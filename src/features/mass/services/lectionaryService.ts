import type { LiturgicalDay } from '@shared/types';

// Lazy-load the large JSON (4MB) so it's not in the initial bundle
const lectioModule = import.meta.glob<{ default: RawEntry[] }>(
  '/src/shared/data/lectiones/lectiones-full.json'
);
const key = '/src/shared/data/lectiones/lectiones-full.json';

let allEntriesCache: RawEntry[] | null = null;
const getAllEntries = async (): Promise<RawEntry[]> => {
  if (allEntriesCache) return allEntriesCache;
  if (!lectioModule[key]) return [];
  const module = await lectioModule[key]();
  allEntriesCache = module.default;
  return allEntriesCache;
};

// ── Types ──────────────────────────────────────────────────────────────────

export type LecturaType =
  | 'ACCLAMATION'
  | 'FIRSTLECTURE'
  | 'ALTERNATIVE_FIRSTLECTURE'
  | 'PSALM'
  | 'SECONDLECTURE'
  | 'GOSPEL'
  | string;

export interface Lectura {
  type: LecturaType;
  reference?: string;
  intro: { es: string; la: string };
  text: { es: string; la: string };
}

export interface DailyLectiones {
  dayId: string;
  cycle: string;
  lecturas: Lectura[];
  liturgicalDay: LiturgicalDay;
}

// ── Raw JSON type ──────────────────────────────────────────────────────────

interface RawLectura {
  type: string;
  reference?: string;
  intro: { es: string; la: string };
  text: { es: string; la: string };
}

interface RawEntry {
  id: string;
  cycle: string;
  lecturas: RawLectura[];
}


// ── Helpers ────────────────────────────────────────────────────────────────


/**
 * Display label for a lectura type in the given language.
 * Pass allDayTypes to detect if a long/short pair exists.
 */
export function getLecturaLabel(type: LecturaType, lang: 'es' | 'la', allDayTypes?: string[]): string {
  const normType = type.toUpperCase()
    .replace('ALTENATIVE', 'ALTERNATIVE') // Handle typo
    .replace('CELEBRATIÓN', 'CELEBRATION') // Handle accented variation
    .replace('CELEBRATIN', 'CELEBRATION')  // Handle typo
    .replace('COMENT', 'COMMENT');         // Unified comment entry

  // Base labels
  const labels: Record<string, { es: string; la: string }> = {
    ACCLAMATION:            { es: 'Aclamación',          la: 'Acclamatio'       },
    FIRSTLECTURE:           { es: '1ª Lectura',          la: 'Lectio I'         },
    SECONDLECTURE:          { es: '2ª Lectura',          la: 'Lectio II'        },
    PSALM:                  { es: 'Salmo Responsorial',  la: 'Psalmus'          },
    GOSPEL:                 { es: 'Evangelio',           la: 'Evangelium'       },
    COMMENT:                { es: 'Monición',            la: 'Monitio'          },
    CELEBRATION_COMMENT:     { es: 'Comentario',          la: 'Commentarium'     },
    SEQUENCE:               { es: 'Secuencia',           la: 'Sequentia'        },
  };

  // Check for exact match
  if (labels[normType]) return labels[normType][lang];

  const isAlt = normType.includes('ALTERNATIVE');
  const isShort = normType.includes('SHORT');
  const isGospel = normType.includes('GOSPEL');

  // Find the closest base label by stripping modifiers
  const baseKey = normType
    .replace('ALTERNATIVE_', '')
    .replace('CELEBRATION_', '')
    .replace('SHORT_', '')
    .replace('_SHORT', '');
  
  // Try matching stripped key
  let baseLabel = labels[baseKey]?.[lang] ?? baseKey;

  // Manual overrides for short forms that need specific grammar
  if (isShort && isGospel) {
      baseLabel = lang === 'es' ? 'Evangelio' : 'Evangelium';
  }

  // Construct final label
  let result = baseLabel;
  if (isShort) {
      result += (lang === 'es' ? ' (forma breve)' : ' (forma brevis)');
  } else if (!isAlt && allDayTypes && allDayTypes.includes(`SHORT_${normType}`)) {
      // If we are evaluating the standard reading, but the SHORT version exists today
      result += (lang === 'es' ? ' (forma larga)' : ' (forma longa)');
  } else if (!isAlt && allDayTypes && allDayTypes.includes(`${normType}_SHORT`)) {
      // Check the other common naming convention
      result += (lang === 'es' ? ' (forma larga)' : ' (forma longa)');
  }

  if (isAlt) {
    result += (lang === 'es' ? ' (forma altera)' : ' (forma alternativa)');
  }

  return result;
}

