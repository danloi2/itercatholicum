import { useMemo } from 'react';
import {
  getFullLiturgicalName,
  normalizeLiturgicalColor,
  SEASON_NAMES,
} from '@shared/lib/liturgy-engine';
import { ROMCAL_MAP, CYCLE_MAP, RANK_MAP } from '@shared/constants/config';
import type { LiturgicalDay } from '@shared/types';
import { LiturgicalDatePicker } from '@shared/components/widgets/LiturgicalDatePicker';
import { ChevronDown } from 'lucide-react';
import { LiturgicalBadge } from '@shared/components/LiturgicalBadge';
import { StoleIcon } from '@shared/components/icons/StoleIcon';

interface MassHeaderProps {
  liturgicalDay: LiturgicalDay;
  language: 'es' | 'la';
  onDateChange?: (date: Date) => void;
}

export default function SecondHeader({ liturgicalDay, language, onDateChange }: MassHeaderProps) {
  const pageTitleStr = getFullLiturgicalName(liturgicalDay, language);
  const selectedDate = new Date(liturgicalDay.date);

  const liturgicalInfo = useMemo(() => {
    const { theme } = normalizeLiturgicalColor(liturgicalDay);

    const seasonRaw = liturgicalDay.seasons?.[0] || 'ORDINARY_TIME';
    const mappedSeason = ROMCAL_MAP[seasonRaw.toUpperCase()] || seasonRaw.toUpperCase();
    const translatedSeason =
      SEASON_NAMES[language]?.[mappedSeason] || liturgicalDay.seasonNames?.[0] || mappedSeason;
    const weekNum = liturgicalDay.calendar?.weekOfSeason || 0;

    const sundayCycleKey = liturgicalDay.cycles?.sundayCycle || '';
    const weekdayCycleKey = liturgicalDay.cycles?.weekdayCycle || '';
    const localizedSundayCycle = CYCLE_MAP[language]?.[sundayCycleKey] || sundayCycleKey;
    const localizedWeekdayCycle = CYCLE_MAP[language]?.[weekdayCycleKey] || weekdayCycleKey;
    const localizedRank =
      RANK_MAP[language]?.[liturgicalDay.rank.toUpperCase()] || liturgicalDay.rank;

    return {
      theme,
      season: translatedSeason,
      weekNum,
      sundayCycle: localizedSundayCycle,
      weekdayCycle: localizedWeekdayCycle,
      rank: localizedRank,
      rawRank: liturgicalDay.rank,
      isHolyWeek: liturgicalDay.periods?.includes('HOLY_WEEK'),
    };
  }, [liturgicalDay, language]);

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-500 min-w-0 w-full">
      <div className="flex items-center gap-2 flex-wrap justify-center min-w-0">
        {onDateChange ? (
          <LiturgicalDatePicker
            date={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            language={language}
            trigger={
              <button className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-xl md:text-2xl font-bold tracking-tight text-[#3d0c0c] hover:text-[#8B0000] transition-colors group text-center min-w-0 font-serif italic">
                <StoleIcon
                  color={liturgicalInfo.theme.hex}
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 drop-shadow-sm shrink-0"
                />
                <span className="truncate max-w-[160px] sm:max-w-[260px] md:max-w-none">{pageTitleStr}</span>
                <ChevronDown className="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
              </button>
            }
          />
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-xl md:text-2xl font-bold tracking-tight text-[#3d0c0c] truncate text-center font-serif italic">
            <StoleIcon
              color={liturgicalInfo.theme.hex}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 drop-shadow-sm shrink-0"
            />
            <span className="truncate">{pageTitleStr}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 opacity-90 scale-90 origin-center">
        <LiturgicalBadge theme={liturgicalInfo.theme} showDot>
          {liturgicalInfo.isHolyWeek ? (
            language === 'la' ? (
              'Hebdomada Sancta'
            ) : (
              'Semana Santa'
            )
          ) : (
            <>
              {liturgicalInfo.weekNum > 0 &&
                `${language === 'la' ? 'HEB' : 'SEMANA'} ${liturgicalInfo.weekNum} `}
              {liturgicalInfo.season}
            </>
          )}
        </LiturgicalBadge>

        <LiturgicalBadge
          theme={liturgicalInfo.theme}
          showDot
          className="bg-[#8B0000]/5 text-[#8B0000]/70 border-[#8B0000]/10"
        >
          {liturgicalInfo.sundayCycle}
        </LiturgicalBadge>

        {liturgicalInfo.weekdayCycle && (
          <LiturgicalBadge theme={liturgicalInfo.theme} showDot variant="stone">
            {liturgicalInfo.weekdayCycle}
          </LiturgicalBadge>
        )}

        {liturgicalInfo.rawRank && (
          <LiturgicalBadge theme={liturgicalInfo.theme} rawRank={liturgicalInfo.rawRank} showDot>
            {liturgicalInfo.rank}
          </LiturgicalBadge>
        )}
      </div>
    </div>
  );
}
