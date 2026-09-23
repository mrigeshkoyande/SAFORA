import { createContext, useContext } from 'react';
import type { AppState, User, Contact, GuardianModeState, SOSState, NavTab } from '../types';

export interface AppContextValue {
  state: AppState;
  setUser: (user: User | null) => void;
  setAuthenticated: (auth: boolean) => void;
  setGuardianMode: (mode: Partial<GuardianModeState>) => void;
  setSosState: (state: SOSState) => void;
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  setNavTab: (tab: NavTab) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
