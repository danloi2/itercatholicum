import { Romcal } from 'romcal';
import { Spain_Es } from '@romcal/calendar.spain';
import * as fs from 'fs';
import * as path from 'path';

interface RomcalDay {
  id: string;
  date: string;
  name: string;
  rank: string;
  cycles: {
    sundayCycle: string;
    weekdayCycle: string;
  };
  calendar: {
    weekOfSeason: number;
  };
  periods: string[];
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

// Simulation of the matching logic in lectionaryService.ts
function findReadingEntry(day: RomcalDay, data: LectionaryEntry[]) {
  const dayId = day.id.toLowerCase().replace(/_/g, '');

  // 1. Slug matching
  const slugMatches = data.filter((e: LectionaryEntry) => {
    if (!e.slug) return false;
    const normalizedSlug = e.slug.toLowerCase().replace(/_/g, '');
    return dayId.includes(normalizedSlug) || normalizedSlug.includes(dayId);
  });

  if (slugMatches.length > 0) {
    return slugMatches.find((e: LectionaryEntry) => !!e.firstReading) || slugMatches[0];
  }

  // 2. Week/Cycle matching
  const sundayCycle = (day.cycles?.sundayCycle || '').replace('YEAR_', '').toUpperCase();
  const weekdayCycle = (day.cycles?.weekdayCycle || '').replace('YEAR_', '').toString();
  const weekOrder = day.calendar?.weekOfSeason?.toString() || '';
  const dateObj = new Date(day.date);
  const weekday = dateObj.getDay();
  const isSunday = weekday === 0;
  const weekdayName = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ][weekday];

  const matches = data.filter((entry: LectionaryEntry) => {
    const entryCycle = (entry.yearCycle || '').toUpperCase();
    const entryWeekOrder = (entry.weekOrder || '').toString();
    const entryYearNumber = (entry.yearNumber || '').toString();

    if (isSunday || day.rank === 'SOLEMNITY' || day.rank === 'FEAST') {
      return (
        entry.weekdayType === 'sunday' &&
        entryWeekOrder === weekOrder &&
        (entryCycle === sundayCycle || entryCycle === '')
      );
    } else {
      return (
        entry.weekdayType === weekdayName &&
        entryWeekOrder === weekOrder &&
        (entryYearNumber === '' || entryYearNumber === weekdayCycle)
      );
    }
  });

  return matches.find((e: LectionaryEntry) => !!e.firstReading) || matches[0] || null;
}

async function run() {
  const romcal = new Romcal({ localizedCalendar: Spain_Es });
  const cal = await romcal.generateCalendar(2026);
  const days = Object.values(cal).flat() as unknown as RomcalDay[];

  const lectionesDir = path.resolve('src/shared/data/lectiones');

  // Load ALL json files
  const allFiles: { name: string; data: LectionaryEntry[] }[] = [];
  const walkSync = (dir: string) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        walkSync(filePath);
      } else if (file.endsWith('.json')) {
        const relativePath = path.relative(lectionesDir, filePath);
        allFiles.push({ name: relativePath, data: JSON.parse(fs.readFileSync(filePath, 'utf-8')) });
      }
    });
  };
  walkSync(lectionesDir);

  const targetIds = [
    'mary_mother_of_god',
    'epiphany_of_the_lord',
    'joseph_spouse_of_mary',
    'james_apostle', // Changed to match romcal output
    'assumption_of_the_blessed_virgin_mary', // Correcting from romcal output
    'all_saints',
    'immaculate_conception_of_the_blessed_virgin_mary',
    'nativity_of_the_lord',
    'first_sunday_of_advent',
    'holy_family_of_jesus_mary_and_joseph',
    'baptism_of_the_lord',
    'ash_wednesday',
    'easter_sunday',
    'ascension_of_the_lord',
    'pentecost_sunday',
    'our_lord_jesus_christ_the_eternal_high_priest',
    'most_holy_trinity',
    'most_holy_body_and_blood_of_christ',
    'most_holy_sacred_heart_of_jesus',
    'our_lord_jesus_christ_king_of_the_universe',
  ];

  console.log('| Date | ID | Name | Match Status | Slug Used |');
  console.log('|---|---|---|---|---|');

  for (const targetId of targetIds) {
    const day = days.find(
      (d) => d.id === targetId || d.id.includes(targetId) || targetId.includes(d.id)
    );
    if (!day) {
      console.log(`| - | ${targetId} | NOT FOUND IN ROMCAL 2026 | - | - |`);
      continue;
    }

    let foundEntry: LectionaryEntry | null = null;
    let sourceFile = '';

    for (const fileObj of allFiles) {
      const entry = findReadingEntry(day, fileObj.data);
      if (entry) {
        foundEntry = entry;
        sourceFile = fileObj.name;
        // If it's a slug match, it's a high quality match
        if (
          entry.slug &&
          day.id
            .toLowerCase()
            .replace(/_/g, '')
            .includes(entry.slug.toLowerCase().replace(/_/g, ''))
        ) {
          break;
        }
      }
    }

    const status = foundEntry ? `✅ Found in ${sourceFile}` : '❌ NOT FOUND';
    const slug = foundEntry?.slug || '-';
    console.log(`| ${day.date} | ${day.id} | ${day.name} | ${status} | ${slug} |`);
  }
}

run().catch(console.error);
