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
