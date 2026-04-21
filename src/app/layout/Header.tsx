import { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md border-b shadow-sm transition-all duration-700 ease-in-out"
      style={{
        backgroundColor: `${hex}15`,
        borderColor: `${hex}30`,
      }}
    >
      {/* Unified Top Section - Only on Home */}
      {isHome && (
        <div className="border-b border-stone-200/30">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1 md:py-2">
            <div className="flex items-center justify-between gap-2">
              {/* Left: Branding */}
              <div className="flex items-center shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-3 group py-1">
                  <div className="relative transform transition-transform group-hover:scale-110 duration-500 shrink-0">
                    <StoleIcon color={hex} className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 drop-shadow-sm" />
                  </div>
                  <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tighter text-[#3d0c0c] leading-none font-serif">
                    <span className="bg-linear-to-r from-[#8B0000] to-[#3d0c0c] bg-clip-text text-transparent">
                      Iter Catholicum
                    </span>
                  </h1>
                </div>
              </div>

              {/* Center: Liturgical Info — hidden on xs, visible on sm+ */}
              <div className="hidden sm:flex flex-col items-center justify-center gap-1 flex-1 min-w-0 overflow-hidden">
                <LatinDateDisplay language={language} />
                <div
                  id="header-portal-badges"
                  className="flex items-center justify-center w-full min-h-6"
                />
              </div>

              {/* Right: Controls & Time */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1.5 z-50">
                  <SettingsDropdown language={language} setLanguage={setLanguage} />
                </div>
                <TimePill language={language} />
              </div>
            </div>

            {/* Liturgical Info on xs screens only */}
            <div className="sm:hidden flex flex-col items-center pb-1 gap-0.5">
              <LatinDateDisplay language={language} />
              <div
                id="header-portal-badges-xs"
                className="flex items-center justify-center w-full min-h-5"
              />
            </div>
          </div>
        </div>
      )}

      {/* Page-Specific Section (Second Header Slot) */}
      {(pageTitle || children || centerChildren) && (
        <div className="bg-stone-50/50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            {centerChildren ? (
              <div className="flex flex-col items-center justify-center min-h-[44px] sm:min-h-[50px] py-1.5 w-full gap-1">
                <div className="flex flex-col items-center justify-center w-full gap-1 min-w-0">
                  <div
                    id="header-portal-center"
                    className="flex items-center justify-center w-full min-w-0"
                  />
                  {pageTitle && (
                    <div className="flex items-center justify-center gap-2 flex-wrap w-full min-w-0 px-2">
                      {typeof pageTitle === 'string' ? (
                        <h2 className="text-base sm:text-xl md:text-2xl font-bold text-[#3d0c0c] tracking-tight font-serif italic text-center leading-tight line-clamp-2">
                          {pageTitle}
                        </h2>
                      ) : (
                        <div className="w-full flex justify-center min-w-0 overflow-hidden">{pageTitle}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between min-h-[48px] sm:min-h-[60px] py-1 md:py-2 gap-2">
                {/* Left Slot: Feature Titles / Breadcrumbs */}
                <div className="flex items-center overflow-hidden flex-1 min-w-0">
                  {pageTitle && (
                    <div className="flex items-center min-w-0">
                      {typeof pageTitle === 'string' ? (
                        <h2 className="text-base sm:text-xl md:text-2xl font-bold text-[#3d0c0c] tracking-tight truncate font-serif italic">
                          {pageTitle}
                        </h2>
                      ) : (
                        <div className="min-w-0 overflow-hidden">{pageTitle}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Center Slot: Main Selectors */}
                <div
                  id="header-portal-center"
                  className="flex items-center justify-center shrink-0"
                />

                {/* Right Slot: Tabs & Actions */}
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  <div id="header-portal-right" className="flex items-center gap-1.5" />
                  {children}
                  {!isHome && <SettingsDropdown language={language} setLanguage={setLanguage} />}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
