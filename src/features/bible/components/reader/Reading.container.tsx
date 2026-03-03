import React from 'react';
import ReadingView from './Reading.view';

import type { BibleBook } from '../../constants/bibleVersions';

interface ReadingContainerProps {
  language: 'es' | 'la';
  selectedBook: BibleBook | null;
  selectedChapter: number | null;
  verses: { start: number; end: number };
  bookData: {
    chapters: Array<{
      numerus: number;
      versus: Record<string, string>;
      [key: string]: unknown;
    }>;
  } | null;
  otherBookData?: {
    chapters: Array<{
      numerus: number;
      versus: Record<string, string>;
      [key: string]: unknown;
    }>;
  } | null;
}

const ReadingContainer: React.FC<ReadingContainerProps> = ({
  language,
  selectedBook,
  selectedChapter,
  verses,
  bookData,
  otherBookData,
}) => {
  if (!bookData) return null;

  const chaptersToRender =
    selectedChapter === 0
      ? bookData.chapters
      : [bookData.chapters.find((c) => c.numerus === selectedChapter)].filter(
          (c): c is NonNullable<typeof c> => !!c
        );

  if (chaptersToRender.length === 0) return null;

  return (
    <ReadingView
      language={language}
      selectedBookName={selectedBook?.name[language] || ''}
      chapters={chaptersToRender}
      otherBookData={otherBookData || undefined}
      verses={verses}
      isSingleChapter={selectedChapter !== 0}
      selectedChapterNumber={selectedChapter ?? 1}
    />
  );
};

export default ReadingContainer;
