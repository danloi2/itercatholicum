import { useEffect, useState, useMemo } from 'react';
import {
  getLiturgicalDayInfo,
  normalizeLiturgicalColor,
  getFullLiturgicalName,
} from '../lib/liturgy-engine';
import type { LiturgicalDay } from '../types';
import { SEASON_INFO, ROMCAL_MAP, RANK_MAP, CYCLE_MAP } from '../constants/config';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@ui/hover-card';
import { StoleIcon } from './icons/StoleIcon';
import { LiturgicalBadge } from './LiturgicalBadge';

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
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
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
      fullName: getFullLiturgicalName(todayEntry, language),
      season: language === 'la' ? primarySeason.latTitle : primarySeason.title,
      color: theme.hex,
      theme,
      rank: localizedRank,
      sundayCycle: localizedSundayCycle,
      weekdayCycle: localizedWeekdayCycle,
      weekOfSeason: todayEntry.calendar.weekOfSeason,
      rawRank: todayEntry.rank,
    };
  }, [todayEntry, language]);

  if (!liturgicalInfo) return null;

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-3 group cursor-help py-1">
          <div className="relative transform transition-transform group-hover:scale-110 duration-500 shrink-0">
            <StoleIcon
              color={liturgicalInfo.color}
              className="w-8 h-8 md:w-10 md:h-10 drop-shadow-sm"
            />
          </div>
          {showTitle && (
            <div className="flex flex-col items-start leading-none gap-1">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter text-[#3d0c0c] leading-none">
                <span className="bg-linear-to-r from-[#8B0000] to-[#3d0c0c] bg-clip-text text-transparent">
                  Iter Catholicum
                </span>
              </h1>
            </div>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="bg-[#fdfbf7] border-[#c49b9b] text-[#3d0c0c] font-serif shadow-xl w-64 p-3">
        <div className="text-xs space-y-1.5">
          <p className="font-bold underline text-sm">{liturgicalInfo.fullName}</p>
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <LiturgicalBadge theme={liturgicalInfo.theme} rawRank={liturgicalInfo.rawRank}>
                {liturgicalInfo.rank}
              </LiturgicalBadge>
            </div>
            <div className="flex items-center gap-1.5">
              <LiturgicalBadge
                theme={liturgicalInfo.theme}
                className="bg-[#8B0000]/10 text-[#8B0000]"
              >
                {liturgicalInfo.sundayCycle}
              </LiturgicalBadge>
              <LiturgicalBadge theme={liturgicalInfo.theme} variant="stone">
                {liturgicalInfo.weekdayCycle}
              </LiturgicalBadge>
            </div>
          </div>
          <div className="pt-1 flex items-center gap-2 opacity-60 border-t border-[#c49b9b]/20">
            <p className="text-[10px]">
              {language === 'la' ? 'Status Liturgicus Hodiernus' : 'Estado Litúrgico del Día'}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
