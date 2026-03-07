import { type ReactNode } from 'react';
import LanguageToggle from './LanguageToggle';
import SettingsDropdown from './SettingsDropdown';
import { useTodayLiturgicalColor } from '@shared/hooks/useLiturgicalColor';
import { StoleIcon } from '@shared/components/icons/StoleIcon';
import { LatinDateDisplay, TimePill } from '@shared/components/widgets/LatinDateTime';

interface HeaderProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
  pageTitle?: ReactNode;
  children?: ReactNode;
  year?: number;
  centerChildren?: boolean;
}

export default function Header({
  language,
  setLanguage,
  pageTitle,
  children,
  centerChildren,
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
      {/* Unified Top Section */}
      <div className="border-b border-stone-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 md:py-2">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Left: Branding */}
            <div className="flex items-center">
              <div className="flex items-center gap-3 group py-1">
                <div className="relative transform transition-transform group-hover:scale-110 duration-500 shrink-0">
                  <StoleIcon color={hex} className="w-8 h-8 md:w-10 md:h-10 drop-shadow-sm" />
                </div>
                <div className="flex flex-col items-start leading-none gap-1">
                  <h1 className="text-xl md:text-2xl font-black tracking-tighter text-[#3d0c0c] leading-none">
                    <span className="bg-linear-to-r from-[#8B0000] to-[#3d0c0c] bg-clip-text text-transparent">
                      Iter Catholicum
                    </span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Center: Liturgical Info */}
            <div className="flex flex-col items-center justify-center">
              <LatinDateDisplay language={language} />
            </div>

            {/* Right: Controls & Time */}
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-2 z-50">
                <LanguageToggle language={language} setLanguage={setLanguage} />
                <SettingsDropdown language={language} />
              </div>
              <TimePill language={language} />
            </div>
          </div>
        </div>
      </div>

      {/* Page-Specific Section (Second Header Slot) */}
      {(pageTitle || children || centerChildren) && (
        <div className="bg-stone-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {centerChildren ? (
              <div className="flex flex-col items-center justify-center min-h-[70px] py-2 w-full gap-2">
                {/* Badges Portal Slot (Top of the stack) */}
                <div
                  id="header-portal-badges"
                  className="flex items-center justify-center w-full min-h-[1.5rem]"
                />

                {/* Main Content Area (Title or Portal Center) */}
                <div className="flex flex-col items-center justify-center w-full gap-1">
                  <div
                    id="header-portal-center"
                    className="flex items-center justify-center w-full"
                  />
                  {pageTitle && (
                    <div className="flex items-center justify-center gap-2 flex-wrap w-full">
                      {typeof pageTitle === 'string' ? (
                        <h2 className="text-xl md:text-2xl font-black text-[#3d0c0c] tracking-tight truncate font-serif italic text-center leading-tight">
                          {pageTitle}
                        </h2>
                      ) : (
                        <div className="w-full flex justify-center">{pageTitle}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 items-center min-h-[60px] py-1 md:py-2 gap-4">
                {/* Left Slot: Feature Titles / Breadcrumbs */}
                <div className="flex items-center overflow-hidden">
                  {pageTitle && (
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      {typeof pageTitle === 'string' ? (
                        <h2 className="text-lg md:text-xl font-bold text-[#3d0c0c] tracking-tight truncate">
                          {pageTitle}
                        </h2>
                      ) : (
                        pageTitle
                      )}
                    </div>
                  )}
                </div>

                {/* Center Slot: Main Selectors (Mass date picker, Calendar nav) */}
                <div
                  id="header-portal-center"
                  className="flex items-center justify-center min-w-0"
                />

                {/* Right Slot: Tabs & Actions */}
                <div className="flex items-center justify-end gap-3 min-w-0">
                  <div id="header-portal-right" className="flex items-center gap-2" />
                  {children}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