/**
 * Returns the full liturgical Gospel title based on the evangelist in the reference.
 * e.g. "Mc 13, 33-37" → "Lectura del santo Evangelio según san Marcos"
 */
export function getGospelTitle(reference: string | undefined, lang: 'es' | 'la', type?: string, allDayTypes?: string[]): string {
  const isShort = type?.toUpperCase().includes('SHORT');
  
  let suffix = '';
  if (isShort) {
      suffix = lang === 'es' ? ' (forma breve)' : ' (forma brevis)';
  } else if (allDayTypes && type) {
      const normType = type.toUpperCase();
      if (allDayTypes.includes(`SHORT_${normType}`) || allDayTypes.includes(`${normType}_SHORT`)) {
          suffix = lang === 'es' ? ' (forma larga)' : ' (forma longa)';
      }
  }

  if (!reference) return getLecturaLabel('GOSPEL', lang, allDayTypes) + suffix;

  // Detect evangelist abbreviation at the start of the reference
  const abbr = reference.trim().split(/[\s,]/)[0];


  const evangelists: Record<string, { es: string; la: string }> = {
    Mt:  { es: 'san Mateo',  la: 'Matthaeum'  },
    Mc:  { es: 'san Marcos', la: 'Marcum'     },
    Lc:  { es: 'san Lucas',  la: 'Lucam'      },
    Jn:  { es: 'san Juan',   la: 'Ioannem'    },
    // Also handle Latin abbreviations just in case
    Mt_la: { es: 'san Mateo',  la: 'Matthaeum' },
    Mk:    { es: 'san Marcos', la: 'Marcum'    },
    Lk:    { es: 'san Lucas',  la: 'Lucam'     },
    Jn_la: { es: 'san Juan',   la: 'Ioannem'   },
  };

  const evangelist = evangelists[abbr];
  if (!evangelist) return getLecturaLabel('GOSPEL', lang, allDayTypes) + suffix;

  if (lang === 'la') {
    return `Lectio sancti Evangelii secundum ${evangelist.la}${suffix}`;
  }
  return `Lectura del santo Evangelio según ${evangelist.es}${suffix}`;
}


// ── Service ────────────────────────────────────────────────────────────────

export const lectionaryService = {
  /**
   * Returns the lecturas for a given liturgical day.
   * Priority: cycle-specific entry > ANY cycle entry.
   */
  async getLectionesForDay(day: LiturgicalDay): Promise<DailyLectiones | null> {
    const sundayCycle = day.cycles?.sundayCycle ?? ''; // e.g. "YEAR_B"
    const weekdayCycle = day.cycles?.weekdayCycle ?? ''; // e.g. "YEAR_1"
    
    // Map romcal's YEAR_1/YEAR_2 to lectionary's ODD/EVEN
    const mappedWeekdayCycle = weekdayCycle === 'YEAR_1' ? 'ODD' : (weekdayCycle === 'YEAR_2' ? 'EVEN' : '');

    const allEntries = await getAllEntries();

    // ── ID Normalization ──
    // Romcal (Spain) uses "monday_1_ordinary"
    // Our JSON uses "ordinary_time_1_monday"
    let normalizedId = day.id;
    if (day.id.includes('_ordinary')) {
      const parts = day.id.split('_'); // [day, index, ordinary]
      if (parts.length >= 2) {
        normalizedId = `ordinary_time_${parts[1]}_${parts[0]}`;
      }
    }

    // Find all entries matching this normalizedId
    const matching = allEntries.filter((e) => e.id === normalizedId);
    if (matching.length === 0) return null;

    // Prefer exact cycle match priorities:
    // 1. Sunday Cycle (A/B/C)
    // 2. Weekday Cycle (ODD/EVEN)
    // 3. ANY (Generic)
    // 4. MEMORY (Memorials)
    const specificSunday = matching.find((e) => e.cycle === sundayCycle);
    const specificWeekday = mappedWeekdayCycle ? matching.find((e) => e.cycle === mappedWeekdayCycle) : null;
    const generic = matching.find((e) => e.cycle === 'ANY');
    const memory = matching.find((e) => e.cycle === 'MEMORY');

    const chosen = specificSunday ?? specificWeekday ?? generic ?? memory ?? null;
    if (!chosen) return null;

    return {
      dayId: normalizedId,
      cycle: chosen.cycle,
      lecturas: chosen.lecturas as Lectura[],
      liturgicalDay: day,
    };
  },
};
