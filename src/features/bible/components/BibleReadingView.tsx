import React from 'react';
import BibleDisplay from './BibleDisplay';

interface BibleReadingViewProps {
  language: 'es' | 'la';
  selectedBook: any;
  selectedChapter: number | null;
  verses: { start: number; end: number };
  bookData: any;
}

export const BibleReadingView: React.FC<BibleReadingViewProps> = ({
  language,
  selectedBook,
  selectedChapter,
  verses,
  bookData,
}) => {
  if (!bookData) return null;

  if (selectedChapter === 0) {
    return (
      <div className="pb-28 max-w-4xl mx-auto px-4 md:px-6 animate-in fade-in duration-700 mt-6">
        <div className="space-y-16">
          {bookData.chapters.map((chapter: any) => (
            <div key={chapter.numerus} className="relative">
              <BibleDisplay
                content={chapter}
                startVerse={1}
                endVerse={9999}
                bookName={selectedBook?.name[language]}
                chapter={chapter.numerus}
                language={language}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderingContent = bookData.chapters.find((c: any) => c.numerus === selectedChapter);
  if (!renderingContent) return null;

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 md:px-6 animate-in fade-in duration-700 mt-6">
      <div className="bg-white/40 p-6 md:p-8 rounded-2xl shadow-sm border border-[#c49b9b]/20">
        <BibleDisplay
          content={renderingContent}
          startVerse={verses.start}
          endVerse={verses.end}
          bookName={selectedBook?.name[language]}
          chapter={selectedChapter!}
          language={language}
        />
      </div>
    </div>
  );
};
