import React, { useEffect, useMemo, useRef } from 'react';
import { useLayout } from '@app/layout/LayoutContext';
import { ArrowLeft, Loader2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLectionary } from './hooks/useLectionary';
import { MassReading } from './components/MassReading';
import SecondHeader from './layout/SecondHeader';
import { useTTS } from '@shared/hooks/useTTS';
import { FloatingTTSButton, Fab as FloatingActionButton } from '@shared/components/buttons/Fab';

interface PageProps {
  language: 'es' | 'la';
}

const Page: React.FC<PageProps> = ({ language }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState(() => new Date());
  const { readings, loading, error } = useLectionary(selectedDate, language);
  const { setHeaderProps } = useLayout();

  useEffect(() => {
    if (readings?.liturgicalDay) {
      setHeaderProps({
        pageTitle: language === 'la' ? 'Sancta Missa' : 'Santa Misa',
      });
    }
  }, [readings, language, setHeaderProps]);

  const { speak, pause, resume, stop, isPlaying, isPaused } = useTTS();

  const textToSpeak = useMemo(() => {
    if (!readings) return '';
    const parts = [];
    if (readings.firstReading) {
      parts.push(readings.firstReading.title);
      parts.push(readings.firstReading.text);
    }
    if (readings.psalm) {
      parts.push(readings.psalm.title);
      parts.push(readings.psalm.text);
    }
    if (readings.secondReading) {
      parts.push(readings.secondReading.title);
      parts.push(readings.secondReading.text);
    }
    if (readings.gospel) {
      parts.push(readings.gospel.title);
      parts.push(readings.gospel.text);
    }
    return parts.join(' ');
  }, [readings]);

  const lastSpokenRef = useRef<{ text: string; lang: string } | null>(null);

  useEffect(() => {
    if (isPlaying && !isPaused && textToSpeak) {
      if (lastSpokenRef.current?.text === textToSpeak && lastSpokenRef.current?.lang === language) {
        return;
      }
      speak(textToSpeak, language);
      lastSpokenRef.current = { text: textToSpeak, lang: language };
    }
    if (!isPlaying) {
      lastSpokenRef.current = null;
    }
  }, [language, textToSpeak, speak, isPlaying, isPaused]);

  const handlePlay = () => {
    if (textToSpeak) {
      speak(textToSpeak, language);
    }
  };

  const handleBack = () => navigate('/');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4 opacity-50" />
        <p className="font-serif italic text-primary/60 animate-pulse text-lg">
          {language === 'la' ? 'Lectio paratur...' : 'Preparando la lectura...'}
        </p>
      </div>
    );
  }

  if (error || !readings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Info className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-2xl font-serif text-red-900 mb-2">
          {language === 'la' ? 'Error occurrit' : 'Ha ocurrido un error'}
        </h3>
        <p className="text-red-700/70 font-serif italic max-w-md">
          {error ||
            (language === 'la' ? 'Lectiones non inventæ' : 'No se han encontrado las lecturas')}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-2 bg-red-800 text-white rounded-lg font-serif hover:bg-red-900 transition-colors"
        >
          {language === 'la' ? 'Iterum probare' : 'Reintentar'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <SecondHeader
        liturgicalDay={readings.liturgicalDay}
        language={language}
        onDateChange={setSelectedDate}
      />
      <div className="flex-1 w-full bg-[#fdfbf7] py-8 md:py-12">
        {readings.firstReading && <MassReading reading={readings.firstReading} />}
        {readings.psalm && <MassReading reading={readings.psalm} />}
        {readings.secondReading && <MassReading reading={readings.secondReading} />}
        {readings.gospel && <MassReading reading={readings.gospel} />}
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <FloatingTTSButton
          isPlaying={isPlaying}
          isPaused={isPaused}
          onPlay={handlePlay}
          onPause={pause}
          onResume={resume}
          onStop={stop}
          language={language}
        />

        <FloatingActionButton
          icon={<ArrowLeft />}
          label={language === 'la' ? 'INITIUM' : 'ATRÁS'}
          onClick={handleBack}
          variant="ghost"
          iconAnimation="group-hover:-translate-x-1"
        />
      </div>
    </div>
  );
};

export default Page;
