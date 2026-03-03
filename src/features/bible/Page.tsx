import { useState, useEffect, useMemo, useRef } from 'react';
import { useLayout } from '@app/layout/LayoutContext';
import { Shuffle, Search, ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BIBLE_BOOKS } from '@features/bible/constants/bibleVersions';
import SearchCommandPalette from './components/search/SearchCommandPalette';
import TextSearch from './components/search/TextSearch';
import LayoutHeader from './components/layout/LayoutHeader';
import { bibleService } from './services/bibleService';
import { BookTree } from './components/navigation/BookTree';
import { ChapterSelector } from './components/navigation/ChapterSelector';
import ReadingContainer from './components/reader/Reading.container';
import { useBibleHierarchy, useBibleBookLoader } from './hooks/useBible';
import { useTTS } from '@shared/hooks/useTTS';
import { FloatingTTSButton, Fab as FloatingActionButton } from '@shared/components/buttons/Fab';

interface PageProps {
  language: 'es' | 'la';
}

export default function Page({ language }: PageProps) {
  const navigate = useNavigate();
  const selectedVersion = language === 'la' ? 'vulgata' : 'torres';
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<{ start: number; end: number }>({ start: 1, end: 5 });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isContentSearchOpen, setIsContentSearchOpen] = useState(false);

  const hierarchy = useBibleHierarchy(language);
  const { bookData, loading, error } = useBibleBookLoader(selectedBookId, selectedVersion);
  const otherVersion = selectedVersion === 'vulgata' ? 'torres' : 'vulgata';
  const {
    bookData: otherBookData,
    loading: otherLoading,
    error: otherError,
  } = useBibleBookLoader(selectedBookId, otherVersion);

  const selectedBook = useMemo(
    () => BIBLE_BOOKS.find((b) => b.id === selectedBookId),
    [selectedBookId]
  );

  const handleRandom = () => {
    const { bookId, chapter } = bibleService.getRandomReference();
    setSelectedBookId(bookId);
    setSelectedChapter(chapter);
    setVerses({ start: 1, end: 9999 });
  };

  const { setHeaderProps } = useLayout();

  useEffect(() => {
    setHeaderProps({
      pageTitle: (
        <LayoutHeader
          language={language}
          selectedBook={selectedBook || null}
          selectedChapter={selectedChapter}
          verses={verses}
          onBookChange={setSelectedBookId}
          onChapterChange={(ch: number | null) => {
            setSelectedChapter(ch);
            setVerses({ start: 1, end: 9999 });
          }}
          onVersesChange={setVerses}
          hierarchy={hierarchy}
          bookData={bookData}
        />
      ),
      centerChildren: false,
    });
  }, [language, selectedBook, selectedChapter, verses, hierarchy, bookData, setHeaderProps]);

  const renderMainContent = () => {
    if (loading || otherLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-48 mt-10">
          <Loader2 className="w-10 h-10 animate-spin text-[#8B0000] mb-3" />
          <p className="font-serif text-[#522b2b] italic text-sm">Loading Sacred Text...</p>
        </div>
      );
    }
    if (error || otherError) {
      return (
        <div className="flex items-center justify-center h-48 text-red-500 font-serif text-lg mt-10">
          {error || otherError}
        </div>
      );
    }

    if (!selectedBookId) {
      return (
        <BookTree language={language} hierarchy={hierarchy} onSelectBook={setSelectedBookId} />
      );
    }

    if (selectedBookId && selectedChapter === null) {
      return (
        <ChapterSelector
          language={language}
          bookData={bookData}
          bookName={selectedBook?.name[language] || ''}
          onSelectChapter={(num: number) => {
            setSelectedChapter(num);
            setVerses({ start: 1, end: 9999 });
          }}
          onSelectAll={() => {
            setSelectedChapter(0);
            setVerses({ start: 1, end: 9999 });
          }}
        />
      );
    }

    if (selectedChapter !== null && bookData && otherBookData) {
      return (
        <ReadingContainer
          language={language}
          selectedBook={selectedBook ?? null}
          selectedChapter={selectedChapter}
          verses={verses}
          bookData={bookData}
          otherBookData={otherBookData}
        />
      );
    }

    return null;
  };

  const handleBack = () => {
    if (selectedChapter !== null) {
      setSelectedChapter(null);
    } else if (selectedBookId !== '') {
      setSelectedBookId('');
    } else {
      navigate('/');
    }
  };

  const { speak, pause, resume, stop, isPlaying, isPaused } = useTTS();

  const textToSpeak = useMemo(() => {
    if (!bookData || selectedChapter === null) return '';
    const renderingContent = bookData.chapters.find(
      (c: { numerus: number }) => c.numerus === selectedChapter
    );
    if (!renderingContent) return '';

    const versesToDisplay = [];
    for (let i = verses.start; i <= verses.end; i++) {
      const key = i.toString();
      if (renderingContent.versus && renderingContent.versus[key]) {
        versesToDisplay.push(renderingContent.versus[key]);
      }
    }
    return versesToDisplay.join(' ');
  }, [bookData, selectedChapter, verses]);

  const lastSpokenRef = useRef<{ text: string; lang: string } | null>(null);

  useEffect(() => {
    if (isPlaying && !isPaused && textToSpeak) {
      if (lastSpokenRef.current?.text === textToSpeak && lastSpokenRef.current?.lang === language) {
        return;
      }
      speak(textToSpeak, language);
      lastSpokenRef.current = { text: textToSpeak, lang: language };
    }
    if (!isPlaying) {
      lastSpokenRef.current = null;
    }
  }, [language, textToSpeak, speak, isPlaying, isPaused]);

  const handlePlay = () => {
    if (textToSpeak) {
      speak(textToSpeak, language);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <SearchCommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        onSelect={(bookId: string, chapter: number, start?: number, end?: number) => {
          setSelectedBookId(bookId);
          setSelectedChapter(chapter);
          setVerses({ start: start || 1, end: end || 9999 });
        }}
        language={language}
      />

      <TextSearch
        open={isContentSearchOpen}
        onOpenChange={setIsContentSearchOpen}
        onNavigate={(bookId: string, chapter: number, verse: number) => {
          setSelectedBookId(bookId);
          setSelectedChapter(chapter);
          setVerses({ start: verse, end: verse });
        }}
        language={language}
        selectedBookId={selectedBookId}
        selectedChapter={selectedChapter || 1}
        verses={verses}
      />

      <div className="flex-1 w-full bg-[#fdfbf7] min-h-[calc(100vh-140px)]">
        {renderMainContent()}
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {selectedChapter !== null && (
          <FloatingTTSButton
            isPlaying={isPlaying}
            isPaused={isPaused}
            onPlay={handlePlay}
            onPause={pause}
            onResume={resume}
            onStop={stop}
            language={language}
          />
        )}

        <FloatingActionButton
          icon={<Search />}
          label={language === 'la' ? 'REFERENTIA' : 'REFERENCIA'}
          onClick={() => setIsCommandPaletteOpen(true)}
          variant="primary"
        />

        <FloatingActionButton
          icon={<BookOpen />}
          label={language === 'la' ? 'CONTENTUM' : 'CONTENIDO'}
          onClick={() => setIsContentSearchOpen(true)}
          variant="amber"
        />

        <FloatingActionButton
          icon={<Shuffle />}
          label={language === 'la' ? 'FORTUITUS' : 'ALEATORIO'}
          onClick={handleRandom}
          variant="accent"
          iconAnimation="group-hover:rotate-180 duration-500"
        />

        <FloatingActionButton
          icon={<ArrowLeft />}
          label={language === 'la' ? 'INITIUM' : 'ATRÁS'}
          onClick={handleBack}
          variant="ghost"
          iconAnimation="group-hover:-translate-x-1"
        />
      </div>
    </div>
  );
}
