export type LiturgicalSeason =
  | 'ADVENT'
  | 'CHRISTMAS'
  | 'LENT'
  | 'HOLY_WEEK'
  | 'EASTER'
  | 'ORDINARY_TIME';

export type LiturgicalColor =
  | 'PURPLE'
  | 'WHITE'
  | 'GREEN'
  | 'RED'
  | 'ROSE'
  | 'BLUE'
  | 'BLACK'
  | 'GOLD';

export type UiLanguage = 'es' | 'la';

export interface SeasonInfo {
  title: string;
  latTitle: string;
  desc: string;
  latDesc: string;
}

export interface ColorTheme {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  icon: string;
  badge: string;
  hex: string;
}

export interface UiString {
  todayLabel: string;
  obligationLabel: string;
}
export interface LiturgicalDay {
  date: string;
  name: string;
  rank: string;
  rankName: string;
  colors: string[];
  seasonNames: string[];
  seasons: string[];
  periods: string[];
  id: string;
  cycles: {
    sundayCycle: string;
    weekdayCycle: string;
    psalterWeek: string;
  };
  calendar: {
    weekOfSeason: number;
    dayOfSeason?: number;
    dayOfWeek?: number;
  };
  precedence: string;
  isHolyDayOfObligation: boolean;
  weekday?: LiturgicalDay;
}

export interface LiturgicalSummary {
  text: string;
  theme: ColorTheme;
}
