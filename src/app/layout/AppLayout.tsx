import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useSettings } from '@shared/context/SettingsContext';
import { LayoutContext } from './LayoutContext';
import { LiturgicalBadgesPortal } from '@shared/components/widgets/LatinDateTime';

interface AppLayoutProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
}

export default function AppLayout({ language, setLanguage }: AppLayoutProps) {
  const { fontScale } = useSettings();

  // Apply font scale to body for portals
  useEffect(() => {
    document.body.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  const [headerProps, setHeaderProps] = useState<{
    pageTitle?: React.ReactNode;
    centerChildren?: boolean;
    year?: number;
  }>({});

  return (
    <LayoutContext.Provider value={{ setHeaderProps }}>
      <div className="min-h-screen flex flex-col bg-[#fdfbf7] relative">
        <LiturgicalBadgesPortal language={language} />
        <Header
          language={language}
          setLanguage={setLanguage}
          pageTitle={headerProps.pageTitle}
          centerChildren={headerProps.centerChildren}
          year={headerProps.year}
        />
        <main className="flex-1 scalable-content">
          <Outlet />
        </main>

        <Footer language={language} />
      </div>
    </LayoutContext.Provider>
  );
}
