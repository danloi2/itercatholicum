import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { la } from '@shared/lib/locales';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { SEASON_INFO } from '@shared/constants/config';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@ui/collapsible';
import type { ColorTheme, SeasonInfo } from '@shared/types';
import { LiturgicalDatePicker } from '@shared/components/widgets/LiturgicalDatePicker';

interface CalendarHeaderProps {
  view: 'year' | 'week';
  year: number;
  onYearChange: (year: number) => void;
  language: 'es' | 'la';

  // For Year view
  season?: string;
  onSeasonChange?: (season: string) => void;

  // For Week view
  displayMonth?: string;
  displayWeekInfo?: string;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  theme?: ColorTheme; // To allow coloring the header based on the week's liturgical season
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
}

export default function SecondHeader({
  view,
  year,
  onYearChange,
  language,
  season = 'none',
  onSeasonChange,
  displayMonth,
  displayWeekInfo,
  onPrevWeek,
  onNextWeek,
  theme,
  selectedDate,
  onDateSelect,
}: CalendarHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePrevYear = () => onYearChange(year - 1);
  const handleNextYear = () => onYearChange(year + 1);

  const displaySeason = useMemo(() => {
    if (view === 'year' && onDateSelect) {
      if (selectedDate) {
        return format(selectedDate, 'PPP', { locale: language === 'la' ? la : es });
      }
      return language === 'la' ? 'Eligere Diem' : 'Elige un Día';
    }

    if (season === 'none') return language === 'la' ? 'Totus Annus' : 'Todo el Año';
    const info = SEASON_INFO[season];
    if (!info) return season;
    return language === 'la' ? (info as SeasonInfo).latTitle : (info as SeasonInfo).title;
  }, [selectedDate, season, language, view, onDateSelect]);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 animate-in fade-in duration-300 w-full flex-wrap">
      <div
        className="flex items-center gap-1 sm:gap-2 px-1 lg:px-2 py-1.5 rounded-xl border transition-all duration-500 shadow-xs bg-white/40 backdrop-blur-md"
        style={{
          backgroundColor: theme ? `${theme.hex}15` : 'rgba(255, 255, 255, 0.4)',
          borderColor: theme ? `${theme.hex}30` : 'rgba(196, 155, 155, 0.2)',
        }}
      >
        {/* Year Navigation Arrows */}
        <button
          onClick={handlePrevYear}
          title={language === 'la' ? 'Annus Prior' : 'Año Anterior'}
          className={cn(
            'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
            'bg-white/50 hover:bg-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
            'h-8 w-8 text-[#5c4033]'
          )}
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Week Previous Arrow (for Week View) */}
        {view === 'week' && onPrevWeek && (
          <button
            onClick={onPrevWeek}
            className={cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
              'bg-white/30 hover:bg-white/60',
              'h-8 w-6 text-[#5c4033]'
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div className="flex flex-col items-center justify-center text-center px-1 min-w-[120px] lg:min-w-[150px]">
          {view === 'year' ? (
            <div className="flex flex-col items-center">
              <h2 className="text-[1em] md:text-[1.125em] font-bold text-[#5c4033] leading-none tracking-tight">
                {year - 1} / {year}
              </h2>
              {onDateSelect && view === 'year' ? (
                <LiturgicalDatePicker
                  date={selectedDate}
                  onSelect={onDateSelect}
                  language={language}
                  trigger={
                    <button className="flex items-center justify-center gap-[0.25em] text-[0.65em] md:text-[0.75em] font-semibold mt-[0.25em] text-[#c49b9b] hover:text-[#5c4033] transition-colors outline-none cursor-pointer leading-none">
                      {displaySeason}
                      <ChevronDown className="h-[1em] w-[1em] transition-transform duration-300" />
                    </button>
                  }
                />
              ) : (
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className="relative z-50">
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center justify-center gap-[0.25em] text-[0.65em] md:text-[0.75em] font-semibold mt-[0.25em] text-[#c49b9b] hover:text-[#5c4033] transition-colors outline-none cursor-pointer leading-none">
                      {displaySeason}
                      <ChevronDown
                        className={cn(
                          'h-[1em] w-[1em] transition-transform duration-300',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="absolute top-[calc(100%+0.5em)] left-1/2 -translate-x-1/2 w-[14em] bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 duration-200">
                    <div className="flex flex-col max-h-[18em] overflow-y-auto py-[0.25em]">
                      <button
                        onClick={() => {
                          onSeasonChange?.('none');
                          setIsOpen(false);
                        }}
                        className={cn(
                          'px-[0.75em] py-[0.5em] text-[0.875em] text-left hover:bg-stone-50 transition-colors font-medium border-l-2',
                          season === 'none'
                            ? 'border-[#8B0000] text-[#8B0000] bg-stone-50'
                            : 'border-transparent text-stone-600'
                        )}
                      >
                        {language === 'la' ? 'Totus Annus' : 'Todo el Año'}
                      </button>
                      {Object.entries(SEASON_INFO).map(([key, info]) => {
                        const name =
                          language === 'la'
                            ? (info as SeasonInfo).latTitle
                            : (info as SeasonInfo).title;
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              onSeasonChange?.(key);
                              setIsOpen(false);
                            }}
                            className={cn(
                              'px-[0.75em] py-[0.5em] text-[0.875em] text-left hover:bg-stone-50 transition-colors font-medium border-l-2',
                              season === key
                                ? 'border-[#8B0000] text-[#8B0000] bg-stone-50'
                                : 'border-transparent text-stone-600'
                            )}
                          >
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h2
                className={cn(
                  'text-[1em] md:text-[1.125em] font-bold capitalize leading-none tracking-tight transition-colors duration-500',
                  theme ? theme.text : 'text-[#5c4033]'
                )}
              >
                {displayMonth}
              </h2>
              <div
                className={cn(
                  'text-[0.65em] md:text-[0.75em] font-semibold mt-[0.25em] transition-colors duration-500 opacity-80 leading-none',
                  theme ? theme.text : 'text-[#c49b9b]'
                )}
              >
                {displayWeekInfo || (language === 'la' ? 'Hebdomada' : 'Semana')}
              </div>
            </div>
          )}
        </div>

        {/* Week Next Arrow (for Week View) */}
        {view === 'week' && onNextWeek && (
          <button
            onClick={onNextWeek}
            className={cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
              'bg-white/30 hover:bg-white/60',
              'h-8 w-6 text-[#5c4033]'
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Year Navigation Arrows */}
        <button
          onClick={handleNextYear}
          title={language === 'la' ? 'Annus Sequens' : 'Año Siguiente'}
          className={cn(
            'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
            'bg-white/50 hover:bg-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
            'h-8 w-8 text-[#5c4033]'
          )}
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
