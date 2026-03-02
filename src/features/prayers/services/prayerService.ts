// No unused imports here.

export interface Prayer {
  id: string;
  title: Record<string, string>;
  content: Record<string, string[]>;
  category?: string;
  seasons?: string[];
}

const prayerModules = import.meta.glob('../data/orationes/*.json', { eager: true });
const allPrayers = Object.values(prayerModules).map(
  (mod: unknown) => (mod as { default: Prayer }).default
);

export const prayerService = {
  getPrayers(): Prayer[] {
    return allPrayers;
  },

  getPrayerById(id: string): Prayer | undefined {
    return allPrayers.find((p) => p.id === id);
  },

  getPrayersBySeason(seasonId: string): Prayer[] {
    return allPrayers.filter((p) => p.seasons?.includes(seasonId));
  },

  getPrayersCountBySeason(): Record<string, number> {
    const countMap: Record<string, number> = {};
    allPrayers.forEach((prayer) => {
      prayer.seasons?.forEach((season) => {
        countMap[season] = (countMap[season] || 0) + 1;
      });
    });
    return countMap;
  },

  getRandomPrayer(): Prayer {
    return allPrayers[Math.floor(Math.random() * allPrayers.length)];
  },
};
