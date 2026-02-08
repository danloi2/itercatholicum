import type { ColorTheme, LiturgicalColor, SeasonInfo, UiLanguage, UiString } from '@/types';

export const ROMCAL_MAP: Record<string, string> = {
  CHRISTMASTIDE: 'CHRISTMAS',
  CHRISTMAS_TIME: 'CHRISTMAS',
  ADVENT: 'ADVENT',
  LENT: 'LENT',
  EASTER: 'EASTER',
  ORDINARY_TIME: 'ORDINARY_TIME',
};

export const SEASON_INFO: Record<string, SeasonInfo> = {
  ADVENT: {
    title: 'Tiempo de Adviento',
    latTitle: 'Tempus Adventus',
    desc: 'Preparación para la llegada de Cristo',
    latDesc: 'Præparatio adventus Christi',
  },
  CHRISTMAS: {
    title: 'Tiempo de Navidad',
    latTitle: 'Tempus Nativitatis',
    desc: 'Celebración del nacimiento del Señor',
    latDesc: 'Nativitas Domini',
  },
  ORDINARY_TIME_1: {
    title: 'Tiempo Ordinario I',
    latTitle: 'Tempus per Annum I',
    desc: 'La vida pública de Jesús',
    latDesc: 'Initium ministerii publici Iesu',
  },
  LENT: {
    title: 'Tiempo de Cuaresma',
    latTitle: 'Tempus Quadragesimæ',
    desc: 'Penitencia y preparación para la Pasión',
    latDesc: 'Pænitentia et præparatio ad Pascha',
  },
  HOLY_WEEK: {
    title: 'Semana Santa',
    latTitle: 'Hebdomada Sancta',
    desc: 'La Pasión del Señor',
    latDesc: 'Passio Domini',
  },
  EASTER: {
    title: 'Tiempo de Pascua',
    latTitle: 'Tempus Paschale',
    desc: 'Celebración de Cristo Resucitado',
    latDesc: 'Christus resurrexit.',
  },
  ORDINARY_TIME_2: {
    title: 'Tiempo Ordinario II',
    latTitle: 'Tempus per Annum II',
    desc: 'Enseñanzas, milagros y crecimiento del Reino.',
    latDesc: 'Doctrina et miracula Domini.',
  },
};

export const COLOR_MAP: Record<LiturgicalColor, ColorTheme> = {
  VIOLET: {
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    border: 'border-purple-200',
    hoverBg: 'group-hover:bg-purple-50/50',
    icon: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-700 ring-purple-600/20',
    hex: '#7c3aed', // violet-600
  },
  WHITE: {
    bg: 'bg-white',
    text: 'text-[#522b2b]',
    border: 'border-[#c49b9b]/30',
    hoverBg: 'group-hover:bg-[#f4e2e2]/50',
    icon: 'bg-yellow-400',
    badge: 'bg-[#ebd6d6]/50 text-[#8B0000] ring-[#8B0000]/20',
    hex: '#c49b9b', // Using reddish taupe for border
  },
  GREEN: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    hoverBg: 'group-hover:bg-emerald-50/50',
    icon: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
    hex: '#059669', // emerald-600
  },
  RED: {
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    border: 'border-rose-200',
    hoverBg: 'group-hover:bg-rose-50/50',
    icon: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-700 ring-rose-600/20',
    hex: '#e11d48', // rose-600
  },
  PINK: {
    bg: 'bg-pink-50',
    text: 'text-pink-900',
    border: 'border-pink-200',
    hoverBg: 'group-hover:bg-pink-50/50',
    icon: 'bg-pink-500',
    badge: 'bg-pink-100 text-pink-700 ring-pink-600/20',
    hex: '#db2777', // pink-600
  },
  BLUE: {
    bg: 'bg-sky-50',
    text: 'text-sky-900',
    border: 'border-sky-200',
    hoverBg: 'group-hover:bg-sky-50/50',
    icon: 'bg-sky-500',
    badge: 'bg-sky-100 text-sky-700 ring-sky-600/20',
    hex: '#0284c7', // sky-600
  },
  BLACK: {
    bg: 'bg-slate-50',
    text: 'text-slate-900',
    border: 'border-slate-300',
    hoverBg: 'group-hover:bg-slate-100',
    icon: 'bg-slate-700',
    badge: 'bg-slate-200 text-slate-800 ring-slate-700/20',
    hex: '#334155', // slate-700
  },
  GOLD: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-950',
    border: 'border-yellow-200',
    hoverBg: 'group-hover:bg-yellow-50/50',
    icon: 'bg-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
    hex: '#eab308', // yellow-500
  },
};

export const UI_STRINGS: Record<UiLanguage, UiString> = {
  es: {
    todayLabel: 'HOY',
    obligationLabel: 'PRECEPTO',
  },
  la: {
    todayLabel: 'HODIE',
    obligationLabel: 'DE PRÆCEPTO',
  },
};
