import { useState, useCallback } from 'react';
// moment polyfill is handled inside @/lib/romcal/romcal.js
import { createRomcalInstance } from '@shared/lib/liturgy-engine';
import { getStartOfLiturgicalYear, getEndOfLiturgicalYear } from '@shared/lib/liturgy-utils';

import type { LiturgicalDay } from '@shared/types';

export interface CalendarData {
  [date: string]: LiturgicalDay[];
}

export function useCalendar() {
  const [data, setData] = useState<CalendarData>({});
  const [loading, setLoading] = useState(false);

  const generateData = useCallback(async (targetYear: number, language: string = 'es') => {
    setLoading(true);
    try {
      // Centralized Romcal instantiation
      const romcal = createRomcalInstance(language as 'es' | 'la');

      // We want the liturgical year whose Advent started at the end of
      // (targetYear - 1). This covers Advent (targetYear-1) through the
      // Saturday before Advent of targetYear — i.e. the full cycle active
      // during calendar year targetYear.
      const [cal1, cal2] = await Promise.all([
        romcal.generateCalendar(targetYear - 1),
        romcal.generateCalendar(targetYear),
      ]);

      const allEvents = [
        ...(Object.values(cal1).flat() as LiturgicalDay[]),
        ...(Object.values(cal2).flat() as LiturgicalDay[]),
      ];

      // Filter to the liturgical year that started in Advent of (targetYear - 1)
      const start = getStartOfLiturgicalYear(targetYear - 1);
      const end = getEndOfLiturgicalYear(targetYear - 1);

      const map: CalendarData = {};

      // Process events for the target liturgical year range
      allEvents.forEach((d: LiturgicalDay) => {
        const dateStr = d.date.split('T')[0];
        const dateObj = new Date(dateStr);

        if (dateObj >= start && dateObj <= end) {
          if (!map[dateStr]) {
            map[dateStr] = [];
          }
          map[dateStr].push(d);
        }
      });

      setData(map);
    } catch (error) {
      console.error('Error generating calendar:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, generateData };
}
