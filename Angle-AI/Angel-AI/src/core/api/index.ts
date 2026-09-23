import type { User, Contact, GuardianModeState, EvidenceVault, SafetyLesson, ChatMessage } from '../types';

// ============================================================
// Mock API Layer — SAFORA
// Drop-in: replace with real fetch calls pointing to your backend.
// All functions return typed Promises so the interface never changes.
// ============================================================

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? '/api'
    : 'http://localhost:5000/api'
);

// ── Auth ─────────────────────────────────────────────────────
export const authApi = {
  login: async (_phone: string): Promise<{ user: User; token: string }> => {
    throw new Error("Phone login via Firebase requires OTP verification UI. Please use Google Login for now, or we can build the OTP UI next.");
  },
  loginWithGoogle: async (): Promise<{ user: User; token: string }> => {
    const isFirebaseActive = Boolean(import.meta.env.VITE_FIREBASE_API_KEY && auth && googleProvider);
    if (!isFirebaseActive) {
      console.warn("Firebase configuration not set or incomplete. Falling back to local SAFORA authentication.");
      await delay(800);

      // Only attempt to sync with backend if running locally or a real external API URL is configured
      const shouldSyncWithBackend = API_URL.startsWith('http') || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      if (shouldSyncWithBackend) {
        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer mock-dev-user-token`
            },
            body: JSON.stringify({
              fullName: 'Demo User',
              phone: '+1 555 0199'
            })
          });

          if (response.ok) {
            const data = await response.json();
            const backendUser = data.data.user;
            return {
              user: {
                id: backendUser.id,
                name: backendUser.fullName || 'Demo User',
                phone: backendUser.phone || '+1 555 0199',
                email: backendUser.email || 'user@safora.app',
                avatarUrl: backendUser.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
              },
              token: 'mock-dev-user-token',
            };
          }
        } catch (e) {
          console.warn("Backend not reachable or not running. Using client-side mock user fallback.", e);
        }
      } else {
        console.info("Relative API route detected on production deployment. Skipping backend sync for mock auth.");
      }

      return {
        user: {
          id: 'mock-dev-user-uid',
          name: 'Demo User',
          phone: '+1 555 0199',
          email: 'user@safora.app',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        },
        token: 'mock-dev-user-token',
      };
    }

    try {
      const result = await signInWithPopup(auth!, googleProvider!);
      const token = await result.user.getIdToken();

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: result.user.displayName || '',
          phone: result.user.phoneNumber || ''
        })
      });

      if (!response.ok) {
        throw new Error('Backend authentication failed');
      }

      const data = await response.json();
      const backendUser = data.data.user;

      return {
        user: {
          id: backendUser.id,
          name: backendUser.fullName || 'User',
          phone: backendUser.phone || '',
          email: backendUser.email || '',
          avatarUrl: backendUser.profileImage || result.user.photoURL || '',
        },
        token,
      };
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },
  logout: async (): Promise<void> => {
    if (auth) {
      await signOut(auth);
    }
  },
};

// ── Guardian ──────────────────────────────────────────────────
export const guardianApi = {
  startMonitoring: async (): Promise<GuardianModeState> => {
    await delay(500);
    return {
      isActive: true,
      status: 'active',
      destination: 'The Arts Club, Mayfair',
      eta: '12 mins',
      checkInsEnabled: true,
      anomalyDetectionEnabled: true,
      realTimeTracking: true,
      journeyStartTime: new Date(),
      checkpoints: [
        { id: 'cp1', label: 'Journey Started', time: '21:40', location: 'Hyde Park Corner', status: 'passed' },
        { id: 'cp2', label: 'Checkpoint 1', time: '21:48', location: 'Passed Safely', status: 'passed' },
        { id: 'cp3', label: 'ETA: 12 mins', time: '22:00', location: 'Dover Street', status: 'current' },
      ],
    };
  },
  stopMonitoring: async (): Promise<void> => {
    await delay(300);
  },
  updateSettings: async (settings: Partial<GuardianModeState>): Promise<GuardianModeState> => {
    await delay(400);
    return {
      isActive: true,
      status: 'active',
      destination: 'Home',
      eta: '5 mins',
      checkInsEnabled: true,
      anomalyDetectionEnabled: true,
      realTimeTracking: true,
      checkpoints: [],
      ...settings,
    };
  },
};

// ── SOS ───────────────────────────────────────────────────────
export const sosApi = {
  triggerSOS: async (): Promise<{ alertId: string; notifiedContacts: number }> => {
    await delay(200);
    return { alertId: 'sos_' + Date.now(), notifiedContacts: 3 };
  },
  cancelSOS: async (alertId: string): Promise<void> => {
    await delay(200);
    console.log('SOS cancelled:', alertId);
  },
  notifyContacts: async (contacts: Contact[]): Promise<void> => {
    await delay(300);
    console.log('Notified:', contacts.map(c => c.name).join(', '));
  },
};

// ── Location ──────────────────────────────────────────────────
export const locationApi = {
  getCurrentLocation: async () => {
    await delay(300);
    return {
      lat: 51.5074,
      lng: -0.1278,
      address: 'HSR Layout, Sector 2',
      neighborhood: 'HSR Layout',
      timestamp: new Date(),
    };
  },
  getJourneyHistory: async () => {
    await delay(400);
    return [
      { label: 'Left Office', time: '06:45 PM', location: 'Whitefield', status: 'passed' as const },
      { label: 'Metro Transit', time: '07:15 PM', location: 'MG Road Station', status: 'passed' as const },
      { label: 'Walking Home', time: '08:02 PM', location: 'Current', status: 'current' as const },
    ];
  },
};

// ── Evidence ──────────────────────────────────────────────────
export const evidenceApi = {
  getVault: async (): Promise<EvidenceVault> => {
    await delay(600);
    return {
      totalSizeGB: 12.4,
      itemCount: 1204,
      lastSyncedAt: new Date(Date.now() - 2 * 60 * 1000),
      photos: [],
      videos: [],
      audio: [],
      logs: [],
    };
  },
  uploadEvidence: async (_file: File): Promise<{ id: string; url: string }> => {
    await delay(1500);
    return { id: 'ev_' + Date.now(), url: '/mock-upload.jpg' };
  },
};

// ── Contacts ──────────────────────────────────────────────────
export const contactsApi = {
  getContacts: async (): Promise<Contact[]> => {
    await delay(400);
    return [
      { id: 'c1', name: 'Sarah Mitchell', phone: '+1 555 001', relationship: 'primary', isOnline: true },
      { id: 'c2', name: 'Robert Chen', phone: '+1 555 002', relationship: 'secondary', isOnline: true },
      { id: 'c3', name: 'Mom', phone: '+1 555 003', relationship: 'family', isOnline: false },
    ];
  },
  addContact: async (contact: Omit<Contact, 'id'>): Promise<Contact> => {
    await delay(400);
    return { ...contact, id: 'c_' + Date.now() };
  },
};

// ── AI Escape Coach ───────────────────────────────────────────
export const escapeCoachApi = {
  sendMessage: async (message: string): Promise<ChatMessage> => {
    await delay(1000 + Math.random() * 500);
    const responses: Record<string, string> = {
      default: "I'm analyzing your situation. Stay calm. I've locked onto your location and am sharing it with your guardian circle. What's happening around you right now?",
      following: "I've locked onto your location. Stay calm. Follow these steps:\n\n1. Cross the street — this breaks predictable patterns.\n2. Enter a well-lit public space (café, pharmacy).\n3. I'm ready to call local dispatch — Precinct 4 is 0.4 miles away.",
      unsafe: "I hear you. You're safe to talk to me. I'm quietly monitoring everything. Should I activate Silent SOS and notify your contacts without any visible alert?",
    };
    const key = message.toLowerCase().includes('follow') ? 'following'
      : message.toLowerCase().includes('unsafe') ? 'unsafe'
      : 'default';
    return {
      id: 'msg_' + Date.now(),
      sender: 'ai',
      content: responses[key],
      timestamp: new Date(),
      actions: key === 'following' ? [
        { label: 'Call Dispatch', type: 'call', value: '911' },
        { label: 'Share Location', type: 'share-location', value: 'guardian-circle' },
      ] : undefined,
    };
  },
};

// ── Self-Defence ──────────────────────────────────────────────
export const selfDefenceApi = {
  getLessons: async (): Promise<SafetyLesson[]> => {
    await delay(500);
    return [
      { id: 'l1', title: 'Digital Footprint Safety', category: 'escape', durationMinutes: 2, level: 'advanced', rating: 4.9 },
      { id: 'l2', title: 'Night Walk Confidence', category: 'night', durationMinutes: 2, level: 'beginner', rating: 5.0 },
      { id: 'l3', title: 'Public Transport Safety', category: 'transport', durationMinutes: 3, level: 'intermediate', rating: 4.7 },
      { id: 'l4', title: 'Awareness Mastery', category: 'escape', durationMinutes: 8, level: 'beginner', rating: 4.8 },
    ];
  },
};

// ── Health/Pinger ─────────────────────────────────────────────
export const healthApi = {
  ping: async (): Promise<void> => {
    if (API_URL.startsWith('http')) {
      try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
          console.log("Backend pre-warmed successfully.");
        }
      } catch (e) {
        console.warn("Backend pre-warming ping failed:", e);
      }
    }
  }
};
