import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Search, Quote } from 'lucide-react';

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

export default function PrayersCommandPalette({
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

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[20%] z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 border border-[#c49b9b] bg-[#fdfbf7] p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <DialogPrimitive.Title className="sr-only">
            {language === 'la' ? 'Quaerere in orationibus' : 'Buscar en oraciones'}
          </DialogPrimitive.Title>

          <div className="flex items-center border-b border-[#c49b9b] px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-[#8B0000]" />
            <input
              ref={inputRef}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[#8B0000]/50 disabled:cursor-not-allowed disabled:opacity-50 text-[#522b2b]"
              placeholder={
                language === 'la'
                  ? 'Scribe ad minus tres litteras ad quaerendum.'
                  : 'Escribe al menos tres letras para buscar.'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto p-1">
            {results.length > 0 ? (
              <div className="space-y-1">
                {results.map((result) => (
                  <button
                    key={result.prayerId + (result.match || '')}
                    className="w-full relative flex cursor-pointer select-none flex-col rounded-md px-3 py-2 text-sm outline-none hover:bg-[#ebd6d6] text-left transition-colors"
                    onClick={() => {
                      onSelect(result.prayerId);
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex items-center mb-0.5">
                      <Quote className="mr-2 h-3.5 w-3.5 text-[#8B0000]/60" />
                      <span className="font-bold text-[#3d0c0c]">{result.title}</span>
                    </div>
                    {result.match && (
                      <div className="text-xs text-[#522b2b]/70 ml-5 line-clamp-1 italic font-serif">
                        {highlightMatch(result.match, inputValue)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : inputValue.length >= 3 ? (
              <div className="py-10 text-center text-sm text-[#8B0000]/70 font-serif italic">
                {language === 'la' ? 'Nulla oratio inventa.' : 'No se encontraron oraciones.'}
              </div>
            ) : inputValue.length > 0 ? (
              <div className="py-6 text-center text-xs text-[#8B0000]/50 font-serif italic">
                {language === 'la'
                  ? 'Scribe ad minus tres litteras...'
                  : 'Escribe al menos tres letras...'}
              </div>
            ) : null}
          </div>

          <div className="border-t border-[#c49b9b]/10 px-3 py-2 text-[10px] text-[#8B0000]/40 flex justify-between uppercase tracking-widest font-bold">
            <span>Enter to select</span>
            <span>Esc to close</span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
