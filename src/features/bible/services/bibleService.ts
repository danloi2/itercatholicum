import { BIBLE_BOOKS } from '../constants/bibleVersions';

const bibleModules = {
  vulgata: import.meta.glob('../data/1592_vulgata_clementina_la/*.json'),
  torres: import.meta.glob('../data/1823_torres_amat_es/*.json'),
};

export const bibleService = {
  async loadBookData(bookId: string, version: 'vulgata' | 'torres') {
    const book = BIBLE_BOOKS.find((b) => b.id === bookId);
    if (!book) throw new Error(`Book not found: ${bookId}`);

    const filename = version === 'vulgata' ? book.files.vulgata : book.files.torres;
    const fileBase = filename.replace('.json', '');
    const modules = version === 'vulgata' ? bibleModules.vulgata : bibleModules.torres;
    const key =
      version === 'vulgata'
        ? `../data/1592_vulgata_clementina_la/${fileBase}.json`
        : `../data/1823_torres_amat_es/${fileBase}.json`;

    const loader = modules[key];
    if (!loader) throw new Error(`File not found: ${key}`);

    const module = (await loader()) as { default: { capitula: unknown[] } };
    return module.default;
  },

  getRandomReference() {
    const randomBook = BIBLE_BOOKS[Math.floor(Math.random() * BIBLE_BOOKS.length)];
    const randomChapterNum = Math.floor(Math.random() * randomBook.chapters) + 1;
    return { bookId: randomBook.id, chapter: randomChapterNum };
  },
};
