import React from 'react';
import { ContentCanvas, CanvasHeader, CanvasInitial } from '@shared/components/ContentCanvas';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@ui/hover-card';
import type { ReadingData } from '../services/lectionaryService';

interface MassReadingProps {
  reading: ReadingData;
}

export const MassReading: React.FC<MassReadingProps> = ({ reading }) => {
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const referenceParts = React.useMemo(() => {
    const parts = reading.displayReference.split(':');
    if (parts.length > 1) {
      return {
        main: parts[0],
        badge: parts.slice(1).join(':'),
      };
    }
    return {
      main: reading.displayReference,
      badge: null,
    };
  }, [reading.displayReference]);

  const subtitle = (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center justify-center gap-4">
        <span className="h-px w-6 bg-border/30"></span>
        <span className="italic font-serif text-primary/70">{referenceParts.main}</span>
        {referenceParts.badge && (
          <span className="bg-primary/5 text-primary text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full border border-primary/10 uppercase tracking-widest not-italic">
            {referenceParts.badge}
          </span>
        )}
        <span className="h-px w-6 bg-border/30"></span>
      </div>
    </div>
  );

  return (
    <ContentCanvas className="mb-12">
      <CanvasHeader
        title={reading.title}
        subtitle={subtitle}
        className="animate-in fade-in slide-in-from-top-4 duration-700"
      />

      <div className="text-justify px-2 md:px-6 font-serif leading-relaxed text-lg md:text-xl text-[#3d0c0c]">
        {reading.verseList.map((verse, index) => {
          const otherVerseText = reading.otherLanguageVerseList?.find(
            (v) => v.num === verse.num
          )?.text;

          const verseContent = (
            <React.Fragment key={verse.num}>
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
            </React.Fragment>
          );

          if (otherVerseText) {
            return (
              <HoverCard key={verse.num}>
                <HoverCardTrigger asChild>
                  <span className="inline cursor-pointer hover:bg-primary/5 rounded px-0.5 transition-colors">
                    {verseContent}
                  </span>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4 bg-[#fdfbf7] border-border/30 shadow-xl font-serif text-foreground text-base md:text-lg pointer-events-none">
                  <p className="leading-relaxed text-justify">
                    <sup className="text-[0.7em] font-bold text-red-600 mr-1">{verse.num}</sup>
                    {otherVerseText}
                  </p>
                </HoverCardContent>
              </HoverCard>
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
};
