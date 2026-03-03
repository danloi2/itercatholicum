/**
 * Calculates the start of the liturgical year (First Sunday of Advent) for a given calendar year.
 * The First Sunday of Advent is the Sunday closest to St. Andrew's Day (Nov 30),
 * or 4 Sundays before Christmas.
 *
 * @param {number} year - The Gregorian calendar year.
 * @returns {Date} The date of the First Sunday of Advent.
 */
export function getStartOfLiturgicalYear(year: number): Date {
  const sunday = new Date(year, 11, 25);
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

/**
 * Returns the Advent year of the liturgical cycle currently in progress.
 * If today is before Advent of this calendar year, we are in the cycle that
 * started last year.
 *
 * Example: March 2026 → before Advent 2026 (Nov 29) → started Advent 2025 → returns 2025.
 * Example: December 3, 2026 → after Advent 2026 (Nov 29) → returns 2026.
 */
export function getCurrentLiturgicalYear(): number {
  const today = new Date();
  const calYear = today.getFullYear();
  const thisYearAdventStart = getStartOfLiturgicalYear(calYear);
  // The liturgical year is named by the year its Advent starts.
  // If today is before Advent of this calendar year, we're still in last year's cycle.
  if (today < thisYearAdventStart) {
    return calYear - 1;
  }
  return calYear;
}
