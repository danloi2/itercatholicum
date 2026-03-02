import { UI_STRINGS } from '@shared/constants/config';
import type { UiLanguage } from '@shared/types';

export function useTranslation(language: UiLanguage) {
  const t = UI_STRINGS[language];

  const translate = (key: string) => {
    // This can be expanded later if we have a flatter structure or nested keys
    // For now, it just returns common UI strings
    return (t as unknown as Record<string, string>)[key] || key;
  };

  return { t, translate };
}
