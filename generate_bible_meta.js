import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vulgataDir = path.join(__dirname, 'src/data/bibles/1592_vulgata_clementina_la');
const torresDir = path.join(__dirname, 'src/data/bibles/1823_torres_amat_es');

const vulgataFiles = fs
  .readdirSync(vulgataDir)
  .filter((f) => f.endsWith('.json'))
  .sort();
const torresFiles = fs
  .readdirSync(torresDir)
  .filter((f) => f.endsWith('.json'))
  .sort();

const books = vulgataFiles
  .map((file) => {
    const id = file.split('_')[0];
    const torresFile = torresFiles.find((f) => f.startsWith(id + '_'));

    if (!torresFile) {
      console.warn(`No Torres Amat file found for ID ${id}`);
      return null;
    }

    const content = JSON.parse(fs.readFileSync(path.join(vulgataDir, file), 'utf-8'));
    const torresContent = JSON.parse(fs.readFileSync(path.join(torresDir, torresFile), 'utf-8'));

    return {
      id: content.id,
      acronym: content.acronymum_la, // We can use the Latin acronym as key, or the ID
      name: {
        la: content.nomen_la,
        es: torresContent.nomen_es || content.nomen_es,
      },
      testament: {
        la: content.testamentum_la,
        es: torresContent.testamentum_es || content.testamentum_es,
      },
      type: {
        la: content.typus_la,
        es: torresContent.typus_es,
      },
      chapters: content.ctd_capitula,
      files: {
        vulgata: file,
        torres: torresFile,
      },
    };
  })
  .filter((b) => b !== null);

fs.writeFileSync(path.join(__dirname, 'bible_metadata.json'), JSON.stringify(books, null, 2));
console.log('Metadata written to bible_metadata.json');
