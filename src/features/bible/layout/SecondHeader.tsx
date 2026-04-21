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
    <div className="flex items-center justify-center gap-1 sm:gap-2 animate-in fade-in duration-500 flex-wrap w-full max-w-full px-2 overflow-visible relative">
      {/* Root: Biblia */}
      <div className="flex items-center">
        <button
          onClick={() => onBookChange('')}
          className={cn(
            'text-sm sm:text-base md:text-lg font-bold tracking-tight transition-all hover:text-[#8B0000] px-2 py-1 rounded-md hover:bg-[#8B0000]/5',
            !selectedBook ? 'text-[#3d0c0c]' : 'text-[#3d0c0c]/40'
          )}
        >
          {language === 'la' ? 'Biblia' : 'Biblia'}
        </button>
      </div>

      {/* Testament Selector */}
      {currentTestament && (
        <div className="relative">
          <div className="flex items-center gap-1">
            <span className="text-[#c49b9b] opacity-30 text-[10px] font-bold">/</span>
            <button 
              onClick={() => {
                setTestamentOpen(!testamentOpen);
                setGroupOpen(false);
                setBookOpen(false);
                setChapterOpen(false);
                setVersesOpen(false);
              }}
              className="flex items-center gap-0.5 group outline-none px-1.5 py-1 rounded-md hover:bg-[#8B0000]/5 transition-all"
            >
              <span className="text-sm sm:text-base font-bold tracking-tight text-[#3d0c0c]/80 transition-colors group-hover:text-[#8B0000] truncate max-w-[70px] sm:max-w-none">
                {currentTestament}
              </span>
              <ChevronDown className={cn('h-3 w-3 transition-transform duration-300 opacity-40', testamentOpen && 'rotate-180')} />
            </button>
          </div>
          {testamentOpen && (
            <div className="absolute top-full left-0 mt-2 w-[220px] bg-[#fdfbf7] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-[#8B0000]/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
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
                      'px-4 py-2.5 text-sm text-left hover:bg-[#8B0000]/5 transition-colors font-serif',
                      t === currentTestament ? 'text-[#8B0000] bg-[#8B0000]/5 font-bold' : 'text-[#3d0c0c]/80'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Group Selector */}
      {selectedBook && (
        <div className="relative">
          <div className="flex items-center gap-1">
            <span className="text-[#c49b9b] opacity-30 text-[10px] font-bold">/</span>
            <button 
              onClick={() => {
                setGroupOpen(!groupOpen);
                setTestamentOpen(false);
                setBookOpen(false);
                setChapterOpen(false);
                setVersesOpen(false);
              }}
              className="flex items-center gap-0.5 group outline-none px-1.5 py-1 rounded-md hover:bg-[#8B0000]/5 transition-all"
            >
              <span className="text-sm sm:text-base font-bold tracking-tight text-[#3d0c0c]/80 transition-colors group-hover:text-[#8B0000] truncate max-w-[80px] sm:max-w-none">
                {currentGroup}
              </span>
              <ChevronDown className={cn('h-3 w-3 transition-transform duration-300 opacity-40', groupOpen && 'rotate-180')} />
            </button>
          </div>
          {groupOpen && (
            <div className="absolute top-full left-0 mt-2 w-[200px] bg-[#fdfbf7] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-[#8B0000]/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
              <div className="flex flex-col py-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                {Array.from(hierarchy.groupsByTestament[currentTestament || ''] || []).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      const firstInGrp = hierarchy.booksByGroup[g]?.[0];
                      if (firstInGrp) onBookChange(firstInGrp.id);
                      setGroupOpen(false);
                    }}
                    className={cn(
                      'px-4 py-2.5 text-sm text-left hover:bg-[#8B0000]/5 transition-colors font-serif',
                      g === currentGroup ? 'text-[#8B0000] bg-[#8B0000]/5 font-bold' : 'text-[#3d0c0c]/80'
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Book Selector */}
      {selectedBook && (
        <div className="relative">
          <div className="flex items-center gap-1">
            <span className="text-[#c49b9b] opacity-30 text-[10px] font-bold">/</span>
            <button 
              onClick={() => {
                setBookOpen(!bookOpen);
                setTestamentOpen(false);
                setGroupOpen(false);
                setChapterOpen(false);
                setVersesOpen(false);
              }}
              className="flex items-center gap-0.5 group outline-none px-1.5 py-1 rounded-md hover:bg-[#8B0000]/5 transition-all"
            >
              <span className="text-sm sm:text-base font-bold tracking-tight text-[#8B0000] transition-opacity hover:opacity-80 truncate max-w-[90px] sm:max-w-none">
                {selectedBook.name[language]}
              </span>
              <ChevronDown className={cn('h-3 w-3 transition-transform duration-300 opacity-40 text-[#8B0000]', bookOpen && 'rotate-180')} />
            </button>
          </div>
          {bookOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[220px] bg-[#fdfbf7] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-[#8B0000]/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
              <div className="flex flex-col max-h-[40vh] overflow-y-auto py-1 custom-scrollbar">
                {(hierarchy.booksByGroup[currentGroup] || []).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onBookChange(b.id);
                      setBookOpen(false);
                    }}
                    className={cn(
                      'px-4 py-2.5 text-sm text-left hover:bg-[#8B0000]/5 transition-colors font-serif',
                      b.id === selectedBook.id ? 'text-[#8B0000] bg-[#8B0000]/5 font-bold' : 'text-[#3d0c0c]/80'
                    )}
                  >
                    {b.name[language]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chapter Selector */}
      {selectedChapter !== null && selectedBook && (
        <div className="relative">
          <div className="flex items-center gap-1">
            <span className="text-[#c49b9b] opacity-30 text-[10px] font-bold">/</span>
            <button 
              onClick={() => {
                setChapterOpen(!chapterOpen);
                setTestamentOpen(false);
                setGroupOpen(false);
                setBookOpen(false);
                setVersesOpen(false);
              }}
              className="flex items-center gap-0.5 group outline-none px-1.5 py-1 rounded-md hover:bg-[#8B0000]/5 transition-all"
            >
              <span className="text-sm sm:text-base font-bold tracking-tight text-[#8B0000] truncate max-w-[60px] sm:max-w-none">
                {selectedChapter === 0 ? (language === 'la' ? 'Omnia' : 'Todos') : `Cap. ${selectedChapter}`}
              </span>
              <ChevronDown className={cn('h-3 w-3 transition-transform duration-300 opacity-40 text-[#8B0000]', chapterOpen && 'rotate-180')} />
            </button>
          </div>
          {chapterOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[280px] bg-[#fdfbf7] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-[#8B0000]/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
              <div className="p-3">
                <button
                  onClick={() => {
                    onChapterChange(0);
                    setChapterOpen(false);
                  }}
                  className={cn(
                    'w-full p-2.5 mb-3 text-sm rounded-lg border transition-all font-bold font-serif',
                    selectedChapter === 0
                      ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-md'
                      : 'bg-[#8B0000]/5 text-[#8B0000] border-[#8B0000]/10 hover:bg-[#8B0000]/10'
                  )}
                >
                  {language === 'la' ? 'Omnia Capitula' : 'Todos los capítulos'}
                </button>
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => {
                        onChapterChange(ch);
                        setChapterOpen(false);
                      }}
                      className={cn(
                        'aspect-square flex items-center justify-center text-xs rounded-md border transition-all font-serif',
                        selectedChapter === ch
                          ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold shadow-sm scale-105'
                          : 'bg-white text-[#3d0c0c]/80 border-[#8B0000]/10 hover:border-[#8B0000]/30 hover:bg-[#8B0000]/5'
                      )}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Verse Selector */}
      {selectedChapter !== null && selectedChapter !== 0 && bookData && (
        <div className="relative">
          <div className="flex items-center gap-1">
            <span className="text-[#c49b9b] opacity-30 text-[10px] font-bold">/</span>
            <button 
              onClick={() => {
                setVersesOpen(!versesOpen);
                setTestamentOpen(false);
                setGroupOpen(false);
                setBookOpen(false);
                setChapterOpen(false);
              }}
              className="flex items-center gap-0.5 group outline-none px-1.5 py-1 rounded-md hover:bg-[#8B0000]/5 transition-all"
            >
              <span className="text-sm sm:text-base font-bold tracking-tight text-[#8B0000] truncate max-w-[80px] sm:max-w-none">
                {`V. ${verses.start}-${verses.end > 500 ? (language === 'la' ? 'Fin.' : 'Fin') : verses.end}`}
              </span>
              <ChevronDown className={cn('h-3 w-3 transition-transform duration-300 opacity-40 text-[#8B0000]', versesOpen && 'rotate-180')} />
            </button>
          </div>
          {versesOpen && (
            <div className="absolute top-full right-0 mt-2 w-[220px] bg-[#fdfbf7] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-[#8B0000]/10 p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8B0000]/60 uppercase tracking-widest px-1">
                    {language === 'la' ? 'Initium' : 'Desde versículo'}
                  </label>
                  <select
                    value={verses.start}
                    onChange={(e) => {
                      const s = parseInt(e.target.value);
                      onVersesChange({ start: s, end: Math.max(s, verses.end) });
                    }}
                    className="w-full bg-white border border-[#8B0000]/10 rounded-lg p-2 text-sm text-[#3d0c0c] outline-none focus:border-[#8B0000]/40 transition-all font-serif cursor-pointer"
                  >
                    {Array.from({ length: bookData.chapters.find((c) => c.numerus === selectedChapter)?.ctd_versus || 0 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#8B0000]/60 uppercase tracking-widest px-1">
                    {language === 'la' ? 'Finis' : 'Hasta versículo'}
                  </label>
                  <select
                    value={verses.end > 500 ? '9999' : verses.end}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      onVersesChange({ start: Math.min(verses.start, v), end: v });
                    }}
                    className="w-full bg-white border border-[#8B0000]/10 rounded-lg p-2 text-sm text-[#3d0c0c] outline-none focus:border-[#8B0000]/40 transition-all font-serif cursor-pointer"
                  >
                    {Array.from({ length: bookData.chapters.find((c) => c.numerus === selectedChapter)?.ctd_versus || 0 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                    <option value="9999">{language === 'la' ? 'Finis' : 'Final del capítulo'}</option>
                  </select>
                </div>
                
                {/* OK Button to close */}
                <button
                  onClick={() => setVersesOpen(false)}
                  className="w-full mt-2 py-2 bg-[#8B0000] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#3d0c0c] transition-colors shadow-sm"
                >
                  {language === 'la' ? 'Confirma' : 'Aceptar'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
