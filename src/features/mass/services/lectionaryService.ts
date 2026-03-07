import { bibleService } from '../../bible/services/bibleService';
import { BIBLE_BOOKS } from '../../bible/constants/bibleVersions';
import type { LiturgicalDay } from '@shared/types';

// Mapping from lectionary acronyms to BIBLE_BOOKS IDs
const ACRONYM_MAP: Record<string, string> = {
  Gen: '01',
  Exod: '02',
  Lev: '03',
  Num: '04',
  Deut: '05',
  Josh: '06',
  Judg: '07',
  Ruth: '08',
  '1 Sam': '09',
  '2 Sam': '10',
  '1 Kings': '11',
  '2 Kings': '12',
  '1 Chron': '13',
  '2 Chron': '14',
  Ezra: '15',
  Neh: '16',
  Tob: '17',
  Jdt: '18',
  Esth: '19',
  '1 Mac': '20',
  '2 Mac': '21',
  Job: '22',
  Ps: '23',
  Prov: '24',
  Eccl: '25',
  Song: '26',
  Wis: '27',
  Sir: '28',
  Isa: '29',
  Jer: '30',
  Lam: '31',
  Bar: '32',
  Ezek: '33',
  Dan: '34',
  Hos: '35',
  Joel: '36',
  Amos: '37',
  Obad: '38',
  Jonah: '39',
  Mic: '40',
  Nahum: '41',
  Hab: '42',
  Zeph: '43',
  Hag: '44',
  Zech: '45',
  Mal: '46',
  Matt: '47',
  Mark: '48',
  Luke: '49',
  John: '50',
  Acts: '51',
  Rom: '52',
  '1 Cor': '53',
  '2 Cor': '54',
  Gal: '55',
  Eph: '56',
  Phil: '57',
  Col: '58',
  '1 Thess': '59',
  '2 Thess': '60',
  '1 Tim': '61',
  '2 Tim': '62',
  Titus: '63',
  Phlm: '64',
  Heb: '65',
  James: '66',
  '1 Pet': '67',
  '2 Pet': '68',
  '1 John': '69',
  '2 John': '70',
  '3 John': '71',
  Jude: '72',
  Rev: '73',
};

export interface ReadingData {
  title: string;
  reference: string;
  displayReference: string;
  text: string;
  verseList: { num: string; text: string }[];
  otherLanguageVerseList?: { num: string; text: string }[];
  bookId: string;
  chapter: number;
  verses: { start: number; end: number };
}

export interface DailyReadings {
  date: string;
  firstReading?: ReadingData;
  psalm?: ReadingData;
  secondReading?: ReadingData;
  gospel?: ReadingData;
  liturgicalDay: LiturgicalDay;
}

interface LectionaryEntry {
  firstReading?: string | string[];
  psalm?: string | string[];
  secondReading?: string | string[];
  gospel?: string | string[];
  yearCycle?: string;
  yearNumber?: string;
  season?: string;
  massType?: string | string[];
  weekdayType?: string;
  weekOrder?: string;
  slug?: string;
}

// Lectionary JSON loading
const lectionaryModules = {
  sunday: import.meta.glob('../../../shared/data/lectiones/sunday/*.json'),
  weekdays: import.meta.glob('../../../shared/data/lectiones/weekdays/*.json'),
  celebrations: import.meta.glob('../../../shared/data/lectiones/celebrations/*.json'),
};

