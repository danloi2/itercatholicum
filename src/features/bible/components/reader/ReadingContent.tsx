import React from 'react';
import { DecorativeSeparator } from '@shared/components/icons/DecorativeSeparator';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@ui/hover-card';

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
      // Using 'versus' as per JSON structure (Latin 'versus')
      if (content?.versus && content.versus[key]) {
        verses.push({ num: key, text: content.versus[key] });
      }
    }
    return verses;
  }, [content, startVerse, endVerse]);

  return (
    <div
      className="relative p-4 md:p-8 mt-4 mx-auto max-w-4xl shadow-2xl rounded-sm min-h-[40vh]"
      style={{
        backgroundColor: '#fdfbf7',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2' fill='%23c49b9b' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Content */}
      <div className="relative font-serif text-[#3d0c0c] text-justify leading-[1.9]">
        {bookName && (
          <div className="text-center mb-8 border-b border-[#c49b9b]/20 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#3d0c0c] mb-2 tracking-tight">
              {bookName}
            </h1>
            {chapter !== undefined && chapter !== null && (
              <div className="flex items-center justify-center gap-4">
                <span className="h-px w-6 bg-[#c49b9b]/30"></span>
                <span className="text-lg md:text-xl font-serif italic text-[#8B0000]">
                  {chapter === 0
                    ? language === 'la'
                      ? 'Omnia Capitula'
                      : 'Todos los capítulos'
                    : `${language === 'la' ? 'Caput' : 'Capítulo'} ${chapter}`}
                </span>
                {chapter !== 0 && (startVerse > 1 || endVerse < 500) && (
                  <span className="bg-[#8B0000]/5 text-[#8B0000] text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full border border-[#8B0000]/10 uppercase tracking-widest">
                    {`${startVerse}-${endVerse > 500 ? (language === 'la' ? 'Fin.' : 'Fin') : endVerse}`}
                  </span>
                )}
                <span className="h-px w-6 bg-[#c49b9b]/30"></span>
              </div>
            )}
          </div>
        )}
        <div className="text-justify">
          {versesToDisplay.map((verse, index) => {
            const otherVerseText = otherContent?.versus?.[verse.num];
            return (
              <span key={verse.num} className="inline">
                {index !== 0 &&
                  (otherVerseText ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <sup className="text-[0.6em] font-bold text-[#8B0000] mr-1 select-none cursor-pointer hover:bg-[#8B0000]/10 rounded px-0.5 transition-colors">
                          {verse.num}
                        </sup>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-4 bg-[#fdfbf7] border-[#c49b9b]/30 shadow-xl font-serif text-[#3d0c0c] text-base md:text-lg pointer-events-none">
                        <p className="leading-relaxed text-justify">
                          <sup className="text-[0.7em] font-bold text-[#8B0000] mr-1">
                            {verse.num}
                          </sup>
                          {otherVerseText}
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <sup className="text-[0.6em] font-bold text-[#8B0000] mr-1 select-none">
                      {verse.num}
                    </sup>
                  ))}
                {index === 0 ? (
                  <>
                    {otherVerseText ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <span className="text-5xl font-bold text-[#8b0000] font-serif mr-1 cursor-pointer hover:bg-[#8B0000]/10 rounded px-1 transition-colors">
                            {verse.text.charAt(0).toUpperCase()}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-4 bg-[#fdfbf7] border-[#c49b9b]/30 shadow-xl font-serif text-[#3d0c0c] text-base md:text-lg pointer-events-none">
                          <p className="leading-relaxed text-justify">
                            <sup className="text-[0.7em] font-bold text-[#8B0000] mr-1">
                              {verse.num}
                            </sup>
                            {otherVerseText}
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      <span className="text-5xl font-bold text-[#8b0000] font-serif mr-1">
                        {verse.text.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span>{verse.text.substring(1)} </span>
                  </>
                ) : (
                  <span>{verse.text} </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Decorative footer */}
      <div className="mt-6 flex justify-center opacity-40">
        <DecorativeSeparator />
      </div>
    </div>
  );
}
