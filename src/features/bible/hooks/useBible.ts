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

  const loadContent = useCallback(async (isCurrent: () => boolean) => {
    if (!bookId) {
      setBookData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fileData = await bibleService.loadBookData(bookId, version);
      if (!isCurrent()) return;
      
      setBookData({
        isFullBook: true,
        chapters: fileData.capitula as Array<{
          numerus: number;
          ctd_versus: number;
          versus: Record<string, string>;
        }>,
      });
    } catch (err) {
      if (!isCurrent()) return;
      console.error('Failed to load bible content:', err);
      setError('Error cargando el contenido / Error loading content');
    } finally {
      if (isCurrent()) {
        setLoading(false);
      }
    }
  }, [bookId, version]);

  useEffect(() => {
    let active = true;
    const isCurrent = () => active;
    
    loadContent(isCurrent);
    
    return () => {
      active = false;
    };
  }, [loadContent]);

  return { bookData, loading, error, reload: () => loadContent(() => true) };
}
