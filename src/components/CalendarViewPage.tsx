import { useState, useEffect, useRef } from 'react';
import CalendarView from '@/components/CalendarView';
import UnifiedHeader from '@/components/UnifiedHeader';
import Controls from '@/components/Controls';
import Footer from '@/components/Footer';
import { useCalendar } from '@/hooks/use-calendar';
import { CalendarDays, ArrowLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import CalendarCommandPalette from '@/components/CalendarCommandPalette';

interface CalendarViewPageProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
}

export default function CalendarViewPage({ language, setLanguage }: CalendarViewPageProps) {
  const navigate = useNavigate();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data, loading, generateData } = useCalendar();
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    generateData(year, language);
  }, [year, language, generateData]);

  // Handle auto-scroll to today
  useEffect(() => {
    if (!loading && Object.keys(data).length > 0 && !hasScrolledRef.current) {
      const timer = setTimeout(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayElement = document.getElementById(todayStr);
        if (todayElement) {
          const headerOffset = 180;
          const elementPosition = todayElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          hasScrolledRef.current = true;
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  const scrollToToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayElement = document.getElementById(todayStr);
    if (todayElement) {
      const headerOffset = 180;
      const elementPosition = todayElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    } else {
      const currentYear = new Date().getFullYear();
      if (year !== currentYear) {
        setYear(currentYear);
      }
    }
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    if (!season || season === 'none') return;

    setTimeout(() => {
      const element = document.getElementById(`banner-${season}`);
      if (element) {
        const headerOffset = 150;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 100);
  };

  const pageTitle = language === 'la' ? 'Calendarium Liturgicum' : 'Calendario Litúrgico';

  return (
    <>
      <UnifiedHeader
        language={language}
        setLanguage={setLanguage}
        pageTitle={pageTitle}
        year={year}
      >
        <Controls
          year={year}
          onYearChange={(y: string) => {
            setYear(parseInt(y));
            hasScrolledRef.current = false;
          }}
          language={language}
          season={selectedSeason}
          onSeasonChange={handleSeasonChange}
        />
      </UnifiedHeader>

      <CalendarCommandPalette
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        data={data}
        language={language}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-4">
        <CalendarView data={data} loading={loading} language={language} />
      </main>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {/* Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className={cn(
            'flex items-center justify-center w-12 h-12 text-white rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 group relative',
            'bg-linear-to-r from-primary-600 to-indigo-600 shadow-primary-200/50'
          )}
        >
          <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
            {language === 'la' ? 'QUAERERE' : 'BUSCAR'}
          </span>
        </button>

        {/* Today Button */}
        <button
          onClick={scrollToToday}
          className={cn(
            'flex items-center justify-center w-12 h-12 text-white rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 group relative',
            'bg-linear-to-r from-[#8B0000] to-[#522b2b] shadow-[#8B0000]/30'
          )}
        >
          <CalendarDays className="w-5 h-5 group-hover:animate-bounce" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
            {language === 'la' ? 'HODIE' : 'HOY'}
          </span>
        </button>

        {/* Home Button */}
        <button
          onClick={() => navigate('/')}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full shadow-xl hover:scale-105 transition-all active:scale-95 group relative border border-stone-200',
            'bg-white/80 backdrop-blur-sm bg-linear-to-b from-stone-50 to-white text-slate-700'
          )}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
            {language === 'la' ? 'INITIUM' : 'INICIO'}
          </span>
        </button>
      </div>
      <Footer language={language} />
    </>
  );
}
