import { BIBLE_BOOKS } from '../constants/bibleVersions';

export interface ParsedReference {
  bookId: string;
  chapter: number;
  verse: number;
  verseEnd?: number;
}

/**
 * Parses a biblical reference string (e.g., "Hch 7, 51", "Jn 6, 30-35", "Sal 30, 3")
 * into a structured object for navigation.
 */
export function parseBibleReference(reference: string): ParsedReference | null {
  if (!reference) return null;

  // Normalize: replace colons with commas for the chapter/verse separator
  const normalized = reference.replace(':', ',').trim();
  
  // Advanced parsing:
  // 1. Try to extract book acronym (everything before the first number)
  const bookMatch = normalized.match(/^([1-3]?\s*[a-zA-ZáéíóúÁÉÍÓÚ]+)\s*/);
  if (!bookMatch) return null;
  
  const acronym = bookMatch[1].trim();
  const rest = normalized.substring(bookMatch[0].length).trim();
  
  // 2. Extract first chapter and verse
  // Standard format: "7, 51b" or "7:51a" or "7"
  const partsMatch = rest.match(/(\d+)[a-zA-Z]*(?:[\s,:]+(\d+)[a-zA-Z]*)?/);
  if (!partsMatch) {
    // Just the book
    return parseWithAcronym(acronym, 0, 1);
  }
  
  const chapter = parseInt(partsMatch[1], 10);
  const verse = partsMatch[2] ? parseInt(partsMatch[2], 10) : 1;
  
  // 3. Try to find the verse range
  let verseEnd: number | undefined = undefined;
  
  // Check for multi-chapter span first
  const multiChapterSpan = rest.match(/\d+[a-zA-Z]*[\s,:]+\d+[a-zA-Z]*\s*-\s*\d+[a-zA-Z]*[\s,:]+\d+[a-zA-Z]*/);
  
  if (!multiChapterSpan) {
    // For single chapter, find all numbers after the chapter
    // and pick the highest one as the end of the range.
    // e.g. "1-3a.4-5.6-7" -> 7 is the highest
    const allNumbers = rest.match(/\d+/g);
    if (allNumbers && allNumbers.length > 2) {
      // First number is chapter, second is start verse
      const numbers = allNumbers.map(n => parseInt(n, 10));
      const vStart = numbers[1];
      const others = numbers.slice(2);
      const maxVerse = Math.max(...others);
      if (maxVerse > vStart) {
        verseEnd = maxVerse;
      }
    } else if (allNumbers && allNumbers.length === 2) {
      // Just chapter and verse, no range
    } else {
      // Traditional range match: "1-8"
      const rangeMatch = rest.match(/(\d+)[a-zA-Z]*[\s,:]+(\d+)[a-zA-Z]*\s*-\s*(\d+)[a-zA-Z]*(?![,\s:]+\d+)/);
      if (rangeMatch) {
        const vStart = parseInt(rangeMatch[2], 10);
        const vEnd = parseInt(rangeMatch[3], 10);
        if (vEnd > vStart) {
          verseEnd = vEnd;
        }
      }
    }
  }

  return parseWithAcronym(acronym, chapter, verse, verseEnd);
}

/**
 * Helper to resolve acronym and return ParsedReference
 */
function parseWithAcronym(acronym: string, chapter: number, verse: number, verseEnd?: number): ParsedReference | null {

  // Find book by acronym (case insensitive)
  const book = BIBLE_BOOKS.find(b => 
    b.acronym.toLowerCase() === acronym.toLowerCase() ||
    b.name.es.toLowerCase() === acronym.toLowerCase() ||
    b.name.la.toLowerCase() === acronym.toLowerCase()
  );

  if (!book) {
    // Try fuzzy match for common lectionary variations
    const commonMaps: Record<string, string> = {
      // Pentateuco
      'gn': '01', 'gen': '01', 'éx': '02', 'ex': '02', 'lv': '03', 'lev': '03', 'nm': '04', 'num': '04', 'dt': '05', 'deut': '05',
      // Históricos
      'jos': '06', 'jue': '07', 'rut': '08', '1 sam': '09', '2 sam': '10', '1 re': '11', '2 re': '12', '1 cr': '13', '1 cron': '13', '2 cr': '14', '2 cron': '14', 'esd': '15', 'neh': '16', 'tob': '17', 'jdt': '18', 'est': '19', '1 mac': '20', '2 mac': '21',
      // Sapienciales
      'job': '22', 'sal': '23', 'ps': '23', 'prv': '24', 'prov': '24', 'ecl': '25', 'qoh': '25', 'cant': '26', 'sab': '27', 'eclo': '28', 'sir': '28',
      // Profetas Mayores
      'is': '29', 'jer': '30', 'lam': '31', 'bar': '32', 'ez': '33', 'dan': '34',
      // Profetas Menores
      'os': '35', 'jl': '36', 'joel': '36', 'am': '37', 'abd': '38', 'jon': '39', 'miq': '40', 'nah': '41', 'hab': '42', 'sof': '43', 'ag': '44', 'zac': '45', 'mal': '46',
      // Evangelios y Hechos
      'mt': '47', 'mc': '48', 'mar': '48', 'lc': '49', 'jn': '50', 'juan': '50', 'hch': '51', 'hech': '51', 'act': '51',
      // Cartas Paulinas
      'rom': '52', '1 cor': '53', '2 cor': '54', 'gal': '55', 'ef': '56', 'flp': '57', 'col': '58', '1 tes': '59', '2 tes': '60', '1 tim': '61', '2 tim': '62', 'tit': '63', 'flm': '64', 'heb': '65',
      // Cartas Católicas y Apocalipsis
      'sant': '66', 'stgo': '66', '1 pe': '67', '2 pe': '68', '1 jn': '69', '2 jn': '70', '3 jn': '71', 'jds': '72', 'ap': '73', 'rev': '73'
    };
    
    const mappedId = commonMaps[acronym.toLowerCase()];
    if (mappedId) {
      return { bookId: mappedId, chapter, verse, verseEnd };
    }
    
    return null;
  }

  return { bookId: book.id, chapter, verse, verseEnd };
}

/**
 * Formats a biblical reference in a unified way: Libro Capítulo, Versículo-Versículo
 */
export function formatBibleReference(
  bookName: string,
  chapter: number | string,
  startVerse?: number,
  endVerse?: number,
  language: 'es' | 'la' = 'es'
): string {
  if (chapter === 0 || chapter === '0') {
    return `${bookName} (${language === 'la' ? 'Omnia' : 'Todos'})`.trim();
  }

  const space = bookName ? ' ' : '';
  let ref = `${bookName}${space}${chapter}`;

  // If it's a full chapter (start at 1 and end is the special "End" marker 9999 or similar), 
  // don't show the verse part.
  const isFullChapter = startVerse === 1 && (endVerse === undefined || endVerse >= 500);

  if (startVerse && startVerse > 0 && !isFullChapter) {
    ref += `, ${startVerse}`;
    if (endVerse && endVerse > startVerse && endVerse < 500) {
      ref += `-${endVerse}`;
    }
  }

  return ref;
}

/**
 * Generates a URL for a biblical reference
 */
export function getBibleReferenceUrl(parsed: ParsedReference): string {
  let url = `/bible?book=${parsed.bookId}&chapter=${parsed.chapter}&verse=${parsed.verse}`;
  if (parsed.verseEnd) {
    url += `&verseEnd=${parsed.verseEnd}`;
  }
  return url;
}
