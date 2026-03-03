import { useMemo } from 'react';
import { format, addDays } from 'date-fns';
import type { CalendarData } from '@features/calendar/hooks/useCalendar';
import WeekDayCard from '../cards/WeekDayCard';
import { cn } from '@shared/lib/utils';
import { calendarService } from '../../services/calendarService';

interface WeeklyViewProps {
  data: CalendarData;
  loading: boolean;
  language: string;
  currentWeekStart: Date;
}

export default function WeeklyView({ data, loading, language, currentWeekStart }: WeeklyViewProps) {
  // Generate the 7 days for the current week view
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(currentWeekStart, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const events = data[dateStr] || [];
      return {
        date,
        dateStr,
        dayClass: events[0] || null,
      };
    });
  }, [currentWeekStart, data]);

  const headerInfo = useMemo(() => {
    const day = weekDays.find((wd) => wd.dayClass)?.dayClass;
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
        {/* Banner Skeleton */}
        <div className="relative overflow-hidden rounded-2xl h-28 bg-stone-100 animate-pulse" />
        {/* Cards Skeleton */}
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
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-8 flex items-center justify-center text-center shadow-sm border"
          style={{
            background: `linear-gradient(135deg, ${hex}18 0%, ${hex}08 50%, transparent 100%)`,
            borderColor: `${hex}20`,
          }}
        >
          {/* Decorative gradient blobs */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 20% 50%, ${hex}22 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, ${hex}11 0%, transparent 60%)`,
            }}
          />

          {/* Vertical accent bar */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{ backgroundColor: `${hex}90` }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {headerInfo.sundayCycle && (
              <div
                className={cn(
                  'mb-4 px-5 py-2 rounded-full text-sm font-black tracking-[0.2em] uppercase shadow-sm border backdrop-blur-md transition-all duration-300',
                  headerInfo.theme?.badge
                )}
                style={{
                  backgroundColor: `${hex}15`,
                  borderColor: `${hex}30`,
                  color: hex,
                }}
              >
                {headerInfo.sundayCycle}{' '}
                {headerInfo.weekdayCycle && ` • ${headerInfo.weekdayCycle}`}{' '}
                {headerInfo.year && ` - ${headerInfo.year}`}
              </div>
            )}

            {/* Main week text */}
            <h2
              className={cn(
                'text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-none capitalize',
                headerInfo.theme?.text ?? 'text-[#3d0c0c]'
              )}
              style={{ textShadow: `0 2px 12px ${hex}20` }}
            >
              {headerInfo.text}
            </h2>
          </div>
        </div>
      )}

      {/* Days Grid - Horizontal scroll on mobile, grid on desktop */}
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory lg:grid lg:grid-cols-7 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0 gap-4">
        {weekDays.map((wd) => (
          <div
            key={wd.dateStr}
            className="snap-start snap-always shrink-0 w-[85vw] sm:w-[280px] lg:w-auto"
          >
            <WeekDayCard
              day={wd.dayClass}
              dateStr={wd.dateStr}
              isToday={wd.dateStr === todayStr}
              language={language as 'es' | 'la'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
