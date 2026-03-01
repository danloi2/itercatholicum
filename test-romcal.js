import Romcal from './src/shared/lib/romcal/romcal.js';
import Spain_Es from './src/shared/lib/romcal/es.js';
import fs from 'fs';

async function test() {
  try {
    const romcal = new Romcal.Romcal({ localizedCalendar: Spain_Es });
    const cal = await romcal.generateCalendar(2026);
    const dates = Object.keys(cal).sort();
    let output = '';
    for (let i = 0; i < 50; i++) {
      const d = dates[i];
      output += `Date: ${d}\n`;
      output += JSON.stringify(cal[d], null, 2) + '\n\n';
    }
    fs.writeFileSync('romcal-output.txt', output);
    console.log('Successfully wrote romcal-output.txt');
  } catch (e) {
    console.error(e);
  }
}

test();
