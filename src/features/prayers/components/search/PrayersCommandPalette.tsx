import * as React from 'react';
import { Search, Quote } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@ui/dialog';

interface Prayer {
  id: string;
  title: Record<string, string>;
  content: Record<string, string[]>;
  category?: string;
}

interface PrayersCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (prayerId: string) => void;
  language: 'la' | 'es';
  prayers: Prayer[];
}

// Normalize text for searching (remove accents, lowercase)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export default function CommandPalette({
  open,
  onOpenChange,
  onSelect,
  language,
  prayers,
}: PrayersCommandPaletteProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [results, setResults] = React.useState<
    { prayerId: string; title: string; match?: string }[]
  >([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setInputValue('');
      setResults([]);
    }
  }, [open]);

  React.useEffect(() => {
    if (inputValue.length < 3) {
      setResults([]);
      return;
    }

    const query = normalizeText(inputValue);
    const searchResults: { prayerId: string; title: string; match?: string }[] = [];

    prayers.forEach((prayer) => {
      const title = prayer.title[language];
      const normalizedTitle = normalizeText(title);

      if (normalizedTitle.includes(query)) {
        searchResults.push({ prayerId: prayer.id, title });
      } else {
        // Search in content
        for (const line of prayer.content[language]) {
          const normalizedLine = normalizeText(line);
          if (normalizedLine.includes(query)) {
            searchResults.push({ prayerId: prayer.id, title, match: line });
            break; // Show one match per prayer
          }
        }
      }
    });

    setResults(searchResults.slice(0, 10));
  }, [inputValue, language, prayers]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      onSelect(results[0].prayerId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 gap-0 bg-[#fdfbf7] border-2 border-[#8B0000]/20 sm:rounded-xl overflow-hidden">
        <DialogTitle className="sr-only">
          {language === 'la' ? 'Quaerere in orationibus' : 'Buscar en oraciones'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {language === 'la'
            ? 'Quaerere orationes in catalogo.'
            : 'Busca oraciones en el catálogo.'}
        </DialogDescription>
        <div className="flex flex-col h-full">
          {/* Search Input */}
          <div className="flex items-center border-b border-[#c49b9b] px-4">
            <Search className="mr-2 h-5 w-5 shrink-0 opacity-50 text-[#8B0000]" />
            <input
              ref={inputRef}
              className="flex h-14 w-full bg-transparent py-3 text-lg outline-none placeholder:text-[#c49b9b] text-[#3d0c0c] font-serif"
              placeholder={language === 'la' ? 'Quaerere orationem...' : 'Buscar oración...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {(results.length > 0 || (inputValue && inputValue.length >= 3)) && (
            <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
              {results.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {results.map((result, idx) => (
                    <button
                      key={`${result.prayerId}-${idx}`}
                      className="relative flex cursor-pointer select-none flex-col rounded-xl px-4 py-3 text-sm outline-none hover:bg-[#8B0000]/5 transition-all text-left border border-transparent hover:border-[#8B0000]/10 group"
                      onClick={() => {
                        onSelect(result.prayerId);
                        onOpenChange(false);
                      }}
                    >
                      <div className="flex items-center mb-1 gap-2">
                        <Quote className="h-4 w-4 text-[#8B0000] opacity-70" />
                        <span className="font-bold text-[#8B0000] font-serif text-base">
                          {result.title}
                        </span>
                      </div>
                      {result.match && (
                        <div className="text-xs text-[#3d0c0c]/80 font-serif leading-relaxed line-clamp-2 italic">
                          {highlightMatch(result.match, inputValue)}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-lg font-medium text-[#c49b9b] font-serif italic">
                  {language === 'la' ? 'Nulla oratio inventa.' : 'No se encontraron oraciones.'}
                </div>
              )}
            </div>
          )}

          {!inputValue && (
            <div className="py-12 text-center text-[#c49b9b] font-serif italic opacity-60">
              {language === 'la'
                ? 'Scribe ad minus tres litteras...'
                : 'Escribe al menos tres letras...'}
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
