import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import {
  liturgicalTimePrayerTypes,
  type LiturgicalTimePrayerType,
} from '@features/prayers/types/prayerTypes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@ui/collapsible';

interface PrayersHeaderProps {
  language: 'es' | 'la';
  viewMode: 'SELECTION' | 'LIST' | 'READ';
  selectedTimeType: LiturgicalTimePrayerType | null;
  selectedPrayerTitle: string | null;
  onTimeTypeChange: (timeType: LiturgicalTimePrayerType | null) => void;
  onViewModeChange: (mode: 'SELECTION' | 'LIST' | 'READ') => void;
  prayersWithJsonCount: Record<string, number>;
}

export default function PrayersHeader({
  language,
  viewMode,
  selectedTimeType,
  selectedPrayerTitle,
  onTimeTypeChange,
  onViewModeChange,
  prayersWithJsonCount,
}: PrayersHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const displayTitle = useMemo(() => {
    if (!selectedTimeType) return language === 'la' ? 'Tiempos Litúrgicos' : 'Tiempos Litúrgicos';
    return selectedTimeType.title[language] ?? selectedTimeType.title.es;
  }, [selectedTimeType, language]);

  const activeTheme = selectedTimeType;

  return (
    <div className="flex items-center justify-center gap-2 animate-in fade-in duration-300 w-full flex-wrap">
      <div className="flex flex-col items-center">
        <button
          onClick={() => {
            onTimeTypeChange(null);
            onViewModeChange('SELECTION');
          }}
          className={cn(
            'text-base sm:text-lg md:text-xl font-bold tracking-tight transition-colors hover:text-[#8B0000] shrink-0',
            viewMode === 'SELECTION' ? 'text-[#3d0c0c]' : 'text-[#3d0c0c]/60'
          )}
        >
          {language === 'la' ? 'Orationes' : 'Oraciones'}
        </button>
        {viewMode === 'SELECTION' && (
          <span className="text-[14px] sm:text-xl italic text-[#3d0c0c]/60 font-serif -mt-0.5">
            {language === 'la'
              ? 'Ad Te, Domine, levavi animam meam'
              : 'A ti, Señor, levanto mi alma'}
          </span>
        )}
      </div>

      {/* Separator / Breadcrumb arrow */}
      {(selectedTimeType || viewMode !== 'SELECTION') && (
        <span className="text-[#c49b9b] opacity-40 text-xs font-bold">/</span>
      )}

      {/* Category Picker / Breadcrumb item */}
      {(selectedTimeType || viewMode !== 'SELECTION') && (
        <Collapsible
          key={selectedTimeType?.id || 'none'}
          open={isOpen}
          onOpenChange={setIsOpen}
          className="relative"
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1.5 group outline-none">
              <span
                className={cn(
                  'text-base sm:text-lg md:text-xl font-bold tracking-tight transition-colors group-hover:text-[#8B0000] truncate max-w-[120px] sm:max-w-[200px] md:max-w-none',
                  activeTheme ? activeTheme.textClass : 'text-[#3d0c0c]'
                )}
              >
                {displayTitle}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-300 opacity-50',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="absolute top-[calc(100%+12px)] left-0 w-[240px] md:w-[280px] bg-white rounded-xl shadow-2xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-100">
            <div className="flex flex-col max-h-[350px] overflow-y-auto py-1 divide-y divide-[#c49b9b]/10">
              {liturgicalTimePrayerTypes.map((timeType) => {
                const hasPrayers = prayersWithJsonCount[timeType.id] > 0;
                if (!hasPrayers) return null;
                const isSelected = selectedTimeType?.id === timeType.id;

                return (
                  <button
                    key={timeType.id}
                    onClick={() => {
                      onTimeTypeChange(timeType);
                      onViewModeChange('LIST');
                      setIsOpen(false);
                    }}
                    className={cn(
                      'px-4 py-3 flex items-center gap-3 text-left hover:bg-stone-50 transition-colors border-l-4 w-full',
                      isSelected ? 'bg-stone-50' : ''
                    )}
                    style={{
                      borderLeftColor: isSelected ? timeType.hex : 'transparent',
                      backgroundColor: isSelected ? `${timeType.hex}10` : '',
                    }}
                  >
                    <span className="text-xl">{timeType.emoji}</span>
                    <div className="flex flex-col flex-1">
                      <span
                        className={cn(
                          'text-sm font-bold leading-tight',
                          isSelected ? timeType.textClass : 'text-stone-700'
                        )}
                      >
                        {timeType.title[language] ?? timeType.title.es}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Prayer Title breadcrumb item */}
      {viewMode === 'READ' && selectedPrayerTitle && (
        <>
          <span className="text-[#c49b9b] opacity-40 text-xs font-bold">/</span>
          <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#8B0000] truncate max-w-[100px] sm:max-w-[200px] md:max-w-[300px]">
            {selectedPrayerTitle}
          </span>
        </>
      )}
    </div>
  );
}
