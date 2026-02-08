import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BIBLE_BOOKS } from '@/constants/bibleData';
import { Search, Loader2 } from 'lucide-react';

interface BibleContentSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (bookId: string, chapter: number, verse: number) => void;
  language: 'es' | 'la';
  selectedBookId?: string;
  selectedChapter?: number;
  verses?: { start: number; end: number };
}

interface VerseResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

// Pre-load all Bible JSON files using Vite's import.meta.glob with eager loading
const bibleModules = import.meta.glob<{ default: any }>('/src/data/bibles/**/*.json', {
  eager: true,
});

// Normalize text for search (remove accents, lowercase)
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
  limit: number = 20,
  filters?: {
    bookId?: string;
    chapter?: number;
    verses?: { start: number; end: number };
  }
): Promise<VerseResult[]> => {
  console.log('🔍 searchVerses called with:', { query, language, limit, filters });
  const normalizedQuery = normalizeText(query);
  const results: VerseResult[] = [];

  // Determine Bible version based on language
  const bibleVersion = language === 'es' ? '1823_torres_amat_es' : '1592_vulgata_clementina_la';

  try {
    // Search through all books
    for (const book of BIBLE_BOOKS) {
      if (results.length >= limit) break;

      // Filter by book if specified
      if (filters?.bookId && book.id !== filters.bookId) continue;

      try {
        const filename = language === 'es' ? book.files.torres : book.files.vulgata;
        const bookPath = `/src/data/bibles/${bibleVersion}/${filename}`;
        const module = bibleModules[bookPath];

        if (!module) {
          continue;
        }

        const data = module.default || module;

        // Search through chapters and verses
        if (data.capitula && Array.isArray(data.capitula)) {
          for (const chapter of data.capitula) {
            if (results.length >= limit) break;

            const chapterNum = chapter.numerus;
            // Filter by chapter if specified
            if (filters?.chapter && filters.chapter !== 0 && chapterNum !== filters.chapter)
              continue;

            const verses = chapter.versus;

            if (verses && typeof verses === 'object') {
              for (const [verseNum, verseText] of Object.entries(verses)) {
                if (results.length >= limit) break;

                const vNum = parseInt(verseNum);
                // Filter by verse range if specified
                if (filters?.verses && filters.chapter && filters.chapter !== 0) {
                  if (vNum < filters.verses.start || vNum > filters.verses.end) continue;
                }

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
        console.warn(`⚠️ Failed to load book: ${book.name[language]}`, error);
        continue;
      }
    }
  } catch (error) {
    console.error('❌ Error searching verses:', error);
  }

  return results;
};

export default function BibleContentSearch({
  open,
  onOpenChange,
  onNavigate,
  language,
  selectedBookId,
  selectedChapter,
  verses,
}: BibleContentSearchProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [results, setResults] = React.useState<VerseResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchTimeoutRef = React.useRef<number | null>(null);

  // Focus input when dialog opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setInputValue('');
      setResults([]);
    }
  }, [open]);

  // Search effect with debouncing
  React.useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (inputValue.length >= 3) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        const searchResults = await searchVerses(inputValue, language, 20, {
          bookId: selectedBookId,
          chapter: selectedChapter,
          verses: verses,
        });
        setResults(searchResults);
        setIsSearching(false);
      }, 300);
    } else {
      setResults([]);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [inputValue, language, selectedBookId, selectedChapter, verses]);

  const handleResultClick = (result: VerseResult) => {
    onNavigate(result.bookId, result.chapter, result.verse);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 gap-0 bg-[#fdfbf7] border-2 border-[#8B0000]/20">
        <DialogTitle className="sr-only">
          {language === 'la' ? 'Quaerere Contentum Bibliae' : 'Buscar Contenido de la Biblia'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {language === 'la'
            ? 'Quaere verba aut sententias in Sacra Biblia.'
            : 'Busca palabras o frases en la Santa Biblia.'}
        </DialogDescription>
        <div className="flex flex-col h-full">
          {/* Search Input */}
          <div className="flex items-center border-b border-[#c49b9b] px-3">
            <Search className="w-5 h-5 text-[#8B0000] mr-2" />
            <input
              ref={inputRef}
              className="flex w-full h-14 py-3 text-lg bg-transparent outline-none placeholder:text-[#c49b9b] text-[#3d0c0c] font-serif"
              placeholder={language === 'la' ? 'Quaerere in Biblia...' : 'Buscar en la Biblia...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {isSearching && <Loader2 className="w-5 h-5 animate-spin text-[#8B0000]" />}
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto max-h-[60vh] p-2 custom-scrollbar">
            {results.length > 0 ? (
              <div className="flex flex-col gap-1">
                {results.map((result, idx) => (
                  <button
                    key={`${result.bookId}-${result.chapter}-${result.verse}-${idx}`}
                    onClick={() => handleResultClick(result)}
                    className="flex flex-col p-4 rounded-xl hover:bg-[#8B0000]/5 transition-all text-left border border-transparent hover:border-[#8B0000]/10 group"
                  >
                    <span className="text-sm font-bold text-[#8B0000] mb-1 flex items-center gap-2">
                      <span className="opacity-60 font-serif">{result.bookName}</span>
                      <span className="bg-[#8B0000]/10 px-2 py-0.5 rounded-full">
                        {result.chapter}:{result.verse}
                      </span>
                    </span>
                    <p className="text-[#3d0c0c] font-serif leading-relaxed line-clamp-3">
                      {result.text}
                    </p>
                  </button>
                ))}
              </div>
            ) : inputValue.length >= 3 && !isSearching ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#c49b9b]">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">
                  {language === 'la' ? 'Nulla inventa' : 'No se encontraron resultados'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-[#c49b9b]">
                <p className="text-center font-serif italic max-w-sm">
                  {language === 'la'
                    ? 'Scribe ad minus tria elementa ad quaerendum.'
                    : 'Escribe al menos tres letras para buscar.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
