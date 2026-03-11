export interface BibleBook {
  id: string;
  acronym: string;
  name: {
    la: string;
    es: string;
  };
  testament: {
    la: string;
    es: string;
  };
  type: {
    la: string;
    es?: string;
  };
  chapters: number;
  files: {
    vulgata: string;
    torres: string;
  };
}

export const BIBLE_BOOKS: BibleBook[] = [
  {
    id: '01',
    acronym: 'Gen',
    name: {
      la: 'Genesis',
      es: 'Génesis',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Pentateuchus',
      es: 'Pentateuco',
    },
    chapters: 50,
    files: {
      vulgata: '01-gen-vc-la.json',
      torres: '01-gen-ta-es.json',
    },
  },
  {
    id: '02',
    acronym: 'Ex',
    name: {
      la: 'Exodus',
      es: 'Éxodo',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Pentateuchus',
      es: 'Pentateuco',
    },
    chapters: 40,
    files: {
      vulgata: '02-ex-vc-la.json',
      torres: '02-ex-ta-es.json',
    },
  },
  {
    id: '03',
    acronym: 'Lev',
    name: {
      la: 'Leviticus',
      es: 'Levítico',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Pentateuchus',
      es: 'Pentateuco',
    },
    chapters: 27,
    files: {
      vulgata: '03-lev-vc-la.json',
      torres: '03-lev-ta-es.json',
    },
  },
  {
    id: '04',
    acronym: 'Num',
    name: {
      la: 'Numeri',
      es: 'Números',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Pentateuchus',
      es: 'Pentateuco',
    },
    chapters: 36,
    files: {
      vulgata: '04-num-vc-la.json',
      torres: '04-num-ta-es.json',
    },
  },
  {
    id: '05',
    acronym: 'Dt',
    name: {
      la: 'Deuteronomium',
      es: 'Deuteronomio',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Pentateuchus',
      es: 'Pentateuco',
    },
    chapters: 34,
    files: {
      vulgata: '05-dt-vc-la.json',
      torres: '05-dt-ta-es.json',
    },
  },
  {
    id: '06',
    acronym: 'Jos',
    name: {
      la: 'Iosue',
      es: 'Josué',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 24,
    files: {
      vulgata: '06-jos-vc-la.json',
      torres: '06-jos-ta-es.json',
    },
  },
  {
    id: '07',
    acronym: 'Jue',
    name: {
      la: 'Iudices',
      es: 'Jueces',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 21,
    files: {
      vulgata: '07-jue-vc-la.json',
      torres: '07-jue-ta-es.json',
    },
  },
  {
    id: '08',
    acronym: 'Rut',
    name: {
      la: 'Ruth',
      es: 'Rut',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 4,
    files: {
      vulgata: '08-rut-vc-la.json',
      torres: '08-rut-ta-es.json',
    },
  },
  {
    id: '09',
    acronym: '1 Sam',
    name: {
      la: '1 Samuelis',
      es: '1 Samuel',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 31,
    files: {
      vulgata: '09-1sam-vc-la.json',
      torres: '09-1sam-ta-es.json',
    },
  },
  {
    id: '10',
    acronym: '2 Sam',
    name: {
      la: '2 Samuelis',
      es: '2 Samuel',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 24,
    files: {
      vulgata: '10-2sam-vc-la.json',
      torres: '10-2sam-ta-es.json',
    },
  },
  {
    id: '11',
    acronym: '1 Re',
    name: {
      la: '1 Regum',
      es: '1 Reyes',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 22,
    files: {
      vulgata: '11-1re-vc-la.json',
      torres: '11-1re-ta-es.json',
    },
  },
  {
    id: '12',
    acronym: '2 Re',
    name: {
      la: '2 Regum',
      es: '2 Reyes',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 25,
    files: {
      vulgata: '12-2re-vc-la.json',
      torres: '12-2re-ta-es.json',
    },
  },
  {
    id: '13',
    acronym: '1 Cron',
    name: {
      la: '1 Paralipomenon',
      es: '1 Crónicas',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 29,
    files: {
      vulgata: '13-1cron-vc-la.json',
      torres: '13-1cron-ta-es.json',
    },
  },
  {
    id: '14',
    acronym: '2 Cron',
    name: {
      la: '2 Paralipomenon',
      es: '2 Crónicas',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 36,
    files: {
      vulgata: '14-2cron-vc-la.json',
      torres: '14-2cron-ta-es.json',
    },
  },
  {
    id: '15',
    acronym: 'Esd',
    name: {
      la: 'Esdras',
      es: 'Esdras',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 10,
    files: {
      vulgata: '15-esd-vc-la.json',
      torres: '15-esd-ta-es.json',
    },
  },
  {
    id: '16',
    acronym: 'Neh',
    name: {
      la: 'Nehemias',
      es: 'Nehemías',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 13,
    files: {
      vulgata: '16-neh-vc-la.json',
      torres: '16-neh-ta-es.json',
    },
  },
  {
    id: '17',
    acronym: 'Tob',
    name: {
      la: 'Tobias',
      es: 'Tobías',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 14,
    files: {
      vulgata: '17-tob-vc-la.json',
      torres: '17-tob-ta-es.json',
    },
  },
  {
    id: '18',
    acronym: 'Jdt',
    name: {
      la: 'Iudith',
      es: 'Judit',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 16,
    files: {
      vulgata: '18-jdt-vc-la.json',
      torres: '18-jdt-ta-es.json',
    },
  },
  {
    id: '19',
    acronym: 'Est',
    name: {
      la: 'Esther',
      es: 'Ester',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 16,
    files: {
      vulgata: '19-est-vc-la.json',
      torres: '19-est-ta-es.json',
    },
  },
  {
    id: '20',
    acronym: '1 Mac',
    name: {
      la: '1 Machabaeorum',
      es: '1 Macabeos',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 16,
    files: {
      vulgata: '20-1mac-vc-la.json',
      torres: '20-1mac-ta-es.json',
    },
  },
  {
    id: '21',
    acronym: '2 Mac',
    name: {
      la: '2 Machabaeorum',
      es: '2 Macabeos',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri historici',
      es: 'Libros históricos',
    },
    chapters: 15,
    files: {
      vulgata: '21-2mac-vc-la.json',
      torres: '21-2mac-ta-es.json',
    },
  },
  {
    id: '22',
    acronym: 'Job',
    name: {
      la: 'Iob',
      es: 'Job',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri sapientiales et poetici',
      es: 'Libros sapienciales y poéticos',
    },
    chapters: 42,
    files: {
      vulgata: '22-job-vc-la.json',
      torres: '22-job-ta-es.json',
    },
  },
  {
    id: '23',
    acronym: 'Sal',
    name: {
      la: 'Psalmi',
      es: 'Salmos',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri sapientiales et poetici',
      es: 'Libros sapienciales y poéticos',
    },
    chapters: 150,
    files: {
      vulgata: '23-sal-vc-la.json',
      torres: '23-sal-ta-es.json',
    },
  },
  {
    id: '24',
    acronym: 'Prov',
    name: {
      la: 'Proverbia',
      es: 'Proverbios',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri sapientiales et poetici',
      es: 'Libros sapienciales y poéticos',
    },
    chapters: 31,
    files: {
      vulgata: '24-prov-vc-la.json',
      torres: '24-prov-ta-es.json',
    },
  },
  {
    id: '25',
    acronym: 'Ecl',
    name: {
      la: 'Ecclesiastes',
      es: 'Eclesiastés',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri sapientiales et poetici',
      es: 'Libros sapienciales y poéticos',
    },
    chapters: 12,
    files: {
      vulgata: '25-ecl-vc-la.json',
      torres: '25-ecl-ta-es.json',
    },
  },
  {
    id: '26',
    acronym: 'Cant',
    name: {
      la: 'Canticum Canticorum',
      es: 'Cantar de los Cantares',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri sapientiales et poetici',
      es: 'Libros sapienciales y poéticos',
    },
    chapters: 8,
    files: {
      vulgata: '26-cant-vc-la.json',
      torres: '26-cant-ta-es.json',
    },
  },
  {
    id: '27',
    acronym: 'Sab',
    name: {
      la: 'Sapientia',
      es: 'Sabiduría',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri sapientiales et poetici',
      es: 'Libros sapienciales y poéticos',
    },
    chapters: 19,
    files: {
      vulgata: '27-sab-vc-la.json',
      torres: '27-sab-ta-es.json',
    },
  },
  {
    id: '28',
    acronym: 'Eclo',
    name: {
      la: 'Sirach',
      es: 'Eclesiástico',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri sapientiales et poetici',
      es: 'Libros sapienciales y poéticos',
    },
    chapters: 51,
    files: {
      vulgata: '28-eclo-vc-la.json',
      torres: '28-eclo-ta-es.json',
    },
  },
  {
    id: '29',
    acronym: 'Is',
    name: {
      la: 'Isaias',
      es: 'Isaías',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 66,
    files: {
      vulgata: '29-is-vc-la.json',
      torres: '29-is-ta-es.json',
    },
  },
  {
    id: '30',
    acronym: 'Jer',
    name: {
      la: 'Ieremias',
      es: 'Jeremías',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 52,
    files: {
      vulgata: '30-jer-vc-la.json',
      torres: '30-jer-ta-es.json',
    },
  },
  {
    id: '31',
    acronym: 'Lam',
    name: {
      la: 'Lamentationes',
      es: 'Lamentaciones',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 5,
    files: {
      vulgata: '31-lam-vc-la.json',
      torres: '31-lam-ta-es.json',
    },
  },
  {
    id: '32',
    acronym: 'Bar',
    name: {
      la: 'Baruch',
      es: 'Baruc',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 6,
    files: {
      vulgata: '32-bar-vc-la.json',
      torres: '32-bar-ta-es.json',
    },
  },
  {
    id: '33',
    acronym: 'Ez',
    name: {
      la: 'Ezechiel',
      es: 'Ezequiel',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 48,
    files: {
      vulgata: '33-ez-vc-la.json',
      torres: '33-ez-ta-es.json',
    },
  },
  {
    id: '34',
    acronym: 'Dan',
    name: {
      la: 'Daniel',
      es: 'Daniel',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 14,
    files: {
      vulgata: '34-dan-vc-la.json',
      torres: '34-dan-ta-es.json',
    },
  },
  {
    id: '35',
    acronym: 'Os',
    name: {
      la: 'Osee',
      es: 'Oseas',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 14,
    files: {
      vulgata: '35-os-vc-la.json',
      torres: '35-os-ta-es.json',
    },
  },
  {
    id: '36',
    acronym: 'Jl',
    name: {
      la: 'Ioel',
      es: 'Joel',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 3,
    files: {
      vulgata: '36-jl-vc-la.json',
      torres: '36-jl-ta-es.json',
    },
  },
  {
    id: '37',
    acronym: 'Am',
    name: {
      la: 'Amos',
      es: 'Amós',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 9,
    files: {
      vulgata: '37-am-vc-la.json',
      torres: '37-am-ta-es.json',
    },
  },
  {
    id: '38',
    acronym: 'Abd',
    name: {
      la: 'Abdias',
      es: 'Abdías',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 1,
    files: {
      vulgata: '38-abd-vc-la.json',
      torres: '38-abd-ta-es.json',
    },
  },
  {
    id: '39',
    acronym: 'Jon',
    name: {
      la: 'Ionas',
      es: 'Jonás',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 4,
    files: {
      vulgata: '39-jon-vc-la.json',
      torres: '39-jon-ta-es.json',
    },
  },
  {
    id: '40',
    acronym: 'Miq',
    name: {
      la: 'Michaes',
      es: 'Miqueas',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 7,
    files: {
      vulgata: '40-miq-vc-la.json',
      torres: '40-miq-ta-es.json',
    },
  },
  {
    id: '41',
    acronym: 'Nah',
    name: {
      la: 'Nahum',
      es: 'Nahúm',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 3,
    files: {
      vulgata: '41-nah-vc-la.json',
      torres: '41-nah-ta-es.json',
    },
  },
  {
    id: '42',
    acronym: 'Hab',
    name: {
      la: 'Habacuc',
      es: 'Habacuc',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 3,
    files: {
      vulgata: '42-hab-vc-la.json',
      torres: '42-hab-ta-es.json',
    },
  },
  {
    id: '43',
    acronym: 'Sof',
    name: {
      la: 'Sophonias',
      es: 'Sofonías',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 3,
    files: {
      vulgata: '43-sof-vc-la.json',
      torres: '43-sof-ta-es.json',
    },
  },
  {
    id: '44',
    acronym: 'Ag',
    name: {
      la: 'Aggaeus',
      es: 'Ageo',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 2,
    files: {
      vulgata: '44-ag-vc-la.json',
      torres: '44-ag-ta-es.json',
    },
  },
  {
    id: '45',
    acronym: 'Zac',
    name: {
      la: 'Zacharias',
      es: 'Zacarías',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 14,
    files: {
      vulgata: '45-zac-vc-la.json',
      torres: '45-zac-ta-es.json',
    },
  },
  {
    id: '46',
    acronym: 'Mal',
    name: {
      la: 'Malachias',
      es: 'Malaquías',
    },
    testament: {
      la: 'Vetus Testamentum',
      es: 'Antiguo Testamento',
    },
    type: {
      la: 'Libri prophetici',
      es: 'Libros proféticos',
    },
    chapters: 4,
    files: {
      vulgata: '46-mal-vc-la.json',
      torres: '46-mal-ta-es.json',
    },
  },
  {
    id: '47',
    acronym: 'Mt',
    name: {
      la: 'Matthaeus',
      es: 'Mateo',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Evangelia',
      es: 'Evangelios',
    },
    chapters: 28,
    files: {
      vulgata: '47-mt-vc-la.json',
      torres: '47-mt-ta-es.json',
    },
  },
  {
    id: '48',
    acronym: 'Mc',
    name: {
      la: 'Marcus',
      es: 'Marcos',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Evangelia',
      es: 'Evangelios',
    },
    chapters: 16,
    files: {
      vulgata: '48-mc-vc-la.json',
      torres: '48-mc-ta-es.json',
    },
  },
  {
    id: '49',
    acronym: 'Lc',
    name: {
      la: 'Lucas',
      es: 'Lucas',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Evangelia',
      es: 'Evangelios',
    },
    chapters: 24,
    files: {
      vulgata: '49-lc-vc-la.json',
      torres: '49-lc-ta-es.json',
    },
  },
  {
    id: '50',
    acronym: 'Jn',
    name: {
      la: 'Ioannes',
      es: 'Juan',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Evangelia',
      es: 'Evangelios',
    },
    chapters: 21,
    files: {
      vulgata: '50-jn-vc-la.json',
      torres: '50-jn-ta-es.json',
    },
  },
  {
    id: '51',
    acronym: 'Hch',
    name: {
      la: 'Actus Apostolorum',
      es: 'Hechos de los Apóstoles',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Actus Apostolorum',
      es: 'Hechos de los Apóstoles',
    },
    chapters: 28,
    files: {
      vulgata: '51-hch-vc-la.json',
      torres: '51-hch-ta-es.json',
    },
  },
  {
    id: '52',
    acronym: 'Rom',
    name: {
      la: 'Ad Romanos',
      es: 'Romanos',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 16,
    files: {
      vulgata: '52-rom-vc-la.json',
      torres: '52-rom-ta-es.json',
    },
  },
  {
    id: '53',
    acronym: '1 Cor',
    name: {
      la: '1 ad Corinthios',
      es: '1 Corintios',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 16,
    files: {
      vulgata: '53-1cor-vc-la.json',
      torres: '53-1cor-ta-es.json',
    },
  },
  {
    id: '54',
    acronym: '2 Cor',
    name: {
      la: '2 ad Corinthios',
      es: '2 Corintios',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 13,
    files: {
      vulgata: '54-2cor-vc-la.json',
      torres: '54-2cor-ta-es.json',
    },
  },
  {
    id: '55',
    acronym: 'Gal',
    name: {
      la: 'Ad Galatas',
      es: 'Gálatas',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 6,
    files: {
      vulgata: '55-gal-vc-la.json',
      torres: '55-gal-ta-es.json',
    },
  },
  {
    id: '56',
    acronym: 'Ef',
    name: {
      la: 'Ad Ephesios',
      es: 'Efesios',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 6,
    files: {
      vulgata: '56-ef-vc-la.json',
      torres: '56-ef-ta-es.json',
    },
  },
  {
    id: '57',
    acronym: 'Flp',
    name: {
      la: 'Ad Philippenses',
      es: 'Filipenses',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 4,
    files: {
      vulgata: '57-flp-vc-la.json',
      torres: '57-flp-ta-es.json',
    },
  },
  {
    id: '58',
    acronym: 'Col',
    name: {
      la: 'Ad Colossenses',
      es: 'Colosenses',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 4,
    files: {
      vulgata: '58-col-vc-la.json',
      torres: '58-col-ta-es.json',
    },
  },
  {
    id: '59',
    acronym: '1 Tes',
    name: {
      la: '1 Ad Thessalonicenses',
      es: '1 Tesalonicenses',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 5,
    files: {
      vulgata: '59-1tes-vc-la.json',
      torres: '59-1tes-ta-es.json',
    },
  },
  {
    id: '60',
    acronym: '2 Tes',
    name: {
      la: '2 Ad Thessalonicenses',
      es: '2 Tesalonicenses',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 3,
    files: {
      vulgata: '60-2tes-vc-la.json',
      torres: '60-2tes-ta-es.json',
    },
  },
  {
    id: '61',
    acronym: '1 Tim',
    name: {
      la: '1 Ad Timotheum',
      es: '1 Timoteo',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 6,
    files: {
      vulgata: '61-1tim-vc-la.json',
      torres: '61-1tim-ta-es.json',
    },
  },
  {
    id: '62',
    acronym: '2 Tim',
    name: {
      la: '2 Ad Timotheum',
      es: '2 Timoteo',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 4,
    files: {
      vulgata: '62-2tim-vc-la.json',
      torres: '62-2tim-ta-es.json',
    },
  },
  {
    id: '63',
    acronym: 'Tit',
    name: {
      la: 'Ad Titum',
      es: 'Tito',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 3,
    files: {
      vulgata: '63-tit-vc-la.json',
      torres: '63-tit-ta-es.json',
    },
  },
  {
    id: '64',
    acronym: 'Flm',
    name: {
      la: 'Ad Philemonem',
      es: 'Filemón',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 1,
    files: {
      vulgata: '64-flm-vc-la.json',
      torres: '64-flm-ta-es.json',
    },
  },
  {
    id: '65',
    acronym: 'Heb',
    name: {
      la: 'Ad Hebraeos',
      es: 'Hebreos',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Paulinae',
      es: 'Cartas de San Pablo',
    },
    chapters: 13,
    files: {
      vulgata: '65-heb-vc-la.json',
      torres: '65-heb-ta-es.json',
    },
  },
  {
    id: '66',
    acronym: 'Sant',
    name: {
      la: 'Iacobi',
      es: 'Santiago',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Catholicae',
      es: 'Cartas Católicas',
    },
    chapters: 5,
    files: {
      vulgata: '66-sant-vc-la.json',
      torres: '66-sant-ta-es.json',
    },
  },
  {
    id: '67',
    acronym: '1 Pe',
    name: {
      la: '1 Petri',
      es: '1 Pedro',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Catholicae',
      es: 'Cartas Católicas',
    },
    chapters: 5,
    files: {
      vulgata: '67-1pe-vc-la.json',
      torres: '67-1pe-ta-es.json',
    },
  },
  {
    id: '68',
    acronym: '2 Pe',
    name: {
      la: '2 Petri',
      es: '2 Pedro',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Catholicae',
      es: 'Cartas Católicas',
    },
    chapters: 3,
    files: {
      vulgata: '68-2pe-vc-la.json',
      torres: '68-2pe-ta-es.json',
    },
  },
  {
    id: '69',
    acronym: '1 Jn',
    name: {
      la: '1 Ioannis',
      es: '1 Juan',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Ioannis',
      es: 'Cartas de San Juan',
    },
    chapters: 5,
    files: {
      vulgata: '69-1jn-vc-la.json',
      torres: '69-1jn-ta-es.json',
    },
  },
  {
    id: '70',
    acronym: '2 Jn',
    name: {
      la: '2 Ioannis',
      es: '2 Juan',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Ioannis',
      es: 'Cartas de San Juan',
    },
    chapters: 1,
    files: {
      vulgata: '70-2jn-vc-la.json',
      torres: '70-2jn-ta-es.json',
    },
  },
  {
    id: '71',
    acronym: '3 Jn',
    name: {
      la: '3 Ioannis',
      es: '3 Juan',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Epistulae Ioannis',
      es: 'Cartas de San Juan',
    },
    chapters: 1,
    files: {
      vulgata: '71-3jn-vc-la.json',
      torres: '71-3jn-ta-es.json',
    },
  },
  {
    id: '72',
    acronym: 'Jds',
    name: {
      la: 'Iudae',
      es: 'Judas',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Iudas',
      es: 'Judas',
    },
    chapters: 1,
    files: {
      vulgata: '72-jds-vc-la.json',
      torres: '72-jds-ta-es.json',
    },
  },
  {
    id: '73',
    acronym: 'Ap',
    name: {
      la: 'Apocalypsis',
      es: 'Apocalipsis',
    },
    testament: {
      la: 'Novum Testamentum',
      es: 'Nuevo Testamento',
    },
    type: {
      la: 'Apocalypsis',
      es: 'Apocalipsis',
    },
    chapters: 22,
    files: {
      vulgata: '73-ap-vc-la.json',
      torres: '73-ap-ta-es.json',
    },
  },
];
