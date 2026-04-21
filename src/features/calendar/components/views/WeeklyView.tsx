import { useMemo, useRef } from 'react';
import { format, addDays } from 'date-fns';
import { motion } from 'framer-motion';
import type { CalendarData } from '@features/calendar/hooks/useCalendar';
import { LiturgicalCard } from '../cards/LiturgicalCard';
import { cn } from '@shared/lib/utils';
import { calendarService } from '../../services/calendarService';

interface WeeklyViewProps {
  data: CalendarData;
  loading: boolean;
  language: string;
  currentWeekStart: Date;
}

export default function WeeklyView({ data, loading, language, currentWeekStart }: WeeklyViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate the 7 days for the current week view
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(currentWeekStart, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const events = data[dateStr] || [];
      return {
        date,
        dateStr,
        events,
      };
    });
  }, [currentWeekStart, data]);

  const headerInfo = useMemo(() => {
    const day = weekDays.find((wd) => wd.events[0])?.events[0];
    if (!day) return null;

    const summary = calendarService.getLiturgicalSummary(day, language as 'es' | 'la');
    const { sunday, weekday, year } = calendarService.getCycleInfo(day, language as 'es' | 'la');

    return {
      text: summary?.text,
      theme: summary?.theme,
      sundayCycle: sunday,
      year,
      weekdayCycle: weekday,
    };
  }, [weekDays, language]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="relative overflow-hidden rounded-2xl h-28 bg-stone-100 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const hex = headerInfo?.theme?.hex ?? '#8B0000';

  return (
    <div className="flex flex-col gap-6">
      {/* Week Banner */}
      {headerInfo && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl px-6 py-8 flex items-center justify-center text-center shadow-lg border"
          style={{
            background: `linear-gradient(135deg, ${hex}18 0%, ${hex}08 50%, transparent 100%)`,
            borderColor: `${hex}20`,
          }}
        >
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 20% 50%, ${hex}22 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, ${hex}11 0%, transparent 60%)`,
            }}
          />
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{ backgroundColor: hex === '#ffffff' ? '#8B0000' : `${hex}90` }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {headerInfo.sundayCycle && (
              <div
                className={cn(
                  'mb-[1em] px-[1.5em] py-[0.6em] rounded-full text-[1em] font-black tracking-[0.2em] uppercase shadow-sm border backdrop-blur-md transition-all duration-300',
                  headerInfo.theme?.badge
                )}
                style={{
                  backgroundColor: `${hex}15`,
                  borderColor: `${hex}30`,
                  color: hex === '#ffffff' ? '#8B0000' : hex,
                }}
              >
                {headerInfo.sundayCycle}{' '}
                {headerInfo.weekdayCycle && ` • ${headerInfo.weekdayCycle}`}{' '}
                {headerInfo.year && ` - ${headerInfo.year}`}
              </div>
            )}

            <h2
              className={cn(
                'text-[1.5em] sm:text-[1.875em] md:text-[2.25em] font-black tracking-tight leading-none capitalize',
                headerInfo.theme?.text ?? 'text-[#3d0c0c]'
              )}
              style={{ textShadow: `0 2px 12px ${hex}20` }}
            >
              {headerInfo.text}
            </h2>
          </div>
        </motion.div>
      )}

      {/* Grid of cards - No focus effects or masking */}
      <div className="relative overflow-visible">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-6 pt-4 -mx-4 px-4 sm:px-6 snap-x snap-mandatory lg:overflow-visible lg:grid lg:grid-cols-7 lg:px-0 lg:mx-0 gap-4 no-scrollbar"
        >
          {weekDays.map((wd) => (
            <LiturgicalCard
              key={wd.dateStr}
              events={wd.events}
              isToday={wd.dateStr === todayStr}
              language={language as 'es' | 'la'}
              variant="vertical-compact"
              className="snap-center shrink-0 w-[85vw] sm:w-[18em] lg:w-auto"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
