// type LiturgicalDay is any to avoid broken romcal import
type LiturgicalDay = any;
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { COLOR_MAP, UI_STRINGS } from '@/constants/config';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { LiturgicalColor } from '@/types';

interface DayCardProps {
  day: LiturgicalDay;
  isToday?: boolean;
  language?: string;
}

export default function DayCard({ day, isToday, language = 'es' }: DayCardProps) {
  // Determine primary color with liturgical overrides
  let rawColor = (day.colors[0] || 'WHITE').toUpperCase();

  // Normalization
  if (rawColor === 'PURPLE') rawColor = 'VIOLET';
  if (rawColor === 'ROSE') rawColor = 'PINK';

  // Specific day overrides
  if (day.id === 'immaculate_conception_of_the_blessed_virgin_mary') rawColor = 'BLUE';
  if (day.id === 'advent_3_sunday' || day.id === 'lent_4_sunday') rawColor = 'PINK';

  const colorKey = rawColor as LiturgicalColor;
  const theme = COLOR_MAP[colorKey] || COLOR_MAP.WHITE;

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

  const RANK_MAP: Record<string, Record<string, string>> = {
    es: {
      SOLEMNITY: 'SOLEMNIDAD',
      FEAST: 'FIESTA',
      MEMORIAL: 'MEMORIA',
      OPTIONAL_MEMORIAL: 'MEMORIA LIBRE',
      SUNDAY: 'DOMINGO',
      FERIA: 'FERIA',
      WEEKDAY: 'FERIA',
    },
    la: {
      SOLEMNITY: 'SOLLEMNITAS',
      FEAST: 'FESTUM',
      MEMORIAL: 'MEMORIA',
      OPTIONAL_MEMORIAL: 'MEMORIA AD LIBITUM',
      SUNDAY: 'DOMINICA',
      FERIA: 'FERIA',
      WEEKDAY: 'FERIA',
    },
  };

  const COLOR_NAME_MAP: Record<string, Record<string, string>> = {
    es: {
      WHITE: 'BLANCO',
      VIOLET: 'MORADO',
      GREEN: 'VERDE',
      RED: 'ROJO',
      PINK: 'ROSA',
      BLUE: 'AZUL',
      BLACK: 'NEGRO',
    },
    la: {
      WHITE: 'ALBUS',
      VIOLET: 'VIOLACEUS',
      GREEN: 'VIRIDIS',
      RED: 'RUBER',
      PINK: 'ROSEUS',
      BLUE: 'CAERULEUS',
      BLACK: 'NIGER',
    },
  };

  const localizedRank = RANK_MAP[language]?.[day.rank.toUpperCase()] || day.rank;

  return (
    <Card
      id={day.date}
      className={cn(
        'overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 flex flex-row',
        theme.bg,
        isToday ? 'ring-2 ring-primary ring-offset-2' : ''
      )}
      style={{ borderLeftColor: theme.hex }}
    >
      {/* Date Widget */}
      <div className="w-20 md:w-20 shrink-0 flex flex-col items-center justify-center p-2 border-r border-[#c49b9b]/30 bg-white/40 backdrop-blur-sm">
        <div className="text-[9px] font-bold text-[#c49b9b] uppercase tracking-widest mb-0.5">
          {weekday}
        </div>
        <div
          className={cn(
            'text-2xl md:text-3xl font-black tracking-tighter leading-none mb-0.5',
            theme.text
          )}
        >
          {format(dateObj, 'd')}
        </div>
        <div className="text-[9px] font-bold text-[#c49b9b] uppercase tracking-widest">{month}</div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="pb-1 pt-2 px-3 sm:px-4 flex flex-col gap-1">
          <div className="flex flex-row items-baseline justify-between gap-4">
            <h3 className={cn('text-base font-bold leading-tight', theme.text)}>{day.name}</h3>
            <div className="flex flex-col gap-1 items-end">
              {day.isHolyDayOfObligation && (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] font-bold"
                >
                  {UI_STRINGS[language as keyof typeof UI_STRINGS]?.obligationLabel || 'PRECEPTO'}
                </Badge>
              )}
              {day.rank !== 'FERIA' && day.rank !== 'WEEKDAY' && day.rank !== 'SUNDAY' && (
                <Badge
                  variant="outline"
                  className={cn('uppercase text-[9px] font-medium', theme.badge)}
                >
                  {localizedRank}
                </Badge>
              )}
              {isToday && (
                <Badge
                  variant="default"
                  className="bg-primary text-primary-foreground animate-pulse text-[10px]"
                >
                  {todayLabel}
                </Badge>
              )}
            </div>
          </div>
          {day.calendar?.weekOfSeason > 0 && (
            <div
              className={cn(
                'text-[10px] font-semibold uppercase tracking-wider opacity-70',
                theme.text
              )}
            >
              {language === 'la' ? 'Hebdomada' : 'Semana'} {day.calendar.weekOfSeason}{' '}
              {language === 'la' ? 'de' : 'de'} {day.seasonNames[0]}
            </div>
          )}
        </div>
        <CardContent className="px-3 sm:px-4 pb-2 pt-0">
          <div className="flex flex-wrap gap-2 mt-1">
            {day.colors.map((c: string) => (
              <Badge
                key={c}
                variant="outline"
                className="uppercase text-[9px] bg-white/50 font-medium"
              >
                {COLOR_NAME_MAP[language]?.[c.toUpperCase()] || c}
              </Badge>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
