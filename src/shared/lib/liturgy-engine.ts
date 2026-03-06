import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { la } from '@shared/lib/locales';
import { Romcal } from 'romcal';
import { Spain_Es, Spain_La } from '@romcal/calendar.spain';
import { COLOR_MAP, ROMCAL_MAP } from '@shared/constants/config';
import type { ColorTheme, LiturgicalColor, LiturgicalDay } from '@shared/types';

/**
 * Normalizes liturgical colors and applies business rules for specific feasts.
 */
export function normalizeLiturgicalColor(day: Partial<LiturgicalDay> & { colors: string[] }): {
  key: LiturgicalColor;
  theme: ColorTheme;
} {
  let rawColor = (day.colors[0] || 'WHITE').toUpperCase();

  // Keep BLUE override (not a native Romcal color, our custom override)
  if (day.id === 'immaculate_conception_of_the_blessed_virgin_mary') rawColor = 'BLUE';
  if (day.id === 'advent_3_sunday' || day.id === 'lent_4_sunday') rawColor = 'ROSE';

  const colorKey = rawColor as LiturgicalColor;
  const theme = COLOR_MAP[colorKey] || COLOR_MAP.WHITE;

  return { key: colorKey, theme };
}

/**
 * Creates a Romcal instance for the given language.
 */
export function createRomcalInstance(language: 'es' | 'la' = 'es') {
  const localizedCalendar = language === 'la' ? Spain_La : Spain_Es;
  return new Romcal({ localizedCalendar });
}

/**
 * Fetches the liturgical data for a specific year.
 */
export async function getLiturgicalYearData(year: number, language: 'es' | 'la' = 'es') {
  const romcal = createRomcalInstance(language);
  return await romcal.generateCalendar(year);
}

export const SEASON_NAMES: Record<string, Record<string, string>> = {
  es: {
    ADVENT: 'Adviento',
    CHRISTMAS: 'Navidad',
    LENT: 'Cuaresma',
    EASTER: 'Pascua',
    ORDINARY_TIME: 'Tiempo Ordinario',
    HOLY_WEEK: 'Semana Santa',
  },
  la: {
    ADVENT: 'Adventus',
    CHRISTMAS: 'Nativitatis',
    LENT: 'Quadragesima',
    EASTER: 'Paschae',
    ORDINARY_TIME: 'Tempus per Annum',
    HOLY_WEEK: 'Hebdomada Sancta',
  },
};

function getOrdinal(n: number, lang: 'es' | 'la'): string {
  if (lang === 'la') {
    const ordinals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return ordinals[n] || n.toString();
  }
  return `${n}ª`;
}

/**
 * Generates a full liturgical name including weekday and week of season.
 * Example: "Martes de la 2ª semana de Cuaresma"
 */
export function getFullLiturgicalName(day: LiturgicalDay, lang: 'es' | 'la'): string {
  if (!day) return '';

  // Parse YYYY-MM-DD without timezone shift
  const dateStr = day.date.split('T')[0];
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);

  const currentLocale = lang === 'la' ? la : es;
  const weekday = format(dateObj, 'EEEE', { locale: currentLocale });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  const seasonRaw = day.seasons?.[0] || 'ORDINARY_TIME';
  const mappedSeason = ROMCAL_MAP[seasonRaw.toUpperCase()] || seasonRaw.toUpperCase();
  const translatedSeason =
    SEASON_NAMES[lang]?.[mappedSeason] || day.seasonNames?.[0] || mappedSeason;
  const weekNum = day.calendar?.weekOfSeason || 0;

  if (day.periods?.includes('HOLY_WEEK')) {
    const holyDay = lang === 'la' ? 'Hebdomada Sancta' : 'Semana Santa';
    const link = lang === 'la' ? 'in' : 'de';
    return `${capitalizedWeekday} ${link} ${holyDay}`;
  }

  if (weekNum > 0) {
    const ordinal = getOrdinal(weekNum, lang);
    if (lang === 'la') {
      // Latin format: "Feria IV in hebdomada II Quadragesimae" or "Feria IV in II hebdomada Quadragesima"
      // Using simpler structure: "Feria IV in II hebdomada Quadragesima"
      return `${capitalizedWeekday} in ${ordinal} hebdomada ${translatedSeason}`;
    }
    // Spanish format: "Miércoles de la 2ª semana de Cuaresma"
    return `${capitalizedWeekday} de la ${ordinal} semana de ${translatedSeason}`;
  }

  return day.name;
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
  const allDays = Object.values(cal).flat() as LiturgicalDay[];
  return allDays.find((d) => d.date.split('T')[0] === dateStr) || null;
}
