import React, { useEffect } from 'react';
import { useLayout } from '@app/layout/LayoutContext';
import { ArrowLeft, Loader2, Info, Search, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLectionary } from './hooks/useLectionary';
import { MassReading } from './components/MassReading';
import SecondHeader from './layout/SecondHeader';
import { useTTS } from '@shared/hooks/useTTS';
import { FloatingTTSButton, Fab as FloatingActionButton } from '@shared/components/buttons/Fab';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { la } from '@shared/lib/locales';
import { useCalendar } from '@features/calendar/hooks/useCalendar';
import CalendarCommandPalette from '@features/calendar/components/search/CalendarCommandPalette';
import MassReadingSearch from './components/search/MassReadingSearch';

interface PageProps {
  language: 'es' | 'la';
}

const Page: React.FC<PageProps> = ({ language }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState(() => new Date());
  const [isFestivitySearchOpen, setIsFestivitySearchOpen] = React.useState(false);
  const [isTextSearchOpen, setIsTextSearchOpen] = React.useState(false);
  const { readings, loading, error, liturgicalDay } = useLectionary(selectedDate, language);
  const { data, generateData } = useCalendar();
  const { setHeaderProps } = useLayout();

  const { speak, pause, resume, stop, isPlaying, isPaused } = useTTS();

  useEffect(() => {
    generateData(selectedDate.getFullYear(), language);
  }, [selectedDate, language, generateData]);

  useEffect(() => {
    if (liturgicalDay) {
      setHeaderProps({
        pageTitle: (
          <SecondHeader
            language={language}
            liturgicalDay={liturgicalDay}
            onDateChange={setSelectedDate}
          />
        ),
        centerChildren: true,
      });
    }
  }, [language, liturgicalDay, setHeaderProps]);

  const handlePlay = () => {
    if (readings) {
      const parts = [
        readings.firstReading,
        readings.psalm,
        readings.secondReading,
        readings.gospel,
      ].filter(Boolean);

      const allText = parts.map((r) => `${r!.title}. ${r!.text}`).join(' ');
      speak(allText, language);
    }
  };

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(new Date(dateStr));
    setIsFestivitySearchOpen(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  const readingList = React.useMemo(() => {
    if (!readings) return [];
    return [
      { id: 'first-reading', data: readings.firstReading },
      { id: 'psalm', data: readings.psalm },
      { id: 'second-reading', data: readings.secondReading },
      { id: 'gospel', data: readings.gospel },
    ].filter((item) => !!item.data);
  }, [readings]);

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 w-full bg-[#fdfbf7] py-6 sm:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 animate-pulse">
              <Loader2 className="w-12 h-12 text-[#8B0000] animate-spin mb-4" />
              <p className="font-serif italic text-[#522b2b] text-lg">
                {language === 'la' ? 'Oremus...' : 'Cargando lecturas...'}
              </p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-800 bg-red-50 rounded-2xl border border-red-100 flex flex-col items-center gap-4">
              <Info className="w-10 h-10 text-red-500" />
              <p className="font-serif text-lg">{error}</p>
            </div>
          ) : readings ? (
            <div className="flex flex-col gap-12">
              {readingList.map((item) => (
                <MassReading key={item.id} reading={item.data!} id={item.id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[#522b2b]/60 font-serif italic text-lg">
              {language === 'la' ? 'Nullae lectiones inventae.' : 'No se encontraron lecturas.'}
            </div>
          )}
        </div>
      </main>

      {/* ── FABs ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {readings && (
          <FloatingTTSButton
            isPlaying={isPlaying}
            isPaused={isPaused}
            onPlay={handlePlay}
            onPause={pause}
            onResume={resume}
            onStop={stop}
            language={language}
          />
        )}

        <FloatingActionButton
          icon={<Search />}
          label={language === 'la' ? 'FESTIVITATES' : 'FESTIVIDADES'}
          onClick={() => setIsFestivitySearchOpen(true)}
          variant="primary"
        />

        <FloatingActionButton
          icon={<FileText className="w-6 h-6" />}
          label={language === 'la' ? 'TEXTUS' : 'TEXTO'}
          onClick={() => setIsTextSearchOpen(true)}
          variant="accent"
        />

        <FloatingActionButton
          icon={
            <div className="flex flex-col items-center justify-center relative scale-90 md:scale-100 font-sans">
              <span className="text-[10px] font-bold leading-none mb-0.5">
                {format(new Date(), 'MMM', { locale: language === 'la' ? la : es }).toUpperCase()}
              </span>
              <span className="text-lg font-black leading-none">{new Date().getDate()}</span>
            </div>
          }
          label={language === 'la' ? 'HODIE' : 'HOY'}
          onClick={() => setSelectedDate(new Date())}
          variant="brown"
        />

        <FloatingActionButton
          icon={<ArrowLeft />}
          label={language === 'la' ? 'INITIUM' : 'ATRÁS'}
          onClick={handleBack}
          variant="ghost"
          iconAnimation="group-hover:-translate-x-1"
        />
      </div>

      <CalendarCommandPalette
        open={isFestivitySearchOpen}
        onOpenChange={setIsFestivitySearchOpen}
        data={data}
        language={language}
        onSelectDate={handleSelectDate}
      />

      <MassReadingSearch
        open={isTextSearchOpen}
        onOpenChange={setIsTextSearchOpen}
        readings={readings}
        language={language}
      />
    </div>
  );
};

export default Page;
