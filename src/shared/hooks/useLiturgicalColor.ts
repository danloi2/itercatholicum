import { useState, useEffect } from 'react';
import { COLOR_MAP } from '@shared/constants/config';
import type { ColorTheme } from '@shared/types';
import { getLiturgicalDayInfo, normalizeLiturgicalColor } from '@shared/lib/liturgy-engine';

/**
 * Determines the liturgical color for today using Romcal,
 * applying the same normalization as LiturgicalCard.tsx.
 *
 * Returns a hex color string and its full ColorTheme object.
 */
export function useTodayLiturgicalColor(language: 'es' | 'la' = 'es') {
  const [theme, setTheme] = useState<ColorTheme>(COLOR_MAP.WHITE);

  useEffect(() => {
    async function loadColor() {
      try {
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const today = await getLiturgicalDayInfo(todayStr, language);

        if (today) {
          const { theme: colorTheme } = normalizeLiturgicalColor(today);
          setTheme(colorTheme);
        }
      } catch {
        // Keep white default  // @ts-expect-error: romcal has non-standard internal structure in this version
      }
    }

    loadColor();
  }, [language]);

  return { hex: theme.hex, theme };
}
