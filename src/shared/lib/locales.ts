import type { Locale } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Custom Latin locale for date-fns.
 * Provides basic localization for months and weekdays in liturgical Latin.
 */
export const la: Locale = {
  ...es,
  code: 'la',
  localize: {
    ...es.localize,
    month: (n, options) => {
      const width = options?.width || 'wide';
      const months = {
        wide: [
          'Ianuarius',
          'Februarius',
          'Martius',
          'Aprilis',
          'Maius',
          'Iunius',
          'Iulius',
          'Augustus',
          'September',
          'October',
          'November',
          'December',
        ],
        abbreviated: [
          'Ian.',
          'Feb.',
          'Mar.',
          'Apr.',
          'Mai.',
          'Iun.',
          'Iul.',
          'Aug.',
          'Sep.',
          'Oct.',
          'Nov.',
          'Dec.',
        ],
      };
      // @ts-expect-error - dynamic width indexing
      return months[width][n] || months.wide[n];
    },
    day: (n, options) => {
      const width = options?.width || 'wide';
      const days = {
        wide: ['Dominica', 'Feria II', 'Feria III', 'Feria IV', 'Feria V', 'Feria VI', 'Sabbatum'],
        abbreviated: ['Dom.', 'Fer. II', 'Fer. III', 'Fer. IV', 'Fer. V', 'Fer. VI', 'Sab.'],
        short: ['Do', 'II', 'III', 'IV', 'V', 'VI', 'Sa'],
        narrow: ['D', '2', '3', '4', '5', '6', 'S'],
      };
      // @ts-expect-error - dynamic width indexing
      return days[width][n] || days.wide[n];
    },
  },
};

/**
 * Roman hour names for the liturgical clock.
 */
export const LATIN_ROMAN_HOURS: Record<number, string> = {
  0: 'media nox',
  1: 'prima vigilia',
  2: 'secunda vigilia',
  3: 'tertia vigilia',
  4: 'quarta vigilia',
  5: 'quinta vigilia',
  6: 'hora prima',
  7: 'hora secunda',
  8: 'hora tertia',
  9: 'hora cuarta',
  10: 'hora quinta',
  11: 'hora sexta',
  12: 'hora sexta',
  13: 'hora septima',
  14: 'hora octava',
  15: 'hora nona',
  16: 'hora decima',
  17: 'hora undecima',
  18: 'hora duodecima',
  19: 'prima vigilia',
  20: 'secunda vigilia',
  21: 'tertia vigilia',
  22: 'quarta vigilia',
  23: 'quinta vigilia',
};

/**
 * Genitive month names for the "mensis X" format.
 */
export const LATIN_MONTHS_GENITIVE = [
  'Ianuarii',
  'Februarii',
  'Martii',
  'Aprilis',
  'Maii',
  'Iunii',
  'Iulii',
  'Augusti',
  'Septembris',
  'Octobris',
  'Novembris',
  'Decembris',
];
