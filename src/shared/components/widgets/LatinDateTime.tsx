import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LATIN_ROMAN_HOURS, LATIN_MONTHS_GENITIVE } from '@shared/lib/locales';
import {
  getLiturgicalDayInfo,
  getFullLiturgicalName,
  normalizeLiturgicalColor,
  SEASON_NAMES,
} from '@shared/lib/liturgy-engine';
import { ROMCAL_MAP, CYCLE_MAP, RANK_MAP } from '@shared/constants/config';
import type { LiturgicalDay } from '@shared/types';
import { cn } from '@shared/lib/utils';

import { LiturgicalBadge } from '@shared/components/LiturgicalBadge';

function toRoman(num: number): string {
  if (!num || num === 0) return '';
  const map: [string, number][] = [
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1],
  ];
  let result = '';
  let n = num;
  for (const [letter, value] of map) {
    while (n >= value) {
      result += letter;
      n -= value;
    }
  }
  return result;
}

interface WidgetProps {
  language?: 'es' | 'la';
}

/**
 * Centered component showing Gregorian Date, Liturgical Name, and Season/Cycle badges.
 */
export function LatinDateDisplay({ language = 'es' }: WidgetProps) {
  const [now] = useState(new Date());
  const [liturgicalDay, setLiturgicalDay] = useState<LiturgicalDay | null>(null);

  useEffect(() => {
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    getLiturgicalDayInfo(todayStr, language).then(setLiturgicalDay);
  }, [now, language]);

  const liturgicalInfo = useMemo(() => {
    if (!liturgicalDay) return null;
    const { theme } = normalizeLiturgicalColor(liturgicalDay);
    const fullName = getFullLiturgicalName(liturgicalDay, language);

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
      fullName,
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

  const dateText =
    language === 'la'
      ? (() => {
          const days = [
            'Die Dominica',
            'Die Lunae',
            'Die Martis',
            'Die Mercurii',
            'Die Iovis',
            'Die Veneris',
            'Die Saturni',
          ];
          const months = LATIN_MONTHS_GENITIVE;
          return (
            <>
              {days[now.getDay()]}, die {toRoman(now.getDate())} mensis {months[now.getMonth()]}{' '}
              Anno Domini {toRoman(now.getFullYear())}
            </>
          );
        })()
      : format(now, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <div className="flex flex-col items-center gap-0.5 leading-tight text-center">
      <div className="text-xl font-bold text-slate-700 capitalize tracking-tight font-serif">
        {dateText}
      </div>
      {liturgicalInfo && (
        <span
          className={cn(
            'text-[20px] md:text-[22px] font-bold tracking-tight font-serif whitespace-nowrap opacity-80',
            liturgicalInfo.theme.text
          )}
        >
          {liturgicalInfo.fullName}
        </span>
      )}
    </div>
  );
}

/**
 * Component to portal liturgical badges into the header's center slot.
 */
export function LiturgicalBadgesPortal({ language = 'es' }: WidgetProps) {
  const [liturgicalDay, setLiturgicalDay] = useState<LiturgicalDay | null>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    getLiturgicalDayInfo(todayStr, language).then(setLiturgicalDay);
  }, [language]);

  useEffect(() => {
    const findElement = () => {
      const el = document.getElementById('header-portal-badges');
      if (el) setPortalElement(el);
    };

    findElement();

    const observer = new MutationObserver(() => {
      const el = document.getElementById('header-portal-badges');
      if (el) {
        setPortalElement(el);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const liturgicalInfo = useMemo(() => {
    if (!liturgicalDay) return null;
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

  if (!portalElement || !liturgicalInfo) return null;

  return createPortal(
    <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
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

      <div className="flex items-center gap-1.5">
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
    </div>,
    portalElement
  );
}

/**
 * Clock component with Day/Night icon.
 */
export function TimePill({ language = 'es' }: WidgetProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const h = now.getHours();
  const isNight = h < 6 || h >= 19;

  let timeText = '';
  if (language === 'la') {
    timeText = (LATIN_ROMAN_HOURS[h] || '').toUpperCase();
  } else {
    timeText = format(now, 'h:mm a');
  }

  return (
    <div className="flex flex-col items-center justify-center py-0.5 md:py-1 px-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#c49b9b]/30 shadow-sm transition-all duration-300 hover:shadow-md group">
      {isNight ? (
        <Moon className="w-3 h-3 md:w-4 md:h-4 text-slate-500" />
      ) : (
        <Sun className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
      )}
      <span className="text-xs md:text-sm font-medium text-slate-600 tracking-tight">
        {timeText}
      </span>
    </div>
  );
}

// Keeping backwards compatibility just in case
export function LatinDateTime(props: WidgetProps) {
  return <LatinDateDisplay {...props} />;
}
