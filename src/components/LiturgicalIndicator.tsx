import { useEffect, useMemo } from 'react';
import { useCalendar } from '@/hooks/use-calendar';
import { COLOR_MAP, SEASON_INFO, ROMCAL_MAP, RANK_MAP, CYCLE_MAP } from '@/constants/config';
import { cn } from '@/lib/utils';
import type { LiturgicalColor } from '@/types';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface LiturgicalIndicatorProps {
  language: 'es' | 'la';
  activeYear?: number;
  showTitle?: boolean;
}

const StoleIcon = ({ color }: { color: string }) => (
  <svg
    width="60"
    height="75"
    viewBox="0 0 32 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-sm"
  >
    <path
      d="M8 4C8 2.34315 9.34315 1 11 1H21C22.6569 1 24 2.34315 24 4V36C24 37.6569 22.6569 39 21 39H18L16 35L14 39H11C9.34315 39 8 37.6569 8 36V4Z"
      fill={color}
      stroke="rgba(0,0,0,0.1)"
      strokeWidth="0.5"
    />
    <path d="M16 1V35M8 10H24M8 20H24M8 30H24" stroke="none" />
    {/* Large Central Cross in white */}
    <path d="M16 8V32M10 16H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function LiturgicalIndicator({
  language,
  activeYear,
  showTitle = false,
}: LiturgicalIndicatorProps) {
  const { data, generateData } = useCalendar();
  const currentYear = new Date().getFullYear();
  const yearToFetch = activeYear || currentYear;

  useEffect(() => {
    generateData(yearToFetch, language);
  }, [yearToFetch, language, generateData]);

  // Use today's date but with the active year if viewing the calendar
  const today = new Date();
  const displayDate = useMemo(() => {
    if (!activeYear) return today.toISOString().split('T')[0];

    // Create a date for the same day/month but in the target active year
    const d = new Date(activeYear, today.getMonth(), today.getDate());
    return d.toISOString().split('T')[0];
  }, [activeYear]);

  const todayEntry = data[displayDate]?.[0];

  const liturgicalInfo = useMemo(() => {
    if (!todayEntry) return null;

    let rawColor = (todayEntry.colors[0] || 'WHITE').toUpperCase();
    if (rawColor === 'PURPLE') rawColor = 'VIOLET';
    if (rawColor === 'ROSE') rawColor = 'PINK';

    // Override for specific days matches DayCard logic
    if (todayEntry.id === 'immaculate_conception_of_the_blessed_virgin_mary') rawColor = 'BLUE';
    if (todayEntry.id === 'advent_3_sunday' || todayEntry.id === 'lent_4_sunday') rawColor = 'PINK';

    const colorKey = rawColor as LiturgicalColor;
    const theme = COLOR_MAP[colorKey] || COLOR_MAP.WHITE;

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
            <StoleIcon color={liturgicalInfo.color} />
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
