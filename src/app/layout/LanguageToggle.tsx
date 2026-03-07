import { cn } from '@shared/lib/utils';
import { Switch } from '@ui/switch';

interface LanguageToggleProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
  className?: string;
}

export default function LanguageToggle({ language, setLanguage, className }: LanguageToggleProps) {
  return (
    <div className={cn('flex items-center gap-2 z-50', className)}>
      <div
        className={cn(
          'flex items-center gap-3 bg-white/60 backdrop-blur-md rounded-full border border-[#c49b9b]/20 shadow-sm px-4 py-2 transition-all duration-300 hover:bg-white/80'
        )}
      >
        {/* Language Switch */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'text-[10px] font-black tracking-widest transition-colors',
              language === 'es' ? 'text-[#8B0000]' : 'text-stone-400'
            )}
          >
            ES
          </span>
          <Switch
            checked={language === 'la'}
            onCheckedChange={(checked) => setLanguage(checked ? 'la' : 'es')}
          />
          <span
            className={cn(
              'text-[10px] font-black tracking-widest transition-colors',
              language === 'la' ? 'text-[#8B0000]' : 'text-stone-400'
            )}
          >
            LA
          </span>
        </div>
      </div>
    </div>
  );
}
