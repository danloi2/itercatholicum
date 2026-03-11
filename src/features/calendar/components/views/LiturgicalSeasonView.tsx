import React from 'react';
import { LiturgicalCard } from '../cards/LiturgicalCard';
import LiturgicalSeasonBanner from '@shared/components/widgets/LiturgicalSeasonBanner';
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
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

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

    const seasonRaw = principal.seasons?.[0] || 'ORDINARY_TIME';
    let season = ROMCAL_MAP[seasonRaw.toUpperCase()] || seasonRaw.toUpperCase();
    if (principal.periods?.includes('HOLY_WEEK')) season = 'HOLY_WEEK';

    if (season === 'ORDINARY_TIME' && currentSeasonHeader === 'EASTER') {
      ordinaryBlock = 2;
    }

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
          <div key={`banner-${date}`} className="w-full py-4">
            <LiturgicalSeasonBanner
              seasonKey={infoKey}
              language={language}
              sundayCycle={sundayCycle}
              year={year}
            />
          </div>
        );
      }
      currentSeasonHeader = season;
    }

    if (seasonFilter !== 'none' && seasonFilter !== infoKey) {
      return;
    }

    elements.push(
      <div key={date} className="w-full py-4">
        <LiturgicalCard
          events={events}
          isToday={date === todayStr}
          language={language as 'es' | 'la'}
          variant="standard"
        />
      </div>
    );
  });

  return (
    <div
      className="relative px-4 md:px-12 pb-64 pt-32 w-full mx-auto overflow-visible"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
      }}
    >
      <div className="flex flex-col gap-0 items-center justify-center w-full max-w-7xl mx-auto overflow-visible">
        {elements}
      </div>
    </div>
  );
}
