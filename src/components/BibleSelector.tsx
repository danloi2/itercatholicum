import React, { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BIBLE_BOOKS, type BibleBook } from '@/constants/bibleData';

interface BibleSelectorProps {
  language: 'es' | 'la';
  selectedBookId: string;
  setSelectedBookId: (id: string) => void;
  selectedChapter: number;
  setSelectedChapter: (chapter: number) => void;
  verses: { start: number; end: number };
  setVerses: (verses: { start: number; end: number }) => void;
  totalChapters: number;
  totalVersesInChapter: number;
}

export default function BibleSelector({
  language,
  selectedBookId,
  setSelectedBookId,
  selectedChapter,
  setSelectedChapter,
  verses,
  setVerses,
  totalChapters,
  totalVersesInChapter,
}: BibleSelectorProps) {
  // State for hierarchical selection
  const [selectedTestament, setSelectedTestament] = React.useState<string>('ALL');
  const [selectedGroup, setSelectedGroup] = React.useState<string>('ALL');

  // Update hierarchical state when book changes externally (e.g. random or search)
  React.useEffect(() => {
    const book = BIBLE_BOOKS.find((b) => b.id === selectedBookId);
    if (book) {
      const currentTestament = book.testament[language];
      const currentGroup = book.type[language] || (language === 'es' ? 'Otros' : 'Alii');

      if (currentTestament !== selectedTestament) setSelectedTestament(currentTestament);
      if (currentGroup !== selectedGroup) setSelectedGroup(currentGroup);
    }
  }, [selectedBookId, language]);

  // Derived options based on current selection
  const hierarchy = useMemo(() => {
    const testaments = new Set<string>();
    const groupsByTestament: Record<string, Set<string>> = {};
    const booksByGroup: Record<string, BibleBook[]> = {};

    BIBLE_BOOKS.forEach((book) => {
      const t = book.testament[language];
      const g = book.type[language] || (language === 'es' ? 'Otros' : 'Alii');

      testaments.add(t);

      if (!groupsByTestament[t]) groupsByTestament[t] = new Set();
      groupsByTestament[t].add(g);

      // Key for books needs to be unique pair of T+G, or just G if G is unique enough
      // But groups might have same name? Unlikely here.
      if (!booksByGroup[g]) booksByGroup[g] = [];
      booksByGroup[g].push(book);
    });

    return {
      testaments: Array.from(testaments),
      groups: (testament: string) => {
        if (testament === 'ALL') {
          // Return all unique groups across all testaments
          const allGroups = new Set<string>();
          Object.values(groupsByTestament).forEach((set) => set.forEach((g) => allGroups.add(g)));
          return Array.from(allGroups);
        }
        return Array.from(groupsByTestament[testament] || []);
      },
      books: (group: string) => {
        if (group === 'ALL') {
          // If group is ALL, we might need to filter by Testament if Testament is NOT ALL
          // But the UI flow sets Group to ALL if Testament is changed.
          // Let's refine:
          // If Testament is ALL and Group is ALL -> All books
          // If Testament is Old and Group is ALL -> All Old books?

          // Current logic: booksByGroup only keys by exact group string.
          // We need a way to get all books for a testament.
          // Let's simplify: booksByGroup[g] returns array.
          // If group is ALL, we aggregate all books visible.

          if (selectedTestament === 'ALL') {
            return BIBLE_BOOKS;
          } else {
            // Return all books in the selected testament
            return BIBLE_BOOKS.filter((b) => b.testament[language] === selectedTestament);
          }
        }
        return booksByGroup[group] || [];
      },
    };
  }, [language, selectedTestament]);

  const chapterOptions = [0, ...Array.from({ length: totalChapters }, (_, i) => i + 1)];
  const verseOptions = Array.from({ length: totalVersesInChapter }, (_, i) => i + 1);

  return (
    <div className="flex flex-row items-center gap-2 font-serif text-[#522b2b]">
      {/* Testament Selector */}
      <div className="w-40 md:w-48">
        <Select
          value={selectedTestament}
          onValueChange={(val) => {
            setSelectedTestament(val);
            // Reset to "All" groups and no specific book
            setSelectedGroup('ALL');
            setSelectedBookId('');
          }}
        >
          <SelectTrigger className="w-full h-9 bg-white/50 border-gray-200 rounded-xl focus:ring-[#8B0000] focus:ring-opacity-50 text-[#522b2b] shadow-sm backdrop-blur-sm">
            <SelectValue placeholder="Testament" />
          </SelectTrigger>
          <SelectContent className="bg-[#fdfbf7] border-[#c49b9b] text-[#522b2b]">
            <SelectItem
              value="ALL"
              className="font-bold text-[#8B0000] bg-[#ebd6d6]/50 focus:bg-[#ebd6d6] focus:text-[#522b2b]"
            >
              {language === 'la' ? 'Omnia' : 'Todos'}
            </SelectItem>
            {hierarchy.testaments.map((t) => (
              <SelectItem key={t} value={t} className="focus:bg-[#ebd6d6] focus:text-[#522b2b]">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Group Selector */}
      <div className="w-40 md:w-48 hidden md:block">
        <Select
          value={selectedGroup}
          onValueChange={(val) => {
            setSelectedGroup(val);
            // Do not pick a book automatically, let the user choose
            setSelectedBookId('');
          }}
        >
          <SelectTrigger className="w-full h-9 bg-white/50 border-gray-200 rounded-xl focus:ring-[#8B0000] focus:ring-opacity-50 text-[#522b2b] shadow-sm backdrop-blur-sm">
            <SelectValue placeholder="Group" />
          </SelectTrigger>
          <SelectContent className="bg-[#fdfbf7] border-[#c49b9b] text-[#522b2b]">
            <SelectItem
              value="ALL"
              className="font-bold text-[#8B0000] bg-[#ebd6d6]/50 focus:bg-[#ebd6d6] focus:text-[#522b2b]"
            >
              {language === 'la' ? 'Omnia' : 'Todos'}
            </SelectItem>
            {hierarchy.groups(selectedTestament).map((g) => (
              <SelectItem key={g} value={g} className="focus:bg-[#ebd6d6] focus:text-[#522b2b]">
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Book Selector */}
      <div className="w-32 md:w-40">
        <Select
          value={selectedBookId}
          onValueChange={(val) => {
            if (val === '_ALL_BOOKS_') {
              setSelectedBookId('');
            } else {
              setSelectedBookId(val);
            }
          }}
        >
          <SelectTrigger className="w-full h-9 bg-white/50 border-gray-200 rounded-xl focus:ring-[#8B0000] focus:ring-opacity-50 text-[#522b2b] shadow-sm backdrop-blur-sm">
            <SelectValue placeholder={language === 'la' ? 'Liber' : 'Libro'} />
          </SelectTrigger>
          <SelectContent className="max-h-[60vh] bg-[#fdfbf7] border-[#c49b9b] text-[#522b2b]">
            <SelectItem
              value="_ALL_BOOKS_"
              className="font-bold text-[#8B0000] bg-[#ebd6d6]/50 focus:bg-[#ebd6d6] focus:text-[#522b2b]"
            >
              {language === 'la' ? 'Omnia' : 'Todos'}
            </SelectItem>
            {hierarchy.books(selectedGroup).map((book) => (
              <SelectItem
                key={book.id}
                value={book.id}
                className="focus:bg-[#ebd6d6] focus:text-[#522b2b]"
              >
                {book.name[language]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chapter Selector */}
      <div className="w-20">
        <Select
          value={selectedChapter.toString()}
          onValueChange={(val) => setSelectedChapter(parseInt(val))}
        >
          <SelectTrigger className="w-full h-9 bg-white/50 border-gray-200 rounded-xl focus:ring-[#8B0000] focus:ring-opacity-50 text-[#522b2b] shadow-sm backdrop-blur-sm">
            <span className="truncate">
              {language === 'es' ? 'Cap. ' : 'Cap. '}
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent className="max-h-[50vh] bg-[#fdfbf7] border-[#c49b9b] text-[#522b2b]">
            {chapterOptions.map((num) => (
              <SelectItem
                key={num}
                value={num.toString()}
                className="focus:bg-[#ebd6d6] focus:text-[#522b2b]"
              >
                {num === 0 ? (language === 'la' ? 'Omnia' : 'Todo') : num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Verse Range Selector */}
      <div className="flex items-center gap-1">
        <Select
          disabled={selectedChapter === 0}
          value={verses?.start?.toString() || ''}
          onValueChange={(val) => {
            const newStart = parseInt(val);
            setVerses({ start: newStart, end: Math.max(newStart, verses.end) });
          }}
        >
          <SelectTrigger className="w-20 h-9 bg-white/50 border-gray-200 rounded-xl focus:ring-[#8B0000] focus:ring-opacity-50 text-[#522b2b] shadow-sm backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[50vh] bg-[#fdfbf7] border-[#c49b9b] text-[#522b2b]">
            <SelectItem
              value="1"
              className="font-bold text-[#8B0000] bg-[#ebd6d6]/50 focus:bg-[#ebd6d6] focus:text-[#522b2b]"
            >
              {language === 'la' ? 'Omnia' : 'Todo'}
            </SelectItem>
            {verseOptions.map((num) => (
              <SelectItem
                key={num}
                value={num.toString()}
                className="focus:bg-[#ebd6d6] focus:text-[#522b2b]"
              >
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-[#8B0000] font-bold text-sm">-</span>
        <Select
          disabled={selectedChapter === 0}
          value={verses?.end?.toString() || ''}
          onValueChange={(val) => {
            const newEnd = parseInt(val);
            setVerses({ start: Math.min(newEnd, verses.start), end: newEnd });
          }}
        >
          <SelectTrigger className="w-20 h-9 bg-white/50 border-gray-200 rounded-xl focus:ring-[#8B0000] focus:ring-opacity-50 text-[#522b2b] shadow-sm backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[50vh] bg-[#fdfbf7] border-[#c49b9b] text-[#522b2b]">
            <SelectItem
              value={totalVersesInChapter?.toString() || ''}
              className="font-bold text-[#8B0000] bg-[#ebd6d6]/50 focus:bg-[#ebd6d6] focus:text-[#522b2b]"
            >
              {language === 'la' ? 'Omnia' : 'Todo'}
            </SelectItem>
            {verseOptions.map((num) => (
              <SelectItem
                key={num}
                value={num.toString()}
                className="focus:bg-[#ebd6d6] focus:text-[#522b2b]"
              >
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
