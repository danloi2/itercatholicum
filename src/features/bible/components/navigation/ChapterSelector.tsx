import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@ui/hover-card';

interface ChapterSelectorProps {
  language: 'es' | 'la';
  bookData: {
    chapters: Array<{
      numerus: number;
      ctd_versus: number;
      versus: Record<string, string>;
    }>;
  } | null;
  bookName: string;
  onSelectChapter: (chapterNum: number) => void;
  onSelectAll: () => void;
}

export const ChapterSelector: React.FC<ChapterSelectorProps> = ({
  language,
  bookData,
  bookName,
  onSelectChapter,
  onSelectAll,
}) => {
  if (!bookData) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-700 pb-24 relative">
      <div className="text-center mb-8 border-b border-[#c49b9b]/20 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#3d0c0c] mb-2 tracking-tight">
          {bookName}
        </h1>
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-6 bg-[#c49b9b]/30"></span>
          <span className="text-lg md:text-xl font-serif italic text-[#8B0000]">
            {bookData.chapters.length} {language === 'la' ? 'Capitula' : 'Capítulos'}
          </span>
          <span className="h-px w-6 bg-[#c49b9b]/30"></span>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        <button
          onClick={onSelectAll}
          className="aspect-square flex flex-col items-center justify-center rounded-xl bg-linear-to-br from-[#8B0000] to-[#522b2b] text-[#fdfbf7] shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95 border border-[#3d0c0c] group relative overflow-hidden"
          title={language === 'la' ? 'Omnia Capitula' : 'Todos los capítulos'}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="font-serif font-bold text-xs sm:text-xs tracking-widest leading-none text-center">
            {language === 'la' ? 'OMNIA' : 'TODOS'}
          </span>
        </button>

        {bookData.chapters.map((chapter) => (
          <HoverCard key={chapter.numerus} openDelay={200} closeDelay={150}>
            <HoverCardTrigger asChild>
              <button
                onClick={() => onSelectChapter(chapter.numerus)}
                className="aspect-square flex items-center justify-center rounded-xl bg-white/70 border border-[#c49b9b]/50 text-[#522b2b] shadow-sm hover:shadow-lg hover:bg-[#ebd6d6] hover:text-[#8B0000] transition-all hover:-translate-y-1 active:scale-95 font-serif text-lg md:text-xl font-bold relative overflow-hidden group"
              >
                {chapter.numerus}
                <div className="absolute inset-0 bg-linear-to-br from-white/60 to-transparent pointer-events-none" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent
              className="w-72 sm:w-80 shadow-2xl border-[#8B0000]/20"
              sideOffset={8}
            >
              <div className="flex justify-between items-start space-x-4">
                <div className="space-y-2 w-full">
                  <h4 className="text-base font-bold text-[#8B0000] font-serif border-b border-[#c49b9b]/30 pb-2">
                    {language === 'la' ? 'Caput ' : 'Capítulo '} {chapter.numerus}
                  </h4>
                  <p className="text-sm text-[#522b2b] line-clamp-5 italic pt-1 leading-relaxed">
                    {chapter.versus && chapter.versus[0] ? (
                      <>
                        <sup className="text-xs mr-1 opacity-70 font-bold">1</sup>
                        {chapter.versus['1']}
                      </>
                    ) : (
                      '...'
                    )}
                  </p>
                  <div className="text-[10px] text-right text-[#8B0000]/60 font-bold uppercase tracking-widest pt-3">
                    {chapter.ctd_versus} {language === 'la' ? 'Versus' : 'Versículos'}
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};
