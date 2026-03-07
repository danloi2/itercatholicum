import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLayout } from '@app/layout/LayoutContext';
import { useCalendar } from '@features/calendar/hooks/useCalendar';
import { ArrowLeft, Search } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { useNavigate } from 'react-router-dom';
import { startOfWeek, format, addDays, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { la } from '@shared/lib/locales';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import WeeklyView from './components/views/WeeklyView';
import CalendarCommandPalette from './components/search/CalendarCommandPalette';
import SecondHeader from './layout/SecondHeader';
import { LiturgicalCalendarView } from './components/views/LiturgicalCalendarView';
import { calendarService } from './services/calendarService';
import LiturgicalSeasonView from './components/views/LiturgicalSeasonView';
import { ROMCAL_MAP } from '@shared/constants/config';
import { Fab as FloatingActionButton } from '@shared/components/buttons/Fab';

interface PageProps {
  language: 'es' | 'la';
  year: number;
}

export default function Page({ language, year }: PageProps) {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data, loading, generateData } = useCalendar();
  const { setHeaderProps } = useLayout();
  const hasScrolledRef = useRef(false);
  const [shouldScrollToToday, setShouldScrollToToday] = useState(false);

  const performScroll = (dateStrOrToday: string) => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const targetStr = dateStrOrToday === 'today' ? todayStr : dateStrOrToday;

    const element =
      document.getElementById(targetStr) || document.getElementById(`week-${targetStr}`);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const elementHeight = elementRect.height;
      const elementTop = elementRect.top + window.scrollY;
      const viewportHeight = window.innerHeight;

      // Calculate position to put the center of the element in the center of the viewport
      const offsetPosition = elementTop - viewportHeight / 2 + elementHeight / 2;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const [selectedYear, setSelectedYear] = useState<number>(year);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSeason, setSelectedSeason] = useState<string>('none');
  const [activeTab, setActiveTab] = useState<'year' | 'seasons' | 'week'>('year');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );

  const scrollToToday = useCallback(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const todayStr = format(today, 'yyyy-MM-dd');

    // If we're in seasons view, we need to ensure today's season is selected or filter is off
    if (activeTab === 'seasons') {
      // Find today's season key
      const todayEvents = data[todayStr];
      if (todayEvents?.[0]) {
        const principal = todayEvents[0];
        const seasonRaw = principal.seasons?.[0] || 'ORDINARY_TIME';
        let season = ROMCAL_MAP[seasonRaw.toUpperCase()] || seasonRaw.toUpperCase();
        if (principal.periods?.includes('HOLY_WEEK')) season = 'HOLY_WEEK';

        let targetSeason = season;
        if (season === 'ORDINARY_TIME') {
          const sortedDates = Object.keys(data).sort();
          let ordinaryBlock = 1;
          for (const d of sortedDates) {
            if (d === todayStr) break;
            const ev = data[d][0];
            if (!ev) continue;
            const sRaw = ev.seasons?.[0] || 'ORDINARY_TIME';
            let s = ROMCAL_MAP[sRaw.toUpperCase()] || sRaw.toUpperCase();
            if (ev.periods?.includes('HOLY_WEEK')) s = 'HOLY_WEEK';
            if (s === 'EASTER') ordinaryBlock = 2;
          }
          targetSeason = ordinaryBlock === 1 ? 'ORDINARY_TIME_1' : 'ORDINARY_TIME_2';
        }

        if (selectedSeason !== targetSeason) {
          setSelectedSeason(targetSeason);
        }
      }
    }

    if (selectedYear !== currentYear) {
      setSelectedYear(currentYear);
      setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 0 }));
      setShouldScrollToToday(true);
    } else {
      setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 0 }));
      // Use a slightly longer timeout if we just changed the season filter to allow DOM to update
      setTimeout(() => performScroll('today'), activeTab === 'seasons' ? 300 : 150);
    }
  }, [selectedYear, activeTab, data, selectedSeason]);

  useEffect(() => {
    const pageTitle = language === 'la' ? 'Calendarium Liturgicum' : 'Calendario Litúrgico';
    setHeaderProps({
      pageTitle,
      centerChildren: true,
    });
  }, [language, setHeaderProps]);

  // Determine current liturgical season for the selector default
  useEffect(() => {
    if (!loading && Object.keys(data).length > 0 && selectedSeason === 'none') {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const todayEvents = data[today];
      if (todayEvents?.[0]) {
        const principal = todayEvents[0];
        const seasonRaw = principal.seasons?.[0] || 'ORDINARY_TIME';
        let season = ROMCAL_MAP[seasonRaw.toUpperCase()] || seasonRaw.toUpperCase();
        if (principal.periods?.includes('HOLY_WEEK')) season = 'HOLY_WEEK';

        if (season === 'ORDINARY_TIME') {
          const sortedDates = Object.keys(data).sort();
          let ordinaryBlock = 1;
          for (const d of sortedDates) {
            if (d === today) break;
            const ev = data[d][0];
            if (!ev) continue;
            const sRaw = ev.seasons?.[0] || 'ORDINARY_TIME';
            let s = ROMCAL_MAP[sRaw.toUpperCase()] || sRaw.toUpperCase();
            if (ev.periods?.includes('HOLY_WEEK')) s = 'HOLY_WEEK';
            if (s === 'EASTER') ordinaryBlock = 2;
          }
          setTimeout(() => {
            setSelectedSeason(ordinaryBlock === 1 ? 'ORDINARY_TIME_1' : 'ORDINARY_TIME_2');
          }, 0);
        } else {
          setTimeout(() => {
            setSelectedSeason(season);
          }, 0);
        }
      }
    }
  }, [data, loading, selectedSeason]);

  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    generateData(newYear, language);
  };

  useEffect(() => {
    generateData(selectedYear, language);
  }, [selectedYear, language, generateData]);

  // Sync currentWeekStart when selectedYear changes
  useEffect(() => {
    const weekYear = currentWeekStart.getFullYear();
    if (weekYear !== selectedYear) {
      const newDate = new Date(currentWeekStart);
      newDate.setFullYear(selectedYear);
      setTimeout(() => {
        setCurrentWeekStart(startOfWeek(newDate, { weekStartsOn: 0 }));
      }, 0);
    }
  }, [selectedYear, currentWeekStart]);

  const [portalCenter, setPortalCenter] = useState<HTMLElement | null>(null);
  const [portalRight, setPortalRight] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const elCenter = document.getElementById('header-portal-center');
      const elRight = document.getElementById('header-portal-right');
      if (elCenter) setPortalCenter(elCenter);
      if (elRight) setPortalRight(elRight);
      if (elCenter && elRight) clearInterval(timer);
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
  }, [loading, data, shouldScrollToToday, scrollToToday]);

  // Scroll to today when switching tabs (but skip the very first render)
  const prevTabRef = useRef<string | null>(null);
  useEffect(() => {
    if (prevTabRef.current !== null && prevTabRef.current !== activeTab) {
      // Give the new tab content time to mount before scrolling
      const timer = setTimeout(() => performScroll('today'), 300);
      return () => clearTimeout(timer);
    }
    prevTabRef.current = activeTab;
  }, [activeTab]);

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
    const currentLocale = language === 'la' ? la : es;
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
      <div className="flex-1 w-full bg-[#fdfbf7] py-6 sm:py-8 overflow-x-hidden">
        <div className="w-full mx-auto px-0 sm:px-12 overflow-visible">
          <Tabs
            defaultValue="year"
            className="w-full overflow-visible"
            onValueChange={(v) => setActiveTab(v as 'year' | 'seasons' | 'week')}
          >
            {portalRight &&
              createPortal(
                <TabsList className="flex w-fit shadow-sm border border-stone-200/50 bg-white/50 backdrop-blur-sm">
                  <TabsTrigger value="year" className="text-[10px] sm:text-xs px-2">
                    {language === 'la' ? 'Annus' : 'Año'}
                  </TabsTrigger>
                  <TabsTrigger value="seasons" className="text-[10px] sm:text-xs px-2">
                    {language === 'la' ? 'Tempus' : 'Tiempo'}
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-[10px] sm:text-xs px-2">
                    {language === 'la' ? 'Hebdomada' : 'Semana'}
                  </TabsTrigger>
                </TabsList>,
                portalRight
              )}

            <TabsContent
              value="year"
              className="focus-visible:outline-none px-4 sm:px-0 mt-0 overflow-visible"
            >
              {portalCenter &&
                createPortal(
                  <SecondHeader
                    view="year"
                    year={selectedYear}
                    onYearChange={handleYearChange}
                    language={language}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                  />,
                  portalCenter
                )}
              <div className="w-full max-w-7xl mx-auto px-4 md:px-8 overflow-visible mt-8">
                <LiturgicalCalendarView
                  data={data}
                  language={language}
                  selectedDate={selectedDate}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="seasons"
              className="focus-visible:outline-none px-4 sm:px-0 mt-0 overflow-visible"
            >
              {portalCenter &&
                createPortal(
                  <SecondHeader
                    view="year"
                    year={selectedYear}
                    onYearChange={handleYearChange}
                    language={language}
                    season={selectedSeason}
                    onSeasonChange={setSelectedSeason}
                  />,
                  portalCenter
                )}
              <div className="w-full max-w-7xl mx-auto px-4 md:px-8 overflow-visible">
                <LiturgicalSeasonView
                  data={data}
                  loading={loading}
                  language={language}
                  seasonFilter={selectedSeason}
                />
              </div>
            </TabsContent>

            <TabsContent value="week" className="focus-visible:outline-none px-0 sm:px-0 mt-0">
              {portalCenter &&
                createPortal(
                  <SecondHeader
                    view="week"
                    year={selectedYear}
                    onYearChange={setSelectedYear}
                    language={language}
                    displayMonth={displayMonth}
                    displayWeekInfo={headerInfo?.text}
                    onPrevWeek={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
                    onNextWeek={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
                    theme={headerInfo?.theme}
                  />,
                  portalCenter
                )}
              <div className="w-full">
                <WeeklyView
                  data={data}
                  loading={loading}
                  language={language}
                  currentWeekStart={currentWeekStart}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Floating Buttons Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Search Button */}
        <FloatingActionButton
          icon={<Search />}
          label={language === 'la' ? 'FESTIVITATES' : 'FESTIVIDADES'}
          onClick={() => setIsSearchOpen(true)}
          variant="primary"
        />

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
              {format(new Date(), 'MMM', { locale: language === 'la' ? la : es }).toUpperCase()}
            </span>
            <span className="text-lg font-black leading-none">{new Date().getDate()}</span>
          </div>
          <span className="absolute right-full mr-4 px-2 py-1 bg-[#2d1a1a] text-white text-xs font-serif rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10 italic pointer-events-none">
            {language === 'la' ? 'Hodie' : 'Hoy'}
          </span>
        </button>

        {/* Back Button */}
        <FloatingActionButton
          icon={<ArrowLeft />}
          label={language === 'la' ? 'INITIUM' : 'ATRÁS'}
          onClick={() => navigate('/')}
          variant="ghost"
        />
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
