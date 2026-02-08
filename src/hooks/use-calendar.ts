import { useState, useCallback } from 'react';
// moment polyfill is handled inside @/lib/romcal/romcal.js
import Romcal from '@/lib/romcal/romcal.js';
import Spain_Es from '@/lib/romcal/es.js';
import Spain_La from '@/lib/romcal/la.js';
// import { Romcal } from 'romcal'; // unused
// import type { LiturgicalDay } from 'romcal'; // Types might be broken if I uninstalled package.
import { getStartOfLiturgicalYear, getEndOfLiturgicalYear } from '@/lib/date-utils';

type LiturgicalDay = any;

export interface CalendarData {
  [date: string]: LiturgicalDay[];
}

export function useCalendar() {
  const [data, setData] = useState<CalendarData>({});
  const [loading, setLoading] = useState(false);

  const generateData = useCallback(async (targetYear: number, language: string = 'es') => {
    setLoading(true);
    try {
      const locales: Record<string, any> = {
        es: Spain_Es,
        la: Spain_La,
      };

      const selectedLocale = locales[language] || Spain_Es;

      // Legacy Romcal instantiation
      // @ts-ignore
      const romcal = new Romcal.Romcal({ localizedCalendar: selectedLocale });

      // Generate data for overlap years to ensure full coverage
      // We want to cover the liturgical year ending in `targetYear`.
      // The liturgical year ends in late Nov of `targetYear`.
      // It starts in late Nov of `targetYear - 1`.
      // So merging targetYear and targetYear - 1 is correct.

      const [cal1, cal2] = await Promise.all([
        romcal.generateCalendar(targetYear - 1),
        romcal.generateCalendar(targetYear),
      ]);

      const allEvents = [...Object.values(cal1).flat(), ...Object.values(cal2).flat()];

      const start = getStartOfLiturgicalYear(targetYear);
      const end = getEndOfLiturgicalYear(targetYear);

      const map: CalendarData = {};

      // Process events for the target liturgical year range
      allEvents.forEach((d: LiturgicalDay) => {
        const dateStr = d.date; // ISO string YYYY-MM-DD
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
