import { type ReactNode } from 'react';
import { LatinDateDisplay, TimePill } from '@features/calendar/components/widgets/LatinDateTime';
import LanguageToggle from './LanguageToggle';
import LiturgicalIndicator from '@shared/components/LiturgicalIndicator';
import { useTodayLiturgicalColor } from '@shared/hooks/useLiturgicalColor';

interface HeaderProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
  pageTitle?: ReactNode;
  children?: ReactNode;
  centerChildren?: boolean;
  year?: number;
}

export default function Header({
  language,
  setLanguage,
  pageTitle,
  children,
  centerChildren,
  year,
}: HeaderProps) {
  const { hex } = useTodayLiturgicalColor(language);
  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md border-b shadow-sm transition-all duration-700 ease-in-out"
      style={{
        backgroundColor: `${hex}15`,
        borderColor: `${hex}30`,
      }}
    >
      {/* Common Section */}
      <div className="border-b border-stone-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 md:py-2">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Left: App Branding & Context */}
            <div className="flex items-center">
              <LiturgicalIndicator language={language} activeYear={year} showTitle={true} />
            </div>

            {/* Center: Date & Liturgical Info */}
            <div className="flex flex-col items-center justify-center">
              <LatinDateDisplay language={language} />
            </div>

            {/* Right: Language Toggle & Time */}
            <div className="flex flex-col items-end gap-1.5">
              <LanguageToggle language={language} setLanguage={setLanguage} />
              <TimePill language={language} />
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
                  ? 'relative flex flex-col items-center justify-center py-3 gap-3'
                  : 'relative flex flex-col md:flex-row justify-between items-center py-3 gap-3 min-h-[60px]'
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
              {/* Target for portaling the Radix TabsList from pages into the header */}
              <div
                id="header-portal-target"
                className="flex flex-1 md:justify-end justify-center w-full md:w-auto"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