export const lectionaryService = {
  async getReadings(day: LiturgicalDay, version: 'vulgata' | 'torres'): Promise<DailyReadings> {
    const readings: DailyReadings = {
      date: day.date.split('T')[0],
      liturgicalDay: day,
    };

    // 1. Determine which lectionary file to use
    const lectionaryData = await this.loadLectionaryData(day);
    if (!lectionaryData) return readings;

    // 2. Find the correct entry in the lectionary data
    const entry = this.findReadingEntry(day, lectionaryData);
    if (!entry) return readings;

    // 3. Fetch Bible text for each reading
    const otherVersion = version === 'vulgata' ? 'torres' : 'vulgata';

    const getRef = (val: string | string[] | undefined) => (Array.isArray(val) ? val[0] : val);

    const firstReadingRef = getRef(entry.firstReading);
    if (firstReadingRef && typeof firstReadingRef === 'string') {
      readings.firstReading = await this.fetchReadingText(
        firstReadingRef,
        version,
        '1ª Lectura',
        'Lectio I',
        otherVersion
      );
    }

    const psalmRef = getRef(entry.psalm);
    if (psalmRef && typeof psalmRef === 'string') {
      readings.psalm = await this.fetchReadingText(
        psalmRef,
        version,
        'Salmo Responsorial',
        'Psalmus Responsorius',
        otherVersion
      );
    }

    const secondReadingRef = getRef(entry.secondReading);
    if (secondReadingRef && typeof secondReadingRef === 'string') {
      readings.secondReading = await this.fetchReadingText(
        secondReadingRef,
        version,
        '2ª Lectura',
        'Lectio II',
        otherVersion
      );
    }

    const gospelRef = getRef(entry.gospel);
    if (gospelRef && typeof gospelRef === 'string') {
      readings.gospel = await this.fetchReadingText(
        gospelRef,
        version,
        'Evangelio',
        'Evangelium',
        otherVersion
      );
    }

    return readings;
  },

  async loadLectionaryData(day: LiturgicalDay): Promise<LectionaryEntry[] | null> {
    const seasonRaw = (day.seasons?.[0] || 'ORDINARY_TIME').toUpperCase();

    // Normalize Romcal season strings
    const normalizedSeason = seasonRaw.replace('_TIME', '');

    const seasonMap: Record<string, string> = {
      ADVENT: '1_advent.json',
      CHRISTMAS: '2_christmas.json',
      LENT: '3_lent.json',
      EASTER: '4_easter.json',
      ORDINARY: '5_ot.json',
      HOLY_WEEK: '3_lent.json',
    };

    const filename = seasonMap[normalizedSeason] || '5_ot.json';

    // Try these paths in order.
    // IMPORTANT: Celebrations folder MUST be checked for everyone since many privileged Sundays are there.
    const possiblePaths: string[] = [
      '../../../shared/data/lectiones/celebrations/1_solemnity.json',
      '../../../shared/data/lectiones/celebrations/3_movable_celebrations.json',
      `../../../shared/data/lectiones/sunday/${filename}`,
      `../../../shared/data/lectiones/weekdays/${filename}`,
    ];

    // Additional seasonal fallbacks
    if (normalizedSeason === 'EASTER' || normalizedSeason === 'HOLY_WEEK') {
      possiblePaths.push('../../../shared/data/lectiones/sunday/4_triduum.json');
    }

    // Final fallback
    possiblePaths.push('../../../shared/data/lectiones/weekdays/5_ot.json');

    for (const path of possiblePaths) {
      const loader =
        lectionaryModules.sunday[path] ||
        lectionaryModules.weekdays[path] ||
        lectionaryModules.celebrations[path];

      if (loader) {
        const mod = (await loader()) as { default: LectionaryEntry[] };
        const entry = this.findReadingEntry(day, mod.default);
        if (entry) return [entry];
      }
    }

    return null;
  },

  findReadingEntry(day: LiturgicalDay, data: LectionaryEntry[]): LectionaryEntry | null {
    const dateStr = day.date.split('T')[0];
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const weekday = dateObj.getDay();
    const isSunday = weekday === 0;
    const weekOrder = day.calendar?.weekOfSeason?.toString() || '';
    const weekdayName = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ][weekday] as string;

    const daySeason = (day.seasons?.[0] || 'ORDINARY_TIME').toLowerCase().replace('_time', '');
    const sundayCycle = (day.cycles?.sundayCycle || '').replace('YEAR_', '').toUpperCase();
    const weekdayCycle = (day.cycles?.weekdayCycle || '').replace('YEAR_', '').toString();

    let effectiveWeekOrder = weekOrder;
    if (day.id.includes('ash_wednesday')) effectiveWeekOrder = 'ashWednesday';
    if (day.id.includes('after_ash_wednesday')) effectiveWeekOrder = 'afterAshWednesday';

    // 1. Try matching by slug first (very specific)
    // Slugs IGNORE seasonal matching logic because they are unique identifies.
    if (day.id) {
      const normalizedDayId = day.id.toLowerCase().replace(/_/g, '');
      const slugMatches = data.filter((e) => {
        if (!e.slug) return false;
        const normalizedSlug = e.slug.toLowerCase().replace(/_/g, '');
        return normalizedDayId.includes(normalizedSlug) || normalizedSlug.includes(normalizedDayId);
      });

      if (slugMatches.length > 0) {
        // Prefer the one with firstReading (likely the Mass readings)
        return slugMatches.find((e) => !!e.firstReading) || slugMatches[0];
      }
    }

    // 2. Try matching by week/cycle/weekday AND season
    const matches = data.filter((entry: LectionaryEntry) => {
      const entryCycle = (entry.yearCycle || '').toUpperCase();
      const entryWeekOrder = (entry.weekOrder || '').toString();
      const entryYearNumber = (entry.yearNumber || '').toString();
      const entrySeason = (entry.season || '').toLowerCase().replace('_time', '');

      // Flexible seasonal mapping check
      const seasonMatch =
        entrySeason === '' ||
        entrySeason === daySeason ||
        entrySeason === 'triduum' || // Triduum entries often match Easter/Holy Week days
        (daySeason === 'ordinary' && (entrySeason === 'ot' || entrySeason === 'ordinary')) ||
        (daySeason === 'holy_week' && entrySeason === 'lent') ||
        (daySeason === 'easter' && entrySeason === 'triduum');

      if (!seasonMatch) return false;

      // Romcal rank can be 'SUNDAY', 'SOLEMNITY', 'FEAST', 'MEMORIAL', 'FERIA'
      const isPrivileged = isSunday || day.rank === 'SOLEMNITY' || day.rank === 'FEAST';

      if (isPrivileged) {
        return (
          entry.weekdayType === 'sunday' &&
          entryWeekOrder === effectiveWeekOrder &&
          (entryCycle === sundayCycle || entryCycle === '')
        );
      } else {
        return (
          entry.weekdayType === weekdayName &&
          entryWeekOrder === effectiveWeekOrder &&
          (entryYearNumber === '' || entryYearNumber === weekdayCycle)
        );
      }
    });

    if (matches.length > 0) {
      return matches.find((e) => !!e.firstReading) || matches[0];
    }

    return null;
  },

  async fetchReadingText(
    reference: string,
    version: 'vulgata' | 'torres',
    titleEs: string,
    titleLa: string,
    otherVersion?: 'vulgata' | 'torres'
  ): Promise<ReadingData | undefined> {
    if (!reference || reference === 'the reading from Year A') return undefined;

    try {
      // 1. Detect if it's a cross-chapter range: "Matt 26:14--27:66"
      if (reference.includes('--')) {
        const parts = reference.split('--');
        const startMatch = parts[0].match(/^(.+?)\s+(\d+):(\d+)([a-d])?$/);
        const endMatch = parts[1].match(/^(\d+):(\d+)([a-d])?$/);

        if (startMatch && endMatch) {
          const bookAcronym = startMatch[1].trim();
          const bookId = ACRONYM_MAP[bookAcronym];
          if (!bookId) return undefined;

          const startChap = parseInt(startMatch[2]);
          const startVerse = parseInt(startMatch[3]);
          const startPart = startMatch[4] || '';

          const endChap = parseInt(endMatch[1]);
          const endVerse = parseInt(endMatch[2]);
          const endPart = endMatch[3] || '';

          const book = BIBLE_BOOKS.find((b) => b.id === bookId);
          if (!book) return undefined;

          const bookData = await bibleService.loadBookData(bookId, version);
          const verseList: { num: string; text: string }[] = [];

          for (let c = startChap; c <= endChap; c++) {
            const chapterData = (bookData.capitula as any[]).find((ch) => ch.numerus === c);
            if (!chapterData) continue;

            const vKeys = Object.keys(chapterData.versus).sort((a, b) => parseInt(a) - parseInt(b));
            for (const vKey of vKeys) {
              const vNum = parseInt(vKey);
              if (c === startChap && vNum < startVerse) continue;
              if (c === endChap && vNum > endVerse) continue;

              const fullText = chapterData.versus[vKey];
              let text = fullText;
              let num = vNum.toString();

              // Add chapter prefix if it spans multiple chapters
              if (startChap !== endChap) {
                num = `${c}:${vKey}`;
              }

              if (c === startChap && vNum === startVerse && startPart) {
                const parts = this.splitVerseIntoParts(fullText);
                text = this.joinParts(parts, startPart, '');
                num = `${num}${startPart}`;
              } else if (c === endChap && vNum === endVerse && endPart) {
                const parts = this.splitVerseIntoParts(fullText);
                text = this.joinParts(parts, '', endPart);
                num = `${num}${endPart}`;
              }

              verseList.push({ num, text });
            }
          }

          const readingData: ReadingData = {
            title: version === 'vulgata' ? titleLa : titleEs,
            reference: reference,
            displayReference: reference.replace('--', '–'),
            text: verseList.map((v) => v.text).join(' '),
            verseList,
            bookId,
            chapter: startChap,
            verses: { start: 0, end: 0 },
          };

          if (otherVersion) {
            const otherLangData = await this.fetchReadingText(
              reference,
              otherVersion,
              titleEs,
              titleLa
            );
            if (otherLangData) readingData.otherLanguageVerseList = otherLangData.verseList;
          }
          return readingData;
        }
      }

      // 2. Regular single-chapter reference
      const match = reference.match(/^(.+?)\s+(\d+):(.+)$/);
      if (!match) return undefined;

      const bookAcronym = match[1].trim();
      const chapter = parseInt(match[2]);
      const rest = match[3].trim();

      const bookId = ACRONYM_MAP[bookAcronym];
      if (!bookId) {
        console.warn(`Unknown book acronym: ${bookAcronym}`);
        return undefined;
      }

      const book = BIBLE_BOOKS.find((b) => b.id === bookId);
      if (!book) return undefined;

      const bookData = await bibleService.loadBookData(bookId, version);
      const chapterData = (bookData.capitula as Record<string, unknown>[]).find(
        (c) => (c as { numerus: number }).numerus === chapter
      ) as { versus: Record<string, string> } | undefined;
      if (!chapterData) return undefined;

      const intervals = rest.split(',').map((s) => s.trim());
      const verseList: { num: string; text: string }[] = [];

      for (const interval of intervals) {
        const subIntervals = interval.split('+').map((s) => s.trim());

        for (const sub of subIntervals) {
          const rangeMatch = sub.match(/^(\d+)([a-d])?-(\d+)([a-d])?$/);
          if (rangeMatch) {
            const vStart = parseInt(rangeMatch[1]);
            const pStart = rangeMatch[2] || '';
            const vEndNum = parseInt(rangeMatch[3]);
            const pEnd = rangeMatch[4] || '';

            for (let v = vStart; v <= vEndNum; v++) {
              const fullText = chapterData.versus[v.toString()];
              if (!fullText) continue;

              const parts = this.splitVerseIntoParts(fullText);

              if (v === vStart && v === vEndNum) {
                const num = pStart === pEnd ? `${v}${pStart}` : `${v}${pStart}-${pEnd}`;
                verseList.push({ num, text: this.joinParts(parts, pStart, pEnd) });
              } else if (v === vStart) {
                verseList.push({ num: `${v}${pStart}`, text: this.joinParts(parts, pStart, '') });
              } else if (v === vEndNum) {
                verseList.push({ num: `${v}${pEnd}`, text: this.joinParts(parts, '', pEnd) });
              } else {
                verseList.push({ num: v.toString(), text: fullText });
              }
            }
          } else {
            const singleMatch = sub.match(/^(\d+)([a-d])?$/);
            if (singleMatch) {
              const vNum = singleMatch[1];
              const pLetter = singleMatch[2] || '';
              const fullText = chapterData.versus[vNum];
              if (fullText) {
                if (pLetter) {
                  const parts = this.splitVerseIntoParts(fullText);
                  verseList.push({
                    num: `${vNum}${pLetter}`,
                    text: this.joinParts(parts, pLetter, pLetter),
                  });
                } else {
                  verseList.push({ num: vNum, text: fullText });
                }
              }
            }
          }
        }
      }

      const displayReference = `${book.acronym} ${chapter}:${rest}`;

      const readingData: ReadingData = {
        title: version === 'vulgata' ? titleLa : titleEs,
        reference: reference,
        displayReference,
        text: verseList
          .map((v) => v.text)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim(),
        verseList,
        bookId,
        chapter,
        verses: { start: 0, end: 0 },
      };

      if (otherVersion) {
        const otherLangData = await this.fetchReadingText(
          reference,
          otherVersion,
          titleEs,
          titleLa
        );
        if (otherLangData) readingData.otherLanguageVerseList = otherLangData.verseList;
      }

      return readingData;
    } catch (error) {
      console.error(`Error fetching text for reference ${reference}:`, error);
      return undefined;
    }
  },

  splitVerseIntoParts(text: string): string[] {
    const periodCount = (text.match(/\./g) || []).length;
    if (periodCount > 1) {
      return text
        .split('.')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => s + '.');
    } else {
      return text
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
  },

  joinParts(parts: string[], startLetter: string, endLetter: string): string {
    const letterToIdx = (l: string) => l.toLowerCase().charCodeAt(0) - 97;
    const startIdx = startLetter ? letterToIdx(startLetter) : 0;
    const endIdx = endLetter ? letterToIdx(endLetter) : parts.length - 1;

    return parts.slice(startIdx, endIdx + 1).join(' ');
  },
};
