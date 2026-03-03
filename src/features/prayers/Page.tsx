import { useState, useMemo, useEffect, useRef } from 'react';
import { useLayout } from '@app/layout/LayoutContext';
import PrayersCommandPalette from './components/search/PrayersCommandPalette';
import { Shuffle, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrayersHeader from './components/layout/PrayersHeader';
import {
  liturgicalTimePrayerTypes,
  type LiturgicalTimePrayerType,
} from '@features/prayers/types/prayerTypes';
import { prayerService } from './services/prayerService';
import PrayerSelector from './components/list/PrayerSelector';
import PrayersList from './components/list/PrayersList';
import PrayerReaderContainer from './components/reader/PrayerReader.container';
import { useTTS } from '@shared/hooks/useTTS';
import { FloatingTTSButton, Fab as FloatingActionButton } from '@shared/components/buttons/Fab';

interface PageProps {
  language: 'es' | 'la';
}

export default function Page({ language }: PageProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'SELECTION' | 'LIST' | 'READ'>('SELECTION');
  const [selectedPrayerId, setSelectedPrayerId] = useState<string | null>(null);
  const [selectedTimeType, setSelectedTimeType] = useState<LiturgicalTimePrayerType | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { setHeaderProps } = useLayout();

  const { speak, pause, resume, stop, isPlaying, isPaused } = useTTS();

  const prayers = useMemo(() => prayerService.getPrayers(), []);

  const selectedPrayer = useMemo(
    () => (selectedPrayerId ? prayerService.getPrayerById(selectedPrayerId) : null),
    [selectedPrayerId]
  );

  const lastSpokenRef = useRef<{ text: string; lang: string } | null>(null);

  useEffect(() => {
    if (isPlaying && !isPaused && selectedPrayer) {
      const fullText = selectedPrayer.content[language].join(' ');
      if (lastSpokenRef.current?.text === fullText && lastSpokenRef.current?.lang === language) {
        return;
      }
      speak(fullText, language);
      lastSpokenRef.current = { text: fullText, lang: language };
    }
    if (!isPlaying) {
      lastSpokenRef.current = null;
    }
  }, [language, selectedPrayer, speak, isPlaying, isPaused]);

  const handlePlay = () => {
    if (selectedPrayer) {
      const fullText = selectedPrayer.content[language].join(' ');
      speak(fullText, language);
    }
  };

  const prayersWithJsonCount = useMemo(() => {
    const countMap: Record<string, number> = {};
    liturgicalTimePrayerTypes.forEach((timeType) => {
      countMap[timeType.id] = prayers.filter((prayer) =>
        prayer.seasons?.includes(timeType.id)
      ).length;
    });
    return countMap;
  }, [prayers]);

  useEffect(() => {
    setHeaderProps({
      pageTitle: (
        <PrayersHeader
          language={language}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedTimeType={selectedTimeType}
          selectedPrayerTitle={
            selectedPrayer
              ? language === 'la' && selectedPrayer.title.la
                ? selectedPrayer.title.la
                : selectedPrayer.title.es
              : null
          }
          onTimeTypeChange={setSelectedTimeType}
          prayersWithJsonCount={prayersWithJsonCount}
        />
      ),
      centerChildren: false,
    });
  }, [language, viewMode, selectedTimeType, selectedPrayer, prayersWithJsonCount, setHeaderProps]);

  const handleSelectTimeType = (timeType: LiturgicalTimePrayerType) => {
    setSelectedTimeType(timeType);
    setViewMode('LIST');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPrayer = (id: string) => {
    setSelectedPrayerId(id);
    setViewMode('READ');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRandom = () => {
    const randomPrayer = prayerService.getRandomPrayer();
    handleSelectPrayer(randomPrayer.id);
  };

  const handleBack = () => {
    if (viewMode === 'READ') setViewMode('LIST');
    else if (viewMode === 'LIST') setViewMode('SELECTION');
    else navigate('/');
  };

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 w-full bg-[#fdfbf7] py-6 sm:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          {viewMode === 'SELECTION' && (
            <PrayerSelector
              language={language}
              prayersWithJsonCount={prayersWithJsonCount}
              onSelectTimeType={handleSelectTimeType}
            />
          )}

          {viewMode === 'LIST' && (
            <PrayersList
              language={language}
              selectedTimeType={selectedTimeType}
              prayers={prayers}
              prayersWithJsonCount={prayersWithJsonCount}
              onSelectPrayer={handleSelectPrayer}
            />
          )}

          {viewMode === 'READ' && selectedPrayer && (
            <PrayerReaderContainer language={language} selectedPrayer={selectedPrayer} />
          )}
        </div>
      </main>

      {/* ── FABs ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {viewMode === 'READ' && selectedPrayer && (
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
          onClick={() => setIsSearchOpen(true)}
          icon={<Search />}
          label={language === 'la' ? 'Invenire Orationem' : 'Buscar Oración'}
          variant="accent"
        />

        {viewMode === 'READ' && (
          <FloatingActionButton
            onClick={handleRandom}
            icon={<Shuffle />}
            label={language === 'la' ? 'Temere' : 'Aleatorio'}
            variant="brown"
            iconAnimation="group-hover:rotate-180 duration-500"
          />
        )}

        <FloatingActionButton
          onClick={handleBack}
          icon={<ArrowLeft />}
          label={language === 'la' ? 'RETRO' : 'ATRÁS'}
          variant="ghost"
          iconAnimation="group-hover:-translate-x-1"
        />
      </div>

      <PrayersCommandPalette
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        onSelect={handleSelectPrayer}
        language={language}
        prayers={prayers}
      />
    </div>
  );
}
