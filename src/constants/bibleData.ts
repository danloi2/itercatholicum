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
    acronym: 'Gn',
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
      vulgata: '01_Gn_la.json',
      torres: '01_Gn_es.json',
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
      vulgata: '02_Ex_la.json',
      torres: '02_Ex_es.json',
    },
  },
  {
    id: '03',
    acronym: 'Lv',
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
      vulgata: '03_Lv_la.json',
      torres: '03_Lv_es.json',
    },
  },
  {
    id: '04',
    acronym: 'Nm',
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
      vulgata: '04_Nm_la.json',
      torres: '04_Nm_es.json',
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
      vulgata: '05_Dt_la.json',
      torres: '05_Dt_es.json',
    },
  },
  {
    id: '06',
    acronym: 'Ios',
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
      vulgata: '06_Ios_la.json',
      torres: '06_Jos_es.json',
    },
  },
  {
    id: '07',
    acronym: 'Iud',
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
      vulgata: '07_Iud_la.json',
      torres: '07_Jue_es.json',
    },
  },
  {
    id: '08',
    acronym: 'Ruth',
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
      vulgata: '08_Ruth_la.json',
      torres: '08_Rut_es.json',
    },
  },
  {
    id: '09',
    acronym: '1 Reg',
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
      vulgata: '09_1_Reg_la.json',
      torres: '09_1_Sm_es.json',
    },
  },
  {
    id: '10',
    acronym: '2 Reg',
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
      vulgata: '10_2_Reg_la.json',
      torres: '10_2_Sm_es.json',
    },
  },
  {
    id: '11',
    acronym: '3 Reg',
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
      vulgata: '11_3_Reg_la.json',
      torres: '11_1_Re_es.json',
    },
  },
  {
    id: '12',
    acronym: '4 Reg',
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
      vulgata: '12_4_Reg_la.json',
      torres: '12_2_Re_es.json',
    },
  },
  {
    id: '13',
    acronym: '1 Par',
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
      vulgata: '13_1_Par_la.json',
      torres: '13_1_Cr_es.json',
    },
  },
  {
    id: '14',
    acronym: '2 Par',
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
      vulgata: '14_2_Par_la.json',
      torres: '14_2_Cr_es.json',
    },
  },
  {
    id: '15',
    acronym: 'Esd',
    name: {
      la: 'Esdras',
      es: 'Esdrás',
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
      vulgata: '15_Esd_la.json',
      torres: '15_Esd_es.json',
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
      vulgata: '16_Neh_la.json',
      torres: '16_Neh_es.json',
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
      vulgata: '17_Tob_la.json',
      torres: '17_Tob_es.json',
    },
  },
  {
    id: '18',
    acronym: 'Iudt',
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
      vulgata: '18_Iudt_la.json',
      torres: '18_Jdt_es.json',
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
      vulgata: '19_Est_la.json',
      torres: '19_Est_es.json',
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
      vulgata: '20_1_Mac_la.json',
      torres: '20_1_Mac_es.json',
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
      vulgata: '21_2_Mac_la.json',
      torres: '21_2_Mac_es.json',
    },
  },
  {
    id: '22',
    acronym: 'Iob',
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
      vulgata: '22_Iob_la.json',
      torres: '22_Job_es.json',
    },
  },
  {
    id: '23',
    acronym: 'Ps',
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
      vulgata: '23_Ps_la.json',
      torres: '23_Sal_es.json',
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
      vulgata: '24_Prov_la.json',
      torres: '24_Prov_es.json',
    },
  },
  {
    id: '25',
    acronym: 'Qo',
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
      vulgata: '25_Qo_la.json',
      torres: '25_Qo_es.json',
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
      vulgata: '26_Cant_la.json',
      torres: '26_Ct_es.json',
    },
  },
  {
    id: '27',
    acronym: 'Sap',
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
      vulgata: '27_Sap_la.json',
      torres: '27_Sab_es.json',
    },
  },
  {
    id: '28',
    acronym: 'Sir',
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
      vulgata: '28_Sir_la.json',
      torres: '28_Eclo_es.json',
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
      vulgata: '29_Is_la.json',
      torres: '29_Is_es.json',
    },
  },
  {
    id: '30',
    acronym: 'Ier',
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
      vulgata: '30_Ier_la.json',
      torres: '30_Jer_es.json',
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
      vulgata: '31_Lam_la.json',
      torres: '31_Lam_es.json',
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
      vulgata: '32_Bar_la.json',
      torres: '32_Bar_es.json',
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
      vulgata: '33_Ez_la.json',
      torres: '33_Ez_es.json',
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
      vulgata: '34_Dan_la.json',
      torres: '34_Dan_es.json',
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
      vulgata: '35_Os_la.json',
      torres: '35_Os_es.json',
    },
  },
  {
    id: '36',
    acronym: 'Ioel',
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
      vulgata: '36_Ioel_la.json',
      torres: '36_Jl_es.json',
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
      vulgata: '37_Am_la.json',
      torres: '37_Am_es.json',
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
      vulgata: '38_Abd_la.json',
      torres: '38_Abd_es.json',
    },
  },
  {
    id: '39',
    acronym: 'Ion',
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
      vulgata: '39_Ion_la.json',
      torres: '39_Jon_es.json',
    },
  },
  {
    id: '40',
    acronym: 'Mich',
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
      vulgata: '40_Mich_la.json',
      torres: '40_Miq_es.json',
    },
  },
  {
    id: '41',
    acronym: 'Nah',
    name: {
      la: 'Nahum',
      es: 'Nahum',
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
      vulgata: '41_Nah_la.json',
      torres: '41_Nah_es.json',
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
      vulgata: '42_Hab_la.json',
      torres: '42_Hab_es.json',
    },
  },
  {
    id: '43',
    acronym: 'Soph',
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
      vulgata: '43_Soph_la.json',
      torres: '43_Sof_es.json',
    },
  },
  {
    id: '44',
    acronym: 'Agg',
    name: {
      la: 'Aggaeus',
      es: 'Hageo',
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
      vulgata: '44_Agg_la.json',
      torres: '44_Ag_es.json',
    },
  },
  {
    id: '45',
    acronym: 'Zach',
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
      vulgata: '45_Zach_la.json',
      torres: '45_Zac_es.json',
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
      vulgata: '46_Mal_la.json',
      torres: '46_Mal_es.json',
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
      vulgata: '47_Mt_la.json',
      torres: '47_Mt_es.json',
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
      vulgata: '48_Mc_la.json',
      torres: '48_Mc_es.json',
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
      vulgata: '49_Lc_la.json',
      torres: '49_Lc_es.json',
    },
  },
  {
    id: '50',
    acronym: 'Io',
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
      vulgata: '50_Io_la.json',
      torres: '50_Jn_es.json',
    },
  },
  {
    id: '51',
    acronym: 'Act',
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
      vulgata: '51_Act_la.json',
      torres: '51_Hch_es.json',
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
      vulgata: '52_Rom_la.json',
      torres: '52_Rom_es.json',
    },
  },
  {
    id: '53',
    acronym: '1 Cor',
    name: {
      la: '1 Ad Corinthios',
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
      vulgata: '53_1_Cor_la.json',
      torres: '53_1_Co_es.json',
    },
  },
  {
    id: '54',
    acronym: '2 Cor',
    name: {
      la: '2 Ad Corinthios',
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
      vulgata: '54_2_Cor_la.json',
      torres: '54_2_Co_es.json',
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
      vulgata: '55_Gal_la.json',
      torres: '55_Gal_es.json',
    },
  },
  {
    id: '56',
    acronym: 'Eph',
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
      vulgata: '56_Eph_la.json',
      torres: '56_Ef_es.json',
    },
  },
  {
    id: '57',
    acronym: 'Phil',
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
      vulgata: '57_Phil_la.json',
      torres: '57_Flp_es.json',
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
      vulgata: '58_Col_la.json',
      torres: '58_Col_es.json',
    },
  },
  {
    id: '59',
    acronym: '1 Thess',
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
      vulgata: '59_1_Thess_la.json',
      torres: '59_1_Tes_es.json',
    },
  },
  {
    id: '60',
    acronym: '2 Thess',
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
      vulgata: '60_2_Thess_la.json',
      torres: '60_2_Tes_es.json',
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
      vulgata: '61_1_Tim_la.json',
      torres: '61_1_Tim_es.json',
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
      vulgata: '62_2_Tim_la.json',
      torres: '62_2_Tim_es.json',
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
      vulgata: '63_Tit_la.json',
      torres: '63_Tit_es.json',
    },
  },
  {
    id: '64',
    acronym: 'Phlm',
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
      vulgata: '64_Phlm_la.json',
      torres: '64_Flm_es.json',
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
      vulgata: '65_Heb_la.json',
      torres: '65_Heb_es.json',
    },
  },
  {
    id: '66',
    acronym: 'Iac',
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
      vulgata: '66_Iac_la.json',
      torres: '66_Stg_es.json',
    },
  },
  {
    id: '67',
    acronym: '1 Ptr',
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
      vulgata: '67_1_Ptr_la.json',
      torres: '67_1_Pe_es.json',
    },
  },
  {
    id: '68',
    acronym: '2 Ptr',
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
      vulgata: '68_2_Ptr_la.json',
      torres: '68_2_Pe_es.json',
    },
  },
  {
    id: '69',
    acronym: '1 Io',
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
      vulgata: '69_1_Io_la.json',
      torres: '69_1_Jn_es.json',
    },
  },
  {
    id: '70',
    acronym: '2 Io',
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
      vulgata: '70_2_Io_la.json',
      torres: '70_2_Jn_es.json',
    },
  },
  {
    id: '71',
    acronym: '3 Io',
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
      vulgata: '71_3_Io_la.json',
      torres: '71_3_Jn_es.json',
    },
  },
  {
    id: '72',
    acronym: 'Iud',
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
      vulgata: '72_Iud_la.json',
      torres: '72_Jud_es.json',
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
      vulgata: '73_Ap_la.json',
      torres: '73_Ap_es.json',
    },
  },
];
