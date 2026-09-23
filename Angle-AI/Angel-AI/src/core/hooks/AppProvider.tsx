/* eslint-disable react/only-export-components */
import React, { useReducer, useCallback, type ReactNode } from 'react';
import type { AppState, User, Contact, GuardianModeState, SOSState, NavTab } from '../types';
import { AppContext } from './useApp';

// ── Initial State ─────────────────────────────────────────────
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  guardianMode: {
    isActive: false,
    status: 'inactive',
    checkInsEnabled: true,
    anomalyDetectionEnabled: true,
    realTimeTracking: true,
    checkpoints: [],
  },
  sosData: {
    state: 'idle',
    contacts: [],
    countdown: 3,
  },
  contacts: [],
  activeNavTab: 'home',
};

// ── Actions ───────────────────────────────────────────────────
type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTH'; payload: boolean }
  | { type: 'SET_GUARDIAN_MODE'; payload: Partial<GuardianModeState> }
  | { type: 'SET_SOS_STATE'; payload: SOSState }
  | { type: 'SET_CONTACTS'; payload: Contact[] }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'SET_NAV_TAB'; payload: NavTab };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTH':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_GUARDIAN_MODE':
      return { ...state, guardianMode: { ...state.guardianMode, ...action.payload } };
    case 'SET_SOS_STATE':
      return { ...state, sosData: { ...state.sosData, state: action.payload } };
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload };
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'SET_NAV_TAB':
      return { ...state, activeNavTab: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUser = useCallback((user: User | null) => dispatch({ type: 'SET_USER', payload: user }), []);
  const setAuthenticated = useCallback((auth: boolean) => dispatch({ type: 'SET_AUTH', payload: auth }), []);
  const setGuardianMode = useCallback((mode: Partial<GuardianModeState>) => dispatch({ type: 'SET_GUARDIAN_MODE', payload: mode }), []);
  const setSosState = useCallback((sosState: SOSState) => dispatch({ type: 'SET_SOS_STATE', payload: sosState }), []);
  const setContacts = useCallback((contacts: Contact[]) => dispatch({ type: 'SET_CONTACTS', payload: contacts }), []);
  const addContact = useCallback((contact: Contact) => dispatch({ type: 'ADD_CONTACT', payload: contact }), []);
  const setNavTab = useCallback((tab: NavTab) => dispatch({ type: 'SET_NAV_TAB', payload: tab }), []);

  return (
    <AppContext.Provider value={{ state, setUser, setAuthenticated, setGuardianMode, setSosState, setContacts, addContact, setNavTab }}>
      {children}
    </AppContext.Provider>
  );
}
