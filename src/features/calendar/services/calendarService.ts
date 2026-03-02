import { ROMCAL_MAP, CYCLE_MAP } from '@shared/constants/config';
import { normalizeLiturgicalColor } from '@shared/lib/liturgy-engine';

export interface LiturgicalSummary {
  text: string;
  theme: any;
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
  getLiturgicalSummary(day: any, language: 'es' | 'la'): LiturgicalSummary | null {
    if (!day) return null;

    const seasonRaw = day.seasons?.[0] || 'ORDINARY_TIME';
    let season = ROMCAL_MAP[seasonRaw.toUpperCase()] || seasonRaw.toUpperCase();

    // Holy Week override
    if (day.periods?.includes('HOLY_WEEK')) {
      season = 'HOLY_WEEK';
    }

    const translatedSeason = SEASON_NAMES[language]?.[season] || day.seasonNames?.[0] || season;
    const weekNum = day.calendar?.weekOfSeason || 0;
    const theme = normalizeLiturgicalColor(day).theme;

    let text: string;
    if (season === 'HOLY_WEEK') {
      text = language === 'la' ? 'Hebdomada Sancta' : 'Semana Santa';
    } else if (weekNum > 0) {
      text = `${language === 'la' ? 'Hebdomada' : 'Semana'} ${weekNum} de ${translatedSeason}`;
    } else {
      text = translatedSeason;
    }

    return { text, theme, season, weekNum };
  },

  getCycleInfo(day: any, language: 'es' | 'la'): { sunday: string; weekday: string; year: number } {
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
