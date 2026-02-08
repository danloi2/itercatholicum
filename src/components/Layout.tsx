import React from 'react';
import Header from './Header';
import AboutModal from './AboutModal';
import LanguageToggle from './LanguageToggle';
import { useGitHubVersion } from '@/hooks/useGitHubVersion';
import { GitHubIcon } from './icons/GitHubIcon';

interface LayoutProps {
  children: React.ReactNode;
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
  showHeader?: boolean;
  headerProps?: {
    year: number;
    setYear: (v: string) => void;
    season: string;
    onSeasonChange: (v: string) => void;
  };
}

export default function Layout({
  children,
  language,
  setLanguage,
  showHeader = true,
  headerProps,
}: LayoutProps) {
  const version = useGitHubVersion();
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#522b2b] antialiased selection:bg-[#8B0000]/20 selection:text-[#522b2b] font-serif flex flex-col relative">
      {/* Global Language Toggle - Fixed Top Right */}
      <div className="fixed top-4 right-4 z-60">
        <LanguageToggle language={language} setLanguage={setLanguage} />
      </div>

      {showHeader && headerProps && (
        <>
          <Header {...headerProps} language={language} />
          <div className="h-20 md:h-16 shrink-0"></div> {/* Spacer for fixed header */}
        </>
      )}
      <main className="flex-1 w-full">{children}</main>
      <footer className="py-6 px-4 text-center border-t border-[#c49b9b]/30 bg-[#f4e2e2]/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-left">
            <p className="text-lg font-bold text-[#522b2b]">
              Iter <span className="text-[#8B0000]">Catholicum</span>
            </p>
            <p className="text-sm text-[#8B0000]/80 mt-1">
              © {new Date().getFullYear()} Daniel Losada •{' '}
              {language === 'la' ? 'Licentia MIT' : 'Licencia MIT'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <AboutModal
              language={language}
              trigger={
                <button className="text-sm font-bold text-[#522b2b] hover:text-[#8B0000] transition-colors cursor-pointer uppercase tracking-widest">
                  {language === 'la' ? 'De Iter Catholico' : 'Acerca de'}
                </button>
              }
            />
            <span className="text-[#c49b9b]">|</span>
            <a
              href="https://github.com/danloi2/itercatholicum"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm font-bold text-[#522b2b] hover:text-[#8B0000] transition-colors uppercase tracking-widest"
              title="GitHub Repository"
            >
              <GitHubIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <div className="hidden sm:flex items-center bg-[#ebd6d6]/50 px-2 py-0.5 rounded-full border border-[#c49b9b]/30">
              <span className="text-[10px] font-bold text-[#8B0000] uppercase tracking-tighter">
                {version.startsWith('v') ? version : `v${version}`}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
