import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CalendarIcon, FilterIcon } from 'lucide-react';
import { SEASON_INFO } from '@/constants/config';

interface ControlsProps {
  year: number;
  onYearChange: (year: string) => void;
  language: 'es' | 'la';
  season: string;
  onSeasonChange: (season: string) => void;
}

export default function Controls({
  year,
  onYearChange,
  language,
  season,
  onSeasonChange,
}: ControlsProps) {
  const years = [2026, 2027, 2028, 2029, 2030]; // Dynamic generation can be added

  return (
    <div className="w-full flex flex-col sm:flex-row gap-2">
      {/* Year Selector */}
      <div className="relative group w-full sm:w-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors z-10">
          <CalendarIcon className="w-5 h-5" />
        </div>
        <Select value={year.toString()} onValueChange={onYearChange}>
          <SelectTrigger className="w-full sm:w-40 pl-9 bg-slate-100/50 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-100">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y - 1} / {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Season Selector */}
      <div className="relative group w-full sm:w-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors z-10">
          <FilterIcon className="w-5 h-5" />
        </div>
        <Select value={season} onValueChange={onSeasonChange}>
          <SelectTrigger className="w-full sm:w-48 pl-9 bg-slate-100/50 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-100">
            <SelectValue placeholder={language === 'la' ? '-- Tempus --' : '-- Tiempo --'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              {language === 'la' ? '-- Tempus --' : '-- Tiempo --'}
            </SelectItem>
            {Object.entries(SEASON_INFO).map(([key, info]) => {
              const name = language === 'la' ? info.latTitle : info.title;
              return (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
