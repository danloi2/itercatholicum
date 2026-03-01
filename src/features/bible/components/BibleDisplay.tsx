import React from 'react';
import { DecorativeSeparator } from '@shared/components/icons/DecorativeSeparator';

interface BibleDisplayProps {
  content: {
    versus: Record<string, string>;
  };
  startVerse: number;
  endVerse: number;
  fontScale?: number;
}

export default function BibleDisplay({
  content,
  startVerse,
  endVerse,
  fontScale = 1,
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
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23c49b9b' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Overlay for paper texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ background: 'url(https://www.transparenttextures.com/patterns/aged-paper.png)' }}
      ></div>

      {/* Content */}
      <div
        className="relative font-serif text-[#3d0c0c] text-justify leading-[1.9]"
        style={{ fontSize: `${1.3 * fontScale}rem` }}
      >
        <div className="text-justify">
          {versesToDisplay.map((verse, index) => (
            <span key={verse.num} className="inline">
              {index !== 0 && (
                <sup className="text-[0.6em] font-bold text-[#8B0000] mr-1 select-none">
                  {verse.num}
                </sup>
              )}
              {index === 0 ? (
                <>
                  <span className="text-5xl font-bold text-[#8b0000] font-serif mr-1">
                    {verse.text.charAt(0).toUpperCase()}
                  </span>
                  <span>{verse.text.substring(1)} </span>
                </>
              ) : (
                <span>{verse.text} </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Decorative footer */}
      <div className="mt-6 flex justify-center opacity-40">
        <DecorativeSeparator />
      </div>
    </div>
  );
}
