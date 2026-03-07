import { useState, useEffect, useCallback } from 'react';
import { lectionaryService, type DailyReadings } from '../services/lectionaryService';
import { getLiturgicalDayInfo } from '@shared/lib/liturgy-engine';

export function useLectionary(date: Date, language: 'es' | 'la') {
  const [readings, setReadings] = useState<DailyReadings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReadings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const dayInfo = await getLiturgicalDayInfo(dateStr, language);

      if (!dayInfo) {
        throw new Error('Could not find liturgical information for this date.');
      }

      const version = language === 'la' ? 'vulgata' : 'torres';
      const dailyReadings = await lectionaryService.getReadings(dayInfo, version);
      setReadings(dailyReadings);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error loading readings';
      console.error('Error fetching lectionary:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [date, language]);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  return { readings, loading, error, refetch: fetchReadings };
}
