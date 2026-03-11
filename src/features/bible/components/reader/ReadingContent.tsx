import React from 'react';
import { ContentCanvas, CanvasHeader, CanvasInitial } from '@shared/components/ContentCanvas';

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
          {chapter === 0
            ? language === 'la'
              ? 'Omnia Capitula'
              : 'Todos los capítulos'
            : `${language === 'la' ? 'Caput' : 'Capítulo'} ${chapter}`}
        </span>
        {chapter !== 0 && (startVerse > 1 || endVerse < 500) && (
          <span className="bg-primary/5 text-primary text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full border border-primary/10 uppercase tracking-widest not-italic">
            {`${startVerse}-${endVerse > 500 ? (language === 'la' ? 'Fin.' : 'Fin') : endVerse}`}
          </span>
        )}
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

      <div className="text-justify px-2 md:px-6">
        {versesToDisplay.map((verse, index) => {
          const otherVerseText = otherContent?.versus?.[verse.num];

          const verseContent = (
            <>
              {index === 0 ? (
                <>
                  <CanvasInitial>{verse.text.charAt(0).toUpperCase()}</CanvasInitial>
                  <span>{verse.text.substring(1)} </span>
                </>
              ) : (
                <>
                  <sup className="text-[0.6em] font-bold text-red-600 mr-1 select-none">
                    {verse.num}
                  </sup>
                  <span>{verse.text} </span>
                </>
              )}
            </>
          );

          if (otherVerseText) {
            return (
              <span key={verse.num} className="group relative inline cursor-pointer hover:bg-primary/5 rounded px-0.5 transition-colors">
                {verseContent}
                <div className="absolute bottom-full left-0 md:left-1/2 md:-translate-x-1/2 mb-1 hidden group-hover:block w-[85vw] md:w-80 p-3 md:p-4 rounded-md bg-[#fdfbf7] border border-border/30 shadow-xl font-serif text-foreground text-sm md:text-base pointer-events-none z-50">
                  <p className="leading-relaxed text-justify">
                    <sup className="text-[0.7em] font-bold text-red-600 mr-1">{verse.num}</sup>
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
