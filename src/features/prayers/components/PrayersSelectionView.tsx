import React from 'react';
import { cn } from '@shared/lib/utils';
import { type LiturgicalTimePrayerType, liturgicalTimePrayerTypes } from '../types/prayerTypes';

interface PrayersSelectionViewProps {
  language: 'es' | 'la';
  prayersWithJsonCount: Record<string, number>;
  onSelectTimeType: (timeType: LiturgicalTimePrayerType) => void;
}

export const PrayersSelectionView: React.FC<PrayersSelectionViewProps> = ({
  language,
  prayersWithJsonCount,
  onSelectTimeType,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-7xl mx-auto mt-6 px-4">
      {liturgicalTimePrayerTypes.map((timeType) => {
        const count = prayersWithJsonCount[timeType.id] || 0;
        if (count === 0 && timeType.id !== 'ANY') return null;

        return (
          <button
            key={timeType.id}
            onClick={() => onSelectTimeType(timeType)}
            className={cn(
              'group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl overflow-hidden bg-white/40 backdrop-blur-sm',
              timeType.borderClass,
              'hover:bg-white/80 text-left'
            )}
          >
            {/* Background Decorative Emoji */}
            <span className="absolute -right-6 -bottom-6 text-7xl opacity-5 blur-sm group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
              {timeType.emoji}
            </span>

            <div
              className={cn(
                'w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform duration-500 group-hover:scale-110',
                timeType.bgClass
              )}
            >
              {timeType.emoji}
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3
                  className={cn(
                    'text-xl font-bold tracking-tight leading-tight',
                    timeType.textClass
                  )}
                >
                  {timeType.title[language] ?? timeType.title.es}
                </h3>
                <div
                  className={cn(
                    'shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-xs',
                    timeType.bgClass,
                    timeType.textClass,
                    'opacity-80'
                  )}
                >
                  {count}
                </div>
              </div>

              <p className="text-xl text-stone-500 font-serif leading-snug opacity-90 line-clamp-2">
                {timeType.description[language] ?? timeType.description.es}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
