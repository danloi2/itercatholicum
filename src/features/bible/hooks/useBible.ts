import { useState, useMemo, useCallback, useEffect } from 'react';
import { BIBLE_BOOKS, type BibleBook } from '../constants/bibleVersions';
import { bibleService } from '../services/bibleService';

export function useBibleHierarchy(language: 'es' | 'la') {
  return useMemo(() => {
    const testaments = new Set<string>();
    const groupsByTestament: Record<string, Set<string>> = {};
    const booksByGroup: Record<string, BibleBook[]> = {};

    BIBLE_BOOKS.forEach((book) => {
      const t = book.testament[language];
      const g = book.type[language] || (language === 'es' ? 'Otros' : 'Alii');
      testaments.add(t);
      if (!groupsByTestament[t]) groupsByTestament[t] = new Set();
      groupsByTestament[t].add(g);
      if (!booksByGroup[g]) booksByGroup[g] = [];
      booksByGroup[g].push(book);
    });
    return { testaments: Array.from(testaments), groupsByTestament, booksByGroup };
  }, [language]);
}

export function useBibleBookLoader(bookId: string, version: 'vulgata' | 'torres') {
  const [bookData, setBookData] = useState<{
    isFullBook: boolean;
    chapters: Array<{
      numerus: number;
      ctd_versus: number;
      versus: Record<string, string>;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    if (!bookId) {
      setBookData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fileData = await bibleService.loadBookData(bookId, version);
      setBookData({
        isFullBook: true,
        chapters: fileData.capitula as Array<{
          numerus: number;
          ctd_versus: number;
          versus: Record<string, string>;
        }>,
      });
    } catch (err) {
      console.error('Failed to load bible content:', err);
      setError('Error cargando el contenido / Error loading content');
    } finally {
      setLoading(false);
    }
  }, [bookId, version]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return { bookData, loading, error, reload: loadContent };
}
