import { useState, useMemo, useEffect } from 'react';
import { useLayout } from '@app/layout/AppLayout';
import PrayersCommandPalette from '@features/prayers/components/PrayersCommandPalette';
import { Shuffle, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@shared/lib/utils';
import PrayersHeader from '@features/prayers/components/PrayersHeader';
import {
  liturgicalTimePrayerTypes,
  type LiturgicalTimePrayerType,
} from '@features/prayers/types/prayerTypes';
import { prayerService } from '../services/prayerService';
import { PrayersSelectionView } from '../components/PrayersSelectionView';
import { PrayersListView } from '../components/PrayersListView';
import { PrayersReadView } from '../components/PrayersReadView';

interface PrayersPageProps {
  language: 'es' | 'la';
}

export default function PrayersPage({ language }: PrayersPageProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'SELECTION' | 'LIST' | 'READ'>('SELECTION');
  const [selectedPrayerId, setSelectedPrayerId] = useState<string | null>(null);
  const [selectedTimeType, setSelectedTimeType] = useState<LiturgicalTimePrayerType | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { setHeaderProps } = useLayout();

  const prayers = useMemo(() => prayerService.getPrayers(), []);

  const selectedPrayer = useMemo(
    () => (selectedPrayerId ? prayerService.getPrayerById(selectedPrayerId) : null),
    [selectedPrayerId]
  );

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
            <PrayersSelectionView
              language={language}
              prayersWithJsonCount={prayersWithJsonCount}
              onSelectTimeType={handleSelectTimeType}
            />
          )}

          {viewMode === 'LIST' && (
            <PrayersListView
              language={language}
              selectedTimeType={selectedTimeType}
              prayers={prayers}
              prayersWithJsonCount={prayersWithJsonCount}
              onSelectPrayer={handleSelectPrayer}
            />
          )}

          {viewMode === 'READ' && selectedPrayer && (
            <PrayersReadView language={language} selectedPrayer={selectedPrayer} />
          )}
        </div>
      </main>

      {/* ── FABs ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-center w-14 h-14 text-white rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 group relative bg-linear-to-r from-[#8B0000] to-[#522b2b] shadow-[#8B0000]/30"
          title={language === 'la' ? 'Index' : 'Contenido'}
        >
          <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="absolute right-full mr-4 px-2 py-1 bg-[#2d1a1a] text-white text-xs font-serif rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10 italic pointer-events-none">
            {language === 'la' ? 'Invenire Orationem' : 'Buscar Oración'}
          </span>
        </button>

        {viewMode === 'READ' && (
          <button
            onClick={handleRandom}
            className="flex items-center justify-center w-14 h-14 text-white rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 group relative bg-linear-to-r from-[#5c4033] to-[#2d1a1a] shadow-[#5c4033]/30"
            title={language === 'la' ? 'Temere' : 'Aleatorio'}
          >
            <Shuffle className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
            <span className="absolute right-full mr-4 px-2 py-1 bg-[#2d1a1a] text-white text-xs font-serif rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10 italic pointer-events-none">
              {language === 'la' ? 'Temere' : 'Aleatorio'}
            </span>
          </button>
        )}

        <button
          onClick={handleBack}
          className={cn(
            'flex items-center justify-center w-14 h-14 rounded-full shadow-xl hover:scale-105 transition-all active:scale-95 group relative border border-stone-200',
            'bg-white/80 backdrop-blur-sm bg-linear-to-b from-stone-50 to-white text-slate-700'
          )}
          title={language === 'la' ? 'Retro' : 'Atrás'}
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform text-[#8B0000]" />
          <span className="absolute right-full mr-4 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
            {language === 'la' ? 'RETRO' : 'ATRÁS'}
          </span>
        </button>
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
