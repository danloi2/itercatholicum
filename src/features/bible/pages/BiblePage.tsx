import { useState, useEffect, useMemo } from 'react';
import { useLayout } from '@app/layout/AppLayout';
import { Loader2, Search, ArrowLeft, Shuffle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@shared/lib/utils';
import { BIBLE_BOOKS } from '@features/bible/constants/bibleVersions';
import BibleCommandPalette from '@features/bible/components/BibleCommandPalette';
import BibleContentSearch from '@features/bible/components/BibleContentSearch';
import BibleHeader from '@features/bible/components/BibleHeader';
import { bibleService } from '../services/bibleService';
import { BibleTreeView } from '@features/bible/components/BibleTreeView';
import { BibleChapterSelectionView } from '../components/BibleChapterSelectionView';
import { BibleReadingView } from '../components/BibleReadingView';
import { useBibleHierarchy, useBibleBookLoader } from '../hooks/useBible';

interface BibleReaderPageProps {
  language: 'es' | 'la';
}

export default function BibleReaderPage({ language }: BibleReaderPageProps) {
  const navigate = useNavigate();
  const selectedVersion = language === 'la' ? 'vulgata' : 'torres';
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<{ start: number; end: number }>({ start: 1, end: 5 });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isContentSearchOpen, setIsContentSearchOpen] = useState(false);

  const hierarchy = useBibleHierarchy(language);
  const { bookData, loading, error } = useBibleBookLoader(selectedBookId, selectedVersion);

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
        <BibleHeader
          language={language}
          selectedBook={selectedBook || null}
          selectedChapter={selectedChapter}
          verses={verses}
          onBookChange={setSelectedBookId}
          onChapterChange={(ch) => {
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
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-48 mt-10">
          <Loader2 className="w-10 h-10 animate-spin text-[#8B0000] mb-3" />
          <p className="font-serif text-[#522b2b] italic text-sm">Loading Sacred Text...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center h-48 text-red-500 font-serif text-lg mt-10">
          {error}
        </div>
      );
    }

    if (!selectedBookId) {
      return (
        <BibleTreeView language={language} hierarchy={hierarchy} onSelectBook={setSelectedBookId} />
      );
    }

    if (selectedBookId && selectedChapter === null) {
      return (
        <BibleChapterSelectionView
          language={language}
          bookData={bookData}
          onSelectChapter={(num) => {
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

    if (selectedChapter !== null && bookData) {
      return (
        <BibleReadingView
          language={language}
          selectedBook={selectedBook}
          selectedChapter={selectedChapter}
          verses={verses}
          bookData={bookData}
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

  return (
    <div className="flex flex-col flex-1">
      <BibleCommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        onSelect={(bookId, chapter, start, end) => {
          setSelectedBookId(bookId);
          setSelectedChapter(chapter);
          setVerses({ start: start || 1, end: end || 9999 });
        }}
        language={language}
      />

      <BibleContentSearch
        open={isContentSearchOpen}
        onOpenChange={setIsContentSearchOpen}
        onNavigate={(bookId, chapter, verse) => {
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
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className={cn(
            'flex items-center justify-center w-12 h-12 text-white rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 group relative',
            'bg-linear-to-r from-primary-600 to-indigo-600 shadow-primary-200/50'
          )}
        >
          <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
            {language === 'la' ? 'REFERENTIA' : 'REFERENCIA'}
          </span>
        </button>

        <button
          onClick={() => setIsContentSearchOpen(true)}
          className={cn(
            'flex items-center justify-center w-12 h-12 text-white rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 group relative',
            'bg-linear-to-r from-amber-600 to-orange-600 shadow-amber-200/50'
          )}
        >
          <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
            {language === 'la' ? 'CONTENTUM' : 'CONTENIDO'}
          </span>
        </button>

        <button
          onClick={handleRandom}
          className={cn(
            'flex items-center justify-center w-12 h-12 text-white rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 group relative',
            'bg-linear-to-r from-[#8B0000] to-[#522b2b] shadow-[#8B0000]/30'
          )}
        >
          <Shuffle className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
            {language === 'la' ? 'FORTUITUS' : 'ALEATORIO'}
          </span>
        </button>

        <button
          onClick={handleBack}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full shadow-xl hover:scale-105 transition-all active:scale-95 group relative border border-stone-200',
            'bg-white/90 backdrop-blur-sm bg-linear-to-b from-stone-50 to-white text-slate-700'
          )}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-[#8B0000]" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
            {language === 'la' ? 'INITIUM' : 'ATRÁS'}
          </span>
        </button>
      </div>
    </div>
  );
}
