import React from 'react';
import ReadingContent from './ReadingContent';

interface ChapterData {
  numerus: number;
  versus: Record<string, string>;
  [key: string]: unknown;
}

interface ReadingViewProps {
  language: 'es' | 'la';
  selectedBookName: string;
  chapters: ChapterData[];
  otherBookData?: { chapters: ChapterData[] };
  verses: { start: number; end: number };
  isSingleChapter: boolean;
  selectedChapterNumber: number;
}

const ReadingView: React.FC<ReadingViewProps> = ({
  language,
  selectedBookName,
  chapters,
  otherBookData,
  verses,
  isSingleChapter,
  selectedChapterNumber,
}) => {
  const containerClassName =
    'pb-28 max-w-4xl mx-auto px-4 md:px-6 animate-in fade-in duration-700 mt-6';

  if (!isSingleChapter) {
    return (
      <div className={containerClassName}>
        <div className="space-y-16">
          {chapters.map((chapter) => {
            const otherChapter = otherBookData?.chapters.find(
              (c: ChapterData) => c.numerus === chapter.numerus
            );
            return (
              <div key={chapter.numerus} className="relative">
                <ReadingContent
                  content={chapter}
                  otherContent={otherChapter}
                  startVerse={1}
                  endVerse={9999}
                  bookName={selectedBookName}
                  chapter={chapter.numerus}
                  language={language}
                  otherLanguage={language === 'es' ? 'la' : 'es'}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <div className="bg-white/40 p-6 md:p-8 rounded-2xl shadow-sm border border-[#c49b9b]/20">
        <ReadingContent
          content={chapters[0]}
          otherContent={otherBookData?.chapters.find(
            (c: ChapterData) => c.numerus === selectedChapterNumber
          )}
          startVerse={verses.start}
          endVerse={verses.end}
          bookName={selectedBookName}
          chapter={selectedChapterNumber}
          language={language}
          otherLanguage={language === 'es' ? 'la' : 'es'}
        />
      </div>
    </div>
  );
};

export default ReadingView;
