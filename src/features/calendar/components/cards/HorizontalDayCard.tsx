import { Card } from '@ui/card';
import { Badge } from '@ui/badge';
import { UI_STRINGS, LATIN_WEEKDAYS, LATIN_MONTHS } from '@shared/constants/config';
import { cn } from '@shared/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { normalizeLiturgicalColor } from '@shared/lib/liturgy-engine';
import type { LiturgicalDay } from '@shared/types';

interface HorizontalDayCardProps {
  day: LiturgicalDay;
  isToday?: boolean;
  language?: 'es' | 'la';
}

export default function HorizontalDayCard({
  day,
  isToday,
  language = 'es',
}: HorizontalDayCardProps) {
  if (!day) return null;

  const { theme } = normalizeLiturgicalColor(day);
  const dateObj = new Date(day.date);

  const weekday =
    language === 'la' ? LATIN_WEEKDAYS[dateObj.getDay()] : format(dateObj, 'EEE', { locale: es });
  const month =
    language === 'la' ? LATIN_MONTHS[dateObj.getMonth()] : format(dateObj, 'MMM', { locale: es });
  const todayLabel = language === 'la' ? 'Hodie' : 'Hoy';

  return (
    <Card
      id={day.date}
      className={cn(
        'group flex w-full h-[100px] overflow-hidden transition-all duration-500 hover:shadow-lg border-l-4 relative',
        theme.bg,
        isToday ? 'ring-2 ring-primary ring-offset-2 scale-[1.02] z-10' : 'hover:scale-[1.01]'
      )}
      style={{ borderLeftColor: theme.hex }}
    >
      {/* Date section */}
      <div className="flex flex-col items-center justify-center w-20 border-r border-[#c49b9b]/20 bg-white/20 backdrop-blur-sm px-2">
        <div className="mb-1 px-1.5 py-0.5 rounded-sm bg-black/85 text-white text-[8px] font-black tracking-widest leading-none">
          {dateObj.getFullYear()}
        </div>
        <div className="text-[9px] font-bold text-[#c49b9b] uppercase tracking-widest">
          {weekday}
        </div>
        <div className={cn('text-3xl font-black tracking-tighter leading-none my-0.5', theme.text)}>
          {format(dateObj, 'd')}
        </div>
        <div className="text-[9px] font-bold text-[#c49b9b] uppercase tracking-widest">{month}</div>
      </div>

      {/* Content section */}
      <div className="flex-1 flex flex-col p-3 justify-center gap-1 overflow-hidden">
        {isToday && (
          <Badge className="bg-primary text-primary-foreground animate-pulse text-[8px] w-fit h-4 px-1">
            {todayLabel}
          </Badge>
        )}
        <h3
          className={cn('text-xs font-bold leading-tight line-clamp-2', theme.text)}
          title={day.name}
        >
          {day.name}
        </h3>

        <div className="flex gap-1.5 items-center mt-auto">
          {day.rank !== 'FERIA' && day.rank !== 'WEEKDAY' && day.rank !== 'SUNDAY' && (
            <Badge
              variant="outline"
              className={cn('uppercase text-[7px] font-black py-0 px-1', theme.badge)}
            >
              {day.rank}
            </Badge>
          )}
          {day.isHolyDayOfObligation && (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 text-[7px] font-bold py-0 px-1"
            >
              {UI_STRINGS[language as keyof typeof UI_STRINGS]?.obligationLabel || 'PRECEPTO'}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
