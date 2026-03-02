import { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useLayout } from '@app/layout/AppLayout';
import CalendarView from '@features/calendar/components/CalendarView';
import { useCalendar } from '@features/calendar/hooks/useCalendar';
import { ArrowLeft, Search } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { useNavigate } from 'react-router-dom';
import { startOfWeek, format, addDays, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import WeekView from '@features/calendar/components/WeekView';
import CalendarCommandPalette from '@features/calendar/components/CalendarCommandPalette';
import CalendarHeader from '@features/calendar/components/CalendarHeader';
import { calendarService } from '../services/calendarService';

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
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [shouldScrollToToday, setShouldScrollToToday] = useState(false);

  const [selectedYear, setSelectedYear] = useState<number>(year);
  const [selectedSeason, setSelectedSeason] = useState<string>('none');
  const [activeTab, setActiveTab] = useState<'year' | 'week'>('year');

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );

  useEffect(() => {
    const pageTitle = language === 'la' ? 'Calendarium Liturgicum' : 'Calendario Litúrgico';
    setHeaderProps({
      pageTitle,
    });
  }, [language, setHeaderProps]);

  useEffect(() => {
    generateData(selectedYear, language);
  }, [selectedYear, language, generateData]);

  // Sync currentWeekStart when selectedYear changes
  useEffect(() => {
    const weekYear = currentWeekStart.getFullYear();
    if (weekYear !== selectedYear) {
      const newDate = new Date(currentWeekStart);
      newDate.setFullYear(selectedYear);
      setCurrentWeekStart(startOfWeek(newDate, { weekStartsOn: 0 }));
    }
  }, [selectedYear]);

  useEffect(() => {
    const timer = setInterval(() => {
      const el = document.getElementById('header-portal-target');
      if (el) {
        setPortalTarget(el);
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Handle auto-scroll to today
  useEffect(() => {
    if (!loading && Object.keys(data).length > 0) {
      if (!hasScrolledRef.current) {
        const timer = setTimeout(() => {
          scrollToToday();
          hasScrolledRef.current = true;
        }, 600);
        return () => clearTimeout(timer);
      }

      if (shouldScrollToToday) {
        const timer = setTimeout(() => {
          performScroll('today');
          setShouldScrollToToday(false);
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, data, shouldScrollToToday]);

  const performScroll = (dateStrOrToday: string) => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const targetStr = dateStrOrToday === 'today' ? todayStr : dateStrOrToday;

    const element =
      document.getElementById(targetStr) || document.getElementById(`week-${targetStr}`);
    if (element) {
      const headerOffset = 180;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const scrollToToday = () => {
    const today = new Date();
    const currentYear = today.getFullYear();

    if (selectedYear !== currentYear) {
      setSelectedYear(currentYear);
      setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 0 }));
      setShouldScrollToToday(true);
    } else {
      setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 0 }));
      setTimeout(() => performScroll('today'), 150);
    }
  };

  const handleSelectDate = (dateStr: string) => {
    setIsSearchOpen(false);

    const selectedDate = new Date(dateStr);
    const selectedDateYear = selectedDate.getFullYear();

    setCurrentWeekStart(startOfWeek(selectedDate, { weekStartsOn: 0 }));

    if (selectedYear !== selectedDateYear) {
      setSelectedYear(selectedDateYear);
      setShouldScrollToToday(true);
    }

    setTimeout(() => performScroll(dateStr), 250);
  };

  const headerInfo = useMemo(() => {
    if (activeTab !== 'week' || loading) return null;

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(currentWeekStart, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      return data[dateStr]?.[0] || null;
    });

    const day = weekDays.find((d) => d);
    if (!day) return null;

    const summary = calendarService.getLiturgicalSummary(day, language as 'es' | 'la');
    return { text: summary?.text, theme: summary?.theme };
  }, [activeTab, currentWeekStart, data, language, loading]);

  const displayMonth = useMemo(() => {
    const currentLocale = language === 'la' ? es : es;
    const monthLabel = format(currentWeekStart, 'MMMM yyyy', { locale: currentLocale });
    const monthEndLabel = format(addDays(currentWeekStart, 6), 'MMMM yyyy', {
      locale: currentLocale,
    });
    return monthLabel === monthEndLabel
      ? monthLabel
      : `${format(currentWeekStart, 'MMM', { locale: currentLocale })} - ${monthEndLabel}`;
  }, [currentWeekStart, language]);

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 w-full bg-[#fdfbf7] py-6 sm:py-8">
        <div className="max-w-[1400px] mx-auto px-0 sm:px-6">
          <Tabs
            defaultValue="year"
            className="w-full"
            onValueChange={(v) => setActiveTab(v as 'year' | 'week')}
          >
            {portalTarget &&
              createPortal(
                <div className="flex w-full items-center justify-center md:static relative gap-4 mt-2 md:mt-0">
                  <div
                    id="week-nav-portal-target"
                    className="flex shrink-0 items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2"
                  ></div>
                  <div className="flex md:flex-1 shrink-0 justify-center md:justify-end">
                    <TabsList className="grid w-[240px] sm:w-[320px] grid-cols-2 shadow-sm border border-stone-200/50">
                      <TabsTrigger value="year" className="text-xs sm:text-sm">
                        {language === 'la' ? 'Annus Universus' : 'Año Completo'}
                      </TabsTrigger>
                      <TabsTrigger value="week" className="text-xs sm:text-sm">
                        {language === 'la' ? 'Hebdomada' : 'Semana Actual'}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>,
                portalTarget
              )}

            <TabsContent value="year" className="focus-visible:outline-none px-4 sm:px-0 mt-0">
              <CalendarHeader
                view="year"
                year={selectedYear}
                onYearChange={setSelectedYear}
                language={language}
                season={selectedSeason}
                onSeasonChange={setSelectedSeason}
              />
              <div className="max-w-2xl mx-auto">
                <CalendarView
                  data={data}
                  loading={loading}
                  language={language}
                  seasonFilter={selectedSeason}
                />
              </div>
            </TabsContent>

            <TabsContent value="week" className="focus-visible:outline-none px-0 sm:px-0 mt-0">
              <CalendarHeader
                view="week"
                year={selectedYear}
                onYearChange={setSelectedYear}
                language={language}
                displayMonth={displayMonth}
                displayWeekInfo={headerInfo?.text}
                onPrevWeek={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
                onNextWeek={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
                theme={headerInfo?.theme}
              />
              <div className="w-full">
                <WeekView
                  data={data}
                  loading={loading}
                  language={language}
                  currentWeekStart={currentWeekStart}
                />
              </div>
            </TabsContent>
          </Tabs>
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
        onSelectDate={handleSelectDate}
      />
    </div>
  );
}
