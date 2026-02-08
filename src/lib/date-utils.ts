/**
 * Calculates the start of the liturgical year (First Sunday of Advent) for a given calendar year.
 * The First Sunday of Advent is the Sunday closest to St. Andrew's Day (Nov 30),
 * or 4 Sundays before Christmas.
 *
 * @param {number} year - The Gregorian calendar year.
 * @returns {Date} The date of the First Sunday of Advent.
 */
export function getStartOfLiturgicalYear(year: number): Date {
  const christmas = new Date(year - 1, 11, 25);
  let sunday = new Date(christmas);
  // Find the Sunday before Christmas
  while (sunday.getDay() !== 0) sunday.setDate(sunday.getDate() - 1);
  // Go back 3 more weeks (4th Sunday of Advent -> 1st Sunday)
  sunday.setDate(sunday.getDate() - 21);
  return sunday;
}

/**
 * Calculates the end of the liturgical year (Saturday of the 34th week of Ordinary Time).
 * This is effectively the day before the First Sunday of Advent of the NEXT liturgical year.
 *
 * @param {number} year - The Gregorian calendar year.
 * @returns {Date} The date of the Saturday ending the liturgical year.
 */
export function getEndOfLiturgicalYear(year: number): Date {
  const nextStart = getStartOfLiturgicalYear(year + 1);
  const end = new Date(nextStart);
  end.setDate(end.getDate() - 1);
  return end;
}
