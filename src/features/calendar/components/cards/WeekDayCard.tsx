import type { LiturgicalDay } from '@shared/types';
import { Card, CardContent } from '@ui/card';
import { Badge } from '@ui/badge';
import { UI_STRINGS, LATIN_WEEKDAYS, LATIN_MONTHS } from '@shared/constants/config';
import { cn } from '@shared/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { normalizeLiturgicalColor } from '@shared/lib/liturgy-engine';

interface WeekDayCardProps {
  day: LiturgicalDay;
  dateStr: string;
  isToday?: boolean;
  language?: 'es' | 'la';
}

export default function WeekDayCard({ day, dateStr, isToday, language = 'es' }: WeekDayCardProps) {
  // If no day data is available for this date string, render a placeholder
  if (!day) {
    const fallbackDate = new Date(dateStr);
    return (
      <Card className="h-full flex flex-col opacity-40 bg-slate-50 border-dashed">
        <div className="p-3 border-b text-center">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
            {format(fallbackDate, 'EEE')}
          </div>
          <div className="text-3xl font-black text-stone-300">{format(fallbackDate, 'd')}</div>
        </div>
        <CardContent className="p-4 flex items-center justify-center flex-1">
          <div className="w-8 h-8 rounded-full border-2 border-stone-100 border-t-stone-200 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const { theme } = normalizeLiturgicalColor(day);
  const dateObj = new Date(day.date);

  // Choose date-fns locale
  const currentLocale = es;

  // Custom Latin mappings

  const weekday =
    language === 'la'
      ? LATIN_WEEKDAYS[dateObj.getDay()]
      : format(dateObj, 'EEE', { locale: currentLocale });

  const month =
    language === 'la'
      ? LATIN_MONTHS[dateObj.getMonth()]
      : format(dateObj, 'MMM', { locale: currentLocale });

  const todayLabel = language === 'la' ? 'Hodie' : 'Hoy';

  return (
    <Card
      className={cn(
        'group h-full overflow-hidden transition-all duration-500 hover:shadow-xl border-t-4 flex flex-col relative',
        theme.bg,
        isToday ? 'ring-2 ring-primary ring-offset-2 scale-[1.02] z-10' : 'hover:scale-[1.01]'
      )}
      style={{ borderTopColor: theme.hex }}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="p-3 border-b border-[#c49b9b]/20 text-center relative z-10 bg-white/20 backdrop-blur-sm">
        <div className="flex justify-center mb-1.5">
          <div className="px-1.5 py-0.5 rounded-sm bg-black/80 text-white text-[8px] font-black tracking-widest leading-none">
            {dateObj.getFullYear()}
          </div>
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

        <div className="mt-auto space-y-2">
          {day.rank !== 'FERIA' && day.rank !== 'WEEKDAY' && day.rank !== 'SUNDAY' && (
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className={cn(
                  'uppercase text-[8px] font-black tracking-tighter py-0 px-1.5',
                  theme.badge
                )}
              >
                {day.rank}
              </Badge>
            </div>
          )}

          {day.isHolyDayOfObligation && (
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 text-[8px] font-bold"
              >
                {UI_STRINGS[language as keyof typeof UI_STRINGS]?.obligationLabel || 'PRECEPTO'}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
