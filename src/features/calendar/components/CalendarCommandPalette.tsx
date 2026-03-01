import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Search, Calendar } from 'lucide-react';
import type { CalendarData } from '@features/calendar/hooks/useCalendar';
import { RANK_MAP } from '@shared/constants/config';

interface CalendarCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CalendarData;
  language?: 'la' | 'es';
}

export default function CalendarCommandPalette({
  open,
  onOpenChange,
  data,
  language = 'la',
}: CalendarCommandPaletteProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setInputValue('');
      setSuggestions([]);
    }
  }, [open]);

  React.useEffect(() => {
    if (!inputValue.trim() || inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    const normalize = (str: string) => {
      if (!str) return '';
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/gi, ''); // Also remove punctuation for easier matching
    };

    const query = normalize(inputValue);

    // Flatten all events from the calendar data
    const allEvents = Object.values(data).flat();

    // Filter festivities by normalized name or ID
    const matches = allEvents.filter((event) => {
      const nameMatch = normalize(event.name).includes(query);
      const idMatch = normalize(event.id || '').includes(query);
      const keyMatch = normalize((event as any).key || '').includes(query);
      return nameMatch || idMatch || keyMatch;
    });

    // Deduplicate by name and date
    const uniqueMatches = Array.from(
      new Map(matches.map((m) => [`${m.name || 'event'}-${m.date}`, m])).values()
    );

    // Sort: items starting with query first, then by date
    const sorted = uniqueMatches.sort((a, b) => {
      const aName = normalize(a.name || '');
      const bName = normalize(b.name || '');
      const aStarts = aName.startsWith(query);
      const bStarts = bName.startsWith(query);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.date.localeCompare(b.date);
    });

    setSuggestions(sorted.slice(0, 15)); // Limit to 15 suggestions
  }, [inputValue, data]);

  const handleSelect = (date: string) => {
    onOpenChange(false);

    // Use the same scrolling logic as Bible reader or specific to date IDs
    const element = document.getElementById(date);
    if (element) {
      const headerOffset = 150; // Approximated header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelect(suggestions[0].date);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[20%] z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 border border-[#c49b9b] bg-[#fdfbf7] p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <DialogPrimitive.Title className="sr-only">
            {language === 'la' ? 'Quaerere festivitatem' : 'Buscar festividad'}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {language === 'la'
              ? 'Quaerere festivitatem in calendario.'
              : 'Busca cualquier festividad en el calendario.'}
          </DialogPrimitive.Description>
          <div className="flex items-center border-b border-[#c49b9b] px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-[#8B0000]" />
            <input
              ref={inputRef}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[#8B0000]/50 disabled:cursor-not-allowed disabled:opacity-50 text-[#522b2b]"
              placeholder={language === 'la' ? 'Quaerere festivitatem...' : 'Buscar festividad...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {(suggestions.length > 0 || (inputValue && inputValue.length >= 2)) && (
            <div className="max-h-[300px] overflow-y-auto p-1">
              {suggestions.length > 0 ? (
                suggestions.map((event, idx) => (
                  <div
                    key={`${event.date}-${idx}`}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#ebd6d6] hover:text-[#522b2b]"
                    onClick={() => handleSelect(event.date)}
                  >
                    <Calendar className="mr-2 h-4 w-4 text-[#8B0000]" />
                    <div className="flex flex-col">
                      <span className="text-[#522b2b] font-medium">{event.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#8B0000]/70 uppercase tracking-widest">
                          {event.date}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#8B0000]/5 text-[#8B0000]/60 rounded font-bold uppercase tracking-tighter">
                          {RANK_MAP[language]?.[event.rank?.toUpperCase()] || event.rank}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-[#8B0000]/70">
                  {language === 'la'
                    ? 'Nullus eventus inventus.'
                    : 'No se encontraron festividades.'}
                </div>
              )}
            </div>
          )}

          <div className="border-t border-[#c49b9b] px-3 py-2 text-xs text-[#8B0000]/70 flex justify-between">
            <span>{language === 'la' ? 'Intra ad eligendum' : 'Enter para seleccionar'}</span>
            <span>Esc para cerrar</span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
