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
      {/* Settings & Time — top-right, absolute */}
      <div className="absolute top-2 right-3 sm:right-6 z-50 flex items-center gap-2">
        <TimePill language={language} />
        <SettingsDropdown language={language} setLanguage={setLanguage} />
      </div>

      {/* ── HOME: Stacked centered layout ── */}
      {isHome && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1 md:py-2">
          <div className="flex flex-col items-center gap-1">

            {/* Branding */}
            <div className="flex items-center gap-2 group">
              <div className="relative transform transition-transform group-hover:scale-110 duration-500 shrink-0">
                <StoleIcon color={hex} className="w-8 h-8 md:w-10 md:h-10 drop-shadow-sm" />
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-[#3d0c0c] leading-none font-serif">
                <span className="bg-linear-to-r from-[#8B0000] to-[#3d0c0c] bg-clip-text text-transparent">
                  Iter Catholicum
                </span>
              </h1>
            </div>

            {/* Liturgical Date */}
            <LatinDateDisplay language={language} />

            {/* Badge portal */}
            <div
              id="header-portal-badges"
              className="flex items-center justify-center w-full min-h-5"
            />
          </div>
        </div>
      )}

      {/* ── SUBPAGES: Stacked centered layout ── */}
      {(pageTitle || children || centerChildren) && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 md:py-3 flex flex-col items-center gap-1">

          {/* 1. Page title — always on top */}
          {pageTitle && (
            <div className="flex items-center justify-center w-full min-w-0">
              {typeof pageTitle === 'string' ? (
                <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-[#3d0c0c] tracking-tight font-serif italic text-center leading-tight line-clamp-2 drop-shadow-sm">
                  {pageTitle}
                </h2>
              ) : (
                <div className="w-full flex justify-center min-w-0">
                  {pageTitle}
                </div>
              )}
            </div>
          )}

          {/* 2. Portal for navigation controls (date pickers, year nav, etc.) */}
          <div
            id="header-portal-center"
            className="flex items-center justify-center w-full min-w-0"
          />

          {/* 3. Extra children and right portal (tabs, etc.) */}
          {children && (
            <div className="flex items-center justify-center gap-2 min-w-0">
              <div id="header-portal-right" className="flex items-center gap-1.5" />
              {children}
            </div>
          )}
          {!children && (
            <div id="header-portal-right" className="flex items-center gap-1.5" />
          )}
        </div>
      )}
    </header>
  );
}
