const { Romcal } = require('romcal');
const { Spain_Es } = require('@romcal/calendar.spain');

const romcal = new Romcal({ localizedCalendar: Spain_Es });
romcal.generateCalendar(2026).then(cal => {
  const days = Object.values(cal).flat();
  days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  days.forEach(d => {
    // Only show potential candidates for feasts/solemnities
    if (d.rank === 'SOLEMNITY' || d.rank === 'FEAST' || d.isHolyDayOfObligation) {
        console.log(`${d.date}: ${d.id} -> ${d.name}`);
    }
  });
});
