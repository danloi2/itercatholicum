import React from 'react';
import { type BibleBook } from '@features/bible/constants/bibleVersions';
import { cn } from '@shared/lib/utils';
import { Book as BookIcon, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ui/accordion';

interface BookTreeProps {
  language: 'es' | 'la';
  hierarchy: {
    testaments: string[];
    groupsByTestament: Record<string, Set<string>>;
    booksByGroup: Record<string, BibleBook[]>;
  };
  onSelectBook: (id: string) => void;
}

export const BookTree: React.FC<BookTreeProps> = ({ language, hierarchy, onSelectBook }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-10">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#8B0000] mb-2 tracking-tight">
          {language === 'la' ? 'Sacra Biblia' : 'Santa Biblia'}
        </h1>
        <div className="h-px w-24 bg-linear-to-r from-transparent via-[#8B0000]/30 to-transparent mx-auto" />
        <h2 className="text-lg md:text-xl font-serif italic text-black">
          {language === 'la'
            ? 'Verbum Domini manet in aeternum'
            : 'La Palabra del Señor permanece para siempre'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {hierarchy.testaments.map((testament) => (
          <div key={testament} className="space-y-4">
            <h3 className="text-xl font-serif text-[#8B0000] border-b border-[#8B0000]/10 pb-2 mb-4 px-2">
              {testament}
            </h3>

            <Accordion type="multiple" className="space-y-3">
              {Array.from(hierarchy.groupsByTestament[testament] || []).map((group) => (
                <AccordionItem
                  key={group}
                  value={group}
                  className="border border-stone-200 rounded-lg bg-white/50 overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:bg-[#fdfbf7] transition-colors hover:no-underline">
                    <span className="text-sm font-medium text-stone-700">{group}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-1 pb-2">
                    <div className="grid grid-cols-1 gap-1 p-1">
                      {hierarchy.booksByGroup[group]?.map((book) => (
                        <button
                          key={book.id}
                          onClick={() => onSelectBook(book.id)}
                          className={cn(
                            'flex items-center gap-3 w-full px-4 py-2 text-left rounded-md transition-all group',
                            'hover:bg-[#8B0000]/5 hover:translate-x-1'
                          )}
                        >
                          <BookIcon className="w-4 h-4 text-stone-400 group-hover:text-[#8B0000] shrink-0 transition-colors" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-serif text-stone-800 group-hover:text-[#8B0000] truncate">
                              {book.name[language]}
                            </div>
                          </div>
                          <ChevronRight className="w-3 h-3 text-stone-300 group-hover:text-[#8B0000] group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};
