import * as React from 'react';
import { Search, Book, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@ui/dialog';

// Load Bible JSON files using Vite's import.meta.glob (lazy loading)
const bibleModules = import.meta.glob<{
  default: {
    capitula: Array<{
      numerus: number;
      versus: Record<string, string>;
    }>;
  };
}>('/src/shared/data/bibles/**/*.json');
import { BIBLE_BOOKS } from '@features/bible/constants/bibleVersions';
import { formatBibleReference, parseBibleReference } from '../../utils/bibleNavigation';

interface BibleCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (bookId: string, chapter: number, verseStart?: number, verseEnd?: number) => void;
  language?: 'la' | 'es';
}

interface VerseResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

// Normalize text for searching (remove accents, lowercase)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Search verses in Bible
const searchVerses = async (
  query: string,
  language: 'es' | 'la',
  limit: number = 10
): Promise<VerseResult[]> => {
  const normalizedQuery = normalizeText(query);
  const results: VerseResult[] = [];

  // Determine Bible version based on language
  const bibleVersion = language === 'es' ? '1823_torres_amat_es' : '1592_vulgata_clementina_la';

  try {
    const CHUNK_SIZE = 10;
    
    for (let i = 0; i < BIBLE_BOOKS.length; i += CHUNK_SIZE) {
      if (results.length >= limit) break;
      
      const chunk = BIBLE_BOOKS.slice(i, i + CHUNK_SIZE);
      
      const loadedModules = await Promise.all(
        chunk.map(async (book) => {
          try {
            const filename = language === 'es' ? book.files.torres : book.files.vulgata;
            const fileBase = filename.replace('.json', '');
            const fullPath = `/src/shared/data/bibles/${bibleVersion}/${fileBase}.json`;
            const loadModule = bibleModules[fullPath];
            if (!loadModule) return null;
            const module = await loadModule();
            return { book, bookData: module.default };
          } catch {
            return null;
          }
        })
      );
      
      for (const res of loadedModules) {
        if (!res) continue;
        if (results.length >= limit) break;
        
        const { book, bookData } = res;
        
        if (bookData.capitula && Array.isArray(bookData.capitula)) {
          for (const chapter of bookData.capitula) {
            if (results.length >= limit) break;

            const chapterNum = chapter.numerus;
            const verses = chapter.versus;

            if (verses && typeof verses === 'object') {
              for (const [verseNum, verseText] of Object.entries(verses)) {
                if (results.length >= limit) break;

                const normalizedVerse = normalizeText(verseText as string);
                if (normalizedVerse.includes(normalizedQuery)) {
                  results.push({
                    bookId: book.id,
                    bookName: book.name[language],
                    chapter: chapterNum,
                    verse: parseInt(verseNum),
                    text: verseText as string,
                  });
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error searching verses:', error);
  }

  return results;
};

export default function SearchCommandPalette({
  open,
  onOpenChange,
  onSelect,
  language = 'la',
}: BibleCommandPaletteProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [bookSuggestions, setBookSuggestions] = React.useState<typeof BIBLE_BOOKS>([]);
  const [verseResults, setVerseResults] = React.useState<VerseResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showAllChapters, setShowAllChapters] = React.useState(false);
  const [showAllVerses, setShowAllVerses] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchTimeoutRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setInputValue('');
      setBookSuggestions([]);
      setVerseResults([]);
      setShowAllChapters(false);
      setShowAllVerses(false);
    }
  }, [open]);

  React.useEffect(() => {
    if (!inputValue.trim()) {
      setBookSuggestions([]);
      setVerseResults([]);
      setIsSearching(false);
      setShowAllChapters(false);
      setShowAllVerses(false);
      return;
    }

    const query = inputValue.toLowerCase();
    // Extract only the letters to keep suggesting the book even if numbers are typed
    const bookSearchPart = query.match(/^[a-z\sáéíóúñ1-3]+/i)?.[0].trim() || query;

    // Check if query matches book names (for reference search)
    const bookMatch = BIBLE_BOOKS.filter((book) => {
      const nameLa = book.name.la.toLowerCase();
      const nameEs = book.name.es.toLowerCase();
      const abbr = book.acronym.toLowerCase();

      return (
        nameLa.includes(bookSearchPart) || 
        nameEs.includes(bookSearchPart) || 
        abbr.includes(bookSearchPart)
      );
    }).slice(0, 5);

    setBookSuggestions(bookMatch);

    // Always search verse content if query is 3+ characters
    if (query.length >= 3) {
      // Debounce verse search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await searchVerses(query, language, 10);
        setVerseResults(results);
        setIsSearching(false);
      }, 300); // 300ms debounce
    } else {
      setVerseResults([]);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      setShowAllChapters(false);
      setShowAllVerses(false);
    };
  }, [inputValue, language]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const parsed = parseBibleReference(inputValue);

      if (parsed) {
        onSelect(parsed.bookId, parsed.chapter, parsed.verse, parsed.verseEnd);
        onOpenChange(false);
        return;
      }

      // If no valid reference but we have book suggestions, use the first one
      if (bookSuggestions.length > 0) {
        setInputValue(`${bookSuggestions[0].acronym} `);
        return;
      }
      
      // If we have verse results, use the first one
      if (verseResults.length > 0) {
        handleSelectVerse(verseResults[0]);
      }
    }
  };

  const handleSelectBook = (book: (typeof BIBLE_BOOKS)[0]) => {
    setInputValue(`${book.acronym} `);
    inputRef.current?.focus();
  };

  const handleSelectVerse = (result: VerseResult) => {
    onSelect(result.bookId, result.chapter, result.verse, result.verse);
    onOpenChange(false);
  };

  const highlightMatch = (text: string, query: string) => {
    const normalizedText = normalizeText(text);
    const normalizedQuery = normalizeText(query);
    const index = normalizedText.indexOf(normalizedQuery);

    if (index === -1) return text;

    // Find the actual position in the original text
    let actualIndex = 0;
    let normalizedIndex = 0;
    while (normalizedIndex < index && actualIndex < text.length) {
      const char = text[actualIndex];
      const normalizedChar = normalizeText(char);
      normalizedIndex += normalizedChar.length;
      actualIndex++;
    }

    const before = text.substring(0, actualIndex);
    const match = text.substring(actualIndex, actualIndex + query.length);
    const after = text.substring(actualIndex + query.length);

    return (
      <>
        {before}
        <span className="font-bold text-[#8B0000]">{match}</span>
        {after}
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 gap-0 bg-[#fdfbf7] border-2 border-[#8B0000]/20 sm:rounded-xl overflow-hidden">
        <DialogTitle className="sr-only">
          {language === 'la' ? 'Quaerere Bibliam' : 'Buscar en la Biblia'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {language === 'la'
            ? 'Quaerere librum, caput vel versum.'
            : 'Busca libros, capítulos o versículos de la Biblia.'}
        </DialogDescription>
        <div className="flex flex-col h-full">
          {/* Search Input */}
          <div className="flex items-center border-b border-[#c49b9b] px-4">
            <Search className="mr-2 h-5 w-5 shrink-0 opacity-50 text-[#8B0000]" />
            <input
              ref={inputRef}
              className="flex h-14 w-full bg-transparent py-3 text-lg outline-none placeholder:text-[#c49b9b] text-[#3d0c0c] font-serif"
              placeholder={
                language === 'la'
                  ? 'Quaerere librum, caput... (e.g. Gn 1, 1)'
                  : 'Buscar libro, capítulo... (ej. Gn 1, 1)'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {(bookSuggestions.length > 0 || verseResults.length > 0 || isSearching || inputValue) && (
            <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
              {(() => {
                const parsed = parseBibleReference(inputValue);
                if (parsed) {
                  const book = BIBLE_BOOKS.find(b => b.id === parsed.bookId);
                  if (!book) return null;

                  // Case 1: Book only (Chapter 0)
                  if (parsed.chapter === 0) {
                    return (
                      <div className="mb-6">
                        <div className="px-4 py-2 text-[10px] font-bold text-[#8B0000]/50 uppercase tracking-widest mb-2">
                          {language === 'la' ? 'Vade ad:' : 'Ir a la referencia:'}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-[#8B0000]/5 border border-[#8B0000]/20 hover:bg-[#8B0000]/10 transition-all text-left group"
                            onClick={() => {
                              onSelect(parsed.bookId, 0, 1, 9999);
                              onOpenChange(false);
                            }}
                          >
                            <Book className="h-6 w-6 text-[#8B0000]" />
                            <div className="flex flex-col">
                              <span className="text-lg font-bold text-[#8B0000] font-serif">
                                {book.name[language]}
                              </span>
                              <span className="text-xs text-[#3d0c0c]/60 italic font-serif">
                                {language === 'la' ? 'Librum Totum' : 'Ver todo el libro'}
                              </span>
                            </div>
                          </button>

                          {/* Quick chapter access */}
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 px-1">
                            {Array.from({ length: showAllChapters ? book.chapters : Math.min(book.chapters, 12) }, (_, i) => i + 1).map(ch => (
                              <button
                                key={ch}
                                onClick={() => {
                                  onSelect(parsed.bookId, ch, 1, 9999);
                                  onOpenChange(false);
                                }}
                                className="h-10 flex items-center justify-center rounded-lg bg-white border border-[#8B0000]/10 text-[#8B0000] font-serif hover:bg-[#8B0000]/5 hover:border-[#8B0000]/30 transition-all text-sm font-bold"
                              >
                                {book.acronym} {ch}
                              </button>
                            ))}
                            {book.chapters > 12 && !showAllChapters && (
                              <button 
                                onClick={() => setShowAllChapters(true)}
                                className="h-10 flex items-center justify-center rounded-lg bg-stone-50 border border-dashed border-[#8B0000]/30 text-[#8B0000]/70 font-serif text-[10px] uppercase font-bold hover:bg-[#8B0000]/5 transition-colors"
                              >
                                +{book.chapters - 12}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Case 2: Book and Chapter/Verses
                  const chapterOnlyRef = formatBibleReference(book.name[language], parsed.chapter, 0, 0, language);
                  const specificRef = formatBibleReference(book.name[language], parsed.chapter, parsed.verse, parsed.verseEnd, language);
                  
                  return (
                    <div className="mb-6">
                      <div className="px-4 py-2 text-[10px] font-bold text-[#8B0000]/50 uppercase tracking-widest mb-2">
                        {language === 'la' ? 'Vade ad:' : 'Ir a la referencia:'}
                      </div>
                      <div className="flex flex-col gap-2">
                        {/* Option 1: Full Chapter */}
                        <button
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#8B0000]/10 hover:bg-[#8B0000]/5 hover:border-[#8B0000]/30 transition-all text-left group"
                          onClick={() => {
                            onSelect(parsed.bookId, parsed.chapter, 1, 9999);
                            onOpenChange(false);
                          }}
                        >
                          <Book className="h-5 w-5 text-[#8B0000] opacity-60" />
                          <div className="flex flex-col">
                            <span className="text-base font-bold text-[#3d0c0c] font-serif group-hover:text-[#8B0000]">
                              {chapterOnlyRef}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-[#8B0000]/60 font-sans">
                              {language === 'la' ? 'Caput Totum' : 'Capítulo completo'}
                            </span>
                          </div>
                        </button>

                        {/* Option 2: Specific Verse */}
                        <div className="flex flex-col gap-2">
                          <button
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#8B0000]/5 border border-[#8B0000]/20 hover:bg-[#8B0000]/10 transition-all text-left group"
                            onClick={() => {
                              onSelect(parsed.bookId, parsed.chapter, parsed.verse, parsed.verseEnd);
                              onOpenChange(false);
                            }}
                          >
                            <FileText className="h-5 w-5 text-[#8B0000]" />
                            <div className="flex flex-col">
                              <span className="text-base font-bold text-[#8B0000] font-serif">
                                {specificRef}
                              </span>
                              <span className="text-[10px] uppercase tracking-widest text-[#8B0000]/60 font-sans">
                                {language === 'la' ? 'Versus' : 'Versículo específico'}
                              </span>
                            </div>
                          </button>

                          {/* Quick verse access (if no range is being typed) */}
                          {!parsed.verseEnd && (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 px-1">
                              {Array.from({ length: showAllVerses ? 50 : 12 }, (_, i) => i + 1).map(v => (
                                <button
                                  key={v}
                                  onClick={() => {
                                    onSelect(parsed.bookId, parsed.chapter, v, v);
                                    onOpenChange(false);
                                  }}
                                  className="h-10 flex items-center justify-center rounded-lg bg-white border border-[#8B0000]/10 text-[#8B0000] font-serif hover:bg-[#8B0000]/5 hover:border-[#8B0000]/30 transition-all text-xs"
                                >
                                  {book.acronym} {parsed.chapter}, {v}
                                </button>
                              ))}
                              {!showAllVerses && (
                                <button 
                                  onClick={() => setShowAllVerses(true)}
                                  className="h-10 flex items-center justify-center rounded-lg bg-stone-50 border border-dashed border-[#8B0000]/30 text-[#8B0000]/70 font-serif text-[10px] uppercase font-bold hover:bg-[#8B0000]/5 transition-colors"
                                >
                                  +
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Book Suggestions */}
              {bookSuggestions.length > 0 && (
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {bookSuggestions.map((book) => (
                    <button
                      key={book.id}
                      className="relative flex cursor-pointer select-none items-center rounded-xl px-4 py-3 text-sm outline-none hover:bg-[#8B0000]/5 hover:text-[#3d0c0c] transition-all text-left border border-transparent hover:border-[#8B0000]/10 group"
                      onClick={() => handleSelectBook(book)}
                    >
                      <Book className="mr-3 h-5 w-5 text-[#8B0000] opacity-70" />
                      <div className="flex flex-col flex-1">
                        <span className="text-[#3d0c0c] font-serif font-medium">
                          {book.name[language]}
                        </span>
                        <span className="text-[10px] text-[#8B0000]/70 uppercase tracking-widest font-sans">
                          {book.acronym}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Verse Results */}
              {verseResults.length > 0 && (
                <div className="flex flex-col gap-1">
                  {bookSuggestions.length > 0 && (
                    <div className="px-4 py-2 text-[10px] font-bold text-[#8B0000]/50 uppercase tracking-widest border-t border-[#c49b9b]/30 mt-2 mb-1">
                      {language === 'la' ? 'In versibus:' : 'En versículos:'}
                    </div>
                  )}
                  {verseResults.map((result, idx) => (
                    <button
                      key={`${result.bookId}-${result.chapter}-${result.verse}-${idx}`}
                      className="relative flex cursor-pointer select-none flex-col rounded-xl px-4 py-3 text-sm outline-none hover:bg-[#8B0000]/5 transition-all text-left border border-transparent hover:border-[#8B0000]/10 group"
                      onClick={() => handleSelectVerse(result)}
                    >
                      <div className="flex items-center mb-1 gap-2">
                        <FileText className="h-4 w-4 text-[#8B0000] opacity-70" />
                        <span className="font-bold text-[#8B0000] font-serif text-sm">
                          {formatBibleReference(result.bookName, result.chapter, result.verse, result.verse, language)}
                        </span>
                      </div>
                      <div className="text-xs text-[#3d0c0c]/80 font-serif leading-relaxed line-clamp-2 italic">
                        {highlightMatch(result.text, inputValue)}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Loading state */}
              {isSearching && (
                <div className="py-12 text-center text-sm text-[#8B0000]/70 font-serif italic">
                  {language === 'la' ? 'Quaerens...' : 'Buscando...'}
                </div>
              )}

              {/* No results */}
              {!isSearching &&
                bookSuggestions.length === 0 &&
                verseResults.length === 0 &&
                inputValue && (
                  <div className="py-12 text-center text-lg font-medium text-[#c49b9b] font-serif">
                    {language === 'la'
                      ? 'Nullus eventus inventus.'
                      : 'No se encontraron resultados.'}
                  </div>
                )}
            </div>
          )}

          <div className="border-t border-[#c49b9b] px-4 py-3 text-[10px] text-[#8B0000]/50 flex justify-between uppercase tracking-tighter bg-[#8B0000]/5">
            <span>Enter to select</span>
            <span>Esc to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
