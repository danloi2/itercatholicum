import { useState, useEffect, useMemo } from 'react';
import { BIBLE_BOOKS } from '@/constants/bibleData';
import BibleDisplay from '@/components/BibleDisplay';
import BibleCommandPalette from '@/components/BibleCommandPalette';
import BibleContentSearch from '@/components/BibleContentSearch';
import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';
import { Loader2, Search, ArrowLeft, Shuffle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useTodayLiturgicalColor } from '@/hooks/useLiturgicalColor';

interface BibleReaderPageProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
}

export default function BibleReaderPage({ language, setLanguage }: BibleReaderPageProps) {
  const navigate = useNavigate();
  // Derived state for version based on language
  const selectedVersion = language === 'la' ? 'vulgata' : 'torres';
  const [selectedBookId, setSelectedBookId] = useState<string>(''); // Start empty
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<{ start: number; end: number }>({ start: 1, end: 5 });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isContentSearchOpen, setIsContentSearchOpen] = useState(false);

  const [bookData, setBookData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const liturgicalHex = useTodayLiturgicalColor(language);

  // Progressive Disclosure States (for initial view accordions)
  const [activeTestament, setActiveTestament] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const selectedBook = BIBLE_BOOKS.find((b) => b.id === selectedBookId);

  // Prepare UI hierarchy for initial view
  const hierarchy = useMemo(() => {
    const testaments = new Set<string>();
    const groupsByTestament: Record<string, Set<string>> = {};
    const booksByGroup: Record<string, typeof BIBLE_BOOKS> = {};

    BIBLE_BOOKS.forEach((book) => {
      const t = book.testament[language];
      const g = book.type[language] || (language === 'es' ? 'Otros' : 'Alii');
      testaments.add(t);
      if (!groupsByTestament[t]) groupsByTestament[t] = new Set();
      groupsByTestament[t].add(g);
      if (!booksByGroup[g]) booksByGroup[g] = [];
      booksByGroup[g].push(book);
    });
    return { testaments: Array.from(testaments), groupsByTestament, booksByGroup };
  }, [language]);

  useEffect(() => {
    async function loadContent() {
      if (!selectedBook) {
        setBookData(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      // We don't clear bookData strictly unless different book?
      // Just fetch full book always
      try {
        const filename =
          selectedVersion === 'vulgata' ? selectedBook.files.vulgata : selectedBook.files.torres;

        const fileBase = filename.replace('.json', '');
        let module;
        if (selectedVersion === 'vulgata') {
          module = await import(`../data/bibles/1592_vulgata_clementina_la/${fileBase}.json`);
        } else {
          module = await import(`../data/bibles/1823_torres_amat_es/${fileBase}.json`);
        }

        const fileData = module.default || module;
        setBookData({ isFullBook: true, chapters: fileData.capitula });

        // Clamp verses if reading view is active and a chapter is picked
        if (selectedChapter !== null && selectedChapter !== 0) {
          const chapterData = fileData.capitula.find((c: any) => c.numerus === selectedChapter);
          if (chapterData) {
            const maxVerse = chapterData.ctd_versus;
            if (verses.end > maxVerse) {
              setVerses((prev) => ({ ...prev, end: maxVerse }));
            }
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

  // Handler for Random Button
  const handleRandom = () => {
    const randomBook = BIBLE_BOOKS[Math.floor(Math.random() * BIBLE_BOOKS.length)];
    if (randomBook) {
      setSelectedBookId(randomBook.id);
      const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;
      setSelectedChapter(randomChapter);
      setVerses({ start: 1, end: 9999 }); // Reset verses
    }
  };

  const pageTitle = language === 'la' ? 'Sacra Biblia' : 'Santa Biblia';

  // Header Node (Breadcrumbs style)
  const pageTitleNode = (
    <div
      className={cn(
        'items-center w-full max-w-7xl px-2 transition-all duration-300',
        selectedBookId ? 'grid grid-cols-[1fr_auto_1fr] gap-1 md:gap-4' : 'flex justify-center'
      )}
    >
      {/* LEFT WING: Title + Testament + Group */}
      <div className={cn('flex items-center gap-1 md:gap-2', selectedBookId ? 'justify-end' : '')}>
        {/* 1. Base Title + Version */}
        <button
          onClick={() => {
            setSelectedBookId('');
            setSelectedChapter(null);
            setActiveTestament(null);
            setActiveGroup(null);
          }}
          className={cn(
            'flex flex-col items-center justify-center border-none rounded-xl hover:scale-115 transition-all shadow-lg group shrink-0 z-10',
            selectedBookId
              ? 'h-11 md:h-14 px-4 md:px-6 scale-110'
              : 'h-14 md:h-20 px-8 md:px-12 scale-100'
          )}
          style={{
            background: `linear-gradient(to right, ${liturgicalHex}cc, ${liturgicalHex})`,
          }}
        >
          <span
            className={cn(
              'font-bold tracking-tight text-white group-hover:text-white/90 whitespace-nowrap',
              selectedBookId ? 'text-sm md:text-lg' : 'text-xl md:text-3xl'
            )}
          >
            {pageTitle}
          </span>
          {(!selectedBookId || bookData) && (
            <span
              className={cn(
                'font-serif italic text-white/80 group-hover:text-white whitespace-nowrap',
                selectedBookId ? 'text-[10px] md:text-xs' : 'text-sm md:text-base'
              )}
            >
              {bookData?.versio ||
                (language === 'la' ? 'Vulgata Clementina (1592)' : 'Torres Amat (1823)')}
            </span>
          )}
        </button>

        {/* 2. Testament */}
        {(selectedBookId || activeTestament) && (
          <div className="flex items-center shrink-0">
            <span className="text-[#c49b9b] opacity-50 mx-0.5">/</span>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 md:h-12 bg-white/40 border border-gray-200 rounded-xl px-2 md:px-4 text-xs md:text-base font-bold text-[#8B0000] hover:bg-[#ebd6d6]/50 transition-colors shadow-sm outline-none">
                    {selectedBook?.testament[language] || activeTestament || '...'}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-1 bg-[#fdfbf7] border-[#c49b9b] shadow-xl rounded-md min-w-[150px] animate-in fade-in zoom-in-95 duration-200">
                      {hierarchy.testaments.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            const firstBook = BIBLE_BOOKS.find((b) => b.testament[language] === t);
                            if (firstBook) {
                              if (selectedBookId) setSelectedBookId(firstBook.id);
                              else setActiveTestament(t);
                            }
                            setSelectedChapter(null);
                          }}
                          className="w-full text-left p-2.5 text-sm hover:bg-[#ebd6d6] rounded cursor-pointer text-[#522b2b] font-serif block transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}

        {/* 3. Group */}
        {(selectedBookId || activeGroup) && (
          <div className="items-center shrink-0 hidden sm:flex">
            <span className="text-[#c49b9b] opacity-50 mx-0.5">/</span>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 md:h-12 bg-white/40 border border-gray-200 rounded-xl px-2 md:px-4 text-xs md:text-base font-bold text-[#8B0000] hover:bg-[#ebd6d6]/50 transition-colors shadow-sm outline-none">
                    {selectedBook?.type[language] || activeGroup || '...'}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-1 bg-[#fdfbf7] border-[#c49b9b] shadow-xl rounded-md min-w-[150px] animate-in fade-in zoom-in-95 duration-200">
                      {Array.from(
                        hierarchy.groupsByTestament[
                          selectedBook?.testament[language] || activeTestament || ''
                        ] || []
                      ).map((g) => (
                        <button
                          key={g}
                          onClick={() => {
                            const firstInGrp = hierarchy.booksByGroup[g]?.[0];
                            if (firstInGrp) {
                              if (selectedBookId) setSelectedBookId(firstInGrp.id);
                              else setActiveGroup(g);
                            }
                            setSelectedChapter(null);
                          }}
                          className="w-full text-left p-2.5 text-sm hover:bg-[#ebd6d6] rounded cursor-pointer text-[#522b2b] font-serif block transition-colors"
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}
      </div>

      {/* CENTER PIECE: Book (Fundamental) */}
      <div className="flex items-center justify-center shrink-0 mx-1 md:mx-2">
        {selectedBookId && selectedBook && (
          <div className="flex items-center">
            <span className="text-[#c49b9b] opacity-50 mx-0.5 sm:hidden">/</span>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 md:h-12 bg-linear-to-r from-amber-600 to-orange-600 border-none rounded-xl px-4 md:px-6 text-sm md:text-lg font-black text-white hover:opacity-90 transition-all shadow-lg hover:shadow-orange-200/50 outline-none scale-105 md:scale-110">
                    {selectedBook.name[language]}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-1 bg-[#fdfbf7] border-[#c49b9b] shadow-xl rounded-md animate-in fade-in zoom-in-95 duration-200">
                      <div className="max-h-[60vh] w-[220px] overflow-y-auto pr-1">
                        {(
                          hierarchy.booksByGroup[
                            selectedBook.type[language] || (language === 'es' ? 'Otros' : 'Alii')
                          ] || []
                        ).map((b) => (
                          <button
                            key={b.id}
                            onClick={() => {
                              setSelectedBookId(b.id);
                              setSelectedChapter(null);
                            }}
                            className={cn(
                              'block w-full text-left p-2.5 text-sm rounded transition-colors font-serif',
                              b.id === selectedBookId
                                ? 'bg-[#8B0000] text-white'
                                : 'hover:bg-[#ebd6d6] text-[#522b2b]'
                            )}
                          >
                            {b.name[language]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}
      </div>

      {/* RIGHT WING: Chapter + Verses */}
      <div className="flex items-center justify-start gap-1 md:gap-2">
        {/* 5. Chapter */}
        {selectedBook && bookData && (
          <div className="flex items-center shrink-0">
            <span className="text-[#c49b9b] opacity-50 mx-0.5">/</span>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 md:h-11 bg-white/40 border border-gray-200 rounded-xl px-2 md:px-3 text-xs md:text-sm font-bold text-[#8B0000] hover:bg-[#ebd6d6]/50 transition-colors shadow-sm outline-none">
                    {selectedChapter === null
                      ? language === 'la'
                        ? 'Cap.'
                        : 'Cap.'
                      : selectedChapter === 0
                        ? language === 'la'
                          ? 'Omnia'
                          : 'Todos'
                        : `Cap. ${selectedChapter}`}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-1 bg-[#fdfbf7] border-[#c49b9b] shadow-xl rounded-md animate-in fade-in zoom-in-95 duration-200">
                      <div className="max-h-[60vh] w-[200px] overflow-y-auto pr-1">
                        <div className="grid grid-cols-4 gap-1 p-2">
                          <button
                            onClick={() => {
                              setSelectedChapter(0);
                            }}
                            className={cn(
                              'col-span-4 p-2.5 text-sm rounded font-bold border transition-colors',
                              selectedChapter === 0
                                ? 'bg-[#8B0000] text-white border-[#8B0000]'
                                : 'bg-white text-[#8B0000] border-gray-200 hover:bg-[#ebd6d6]'
                            )}
                          >
                            {language === 'la' ? 'Omnia Capitula' : 'Todos'}
                          </button>
                          {bookData.chapters.map((ch: any) => (
                            <button
                              key={ch.numerus}
                              onClick={() => {
                                setSelectedChapter(ch.numerus);
                                setVerses({ start: 1, end: ch.ctd_versus });
                              }}
                              className={cn(
                                'aspect-square flex items-center justify-center text-sm rounded border transition-colors',
                                selectedChapter === ch.numerus
                                  ? 'bg-[#8B0000] text-white border-[#8B0000]'
                                  : 'bg-white text-[#522b2b] border-gray-200 hover:bg-[#ebd6d6]'
                              )}
                            >
                              {ch.numerus}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}

        {/* 6. Verses */}
        {selectedChapter !== null && selectedChapter !== 0 && bookData && (
          <div className="flex items-center shrink-0">
            <span className="text-[#c49b9b] opacity-50 mx-0.5">/</span>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 md:h-11 bg-white/40 border border-gray-200 rounded-xl px-2 md:px-3 text-[10px] md:text-sm font-bold text-[#8B0000] hover:bg-[#ebd6d6]/50 transition-colors shadow-sm outline-none">
                    {`V. ${verses.start}-${verses.end > 500 ? 'Fin' : verses.end}`}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 bg-[#fdfbf7] border-[#c49b9b] shadow-xl rounded-md flex flex-col gap-3 w-[200px] animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[#8B0000] uppercase tracking-wider">
                          {language === 'la' ? 'Initium' : 'Inicio'}
                        </label>
                        <select
                          value={verses.start}
                          onChange={(e) => {
                            const s = parseInt(e.target.value);
                            setVerses({ start: s, end: Math.max(s, verses.end) });
                          }}
                          className="w-full bg-white border border-gray-200 rounded p-1 text-xs text-[#522b2b]"
                        >
                          {Array.from(
                            {
                              length:
                                bookData.chapters.find((c: any) => c.numerus === selectedChapter)
                                  ?.ctd_versus || 0,
                            },
                            (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-[#8B0000] uppercase tracking-wider">
                          {language === 'la' ? 'Finis' : 'Fin'}
                        </label>
                        <select
                          value={verses.end}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            setVerses({
                              start: Math.min(verses.start, v),
                              end: v,
                            });
                          }}
                          className="w-full bg-white border border-gray-200 rounded p-1 text-xs text-[#522b2b]"
                        >
                          {Array.from(
                            {
                              length:
                                bookData.chapters.find((c: any) => c.numerus === selectedChapter)
                                  ?.ctd_versus || 0,
                            },
                            (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}
      </div>
    </div>
  );

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

    // 1. Initial View (Testaments Accordion)
    if (!selectedBookId) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-700 pb-24 pt-12">
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4"
            value={activeTestament || undefined}
            onValueChange={(val) => {
              setActiveTestament(val);
              setActiveGroup(null);
            }}
          >
            {hierarchy.testaments.map((testament) => (
              <AccordionItem
                value={testament}
                key={testament}
                className="bg-white/50 rounded-xl px-4 border border-[#c49b9b]/30 shadow-sm backdrop-blur-sm data-[state=open]:bg-white/80 transition-colors"
              >
                <AccordionTrigger className="text-xl md:text-2xl font-serif text-[#3d0c0c]">
                  {testament}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                    value={activeGroup || undefined}
                    onValueChange={setActiveGroup}
                  >
                    {Array.from(hierarchy.groupsByTestament[testament] || []).map((group) => (
                      <AccordionItem
                        value={group}
                        key={group}
                        className="bg-white/40 rounded-lg px-3 border border-[#c49b9b]/20 shadow-sm transition-colors"
                      >
                        <AccordionTrigger className="text-lg font-serif font-bold text-[#8B0000] hover:text-[#3d0c0c] hover:no-underline py-3">
                          {group}
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {(hierarchy.booksByGroup[group] || []).map((book) => (
                              <button
                                key={book.id}
                                onClick={() => {
                                  setSelectedBookId(book.id);
                                  setSelectedChapter(null); // Enter Chapter View
                                }}
                                className="text-left px-3 py-2 rounded-lg hover:bg-[#ebd6d6] text-[#522b2b] text-sm md:text-base transition-colors truncate border border-transparent hover:border-[#c49b9b]/30 shadow-sm hover:shadow-md bg-[#fdfbf7]/50"
                                title={book.name[language]}
                              >
                                {book.name[language]}
                              </button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      );
    }

    // 2. Book Detail View (Chapters Grid with Hover Cards)
    if (selectedBookId && selectedChapter === null) {
      if (!bookData) return null; // Wait for load
      return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-700 pb-24 relative">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {/* TODOS Button */}
            <button
              onClick={() => {
                setSelectedChapter(0);
                setVerses({ start: 1, end: 9999 });
              }}
              className="aspect-square flex flex-col items-center justify-center rounded-xl bg-linear-to-br from-[#8B0000] to-[#522b2b] text-[#fdfbf7] shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95 border border-[#3d0c0c] group relative overflow-hidden"
              title={language === 'la' ? 'Omnia Capitula' : 'Todos los capítulos'}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="font-serif font-bold text-xs sm:text-xs tracking-widest leading-none text-center">
                {language === 'la' ? 'OMNIA' : 'TODOS'}
              </span>
            </button>

            {/* Chapter Hexagons / Squares with HoverCard */}
            {bookData.chapters.map((chapter: any) => (
              <HoverCard key={chapter.numerus} openDelay={200} closeDelay={150}>
                <HoverCardTrigger asChild>
                  <button
                    onClick={() => {
                      setSelectedChapter(chapter.numerus);
                      setVerses({ start: 1, end: 9999 });
                    }}
                    className="aspect-square flex items-center justify-center rounded-xl bg-white/70 border border-[#c49b9b]/50 text-[#522b2b] shadow-sm hover:shadow-lg hover:bg-[#ebd6d6] hover:text-[#8B0000] transition-all hover:-translate-y-1 active:scale-95 font-serif text-lg md:text-xl font-bold relative overflow-hidden group"
                  >
                    {chapter.numerus}
                    <div className="absolute inset-0 bg-linear-to-br from-white/60 to-transparent pointer-events-none" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-72 sm:w-80 shadow-2xl border-[#8B0000]/20"
                  sideOffset={8}
                >
                  <div className="flex justify-between items-start space-x-4">
                    <div className="space-y-2 w-full">
                      <h4 className="text-base font-bold text-[#8B0000] font-serif border-b border-[#c49b9b]/30 pb-2">
                        {language === 'la' ? 'Caput ' : 'Capítulo '} {chapter.numerus}
                      </h4>
                      <p className="text-sm text-[#522b2b] line-clamp-5 italic pt-1 leading-relaxed">
                        {chapter.versus && chapter.versus[0] ? (
                          <>
                            <sup className="text-xs mr-1 opacity-70 font-bold">1</sup>
                            {chapter.versus[0].textus}
                          </>
                        ) : (
                          '...'
                        )}
                      </p>
                      <div className="text-[10px] text-right text-[#8B0000]/60 font-bold uppercase tracking-widest pt-3">
                        {chapter.ctd_versus} {language === 'la' ? 'Versus' : 'Versículos'}
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      );
    }

    // 3. Reading View
    if (selectedChapter !== null && bookData) {
      let renderingContent;
      if (selectedChapter === 0) {
        renderingContent = bookData; // isFullBook
      } else {
        renderingContent = bookData.chapters.find((c: any) => c.numerus === selectedChapter);
      }

      if (!renderingContent) return null;

      return (
        <div className="pb-28 max-w-4xl mx-auto px-4 md:px-6 animate-in fade-in duration-700 mt-6">
          {renderingContent.isFullBook ? (
            <div className="space-y-16">
              {renderingContent.chapters.map((chapter: any) => (
                <div key={chapter.numerus} className="relative">
                  <div className="flex items-center justify-center my-6 opacity-60">
                    <span className="h-px w-16 bg-[#8B0000]"></span>
                    <h2 className="mx-4 text-xl md:text-2xl font-serif font-bold text-[#8B0000] tracking-widest">
                      {language === 'es' ? 'CAPÍTULO ' : 'CAPUT '}
                      {chapter.numerus}
                    </h2>
                    <span className="h-px w-16 bg-[#8B0000]"></span>
                  </div>
                  <BibleDisplay content={chapter} startVerse={1} endVerse={9999} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/40 p-6 md:p-8 rounded-2xl shadow-sm border border-[#c49b9b]/20">
              <BibleDisplay
                content={renderingContent}
                startVerse={verses.start}
                endVerse={verses.end}
              />
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <UnifiedHeader
        language={language}
        setLanguage={setLanguage}
        pageTitle={pageTitleNode}
        centerChildren
      >
        <div />
      </UnifiedHeader>

      <BibleCommandPalette
        open={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        onSelect={(bookId, chapter, start, end) => {
          setSelectedBookId(bookId);
          setSelectedChapter(chapter);
          if (start) {
            setVerses({ start, end: end || 9999 });
          } else {
            setVerses({ start: 1, end: 9999 });
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
        selectedChapter={selectedChapter || 1}
        verses={verses}
      />

      {/* Content Area */}
      <div className="flex-1 w-full bg-[#fdfbf7] min-h-[calc(100vh-140px)]">
        {renderMainContent()}
      </div>

      {/* Floating Action Buttons */}
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
          onClick={() => {
            if (selectedChapter !== null) {
              setSelectedChapter(null);
            } else if (selectedBookId !== '') {
              setSelectedBookId('');
            } else {
              navigate('/');
            }
          }}
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
      <Footer language={language} />
    </>
  );
}
