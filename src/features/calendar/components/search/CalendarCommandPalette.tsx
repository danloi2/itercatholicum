import * as React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@ui/dialog';
import type { CalendarData } from '@features/calendar/hooks/useCalendar';
import { RANK_MAP } from '@shared/constants/config';
import type { LiturgicalDay } from '@shared/types';

interface CalendarCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CalendarData;
  language?: 'la' | 'es';
  onSelectDate?: (date: string) => void;
}

export default function CalendarCommandPalette({
  open,
  onOpenChange,
  data,
  language = 'la',
  onSelectDate,
}: CalendarCommandPaletteProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<LiturgicalDay[]>([]);
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
      const keyMatch = normalize((event as LiturgicalDay & { key?: string }).key || '').includes(
        query
      );
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
    if (onSelectDate) {
      onSelectDate(date);
    } else {
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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelect(suggestions[0].date);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 gap-0 bg-[#fdfbf7] border-2 border-[#8B0000]/20 sm:rounded-xl overflow-hidden">
        <DialogTitle className="sr-only">
          {language === 'la' ? 'Quaerere festivitatem' : 'Buscar festividad'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {language === 'la'
            ? 'Quaerere festivitatem in calendario.'
            : 'Busca cualquier festividad en el calendario.'}
        </DialogDescription>
        <div className="flex flex-col h-full">
          <div className="flex items-center border-b border-[#c49b9b] px-4">
            <Search className="mr-2 h-5 w-5 shrink-0 opacity-50 text-[#8B0000]" />
            <input
              ref={inputRef}
              className="flex h-14 w-full bg-transparent py-3 text-lg outline-none placeholder:text-[#c49b9b] text-[#3d0c0c] font-serif"
              placeholder={language === 'la' ? 'Quaerere festivitatem...' : 'Buscar festividad...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {(suggestions.length > 0 || (inputValue && inputValue.length >= 2)) && (
            <div className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
              {suggestions.length > 0 ? (
                suggestions.map((event, idx) => (
                  <button
                    key={`${event.date}-${idx}`}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-xl px-4 py-3 text-sm outline-none hover:bg-[#8B0000]/5 transition-all text-left border border-transparent hover:border-[#8B0000]/10 group"
                    onClick={() => handleSelect(event.date)}
                  >
                    <Calendar className="mr-3 h-5 w-5 text-[#8B0000] opacity-70" />
                    <div className="flex flex-col">
                      <span className="text-[#3d0c0c] font-serif text-base font-medium">
                        {event.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#8B0000]/70 uppercase tracking-widest font-sans">
                          {event.date}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#8B0000]/10 text-[#8B0000] rounded font-bold uppercase tracking-tighter font-sans">
                          {RANK_MAP[language]?.[event.rank?.toUpperCase()] || event.rank}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-12 text-center text-lg font-medium text-[#c49b9b] font-serif">
                  {language === 'la'
                    ? 'Nullus eventus inventus.'
                    : 'No se encontraron festividades.'}
                </div>
              )}
            </div>
          )}

          <div className="border-t border-[#c49b9b] px-4 py-3 text-[10px] text-[#8B0000]/50 flex justify-between uppercase tracking-tighter bg-[#8B0000]/5">
            <span>{language === 'la' ? 'Intra ad eligendum' : 'Enter para seleccionar'}</span>
            <span>Esc para cerrar</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
