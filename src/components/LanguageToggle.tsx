import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
  className?: string;
}

export default function LanguageToggle({ language, setLanguage, className }: LanguageToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center bg-white/80 backdrop-blur-md rounded-full border border-[#c49b9b] shadow-sm p-1 z-50',
        className
      )}
    >
      <button
        onClick={() => setLanguage('es')}
        className={cn(
          'px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-300',
          language === 'es'
            ? 'bg-[#8B0000] text-white shadow-md'
            : 'text-[#522b2b] hover:bg-[#f4e2e2]'
        )}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage('la')}
        className={cn(
          'px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-300',
          language === 'la'
            ? 'bg-[#8B0000] text-white shadow-md'
            : 'text-[#522b2b] hover:bg-[#f4e2e2]'
        )}
      >
        LA
      </button>
    </div>
  );
}
