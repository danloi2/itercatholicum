import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function toRoman(num: number): string {
  if (!num || num === 0) return '';
  const map: [string, number][] = [
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1],
  ];
  let result = '';
  let n = num;
  for (const [letter, value] of map) {
    while (n >= value) {
      result += letter;
      n -= value;
    }
  }
  return result;
}

interface DateWidgetProps {
  language?: string;
}

export default function DateWidget({ language = 'es' }: DateWidgetProps) {
  const [now, setNow] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const h = now.getHours();
  const isNight = h < 6 || h >= 19;

  let timeText = '';
  if (language === 'la') {
    const romanHours: Record<number, string> = {
      0: 'media nox',
      1: 'prima vigilia',
      2: 'secunda vigilia',
      3: 'tertia vigilia',
      4: 'quarta vigilia',
      5: 'quinta vigilia',
      6: 'hora prima',
      7: 'hora secunda',
      8: 'hora tertia',
      9: 'hora quarta',
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
    timeText = (romanHours[h] || '').toUpperCase();
  } else {
    timeText = format(now, 'h:mm a');
  }

  const dateText =
    language === 'la'
      ? (() => {
          const days = [
            'Die Dominica',
            'Die Lunae',
            'Die Martis',
            'Die Mercurii',
            'Die Iovis',
            'Die Veneris',
            'Die Saturni',
          ];
          const months = [
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
          return (
            <>
              {days[now.getDay()]}, die {toRoman(now.getDate())} mensis {months[now.getMonth()]}{' '}
              Anno Domini {toRoman(now.getFullYear())}
            </>
          );
        })()
      : format(now, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <div className="flex flex-col items-center gap-1.5 leading-tight">
      <div className="text-sm font-bold text-slate-700 capitalize tracking-tight text-center">
        {dateText}
      </div>
      <div className="flex flex-col items-center justify-center py-0.5 md:py-1 px-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#c49b9b]/30 shadow-sm transition-all duration-300 hover:shadow-md group">
        {isNight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        <span>{timeText}</span>
      </div>
    </div>
  );
}
