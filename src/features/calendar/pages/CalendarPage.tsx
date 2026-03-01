import { useEffect, useRef, useState } from 'react';
import { useLayout } from '@app/layout/AppLayout';
import CalendarView from '@features/calendar/components/CalendarView';
import { useCalendar } from '@features/calendar/hooks/useCalendar';
import { ArrowLeft, Search } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { useNavigate } from 'react-router-dom';
import CalendarCommandPalette from '@features/calendar/components/CalendarCommandPalette';

interface CalendarPageProps {
  language: 'es' | 'la';
  year: number;
}

export default function CalendarPage({ language, year }: CalendarPageProps) {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data, loading, generateData } = useCalendar();
  const { setHeaderProps } = useLayout();
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    const pageTitle = language === 'la' ? 'Calendarium Liturgicum' : 'Calendario Litúrgico';
    setHeaderProps({
      pageTitle,
      year,
    });
  }, [language, year, setHeaderProps]);

  useEffect(() => {
    generateData(year, language);
  }, [year, language, generateData]);

  // Handle auto-scroll to today
  useEffect(() => {
    if (!loading && Object.keys(data).length > 0 && !hasScrolledRef.current) {
      const timer = setTimeout(() => {
        scrollToToday();
        hasScrolledRef.current = true;
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
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 w-full bg-[#fdfbf7] py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <CalendarView data={data} loading={loading} language={language} />
        </div>
      </main>

      {/* Floating Buttons Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className={cn(
            'flex items-center justify-center w-14 h-14 text-white rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 group relative',
            'bg-linear-to-r from-[#8B0000] to-[#522b2b] shadow-[#8B0000]/30'
          )}
        >
          <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute right-full mr-4 px-2 py-1 bg-[#2d1a1a] text-white text-xs font-serif rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10 italic pointer-events-none">
            {language === 'la' ? 'Invenire Diem' : 'Buscar Día'}
          </span>
        </button>

        {/* Today Button */}
        <button
          onClick={scrollToToday}
          className={cn(
            'flex items-center justify-center w-14 h-14 text-white rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 group relative',
            'bg-linear-to-r from-[#5c4033] to-[#2d1a1a] shadow-[#5c4033]/30'
          )}
        >
          <div className="flex flex-col items-center justify-center relative scale-90 md:scale-100">
            <span className="text-[10px] font-bold leading-none mb-0.5">
              {new Date()
                .toLocaleString(language === 'la' ? 'la' : 'es', { month: 'short' })
                .toUpperCase()}
            </span>
            <span className="text-lg font-black leading-none">{new Date().getDate()}</span>
          </div>
          <span className="absolute right-full mr-4 px-2 py-1 bg-[#2d1a1a] text-white text-xs font-serif rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10 italic pointer-events-none">
            {language === 'la' ? 'Hodie' : 'Hoy'}
          </span>
        </button>

        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className={cn(
            'flex items-center justify-center w-14 h-14 rounded-full shadow-xl hover:scale-105 transition-all active:scale-95 group relative border border-stone-200',
            'bg-white/80 backdrop-blur-sm bg-linear-to-b from-stone-50 to-white text-slate-700'
          )}
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          <span className="absolute right-full mr-4 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
            {language === 'la' ? 'INITIUM' : 'INICIO'}
          </span>
        </button>
      </div>

      <CalendarCommandPalette
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        data={data}
        language={language}
      />
    </div>
  );
}
