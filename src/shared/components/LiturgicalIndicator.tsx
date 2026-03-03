import { useEffect, useState, useMemo } from 'react';
import { getLiturgicalDayInfo, normalizeLiturgicalColor } from '../lib/liturgy-engine';
import type { LiturgicalDay } from '../types';
import { SEASON_INFO, ROMCAL_MAP, RANK_MAP, CYCLE_MAP } from '../constants/config';
import { cn } from '../lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@ui/hover-card';
import { StoleIcon } from './icons/StoleIcon';

interface LiturgicalIndicatorProps {
  language: 'es' | 'la';
  activeYear?: number;
  showTitle?: boolean;
}

export default function LiturgicalIndicator({
  language,
  showTitle = false,
}: LiturgicalIndicatorProps) {
  const [todayEntry, setTodayEntry] = useState<LiturgicalDay | null>(null);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    getLiturgicalDayInfo(todayStr, language)
      .then((day) => {
        setTodayEntry(day);
      })
      .catch(() => {
        setTodayEntry(null);
      });
  }, [language]);

  const liturgicalInfo = useMemo(() => {
    if (!todayEntry) return null;

    const { theme } = normalizeLiturgicalColor(todayEntry);

    // Season determination
    const seasonKey = todayEntry.seasons[0]?.toUpperCase() || '';
    const mappedSeasonKey = ROMCAL_MAP[seasonKey] || seasonKey;

    // Custom check for Ordinary Time 1 vs 2 if possible, or just use general
    const primarySeason = SEASON_INFO[mappedSeasonKey] ||
      SEASON_INFO['ORDINARY_TIME_1'] || {
        // default
        title: todayEntry.seasonNames[0],
        latTitle: todayEntry.seasonNames[0],
      };

    const localizedRank = RANK_MAP[language]?.[todayEntry.rank.toUpperCase()] || todayEntry.rank;

    const sundayCycleKey = todayEntry.cycles?.sundayCycle || '';
    const weekdayCycleKey = todayEntry.cycles?.weekdayCycle || '';

    const localizedSundayCycle = CYCLE_MAP[language]?.[sundayCycleKey] || sundayCycleKey;
    const localizedWeekdayCycle = CYCLE_MAP[language]?.[weekdayCycleKey] || weekdayCycleKey;

    return {
      name: todayEntry.name,
      season: language === 'la' ? primarySeason.latTitle : primarySeason.title,
      color: theme.hex,
      theme,
      rank: localizedRank,
      sundayCycle: localizedSundayCycle,
      weekdayCycle: localizedWeekdayCycle,
    };
  }, [todayEntry, language]);

  if (!liturgicalInfo) return null;

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-4 group cursor-help py-1">
          <div className="relative transform transition-transform group-hover:scale-110 duration-500 shrink-0">
            <StoleIcon color={liturgicalInfo.color} className="drop-shadow-sm" />
          </div>
          <div className="flex flex-col items-start leading-none gap-1.5">
            {showTitle && (
              <h1 className="text-2xl font-black tracking-tighter text-[#3d0c0c] leading-none mb-0.5">
                <span className="bg-linear-to-r from-[#8B0000] to-[#3d0c0c] bg-clip-text text-transparent">
                  Iter Catholicum
                </span>
              </h1>
            )}
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'text-sm md:text-base font-black tracking-tight font-serif whitespace-nowrap',
                  liturgicalInfo.theme.text
                )}
              >
                {liturgicalInfo.season}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] md:text-[10px] px-1.5 py-0 bg-[#8B0000]/5 text-[#8B0000]/60 border border-[#8B0000]/10 rounded font-bold whitespace-nowrap leading-tight">
                  {liturgicalInfo.sundayCycle}
                </span>
                <span className="text-[9px] md:text-[10px] px-1.5 py-0 bg-stone-100/50 text-[#3d0c0c]/60 border border-stone-200/50 rounded font-bold whitespace-nowrap leading-tight">
                  {liturgicalInfo.weekdayCycle}
                </span>
              </div>
            </div>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="bg-[#fdfbf7] border-[#c49b9b] text-[#3d0c0c] font-serif shadow-xl w-64 p-3">
        <div className="text-xs space-y-1.5">
          <p className="font-bold underline text-sm">{liturgicalInfo.name}</p>
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: liturgicalInfo.color }}
              />
              <p className="opacity-80 italic font-medium">{liturgicalInfo.rank}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] px-1.5 py-0.5 bg-[#8B0000]/10 text-[#8B0000] rounded font-bold">
                {liturgicalInfo.sundayCycle}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded font-bold">
                {liturgicalInfo.weekdayCycle}
              </span>
            </div>
          </div>
          <p className="text-[10px] pt-1 opacity-60 border-t border-[#c49b9b]/20">
            {language === 'la' ? 'Status Liturgicus Hodiernus' : 'Estado Litúrgico del Día'}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
