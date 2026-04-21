import React from 'react';
import { ContentCanvas, CanvasHeader, CanvasInitial } from '@shared/components/ContentCanvas';
import { formatBibleReference } from '../../utils/bibleNavigation';

interface BibleDisplayProps {
  content: {
    versus: Record<string, string>;
  };
  otherContent?: {
    versus: Record<string, string>;
  };
  startVerse: number;
  endVerse: number;
  bookName?: string;
  chapter?: number | string | null;
  language?: 'es' | 'la';
  otherLanguage?: 'es' | 'la' | string;
  bookId?: string;
}

export default function ReadingContent({
  content,
  otherContent,
  startVerse,
  endVerse,
  bookName,
  chapter,
  language = 'es',
}: BibleDisplayProps) {
  const versesToDisplay = React.useMemo(() => {
    const verses: { num: string; text: string }[] = [];
    for (let i = startVerse; i <= endVerse; i++) {
      const key = i.toString();
      if (content?.versus && content.versus[key]) {
        verses.push({ num: key, text: content.versus[key] });
      }
    }
    return verses;
  }, [content, startVerse, endVerse]);

  const subtitle = (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center justify-center gap-4">
        <span className="h-px w-6 bg-border/30"></span>
        <span className="italic">
          {formatBibleReference('', chapter ?? 0, startVerse, endVerse, language).trim()}
        </span>
        <span className="h-px w-6 bg-border/30"></span>
      </div>
    </div>
  );

  return (
    <ContentCanvas className="mt-4">
      {bookName && (
        <CanvasHeader
          title={bookName}
          subtitle={subtitle}
          className="animate-in fade-in slide-in-from-top-4 duration-700"
        />
      )}

      <div className="text-justify px-2 md:px-8 text-[1.15rem] md:text-[1.4rem] leading-[1.4] md:leading-[1.5] tracking-tight text-[#3d0c0c] font-serif antialiased">
        {versesToDisplay.map((verse, index) => {
          const otherVerseText = otherContent?.versus?.[verse.num];

          const verseContent = (
            <>
              {index === 0 ? (
                <>
                  <CanvasInitial className="mr-2">{verse.text.charAt(0).toUpperCase()}</CanvasInitial>
                  <span>{verse.text.substring(1)} </span>
                </>
              ) : (
                <>
                  <sup className="text-[0.55em] font-bold text-[#8B0000]/60 mr-1 select-none align-baseline">
                    {verse.num}
                  </sup>
                  <span>{verse.text} </span>
                </>
              )}
            </>
          );

          if (otherVerseText) {
            return (
              <span key={verse.num} className="group relative inline cursor-pointer hover:bg-[#8B0000]/5 rounded transition-all duration-300">
                {verseContent}
                <div className="absolute bottom-full left-0 md:left-1/2 md:-translate-x-1/2 mb-2 hidden group-hover:block w-[90vw] md:w-96 p-4 md:p-6 rounded-2xl bg-[#fdfbf7] border border-[#8B0000]/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] font-serif text-[#3d0c0c] text-base md:text-lg pointer-events-none z-50">
                  <p className="leading-relaxed text-justify">
                    <sup className="text-[0.6em] font-bold text-[#8B0000]/60 mr-1.5 align-baseline">{verse.num}</sup>
                    {otherVerseText}
                  </p>
                </div>
              </span>
            );
          }

          return (
            <span key={verse.num} className="inline">
              {verseContent}
            </span>
          );
        })}
      </div>
    </ContentCanvas>
  );
}
