import { type ReactNode } from 'react';
import DateWidget from './DateWidget';
import LanguageToggle from './LanguageToggle';

interface UnifiedHeaderProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
  pageTitle?: string;
  children?: ReactNode;
}

export default function UnifiedHeader({
  language,
  setLanguage,
  pageTitle,
  children,
}: UnifiedHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/50 shadow-sm">
      {/* Common Section */}
      <div className="border-b border-stone-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center py-3 gap-4">
            {/* Left: App Branding */}
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-black tracking-tighter text-[#3d0c0c] leading-none">
                <span className="bg-linear-to-r from-[#8B0000] to-[#3d0c0c] bg-clip-text text-transparent">
                  Iter
                </span>
                <span className="ml-1 font-bold text-[#3d0c0c]">Catholicum</span>
              </h1>
            </div>

            {/* Center: Date & Time */}
            <div className="flex flex-col items-center justify-center">
              <DateWidget language={language} />
            </div>

            {/* Right: Language Toggle */}
            <div className="flex justify-end">
              <LanguageToggle language={language} setLanguage={setLanguage} />
            </div>
          </div>
        </div>
      </div>

      {/* Page-Specific Section */}
      {(pageTitle || children) && (
        <div className="bg-stone-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center py-3 gap-3">
              {pageTitle && (
                <h2 className="text-lg md:text-xl font-bold text-[#3d0c0c] tracking-tight">
                  {pageTitle}
                </h2>
              )}
              {children && <div className="flex items-center gap-3">{children}</div>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
