import React, { useMemo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { CalendarData } from '@features/calendar/hooks/useCalendar';
import { LiturgicalCard } from '../cards/LiturgicalCard';
import LiturgicalSeasonBanner from '../layout/LiturgicalSeasonBanner';
import { ROMCAL_MAP } from '@shared/constants/config';

interface LiturgicalCalendarViewProps {
  data: CalendarData;
  language: 'es' | 'la';
  selectedDate?: Date;
}

/**
 * Helper component that applies a dramatic vertical focus scaling.
 */
function VerticalFocusCard({ children, id }: { children: React.ReactNode; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center', 'end start'],
  });

  // Continuous Focus Curve: Wider peaks to ensure no gaps during scroll
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.65, 1], [0.7, 1.0, 1.25, 1.0, 0.7]);

  return (
    <motion.div
      ref={ref}
      id={id}
      style={{ scale }}
      className="w-full origin-center py-4 overflow-visible relative"
    >
      {children}
    </motion.div>
  );
}

export const LiturgicalCalendarView: React.FC<LiturgicalCalendarViewProps> = ({
  data,
  language,
  selectedDate,
}) => {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Handle scrolling when selectedDate changes from header
  useEffect(() => {
    if (selectedDate) {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      const el = document.getElementById(dateStr);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedDate]);

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
          <VerticalFocusCard key={`banner-${date}`}>
            <LiturgicalSeasonBanner
              seasonKey={infoKey}
              language={language}
              sundayCycle={sundayCycle}
              year={year}
            />
          </VerticalFocusCard>
        );
        currentSeasonHeader = season;
      }

      result.push(
        <VerticalFocusCard key={date} id={date === todayStr ? 'today' : date}>
          <LiturgicalCard
            events={events}
            isToday={date === todayStr}
            language={language}
            variant="standard"
          />
        </VerticalFocusCard>
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
    <div className="flex flex-col gap-0 w-full mx-auto pb-64 pt-32 relative overflow-visible px-4 md:px-12">
      {elements}
    </div>
  );
};
