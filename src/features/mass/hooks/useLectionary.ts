import { useState, useEffect, useCallback } from 'react';
import { lectionaryService, type DailyLectiones } from '../services/lectionaryService';
import { getLiturgicalDayInfo } from '@shared/lib/liturgy-engine';
import type { LiturgicalDay } from '@shared/types';

export function useLectionary(date: Date, language: 'es' | 'la') {
  const [lectiones, setLectiones] = useState<DailyLectiones | null>(null);
  const [liturgicalDay, setLiturgicalDay] = useState<LiturgicalDay | null>(null);
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
        throw new Error(
          language === 'la'
            ? 'Non inventa est informatio liturgica pro hac die.'
            : 'No se encontró información litúrgica para esta fecha.'
        );
      }

      setLiturgicalDay(dayInfo);
      const result = await lectionaryService.getLectionesForDay(dayInfo);
      setLectiones(result);
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

  return { lectiones, loading, error, liturgicalDay, refetch: fetchReadings };
}
