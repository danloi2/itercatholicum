import { Settings, Type } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { Slider } from '@ui/slider';
import { useSettings } from '@shared/context/SettingsContext';

interface SettingsDropdownProps {
  language: 'es' | 'la';
}

export default function SettingsDropdown({ language }: SettingsDropdownProps) {
  const { fontScale, setFontScale } = useSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center w-10 h-10 bg-white/60 backdrop-blur-md rounded-full border border-[#c49b9b]/20 shadow-sm text-[#c49b9b] hover:text-[#8B0000] hover:bg-white/80 transition-all duration-300 outline-none focus:ring-2 focus:ring-[#8B0000]/20">
          <Settings className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 p-4 bg-white/95 backdrop-blur-xl border-[#c49b9b]/20 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200 z-60"
      >
        <DropdownMenuLabel className="flex items-center gap-2 px-0 pb-3 text-[#522b2b] font-bold tracking-tight">
          <Type className="w-4 h-4 text-[#c49b9b]" />
          {language === 'la' ? 'Magnitudo litterarum' : 'Tamaño de letra'}
          <span className="ml-auto text-[10px] font-black text-[#c49b9b] bg-[#fdfbf7] px-1.5 py-0.5 rounded border border-[#c49b9b]/10">
            {Math.round(fontScale * 100)}%
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#c49b9b]/10 mb-4" />
        <div className="px-1 py-2">
          <Slider
            value={[fontScale]}
            min={0.8}
            max={2}
            step={0.1}
            onValueChange={([val]) => setFontScale(val)}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
