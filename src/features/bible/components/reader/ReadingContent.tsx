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

      <div className="flex flex-col px-2 md:px-10 text-[1.4em] md:text-[1.65em] leading-[1.3em] tracking-tight text-[#3d0c0c] font-serif antialiased">
        {versesToDisplay.map((verse, index) => {
          const otherVerseText = otherContent?.versus?.[verse.num];

          const verseContent = (
            <>
              {index === 0 ? (
                <>
                  <sup className="text-[0.55em] font-bold text-[#8B0000]/60 mr-1.5 select-none align-baseline">
                    {verse.num}
                  </sup>
                  <CanvasInitial className="mr-2">{verse.text.charAt(0).toUpperCase()}</CanvasInitial>
                  <span>{verse.text.substring(1)} </span>
                </>
              ) : (
                <>
                  <sup className="text-[0.55em] font-bold text-[#8B0000]/60 mr-1.5 select-none align-baseline">
                    {verse.num}
                  </sup>
                  <span>{verse.text} </span>
                </>
              )}
            </>
          );

          return (
            <div key={verse.num} className="group relative py-0.5 border-b border-[#8B0000]/5 last:border-0 hover:bg-[#8B0000]/5 transition-colors rounded px-1 -mx-1">
              {otherVerseText ? (
                <div className="cursor-pointer">
                  {verseContent}
                  <div className="absolute bottom-full left-0 md:left-1/2 md:-translate-x-1/2 mb-2 hidden group-hover:block w-[90vw] md:w-96 p-4 md:p-6 rounded-2xl bg-[#fdfbf7] border border-[#8B0000]/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] font-serif text-[#3d0c0c] text-base md:text-lg pointer-events-none z-50">
                    <p className="leading-relaxed text-justify">
                      <sup className="text-[0.6em] font-bold text-[#8B0000]/60 mr-1.5 align-baseline">{verse.num}</sup>
                      {otherVerseText}
                    </p>
                  </div>
                </div>
              ) : (
                verseContent
              )}
            </div>
          );
        })}
      </div>
    </ContentCanvas>
  );
}
