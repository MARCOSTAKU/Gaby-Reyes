import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

type PreferencesContextValue = {
  selectedInterests: string[];
  setSelectedInterests: (interests: string[]) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['diabetes', 'cardio']);
  const value = useMemo(() => ({ selectedInterests, setSelectedInterests }), [selectedInterests]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences debe utilizarse dentro de PreferencesProvider.');
  return context;
}
