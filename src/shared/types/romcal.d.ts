declare module 'romcal' {
  export default class Romcal {
    constructor(config?: unknown);
    generateCalendar(year: number): Promise<Record<string, LiturgicalDay[]>>;
  }

  export interface LiturgicalDay {
    date: string;
    name: string;
    rank: string;
    rankName: string;
    colors: string[];
    seasonNames: string[];
    cycles: unknown;
    calendar: unknown;
    // Add more fields as needed
  }
}
