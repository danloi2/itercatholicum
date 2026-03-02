// type LiturgicalDay is any to avoid broken romcal import
type LiturgicalDay = any;
import { Card } from '@ui/card';
import { Badge } from '@ui/badge';
import { UI_STRINGS, RANK_MAP } from '@shared/constants/config';
import { cn } from '@shared/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { normalizeLiturgicalColor } from '@shared/lib/liturgy-engine';

interface WeekDayCardProps {
  day: LiturgicalDay;
  dateStr: string;
  isToday?: boolean;
  language?: string;
}

export default function WeekDayCard({ day, dateStr, isToday, language = 'es' }: WeekDayCardProps) {
  // If no day data is available for this date string, render a placeholder
  if (!day) {
    const fallbackDate = new Date(dateStr);
    const locales: Record<string, any> = { es, la: es };
    const currentLocale = locales[language] || es;
    const fallbackWeekday = format(fallbackDate, 'EEE', { locale: currentLocale });

    return (
      <Card
        className={cn(
          'overflow-hidden h-48 w-full min-w-[120px] max-w-[180px] shrink-0 flex flex-col items-center justify-center border-t-4 border-slate-200 bg-slate-50',
          isToday ? 'ring-2 ring-primary ring-offset-2' : ''
        )}
      >
        <span className="text-xl font-bold text-slate-400">{format(fallbackDate, 'd')}</span>
        <span className="text-xs text-slate-400 uppercase">{fallbackWeekday}</span>
      </Card>
    );
  }

  const { theme, key: normalizedKey } = normalizeLiturgicalColor(day);
  const dateObj = new Date(day.date);

  // Choose date-fns locale
  const locales: Record<string, any> = { es, la: es };
  const currentLocale = locales[language] || es;

  // Custom Latin mappings
  const LATIN_WEEKDAYS = ['Dom.', 'Fer. II', 'Fer. III', 'Fer. IV', 'Fer. V', 'Fer. VI', 'Sab.'];
  const LATIN_MONTHS = [
    'Ian.',
    'Feb.',
    'Mar.',
    'Apr.',
    'Mai.',
    'Iun.',
    'Iul.',
    'Aug.',
    'Sep.',
    'Oct.',
    'Nov.',
    'Dec.',
  ];

  const weekday =
    language === 'la'
      ? LATIN_WEEKDAYS[dateObj.getDay()]
      : format(dateObj, 'EEE', { locale: currentLocale });
  const month =
    language === 'la'
      ? LATIN_MONTHS[dateObj.getMonth()]
      : format(dateObj, 'MMM', { locale: currentLocale });
  const todayLabel = language === 'la' ? 'HODIE' : 'HOY';

  const COLOR_NAME_MAP: Record<string, Record<string, string>> = {
    es: {
      WHITE: 'BLANCO',
      PURPLE: 'MORADO',
      GREEN: 'VERDE',
      RED: 'ROJO',
      ROSE: 'ROSA',
      BLUE: 'AZUL',
      BLACK: 'NEGRO',
      GOLD: 'ORO',
    },
    la: {
      WHITE: 'ALBUS',
      PURPLE: 'PURPUREUS',
      GREEN: 'VIRIDIS',
      RED: 'RUBER',
      ROSE: 'ROSACEUS',
      BLUE: 'CAERULEUS',
      BLACK: 'NIGER',
      GOLD: 'AUREUS',
    },
  };

  const localizedRank = RANK_MAP[language]?.[day.rank.toUpperCase()] || day.rank;

  return (
    <Card
      id={`week-${day.date}`}
      className={cn(
        'overflow-hidden transition-all duration-300 hover:shadow-lg border-t-4 flex flex-col h-full w-full min-w-[140px] relative',
        theme.bg,
        isToday ? 'ring-2 ring-primary ring-offset-2' : ''
      )}
      style={{ borderTopColor: theme.hex }}
    >
      {/* Date Header */}
      <div className="flex flex-col items-center justify-center p-3 border-b border-[#c49b9b]/20 bg-white/40 backdrop-blur-sm">
        <div className="mb-1 px-1.5 py-0.5 rounded-sm bg-black/85 text-white text-[8px] font-black tracking-widest leading-none">
          {dateObj.getFullYear()} {dateObj.getFullYear() % 2 !== 0 ? 'I' : 'II'}
        </div>
        <div className="text-[10px] font-bold text-[#c49b9b] uppercase tracking-widest mb-1">
          {weekday}
        </div>
        <div className={cn('text-4xl font-black tracking-tighter leading-none mb-1', theme.text)}>
          {format(dateObj, 'd')}
        </div>
        <div className="text-[10px] font-bold text-[#c49b9b] uppercase tracking-widest">
          {month}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-3 gap-2 justify-between">
        <div className="flex flex-col gap-1 items-center text-center">
          {isToday && (
            <Badge
              variant="default"
              className="bg-primary text-primary-foreground animate-pulse text-[9px] mb-1"
            >
              {todayLabel}
            </Badge>
          )}
          <h3
            className={cn('text-sm font-bold leading-tight line-clamp-3', theme.text)}
            title={day.name}
          >
            {day.name}
          </h3>
        </div>

        <div className="flex flex-col gap-2 items-center mt-auto pt-2">
          {day.isHolyDayOfObligation && (
            <Badge
              variant="outline"
              className="bg-amber-100 text-amber-700 border-amber-200 text-[9px] font-bold w-full justify-center"
            >
              {UI_STRINGS[language as keyof typeof UI_STRINGS]?.obligationLabel || 'PRECEPTO'}
            </Badge>
          )}
          {day.rank !== 'FERIA' && day.rank !== 'WEEKDAY' && day.rank !== 'SUNDAY' && (
            <Badge
              variant="outline"
              className={cn(
                'uppercase text-[8px] font-medium w-full justify-center text-center',
                theme.badge
              )}
            >
              {localizedRank}
            </Badge>
          )}

          {/* Color dots — use normalized theme key + raw colors */}
          {(() => {
            const COLOR_HEX: Record<string, string> = {
              WHITE: '#fdfbf7',
              VIOLET: '#800080',
              PURPLE: '#800080',
              GREEN: '#008000',
              RED: '#cc0000',
              PINK: '#e87891',
              ROSE: '#e87891',
              BLUE: '#1a4fa0',
              BLACK: '#1a1a1a',
            };
            // Merge raw colors + normalized key (catches BLUE override, etc.)
            const rawColors: string[] = (day.colors || []).map((c: string) => c.toUpperCase());
            const allColors = [...new Set([...rawColors, normalizedKey])];
            return (
              <div className="flex flex-wrap gap-1 justify-center mt-1">
                {allColors.map((c) => (
                  <div
                    key={c}
                    className="w-3 h-3 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: COLOR_HEX[c] ?? c.toLowerCase() }}
                    title={COLOR_NAME_MAP[language]?.[c] || c}
                  />
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </Card>
  );
}
