import { createContext, useContext } from 'react';

export interface SettingsContextType {
  fontScale: number;
  setFontScale: (scale: number) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
