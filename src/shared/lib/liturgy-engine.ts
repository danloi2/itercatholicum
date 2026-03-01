import Romcal from '@shared/lib/romcal/romcal.js';
// @ts-ignore
import Spain_Es from '@shared/lib/romcal/es.js';
// @ts-ignore
import Spain_La from '@shared/lib/romcal/la.js';
import { COLOR_MAP } from '@shared/constants/config';
import type { ColorTheme, LiturgicalColor } from '@shared/types';

export type LiturgicalDay = any;

/**
 * Normalizes liturgical colors and applies business rules for specific feasts.
 */
export function normalizeLiturgicalColor(day: LiturgicalDay): {
  key: LiturgicalColor;
  theme: ColorTheme;
} {
  let rawColor = (day.colors[0] || 'WHITE').toUpperCase();

  // Standard normalization
  if (rawColor === 'PURPLE') rawColor = 'VIOLET';
  if (rawColor === 'ROSE') rawColor = 'PINK';

  // Specific day overrides (to be centralized here)
  if (day.id === 'immaculate_conception_of_the_blessed_virgin_mary') rawColor = 'BLUE';
  if (day.id === 'advent_3_sunday' || day.id === 'lent_4_sunday') rawColor = 'PINK';

  const colorKey = rawColor as LiturgicalColor;
  const theme = COLOR_MAP[colorKey] || COLOR_MAP.WHITE;

  return { key: colorKey, theme };
}

/**
 * Creates a Romcal instance for the given language.
 */
export function createRomcalInstance(language: 'es' | 'la' = 'es') {
  const locale = language === 'la' ? Spain_La : Spain_Es;
  // @ts-ignore
  return new Romcal.Romcal({ localizedCalendar: locale });
}

/**
 * Fetches the liturgical data for a specific year.
 */
export async function getLiturgicalYearData(year: number, language: 'es' | 'la' = 'es') {
  const romcal = createRomcalInstance(language);
  return await romcal.generateCalendar(year);
}

/**
 * Gets the liturgical information for a specific date string (YYYY-MM-DD).
 */
export async function getLiturgicalDayInfo(
  dateStr: string,
  language: 'es' | 'la' = 'es'
): Promise<LiturgicalDay | null> {
  const year = new Date(dateStr).getFullYear();
  const cal = await getLiturgicalYearData(year, language);
  const allDays: LiturgicalDay[] = Object.values(cal).flat();
  return allDays.find((d: any) => d.date === dateStr) || null;
}
