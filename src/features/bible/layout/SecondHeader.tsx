import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@ui/collapsible';
import { type BibleBook, BIBLE_BOOKS } from '@features/bible/constants/bibleVersions';

interface BibleHeaderProps {
  language: 'es' | 'la';
  selectedBook: BibleBook | null;
  selectedChapter: number | null;
  verses: { start: number; end: number };
  onBookChange: (bookId: string) => void;
  onChapterChange: (chapter: number | null) => void;
  onVersesChange: (verses: { start: number; end: number }) => void;
  hierarchy: {
    testaments: string[];
    groupsByTestament: Record<string, Set<string>>;
    booksByGroup: Record<string, BibleBook[]>;
  };
  bookData: {
    chapters: Array<{
      numerus: number;
      ctd_versus: number;
      versus: Record<string, string>;
    }>;
  } | null;
}

export default function SecondHeader({
  language,
  selectedBook,
  selectedChapter,
  verses,
  onBookChange,
  onChapterChange,
  onVersesChange,
  hierarchy,
  bookData,
}: BibleHeaderProps) {
  const [testamentOpen, setTestamentOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [chapterOpen, setChapterOpen] = useState(false);
  const [versesOpen, setVersesOpen] = useState(false);

  const currentTestament = selectedBook?.testament[language] || null;
  const currentGroup = selectedBook?.type[language] || (language === 'es' ? 'Otros' : 'Alii');

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 animate-in fade-in duration-300 flex-wrap w-full min-w-0 overflow-hidden">
      {/* Root: Biblia */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => {
            onBookChange('');
            onChapterChange(null);
          }}
          className={cn(
            'text-base sm:text-lg md:text-xl font-bold tracking-tight transition-colors hover:text-[#8B0000] shrink-0',
            !selectedBook ? 'text-[#3d0c0c]' : 'text-[#3d0c0c]/60'
          )}
        >
          {language === 'la' ? 'Sacra Biblia' : 'Santa Biblia'}
        </button>
        {!selectedBook && (
          <span className="text-[10px] sm:text-xs italic text-[#3d0c0c]/60 font-serif -mt-0.5">
            {language === 'la'
              ? 'Verbum Domini manet in aeternum'
              : 'La Palabra del Señor permanece para siempre'}
          </span>
        )}
      </div>

      {/* Separator */}
      {currentTestament && <span className="text-[#c49b9b] opacity-40 text-xs font-bold">/</span>}

      {/* Testament Selector */}
      {currentTestament && (
        <Collapsible open={testamentOpen} onOpenChange={setTestamentOpen} className="relative">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 group outline-none">
            <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#3d0c0c] transition-colors group-hover:text-[#8B0000] truncate max-w-[80px] sm:max-w-none">
                {currentTestament}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-300 opacity-50',
                  testamentOpen && 'rotate-180'
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="absolute top-[calc(100%+8px)] left-0 w-[220px] bg-white rounded-xl shadow-2xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-100">
            <div className="flex flex-col py-1">
              {hierarchy.testaments.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    const firstBook = BIBLE_BOOKS.find((b) => b.testament[language] === t);
                    if (firstBook) onBookChange(firstBook.id);
                    setTestamentOpen(false);
                  }}
                  className={cn(
                    'px-4 py-2 text-sm text-left hover:bg-stone-50 transition-colors font-serif',
                    t === currentTestament
                      ? 'text-[#8B0000] bg-stone-50 font-bold'
                      : 'text-stone-700'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Separator */}
      {selectedBook && <span className="text-[#c49b9b] opacity-40 text-xs font-bold">/</span>}

      {/* Group Selector */}
      {selectedBook && (
        <Collapsible open={groupOpen} onOpenChange={setGroupOpen} className="relative">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 group outline-none">
              <span className="text-lg md:text-xl font-bold tracking-tight text-[#3d0c0c] transition-colors group-hover:text-[#8B0000]">
                {currentGroup}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-300 opacity-50',
                  groupOpen && 'rotate-180'
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="absolute top-[calc(100%+8px)] left-0 w-[220px] bg-white rounded-xl shadow-2xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-100">
            <div className="flex flex-col py-1">
              {Array.from(hierarchy.groupsByTestament[currentTestament || ''] || []).map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    const firstInGrp = hierarchy.booksByGroup[g]?.[0];
                    if (firstInGrp) onBookChange(firstInGrp.id);
                    setGroupOpen(false);
                  }}
                  className={cn(
                    'px-4 py-2 text-sm text-left hover:bg-stone-50 transition-colors font-serif',
                    g === currentGroup ? 'text-[#8B0000] bg-stone-50 font-bold' : 'text-stone-700'
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Separator */}
      {selectedBook && <span className="text-[#c49b9b] opacity-40 text-xs font-bold">/</span>}

      {/* Book Selector */}
      {selectedBook && (
        <Collapsible open={bookOpen} onOpenChange={setBookOpen} className="relative">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 group outline-none">
              <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#8B0000] transition-colors hover:opacity-80 truncate max-w-[90px] sm:max-w-none">
                {selectedBook.name[language]}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-300 opacity-50 text-[#8B0000]',
                  bookOpen && 'rotate-180'
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="absolute top-[calc(100%+8px)] left-0 w-[240px] bg-white rounded-xl shadow-2xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-100">
            <div className="flex flex-col max-h-[40vh] overflow-y-auto py-1">
              {(hierarchy.booksByGroup[currentGroup] || []).map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    onBookChange(b.id);
                    setBookOpen(false);
                  }}
                  className={cn(
                    'px-4 py-2 text-sm text-left hover:bg-stone-50 transition-colors font-serif',
                    b.id === selectedBook.id
                      ? 'text-[#8B0000] bg-stone-50 font-bold'
                      : 'text-stone-700'
                  )}
                >
                  {b.name[language]}
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Separator */}
      {selectedChapter !== null && (
        <span className="text-[#c49b9b] opacity-40 text-xs font-bold">/</span>
      )}

      {/* Chapter Selector */}
      {selectedChapter !== null && selectedBook && (
        <Collapsible open={chapterOpen} onOpenChange={setChapterOpen} className="relative">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 group outline-none">
              <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#8B0000] truncate max-w-[80px] sm:max-w-none">
                {selectedChapter === 0
                  ? language === 'la'
                    ? 'Omnia'
                    : 'Todos'
                  : `Cap. ${selectedChapter}`}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-300 opacity-50 text-[#8B0000]',
                  chapterOpen && 'rotate-180'
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="absolute top-[calc(100%+8px)] left-0 w-[280px] bg-white rounded-xl shadow-2xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-100">
            <div className="p-3">
              <button
                onClick={() => {
                  onChapterChange(0);
                  setChapterOpen(false);
                }}
                className={cn(
                  'w-full p-2 mb-2 text-sm rounded border transition-colors font-bold',
                  selectedChapter === 0
                    ? 'bg-[#8B0000] text-white border-[#8B0000]'
                    : 'bg-white text-[#8B0000] border-gray-200 hover:bg-stone-50'
                )}
              >
                {language === 'la' ? 'Omnia Capitula' : 'Todos los capítulos'}
              </button>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => {
                      onChapterChange(ch);
                      setChapterOpen(false);
                    }}
                    className={cn(
                      'aspect-square flex items-center justify-center text-xs rounded border transition-colors',
                      selectedChapter === ch
                        ? 'bg-[#8B0000] text-white border-[#8B0000]'
                        : 'bg-white text-stone-700 border-gray-200 hover:bg-stone-50'
                    )}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Separator */}
      {selectedChapter !== null && selectedChapter !== 0 && bookData && (
        <span className="text-[#c49b9b] opacity-40 text-xs font-bold">/</span>
      )}

      {/* Verse Selector */}
      {selectedChapter !== null && selectedChapter !== 0 && bookData && (
        <Collapsible open={versesOpen} onOpenChange={setVersesOpen} className="relative">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 group outline-none">
              <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#8B0000] truncate max-w-[80px] sm:max-w-none">
                {`V. ${verses.start}-${verses.end > 500 ? (language === 'la' ? 'Fin.' : 'Fin') : verses.end}`}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-300 opacity-50 text-[#8B0000]',
                  versesOpen && 'rotate-180'
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="absolute top-[calc(100%+8px)] left-0 w-[200px] bg-white rounded-xl shadow-2xl border border-stone-100 p-4 animate-in fade-in zoom-in-95 duration-200 z-100">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#8B0000] uppercase tracking-wider">
                  {language === 'la' ? 'Initium' : 'Inicio'}
                </label>
                <select
                  value={verses.start}
                  onChange={(e) => {
                    const s = parseInt(e.target.value);
                    onVersesChange({ start: s, end: Math.max(s, verses.end) });
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded p-1.5 text-xs text-stone-700 outline-none focus:border-[#8B0000]/30 transition-colors"
                >
                  {Array.from(
                    {
                      length:
                        bookData.chapters.find((c) => c.numerus === selectedChapter)?.ctd_versus ||
                        0,
                    },
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#8B0000] uppercase tracking-wider">
                  {language === 'la' ? 'Finis' : 'Fin'}
                </label>
                <select
                  value={verses.end}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    onVersesChange({
                      start: Math.min(verses.start, v),
                      end: v,
                    });
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded p-1.5 text-xs text-stone-700 outline-none focus:border-[#8B0000]/30 transition-colors"
                >
                  {Array.from(
                    {
                      length:
                        bookData.chapters.find((c) => c.numerus === selectedChapter)?.ctd_versus ||
                        0,
                    },
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
