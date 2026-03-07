import { createContext, useContext } from 'react';

export interface LayoutContextType {
  setHeaderProps: (props: {
    pageTitle?: React.ReactNode;
    year?: number;
    centerChildren?: boolean;
  }) => void;
}

export const LayoutContext = createContext<LayoutContextType | null>(null);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within an AppLayout');
  return context;
};
