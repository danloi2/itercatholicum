import { useState, useEffect } from 'react';
import { BIBLE_BOOKS } from '@/constants/bibleData';
import BibleSelector from '@/components/BibleSelector';
import BibleDisplay from '@/components/BibleDisplay';
import BibleCommandPalette from '@/components/BibleCommandPalette';
import BibleContentSearch from '@/components/BibleContentSearch';
import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';
import { Loader2, Search, ArrowLeft, Shuffle, Book, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BibleReaderPageProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
}

export default function BibleReaderPage({ language, setLanguage }: BibleReaderPageProps) {
  const navigate = useNavigate();
  // Derived state for version based on language
  const selectedVersion = language === 'la' ? 'vulgata' : 'torres';
  const [selectedBookId, setSelectedBookId] = useState<string>(''); // Start empty
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [verses, setVerses] = useState<{ start: number; end: number }>({ start: 1, end: 5 });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isContentSearchOpen, setIsContentSearchOpen] = useState(false);

  const [bibleContent, setBibleContent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectedBook = BIBLE_BOOKS.find((b) => b.id === selectedBookId);

  // Random book on mount REMOVED as requested
  // useEffect(() => {
  //   const randomBook = BIBLE_BOOKS[Math.floor(Math.random() * BIBLE_BOOKS.length)];
  //   if (randomBook) {
  //     setSelectedBookId(randomBook.id);
  //     const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;
  //     setSelectedChapter(randomChapter);
  //     setVerses({ start: 1, end: 20 });
  //   }
  // }, []);

  // Sync effects removed as version is now derived directly from language

  useEffect(() => {
    async function loadContent() {
      if (!selectedBook) {
        setBibleContent(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      setBibleContent(null);

      try {
        const filename =
          selectedVersion === 'vulgata' ? selectedBook.files.vulgata : selectedBook.files.torres;

        // Dynamic import using specific paths for Vite optimization
        const fileBase = filename.replace('.json', '');
        let module;
        if (selectedVersion === 'vulgata') {
          module = await import(`../data/bibles/1592_vulgata_clementina_la/${fileBase}.json`);
        } else {
          module = await import(`../data/bibles/1823_torres_amat_es/${fileBase}.json`);
        }

        const fileData = module.default || module;

        if (selectedChapter === 0) {
          // Fetch all chapters (rendering logic handled below)
          // Actually, since we have fileData, we have ALL chapters in fileData.capitula!
          // We can just set bibleContent to the whole fileData or array of chapters.
          // Existing BibleDisplay takes `content` which expects a single chapter object structure usually.
          // We need to adapt BibleDisplay or pass a special structure.
          // Let's pass the array of chapters.
          setBibleContent({ isFullBook: true, chapters: fileData.capitula });
        } else {
          const chapterData = fileData.capitula.find((c: any) => c.numerus === selectedChapter);

          if (chapterData) {
            setBibleContent(chapterData);
            const maxVerse = chapterData.ctd_versus;
            if (verses.end > maxVerse) {
              setVerses((prev) => ({ ...prev, end: maxVerse }));
            }
          } else {
            console.warn(`Chapter ${selectedChapter} not found in ${filename}`);
            setError('Capítulo no encontrado / Chapter not found');
          }
        }
      } catch (err) {
        console.error('Failed to load bible content:', err);
        setError('Error cargando el contenido / Error loading content');
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [selectedVersion, selectedBookId, selectedChapter]);

  const totalVersesInChapter = bibleContent?.ctd_versus || 30;

  // Handler for Random Button
  const handleRandom = () => {
    const randomBook = BIBLE_BOOKS[Math.floor(Math.random() * BIBLE_BOOKS.length)];
    if (randomBook) {
      setSelectedBookId(randomBook.id);
      const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;
      setSelectedChapter(randomChapter);
      setVerses({ start: 1, end: 50 }); // Reset verses
    }
  };

  const pageTitle = language === 'la' ? 'Sacra Biblia' : 'Santa Biblia';

  return (
    <>
      <UnifiedHeader language={language} setLanguage={setLanguage} pageTitle={pageTitle}>
        <BibleSelector
          language={language}
          selectedBookId={selectedBookId}
          setSelectedBookId={(id) => {
            setSelectedBookId(id);
            setSelectedChapter(0);
            setVerses({ start: 1, end: 9999 });
          }}
          selectedChapter={selectedChapter}
          setSelectedChapter={(ch) => {
            setSelectedChapter(ch);
            setVerses({ start: 1, end: 9999 });
          }}
          verses={verses}
          setVerses={setVerses}
          totalChapters={selectedBook?.chapters || 0}
          totalVersesInChapter={totalVersesInChapter}
        />
      </UnifiedHeader>

      <BibleCommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        onSelect={(bookId, chapter, start, end) => {
          setSelectedBookId(bookId);
          setSelectedChapter(chapter);
          if (start) {
            // Default to end of chapter (999 will be clamped) if end is missing
            setVerses({ start, end: end || 999 });
          } else {
            setVerses({ start: 1, end: 999 }); // Default to full chapter
          }
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
        selectedChapter={selectedChapter}
        verses={verses}
      />

      {/* Content Area */}
      <div className="flex-1 w-full bg-[#fdfbf7]">
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 mt-10">
              <Loader2 className="w-10 h-10 animate-spin text-[#8B0000] mb-3" />
              <p className="font-serif text-[#522b2b] italic text-sm">Loading Sacred Text...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48 text-red-500 font-serif text-lg mt-10">
              {error}
            </div>
          ) : bibleContent ? (
            <div className="pb-20 max-w-4xl mx-auto animate-in fade-in duration-700">
              <div className="text-center mb-4 mt-2">
                <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#3d0c0c] mb-1 tracking-tight">
                  {selectedBook?.name[language]}
                </h1>
                <div className="h-1 w-20 bg-[#8B0000] mx-auto my-2 opacity-50"></div>
                <h2 className="text-lg md:text-xl font-serif text-[#8B0000] italic">
                  {selectedChapter === 0
                    ? language === 'la'
                      ? 'Omnia Capitula'
                      : 'Libro Completo'
                    : `${language === 'es' ? 'Capítulo' : 'Caput'} ${selectedChapter}`}
                </h2>
                {selectedChapter !== 0 && !bibleContent.isFullBook && (
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-sm font-bold bg-[#8B0000]/10 text-[#8B0000] px-3 py-0.5 rounded-full border border-[#8B0000]/20 font-serif">
                      {language === 'es' ? 'Versículos ' : 'Versus '}
                      {verses.start === verses.end ? verses.start : `${verses.start}-${verses.end}`}
                    </span>
                  </div>
                )}
              </div>

              {bibleContent.isFullBook ? (
                <div className="space-y-12">
                  {bibleContent.chapters.map((chapter: any) => (
                    <div key={chapter.numerus} className="relative">
                      {/* Optional separator or header for each chapter in full view */}
                      <div className="flex items-center justify-center my-4 opacity-50">
                        <span className="h-px w-10 bg-[#8B0000]"></span>
                        <h2 className="mx-3 text-lg md:text-xl font-serif text-[#8B0000] italic">
                          {language === 'es' ? 'Capítulo ' : 'Caput '}
                          {chapter.numerus}
                        </h2>
                        <span className="h-px w-10 bg-[#8B0000]"></span>
                      </div>
                      <BibleDisplay content={chapter} startVerse={1} endVerse={9999} />
                    </div>
                  ))}
                </div>
              ) : (
                <BibleDisplay
                  content={bibleContent}
                  startVerse={verses.start}
                  endVerse={verses.end}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 mt-10 text-center px-4">
              <div className="w-12 h-12 bg-[#ebd6d6]/50 rounded-full flex items-center justify-center mb-4 border border-[#c49b9b]/30">
                <Book className="w-6 h-6 text-[#8B0000] opacity-40" />
              </div>
              <h3 className="text-lg font-serif text-[#3d0c0c] mb-1">
                {language === 'la' ? 'Librum elige' : 'Selecciona un libro'}
              </h3>
              <p className="text-[#522b2b] italic max-w-sm text-sm">
                {language === 'la'
                  ? 'Incipe lectionem eligendo testamentum, coetum vel librum.'
                  : 'Comienza tu lectura seleccionando un testamento, grupo o libro.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {/* Reference Search Button (Primary) */}
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

        {/* Content Search Button */}
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

        {/* Random Button */}
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

        {/* Home Button */}
        <button
          onClick={() => navigate('/')}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full shadow-xl hover:scale-105 transition-all active:scale-95 group relative border border-stone-200',
            'bg-white/80 backdrop-blur-sm bg-linear-to-b from-stone-50 to-white text-slate-700'
          )}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-[#8B0000]" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
            {language === 'la' ? 'INITIUM' : 'INICIO'}
          </span>
        </button>
      </div>
      <Footer language={language} />
    </>
  );
}
