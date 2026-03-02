import { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { SEASON_INFO } from '@shared/constants/config';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@ui/collapsible';

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
  theme?: any; // To allow coloring the header based on the week's liturgical season
}

export default function CalendarHeader({
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
}: CalendarHeaderProps) {
  const [navPortalTarget, setNavPortalTarget] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const el = document.getElementById('week-nav-portal-target');
      if (el) {
        setNavPortalTarget(el);
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handlePrevYear = () => onYearChange(year - 1);
  const handleNextYear = () => onYearChange(year + 1);

  const displaySeason = useMemo(() => {
    if (season === 'none') return language === 'la' ? 'Totus Annus' : 'Todo el Año';
    const info = SEASON_INFO[season];
    if (!info) return season;
    return language === 'la' ? (info as any).latTitle : (info as any).title;
  }, [season, language]);

  if (!navPortalTarget) return null;

  return createPortal(
    <div className="flex items-center gap-2 sm:gap-3 animate-in fade-in duration-300">
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
              <h2 className="text-base md:text-lg font-bold text-[#5c4033] leading-none tracking-tight">
                {year - 1} / {year}
              </h2>
              <Collapsible open={isOpen} onOpenChange={setIsOpen} className="relative z-50">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-center gap-1 text-[10px] md:text-xs font-semibold mt-1 text-[#c49b9b] hover:text-[#5c4033] transition-colors outline-none cursor-pointer leading-none">
                    {displaySeason}
                    <ChevronDown
                      className={cn(
                        'h-3 w-3 transition-transform duration-300',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[220px] bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 duration-200">
                  <div className="flex flex-col max-h-[300px] overflow-y-auto py-1">
                    <button
                      onClick={() => {
                        onSeasonChange?.('none');
                        setIsOpen(false);
                      }}
                      className={cn(
                        'px-3 py-2 text-sm text-left hover:bg-stone-50 transition-colors font-medium border-l-2',
                        season === 'none'
                          ? 'border-[#8B0000] text-[#8B0000] bg-stone-50'
                          : 'border-transparent text-stone-600'
                      )}
                    >
                      {language === 'la' ? 'Totus Annus' : 'Todo el Año'}
                    </button>
                    {Object.entries(SEASON_INFO).map(([key, info]) => {
                      const name = language === 'la' ? (info as any).latTitle : (info as any).title;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            onSeasonChange?.(key);
                            setIsOpen(false);
                          }}
                          className={cn(
                            'px-3 py-2 text-sm text-left hover:bg-stone-50 transition-colors font-medium border-l-2',
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
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h2
                className={cn(
                  'text-base md:text-lg font-bold capitalize leading-none tracking-tight transition-colors duration-500',
                  theme ? theme.text : 'text-[#5c4033]'
                )}
              >
                {displayMonth}
              </h2>
              <div
                className={cn(
                  'text-[10px] md:text-xs font-semibold mt-1 transition-colors duration-500 opacity-80 leading-none',
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
    </div>,
    navPortalTarget
  );
}
