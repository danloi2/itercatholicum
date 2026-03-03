import React from 'react';
import DayCard from '../cards/DayCard';
import LiturgicalSeasonBanner from '../layout/LiturgicalSeasonBanner';
import type { CalendarData } from '@features/calendar/hooks/useCalendar';
import { ROMCAL_MAP } from '@shared/constants/config';

interface LiturgicalSeasonViewProps {
  data: CalendarData;
  loading: boolean;
  language: string;
  seasonFilter?: string;
}

export default function LiturgicalSeasonView({
  data,
  loading,
  language,
  seasonFilter = 'none',
}: LiturgicalSeasonViewProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const sortedDates = Object.keys(data).sort();

  let currentSeasonHeader: string | null = null;
  let ordinaryBlock = 1;

  const elements: React.ReactNode[] = [];

  sortedDates.forEach((date) => {
    const events = data[date];
    const principal = events[0];
    if (!principal) return;

    // Season Logic: Determine which season section we are in
    const seasonRaw = principal.seasons?.[0] || 'ORDINARY_TIME';
    // Use centralized mapping and periods
    let season = ROMCAL_MAP[seasonRaw.toUpperCase()] || seasonRaw.toUpperCase();

    // Specific overrides for Holy Week
    if (principal.periods?.includes('HOLY_WEEK')) season = 'HOLY_WEEK';

    // Handle split Ordinary Time (I and II)
    if (season === 'ORDINARY_TIME' && currentSeasonHeader === 'EASTER') {
      ordinaryBlock = 2;
    }

    // Render decorative Banner when season changes
    const infoKey =
      season === 'ORDINARY_TIME'
        ? ordinaryBlock === 1
          ? 'ORDINARY_TIME_1'
          : 'ORDINARY_TIME_2'
        : season;

    if (season !== currentSeasonHeader) {
      if (seasonFilter === 'none' || seasonFilter === infoKey) {
        const sundayCycle = principal.cycles?.sundayCycle || '';
        const year = principal.date
          ? new Date(principal.date).getFullYear()
          : new Date().getFullYear();

        elements.push(
          <LiturgicalSeasonBanner
            key={`banner-${date}`}
            seasonKey={infoKey}
            language={language}
            sundayCycle={sundayCycle}
            year={year}
          />
        );
      }
      currentSeasonHeader = season;
    }

    if (seasonFilter !== 'none' && seasonFilter !== infoKey) {
      return;
    }

    elements.push(
      <DayCard key={date} day={principal} isToday={date === todayStr} language={language} />
    );
  });

  return <div className="space-y-4 relative">{elements}</div>;
}
