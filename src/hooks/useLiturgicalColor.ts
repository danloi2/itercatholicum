import { useState, useEffect } from 'react';
import { COLOR_MAP } from '@/constants/config';
import type { LiturgicalColor } from '@/types';
import Romcal from '@/lib/romcal/romcal.js';
import Spain_Es from '@/lib/romcal/es.js';
import Spain_La from '@/lib/romcal/la.js';

/**
 * Determines the liturgical color for today using Romcal,
 * applying the same normalization as DayCard.tsx.
 *
 * Returns a hex color string and its full ColorTheme object.
 */
export function useTodayLiturgicalColor(language: 'es' | 'la' = 'es') {
  const [hex, setHex] = useState<string>('#2563eb'); // default: blue-600

  useEffect(() => {
    async function loadColor() {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const year = new Date().getFullYear();

        const locale = language === 'la' ? Spain_La : Spain_Es;
        // @ts-ignore
        const romcal = new Romcal.Romcal({ localizedCalendar: locale });
        const cal = await romcal.generateCalendar(year);

        const allDays: any[] = Object.values(cal).flat();
        const today = allDays.find((d: any) => d.date === todayStr);

        if (today && today.colors && today.colors[0]) {
          let rawColor = (today.colors[0] || 'WHITE').toUpperCase();

          // Normalization (same as DayCard.tsx)
          if (rawColor === 'PURPLE') rawColor = 'VIOLET';
          if (rawColor === 'ROSE') rawColor = 'PINK';
          if (today.id === 'immaculate_conception_of_the_blessed_virgin_mary') rawColor = 'BLUE';
          if (today.id === 'advent_3_sunday' || today.id === 'lent_4_sunday') rawColor = 'PINK';

          const theme = COLOR_MAP[rawColor as LiturgicalColor] || COLOR_MAP.WHITE;
          setHex(theme.hex);
        }
      } catch (e) {
        // Keep blue default on error
      }
    }

    loadColor();
  }, [language]);

  return hex;
}
