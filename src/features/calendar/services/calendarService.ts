import { ROMCAL_MAP, CYCLE_MAP } from '@shared/constants/config';
import { normalizeLiturgicalColor, getFullLiturgicalName } from '@shared/lib/liturgy-engine';
import type { ColorTheme, LiturgicalDay } from '@shared/types';

export interface LiturgicalSummary {
  text: string;
  theme: ColorTheme;
  season: string;
  weekNum: number;
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

export const calendarService = {
  getLiturgicalSummary(day: LiturgicalDay, language: 'es' | 'la'): LiturgicalSummary | null {
    if (!day) return null;

    const theme = normalizeLiturgicalColor(day).theme;
    const text = getFullLiturgicalName(day, language);
    const seasonRaw = day.seasons?.[0] || 'ORDINARY_TIME';
    const season = ROMCAL_MAP[seasonRaw.toUpperCase()] || seasonRaw.toUpperCase();
    const weekNum = day.calendar?.weekOfSeason || 0;

    return { text, theme, season, weekNum };
  },

  getCycleInfo(
    day: LiturgicalDay,
    language: 'es' | 'la'
  ): { sunday: string; weekday: string; year: number } {
    if (!day) return { sunday: '', weekday: '', year: new Date().getFullYear() };

    const sundayCycle = day.cycles?.sundayCycle || '';
    const localizedSundayCycle = CYCLE_MAP[language]?.[sundayCycle] || sundayCycle;

    const year = day.date ? new Date(day.date).getFullYear() : new Date().getFullYear();
    const weekdayCycle =
      year % 2 !== 0
        ? language === 'la'
          ? 'Annus I'
          : 'Año I'
        : language === 'la'
          ? 'Annus II'
          : 'Año II';

    return { sunday: localizedSundayCycle, weekday: weekdayCycle, year };
  },
};
