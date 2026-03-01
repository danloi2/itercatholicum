import { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutContextType {
  setHeaderProps: (props: {
    pageTitle?: React.ReactNode;
    centerChildren?: boolean;
    year?: number;
  }) => void;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within an AppLayout');
  return context;
};

interface AppLayoutProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
}

export default function AppLayout({ language, setLanguage }: AppLayoutProps) {
  const [headerProps, setHeaderProps] = useState<{
    pageTitle?: React.ReactNode;
    centerChildren?: boolean;
    year?: number;
  }>({});

  return (
    <LayoutContext.Provider value={{ setHeaderProps }}>
      <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
        <Header
          language={language}
          setLanguage={setLanguage}
          pageTitle={headerProps.pageTitle}
          centerChildren={headerProps.centerChildren}
          year={headerProps.year}
        />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer language={language} />
      </div>
    </LayoutContext.Provider>
  );
}
