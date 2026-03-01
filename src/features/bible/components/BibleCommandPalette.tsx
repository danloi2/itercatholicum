import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Search, Book, FileText } from 'lucide-react';
import { BIBLE_BOOKS } from '@features/bible/constants/bibleVersions';

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
    // Search through all books
    for (const book of BIBLE_BOOKS) {
      if (results.length >= limit) break;

      try {
        // Get filename from constants
        const filename = language === 'es' ? book.files.torres : book.files.vulgata;
        // Strip .json for dynamic import if necessary, but here we use the full path or relative
        const fileBase = filename.replace('.json', '');

        // Dynamically import the Bible book JSON
        const module: any = await import(`../data/bibles/${bibleVersion}/${fileBase}.json`);
        const bookData = module.default || module;

        // Search through chapters and verses
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
      } catch (error) {
        // Skip books that don't exist or can't be loaded
        continue;
      }
    }
  } catch (error) {
    console.error('Error searching verses:', error);
  }

  return results;
};

export default function BibleCommandPalette({
  open,
  onOpenChange,
  onSelect,
  language = 'la',
}: BibleCommandPaletteProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [bookSuggestions, setBookSuggestions] = React.useState<typeof BIBLE_BOOKS>([]);
  const [verseResults, setVerseResults] = React.useState<VerseResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchTimeoutRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setInputValue('');
      setBookSuggestions([]);
      setVerseResults([]);
    }
  }, [open]);

  React.useEffect(() => {
    if (!inputValue.trim()) {
      setBookSuggestions([]);
      setVerseResults([]);
      setIsSearching(false);
      return;
    }

    const query = inputValue.toLowerCase();

    // Check if query matches book names (for reference search)
    const bookMatch = BIBLE_BOOKS.filter((book) => {
      const nameLa = book.name.la.toLowerCase();
      const nameEs = book.name.es.toLowerCase();
      const abbr = book.acronym.toLowerCase();
      const id = book.id.toLowerCase();

      return (
        nameLa.includes(query) || nameEs.includes(query) || abbr.includes(query) || id === query
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
    };
  }, [inputValue, language]);

  const parseCommand = (text: string) => {
    let bestMatchBook = null;
    let remainingText = '';

    for (const book of BIBLE_BOOKS) {
      const nameLa = book.name.la.toLowerCase();
      const nameEs = book.name.es.toLowerCase();
      const abbr = book.acronym.toLowerCase();
      const textLower = text.toLowerCase();

      if (textLower.startsWith(nameLa)) {
        if (!bestMatchBook || nameLa.length > bestMatchBook.matchedLength) {
          bestMatchBook = { book, matchedLength: nameLa.length };
          remainingText = text.substring(nameLa.length).trim();
        }
      }
      if (textLower.startsWith(nameEs)) {
        if (!bestMatchBook || nameEs.length > bestMatchBook.matchedLength) {
          bestMatchBook = { book, matchedLength: nameEs.length };
          remainingText = text.substring(nameEs.length).trim();
        }
      }
      if (textLower.startsWith(abbr)) {
        if (!bestMatchBook || abbr.length > bestMatchBook.matchedLength) {
          bestMatchBook = { book, matchedLength: abbr.length };
          remainingText = text.substring(abbr.length).trim();
        }
      }
    }

    if (bestMatchBook) {
      const parts = remainingText.split(':');
      const chapterStr = parts[0]?.trim();
      const versesStr = parts[1]?.trim();

      const chapter = parseInt(chapterStr);
      if (!isNaN(chapter)) {
        let verseStart: number | undefined;
        let verseEnd: number | undefined;

        if (versesStr) {
          const verseParts = versesStr.split('-');
          verseStart = parseInt(verseParts[0]);
          if (verseParts[1]) {
            verseEnd = parseInt(verseParts[1]);
          }
        }

        return {
          book: bestMatchBook.book,
          chapter,
          verseStart,
          verseEnd,
        };
      }
    }
    return null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const parsed = parseCommand(inputValue);

      if (parsed && parsed.chapter) {
        onSelect(parsed.book.id, parsed.chapter, parsed.verseStart, parsed.verseEnd);
        onOpenChange(false);
        return;
      }

      if (parsed && !parsed.chapter) {
        setInputValue(`${parsed.book.acronym} `);
        return;
      }

      if (bookSuggestions.length > 0) {
        setInputValue(`${bookSuggestions[0].acronym} `);
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
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[20%] z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 border border-[#c49b9b] bg-[#fdfbf7] p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <DialogPrimitive.Title className="sr-only">
            {language === 'la' ? 'Quaerere Bibliam' : 'Buscar en la Biblia'}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {language === 'la'
              ? 'Quaerere librum, caput vel versum.'
              : 'Busca libros, capítulos o versículos de la Biblia.'}
          </DialogPrimitive.Description>
          <div className="flex items-center border-b border-[#c49b9b] px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-[#8B0000]" />
            <input
              ref={inputRef}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[#8B0000]/50 disabled:cursor-not-allowed disabled:opacity-50 text-[#522b2b]"
              placeholder={
                language === 'la'
                  ? 'Quaerere librum, caput... (e.g. Gn 1:1)'
                  : 'Buscar libro, capítulo... (ej. Gn 1:1)'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {(bookSuggestions.length > 0 || verseResults.length > 0 || isSearching || inputValue) && (
            <div className="max-h-[400px] overflow-y-auto p-1">
              {/* Book Suggestions */}
              {bookSuggestions.length > 0 && (
                <div className="mb-2">
                  {bookSuggestions.map((book) => (
                    <div
                      key={book.id}
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#ebd6d6] hover:text-[#522b2b] aria-selected:bg-[#ebd6d6] aria-selected:text-[#522b2b]"
                      onClick={() => handleSelectBook(book)}
                    >
                      <Book className="mr-2 h-4 w-4 text-[#8B0000]" />
                      <span className="flex-1 text-[#522b2b]">{book.name[language]}</span>
                      <span className="text-xs text-[#8B0000]/70 ml-2">{book.acronym}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Verse Results */}
              {verseResults.length > 0 && (
                <>
                  {bookSuggestions.length > 0 && (
                    <div className="px-2 py-1 text-xs font-semibold text-[#8B0000]/70 border-t border-[#c49b9b]/30 mt-1 pt-2">
                      {language === 'la' ? 'In versibus:' : 'En versículos:'}
                    </div>
                  )}
                  {verseResults.map((result, idx) => (
                    <div
                      key={`${result.bookId}-${result.chapter}-${result.verse}-${idx}`}
                      className="relative flex cursor-pointer select-none flex-col rounded-sm px-2 py-2 text-sm outline-none hover:bg-[#ebd6d6] hover:text-[#522b2b]"
                      onClick={() => handleSelectVerse(result)}
                    >
                      <div className="flex items-center mb-1">
                        <FileText className="mr-2 h-4 w-4 text-[#8B0000]" />
                        <span className="font-semibold text-[#522b2b]">
                          {result.bookName} {result.chapter}:{result.verse}
                        </span>
                      </div>
                      <div className="text-xs text-[#522b2b]/80 ml-6 line-clamp-2">
                        {highlightMatch(result.text, inputValue)}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Loading state */}
              {isSearching && (
                <div className="py-6 text-center text-sm text-[#8B0000]/70">
                  {language === 'la' ? 'Quaerens...' : 'Buscando...'}
                </div>
              )}

              {/* No results */}
              {!isSearching &&
                bookSuggestions.length === 0 &&
                verseResults.length === 0 &&
                inputValue && (
                  <div className="py-6 text-center text-sm text-[#8B0000]/70">
                    {language === 'la'
                      ? 'Nullus eventus inventus.'
                      : 'No se encontraron resultados.'}
                  </div>
                )}
            </div>
          )}

          <div className="border-t border-[#c49b9b] px-3 py-2 text-xs text-[#8B0000]/70 flex justify-between">
            <span>Enter to select</span>
            <span>Esc to close</span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
