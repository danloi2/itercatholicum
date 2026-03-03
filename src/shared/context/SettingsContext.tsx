import { useState, type ReactNode } from 'react';
export { useSettings, SettingsContext } from './SettingsContext.types';
export type { SettingsContextType } from './SettingsContext.types';
import { SettingsContext } from './SettingsContext.types';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScale] = useState<number>(1);

  return (
    <SettingsContext.Provider value={{ fontScale, setFontScale }}>
      {children}
    </SettingsContext.Provider>
  );
}
