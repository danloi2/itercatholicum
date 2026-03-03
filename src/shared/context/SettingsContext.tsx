import { useState, type ReactNode } from 'react';
// eslint-disable-next-line react-refresh/only-export-components
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
