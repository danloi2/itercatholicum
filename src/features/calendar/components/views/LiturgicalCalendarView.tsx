import React, { useMemo } from 'react';
import type { CalendarData } from '@features/calendar/hooks/useCalendar';
import HorizontalDayCard from '../cards/HorizontalDayCard';
import LiturgicalSeasonBanner from '../layout/LiturgicalSeasonBanner';
import { ROMCAL_MAP } from '@shared/constants/config';

interface LiturgicalCalendarViewProps {
  data: CalendarData;
  language: 'es' | 'la';
}

export const LiturgicalCalendarView: React.FC<LiturgicalCalendarViewProps> = ({
  data,
  language,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const elements = useMemo(() => {
    const sortedDates = Object.keys(data).sort();
    const result: React.ReactNode[] = [];
    let currentSeasonHeader: string | null = null;
    let ordinaryBlock = 1;

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
        const sundayCycle = principal.cycles?.sundayCycle || '';
        const year = principal.date
          ? new Date(principal.date).getFullYear()
          : new Date().getFullYear();
        result.push(
          <LiturgicalSeasonBanner
            key={`banner-${date}`}
            seasonKey={infoKey}
            language={language}
            sundayCycle={sundayCycle}
            year={year}
          />
        );
        currentSeasonHeader = season;
      }

      result.push(
        <HorizontalDayCard
          key={date}
          day={principal}
          isToday={date === todayStr}
          language={language}
        />
      );
    });

    return result;
  }, [data, language, todayStr]);

  if (elements.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-stone-400 font-serif italic">
        {language === 'la'
          ? 'Nullus dies in hoc tempore inventus est.'
          : 'No se encontraron días en este tiempo.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto px-4 pb-24">
      {elements}
    </div>
  );
};
