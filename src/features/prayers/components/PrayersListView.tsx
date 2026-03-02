import React from 'react';
import { BookOpen } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { type LiturgicalTimePrayerType, liturgicalTimePrayerTypes } from '../types/prayerTypes';
import type { Prayer } from '../services/prayerService';

interface PrayersListViewProps {
  language: 'es' | 'la';
  selectedTimeType: LiturgicalTimePrayerType | null;
  prayers: Prayer[];
  prayersWithJsonCount: Record<string, number>;
  onSelectPrayer: (id: string) => void;
}

export const PrayersListView: React.FC<PrayersListViewProps> = ({
  language,
  selectedTimeType,
  prayers,
  prayersWithJsonCount,
  onSelectPrayer,
}) => {
  if (!selectedTimeType) {
    return (
      <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
        {liturgicalTimePrayerTypes.map((timeType) => {
          if (prayersWithJsonCount[timeType.id] === 0) return null;
          return (
            <div
              key={timeType.id}
              className="rounded-2xl overflow-hidden border border-[#c49b9b]/20 shadow-sm mt-6"
            >
              <div
                className={cn(
                  'px-4 py-3 border-b flex items-center gap-2',
                  timeType.bgClass,
                  timeType.borderClass
                )}
              >
                <span className="text-xl">{timeType.emoji}</span>
                <div>
                  <h3 className={cn('text-sm font-bold tracking-wider', timeType.textClass)}>
                    {timeType.title[language] ?? timeType.title.es}
                  </h3>
                  <p className={cn('text-xs font-serif opacity-70', timeType.textClass)}>
                    {timeType.description[language] ?? timeType.description.es}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-[#c49b9b]/10 bg-white">
                {prayers
                  .filter((prayer) => prayer.seasons?.includes(timeType.id))
                  .map((prayer) => (
                    <button
                      key={prayer.id}
                      onClick={() => onSelectPrayer(prayer.id)}
                      className="w-full flex items-center gap-4 px-4 py-3.5 md:py-4 hover:bg-[#8B0000]/5 transition-colors group text-left"
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0 opacity-60"
                        style={{ backgroundColor: timeType.hex }}
                      />
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <span className="font-semibold text-[#3d0c0c] text-sm md:text-base">
                          {language === 'la' && prayer.title.la ? prayer.title.la : prayer.title.es}
                        </span>
                        <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8B0000]/40 shrink-0" />
                      </div>
                      <span className="text-[#8B0000]/30 group-hover:text-[#8B0000]/70 transition-colors shrink-0 ml-2">
                        →
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2
          className={cn(
            'text-2xl font-bold tracking-tight italic font-serif',
            selectedTimeType.textClass
          )}
        >
          {selectedTimeType.title[language]}
        </h2>
      </div>
      <div className="rounded-2xl overflow-hidden border border-[#c49b9b]/20 shadow-sm bg-white divide-y divide-[#c49b9b]/10">
        {prayers
          .filter((prayer) => prayer.seasons?.includes(selectedTimeType.id))
          .map((prayer) => (
            <button
              key={prayer.id}
              onClick={() => onSelectPrayer(prayer.id)}
              className="w-full flex items-center gap-4 px-4 py-3.5 bg-white hover:bg-[#8B0000]/5 transition-colors group text-left"
            >
              <div
                className="w-2 h-2 rounded-full shrink-0 opacity-60"
                style={{ backgroundColor: selectedTimeType.hex }}
              />
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="font-semibold text-[#3d0c0c] text-xl">
                  {language === 'la' && prayer.title.la ? prayer.title.la : prayer.title.es}
                </span>
                <BookOpen className="w-3.5 h-3.5 text-[#8B0000]/40 shrink-0" />
              </div>
              <span className="text-[#8B0000]/30 group-hover:text-[#8B0000]/70 transition-colors shrink-0 ml-2">
                →
              </span>
            </button>
          ))}
      </div>
    </div>
  );
};
