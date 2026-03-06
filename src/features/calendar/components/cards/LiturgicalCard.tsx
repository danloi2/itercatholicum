import { useMemo } from 'react';
import { Card } from '@ui/card';
import { Badge } from '@ui/badge';
import { motion } from 'framer-motion';
import { RANK_MAP, CYCLE_MAP } from '@shared/constants/config';
import { cn } from '@shared/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { normalizeLiturgicalColor } from '@shared/lib/liturgy-engine';
import { la } from '@shared/lib/locales';
import type { LiturgicalDay } from '@shared/types';
import { LiturgicalBadge, LiturgicalColorBadge } from '@shared/components/LiturgicalBadge';

export type LiturgicalCardVariant = 'standard' | 'compact' | 'vertical' | 'vertical-compact';

interface LiturgicalCardProps {
  events: LiturgicalDay[];
  isToday?: boolean;
  language?: 'es' | 'la';
  variant?: LiturgicalCardVariant;
  className?: string;
}

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

export const LiturgicalCard: React.FC<LiturgicalCardProps> = ({
  events,
  isToday,
  language = 'es',
  variant = 'standard',
  className,
}) => {
  const day = events?.[0];
  if (!day) return null;

  const { theme, key: normalizedKey } = normalizeLiturgicalColor(day);
  const dateObj = new Date(day.date);
  const currentLocale = language === 'la' ? la : es;

  const weekday = format(dateObj, 'EEE', { locale: currentLocale });
  const month = format(dateObj, 'MMM', { locale: currentLocale });

  const todayLabel = language === 'la' ? 'HODIE' : 'HOY';
  const localizedRank = RANK_MAP[language]?.[day.rank.toUpperCase()] || day.rank;

  // Extract secondary items with titles and colors
  const secondaryItems = useMemo(() => {
    const items: Array<{ name: string; hex: string; showDot: boolean }> = [];
    const seenNames = new Set([day.name]);

    // Add other events from the array
    events.slice(1).forEach((e) => {
      if (!seenNames.has(e.name)) {
        const { theme: eTheme, key: eKey } = normalizeLiturgicalColor(e);
        // Show dot if it's a special rank OR if colors differ from the primary
        const showDot = e.rank !== 'WEEKDAY' || eKey !== normalizedKey;
        items.push({ name: e.name, hex: eTheme.hex, showDot });
        seenNames.add(e.name);
      }
    });

    // Add nested weekday if it exists and hasn't been seen
    if (day.weekday && !seenNames.has(day.weekday.name)) {
      const { theme: wTheme, key: wKey } = normalizeLiturgicalColor(day.weekday);
      // For the nested weekday, show dot if its color differs from the primary theme
      const showDot = wKey !== normalizedKey;
      items.push({ name: day.weekday.name, hex: wTheme.hex, showDot });
      seenNames.add(day.weekday.name);
    }

    return items;
  }, [events, day.name, day.weekday, normalizedKey]);

  // Responsive and variant-based size logic
  const isCompact = variant === 'compact';
  const isVertical = variant === 'vertical' || variant === 'vertical-compact';
  const isDense = variant === 'vertical-compact';

  return (
    <motion.div
      whileHover={{ scale: 1.03, zIndex: 10, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className={cn('w-full max-w-[30em] mx-auto overflow-visible', className)}
    >
      <Card
        id={day.date}
        className={cn(
          'overflow-hidden transition-all duration-300 hover:shadow-xl border-l-4 relative',
          isVertical && 'flex flex-col border-l-0 border-t-4 h-full',
          !isVertical && 'flex flex-row',
          isCompact && 'min-h-[7em]',
          theme.bg,
          isToday ? 'ring-2 ring-primary ring-offset-2 z-10' : ''
        )}
        style={{
          borderLeftColor: !isVertical ? theme.hex : undefined,
          borderTopColor: isVertical ? theme.hex : undefined,
        }}
      >
        {/* Date Section */}
        <div
          className={cn(
            'shrink-0 flex flex-col items-center justify-center border-[#c49b9b]/20 bg-white/30 backdrop-blur-sm',
            isVertical
              ? isDense
                ? 'p-[0.6em] border-b'
                : 'p-[1em] border-b'
              : 'w-[6em] border-r p-[0.75em]',
            isCompact && 'w-[6em]'
          )}
        >
          <div className="mb-[0.25em] px-[0.4em] py-[0.1em] rounded-sm bg-black/85 text-white text-[0.7em] font-black tracking-widest leading-none">
            {dateObj.getFullYear()}
          </div>
          <div className="text-[0.75em] font-bold text-[#c49b9b] uppercase tracking-widest mb-[0.25em]">
            {weekday}
          </div>
          <div
            className={cn(
              'font-black tracking-tighter leading-none mb-[0.1em]',
              isVertical
                ? isDense
                  ? 'text-[2.25em]'
                  : 'text-[3em]'
                : 'text-[2.25em] md:text-[2.5em]',
              theme.text
            )}
          >
            {format(dateObj, 'd')}
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[0.75em] font-bold text-[#c49b9b] uppercase tracking-widest">
              {month}
            </div>
            <div className="flex flex-col gap-[0.1em] mt-[0.25em] items-center">
              {day.cycles?.sundayCycle && (
                <div className="px-[0.3em] py-[0.1em] rounded-sm bg-stone-100/50 text-stone-500 text-[0.6em] font-bold border border-stone-200 uppercase tracking-tighter leading-tight">
                  {CYCLE_MAP[language]?.[day.cycles.sundayCycle] || day.cycles.sundayCycle}
                </div>
              )}
              {day.cycles?.weekdayCycle && (
                <div className="px-[0.3em] py-[0.1em] rounded-sm bg-stone-100/50 text-stone-500 text-[0.6em] font-bold border border-stone-200 uppercase tracking-tighter leading-tight">
                  {CYCLE_MAP[language]?.[day.cycles.weekdayCycle] || day.cycles.weekdayCycle}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          className={cn(
            'flex-1 flex flex-col min-w-0',
            isVertical
              ? isDense
                ? 'p-[0.75em] gap-[0.5em] justify-between'
                : 'p-[1em] gap-[0.75em] justify-between'
              : 'p-[1em] sm:px-[1.25em]'
          )}
        >
          {/* Title and Badges row */}
          <div
            className={cn('flex flex-col gap-[0.4em]', isVertical && 'items-center text-center')}
          >
            <div
              className={cn(
                'flex flex-row items-baseline justify-between gap-[0.5em]',
                isVertical && 'flex-col items-center'
              )}
            >
              <h3
                className={cn(
                  'font-bold leading-tight',
                  isCompact
                    ? 'text-[0.875em]'
                    : isDense
                      ? 'text-[0.9em]'
                      : 'text-[1em] md:text-[1.125em]',
                  theme.text
                )}
                title={day.name}
              >
                {day.name}
              </h3>
            </div>

            {/* Secondary items (commemorations, ferias) */}
            {secondaryItems.length > 0 && (
              <div
                className={cn('flex flex-col gap-[0.3em] opacity-80', isVertical && 'items-center')}
              >
                {secondaryItems.map((item) => (
                  <div
                    key={item.name}
                    className={cn('flex items-center gap-[0.5em]', isVertical && 'justify-center')}
                  >
                    {item.showDot && (
                      <div
                        className="w-[0.5em] h-[0.5em] rounded-full shrink-0 shadow-sm border border-black/10"
                        style={{ backgroundColor: item.hex }}
                      />
                    )}
                    <p
                      className={cn(
                        'leading-tight italic font-medium',
                        isCompact ? 'text-[0.7em]' : 'text-[0.75em]',
                        theme.text
                      )}
                    >
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Liturgical metadata */}
            {day.calendar?.weekOfSeason > 0 && (
              <div
                className={cn(
                  'font-semibold uppercase tracking-wider opacity-60 flex items-center gap-2',
                  'flex-col gap-[0.25em] items-start',
                  isVertical && 'items-center',
                  isCompact ? 'text-[0.6em] mt-[0.1em]' : 'text-[0.7em]',
                  theme.text
                )}
              >
                <div className="flex items-center gap-2">
                  <span>
                    {language === 'la' ? 'Hebdomada' : 'Semana'} {day.calendar.weekOfSeason}{' '}
                    {day.seasonNames[0]}
                  </span>
                </div>
                {isToday && (
                  <Badge
                    variant="default"
                    className="bg-primary text-primary-foreground animate-pulse text-[0.7em] h-[1.5em] px-[0.5em]"
                  >
                    {todayLabel}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Footer stuff (Colors / Rank / Obligation) */}
          <div
            className={cn(
              'mt-auto pt-[0.75em] flex flex-wrap gap-[0.5em]',
              'justify-between items-center'
            )}
          >
            <div className="flex flex-wrap gap-[0.5em]">
              <LiturgicalBadge
                theme={theme}
                rawRank={
                  day.isHolyDayOfObligation || day.rank === 'SOLEMNITY' || day.rank === 'SUNDAY'
                    ? 'SUNDAY'
                    : day.rank
                }
                className="text-[0.75em] h-[1.8em]"
              >
                {day.rank === 'SOLEMNITY'
                  ? localizedRank
                  : day.isHolyDayOfObligation
                    ? RANK_MAP[language]?.SUNDAY || 'DOMINGO'
                    : localizedRank}
              </LiturgicalBadge>
            </div>

            <div className="flex flex-wrap gap-[0.5em] items-center ml-auto">
              {[
                ...new Set([
                  ...((day.colors || []) as string[]).map((c) => c.toUpperCase()),
                  normalizedKey,
                ]),
              ].map((c) => (
                <LiturgicalColorBadge
                  key={c}
                  theme={theme}
                  colorName={COLOR_NAME_MAP[language]?.[c] || c}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
