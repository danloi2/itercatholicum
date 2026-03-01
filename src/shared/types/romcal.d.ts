declare module 'romcal' {
  export default class Romcal {
    constructor(config?: any);
    generateCalendar(year: number): Promise<Record<string, LiturgicalDay[]>>;
  }

  export interface LiturgicalDay {
    date: string;
    name: string;
    rank: string;
    rankName: string;
    colors: string[];
    seasonNames: string[];
    cycles: any;
    calendar: any;
    // Add more fields as needed
  }
}
