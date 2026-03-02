import type { LiturgicalColor, ColorTheme } from '@shared/types';
import { SEASON_INFO, COLOR_MAP } from '@shared/constants/config';

export interface LiturgicalTimePrayerType {
  id: string;
  emoji: string;
  title: { es: string; la: string };
  description: { es: string; la: string };
  romcalColor: LiturgicalColor;
  /** Hex del color litúrgico (de COLOR_MAP) — para el borde y badges */
  hex: string;
  /** Clases Tailwind para el fondo suave de la tarjeta */
  bgClass: string;
  /** Clases Tailwind para el texto principal */
  textClass: string;
  /** Clases Tailwind para el borde suave interno */
  borderClass: string;
}

const mapColorToTheme = (color: LiturgicalColor): ColorTheme => COLOR_MAP[color];

const ANY_CATEGORY: LiturgicalTimePrayerType = {
  id: 'ANY',
  emoji: '📖',
  title: { es: 'Cualquier Tiempo', la: 'Omni Tempore' },
  description: {
    es: 'Oraciones para toda ocasión litúrgica',
    la: 'Orationes pro omni tempore liturgico',
  },
  romcalColor: 'GOLD',
  hex: mapColorToTheme('GOLD').hex,
  bgClass: mapColorToTheme('GOLD').bg,
  textClass: mapColorToTheme('GOLD').text,
  borderClass: mapColorToTheme('GOLD').border,
};

const SEASON_COLORS: Record<string, LiturgicalColor> = {
  ADVENT: 'PURPLE',
  CHRISTMAS: 'WHITE',
  LENT: 'PURPLE',
  HOLY_WEEK: 'RED',
  EASTER: 'WHITE',
  ORDINARY_TIME_1: 'GREEN',
  ORDINARY_TIME_2: 'GREEN',
};

export const liturgicalTimePrayerTypes: LiturgicalTimePrayerType[] = [
  ANY_CATEGORY,
  ...Object.entries(SEASON_INFO)
    .filter(([key]) => key !== 'ORDINARY_TIME_2')
    .map(([key, info]) => {
      const isOrdinaryTime = key === 'ORDINARY_TIME_1';
      const finalKey = isOrdinaryTime ? 'ORDINARY_TIME' : key;
      const color = SEASON_COLORS[key] || 'GREEN';
      const theme = mapColorToTheme(color);

      return {
        id: finalKey,
        emoji: info.emoji,
        title: {
          es: isOrdinaryTime ? 'Tiempo Ordinario' : info.title,
          la: isOrdinaryTime ? 'Tempus per Annum' : info.latTitle,
        },
        description: { es: info.desc, la: info.latDesc },
        romcalColor: color,
        hex: theme.hex,
        bgClass: theme.bg,
        textClass: theme.text,
        borderClass: theme.border,
      };
    }),
];
