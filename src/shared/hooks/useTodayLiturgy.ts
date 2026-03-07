import { useState, useEffect } from 'react';
import {
  getLiturgicalDayInfo,
  normalizeLiturgicalColor,
  getFullLiturgicalName,
} from '@shared/lib/liturgy-engine';
import { RANK_MAP, CYCLE_MAP } from '@shared/constants/config';
import type { LiturgicalDay } from '@shared/types';
import { format } from 'date-fns';

export function useTodayLiturgy(language: 'es' | 'la') {
  const [liturgicalDay, setLiturgicalDay] = useState<LiturgicalDay | null>(null);

  useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    getLiturgicalDayInfo(todayStr, language).then(setLiturgicalDay);
  }, [language]);

  if (!liturgicalDay) {
    return {
      date: new Date(),
      name: '',
      season: '',
      color: '#7c3aed',
      rank: '',
      cycle: '',
    };
  }

  const { theme } = normalizeLiturgicalColor(liturgicalDay);
  const fullName = getFullLiturgicalName(liturgicalDay, language);

  return {
    date: new Date(liturgicalDay.date),
    name: fullName,
    season: liturgicalDay.seasons?.[0] || '',
    color: theme.hex,
    rank: RANK_MAP[language]?.[liturgicalDay.rank] || liturgicalDay.rank,
    cycle: liturgicalDay.cycles
      ? `${CYCLE_MAP[language]?.[liturgicalDay.cycles.sundayCycle] || ''} / ${CYCLE_MAP[language]?.[liturgicalDay.cycles.weekdayCycle] || ''}`
      : '',
  };
}
