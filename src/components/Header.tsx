import Controls from './Controls';
import DateWidget from './DateWidget';

interface HeaderProps {
  year: number;
  setYear: (v: string) => void;
  language: 'es' | 'la';
  season: string;
  onSeasonChange: (v: string) => void;
}

export default function Header({ year, setYear, language, season, onSeasonChange }: HeaderProps) {
  const cycle = ['C', 'A', 'B'][(year - 2022) % 3];
  const isEven = year % 2 === 0;

  const yearDesignation = isEven ? 'Par (II)' : 'Impar (I)';

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center h-auto min-h-16 py-2 gap-4">
          {/* Logo / Title (Left) */}
          <div className="flex flex-col items-center md:items-start group cursor-default">
            <h1 className="text-2xl font-black tracking-tighter text-[#3d0c0c] group-hover:text-[#8B0000] transition-colors leading-none">
              <span className="bg-linear-to-r from-[#8B0000] to-[#3d0c0c] bg-clip-text text-transparent">
                Iter
              </span>
              <span className="ml-1 font-bold text-[#3d0c0c]">Catholicum</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-2 mt-1.5">
              <p className="text-[10px] font-extrabold text-[#522b2b] uppercase tracking-widest flex items-center gap-1.5 leading-none shadow-stone-100 px-2 py-0.5 rounded-full bg-stone-100/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-pulse"></span>
                {language === 'la'
                  ? `Cyclus ${cycle} • Annus ${yearDesignation}`
                  : `Ciclo ${cycle} • Año ${yearDesignation}`}
              </p>
              <p className="hidden md:block text-[10px] font-bold text-[#8B0000]/70 uppercase tracking-widest leading-none">
                {language === 'la' ? 'Hispania' : 'España'} • {year - 1} / {year}
              </p>
            </div>
          </div>

          {/* Controls & Date (Right) */}
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
            <DateWidget language={language} />
            <Controls
              year={year}
              onYearChange={setYear}
              language={language}
              season={season}
              onSeasonChange={onSeasonChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
