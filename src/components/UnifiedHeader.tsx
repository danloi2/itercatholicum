import { type ReactNode } from 'react';
import DateWidget from './DateWidget';
import LanguageToggle from './LanguageToggle';
import LiturgicalIndicator from './LiturgicalIndicator';

interface UnifiedHeaderProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
  pageTitle?: ReactNode;
  children?: ReactNode;
  centerChildren?: boolean;
  year?: number;
}

export default function UnifiedHeader({
  language,
  setLanguage,
  pageTitle,
  children,
  centerChildren,
  year,
}: UnifiedHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#fdfbf7]/80 backdrop-blur-md border-b border-[#c49b9b]/20 shadow-smHeader">
      {/* Common Section */}
      <div className="border-b border-stone-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 md:py-2">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Left: App Branding & Context */}
            <div className="flex items-center">
              <LiturgicalIndicator language={language} activeYear={year} showTitle={true} />
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
            <div
              className={
                centerChildren
                  ? 'flex flex-col items-center justify-center py-3 gap-3'
                  : 'flex flex-col md:flex-row justify-between items-center py-3 gap-3'
              }
            >
              {pageTitle &&
                (typeof pageTitle === 'string' ? (
                  <h2 className="text-lg md:text-xl font-bold text-[#3d0c0c] tracking-tight text-center">
                    {pageTitle}
                  </h2>
                ) : (
                  <div
                    className={`flex items-center gap-2 flex-wrap ${
                      centerChildren ? 'justify-center' : ''
                    }`}
                  >
                    {pageTitle}
                  </div>
                ))}
              {children && (
                <div
                  className={`flex items-center gap-3 ${centerChildren ? 'justify-center' : ''}`}
                >
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
