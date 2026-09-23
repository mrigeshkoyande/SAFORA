// ============================================================
// Core Types — SAFORA
// ============================================================

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  location?: LocationData;
}

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  neighborhood?: string;
  timestamp: Date;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: 'primary' | 'secondary' | 'family' | 'friend';
  avatarUrl?: string;
  isOnline?: boolean;
}

export type GuardianStatus = 'active' | 'inactive' | 'alert';

export interface GuardianModeState {
  isActive: boolean;
  status: GuardianStatus;
  destination?: string;
  eta?: string;
  checkInsEnabled: boolean;
  anomalyDetectionEnabled: boolean;
  realTimeTracking: boolean;
  journeyStartTime?: Date;
  checkpoints: JourneyCheckpoint[];
}

export interface JourneyCheckpoint {
  id: string;
  label: string;
  time: string;
  location: string;
  status: 'passed' | 'current' | 'upcoming';
}

export type SOSState = 'idle' | 'countdown' | 'active' | 'cancelled';

export interface SOSData {
  state: SOSState;
  activatedAt?: Date;
  location?: LocationData;
  contacts: Contact[];
  countdown: number; // seconds remaining before full activation
}

export interface DummyCallConfig {
  callerName: string;
  callerAvatarUrl?: string;
  delaySeconds: number;
  voiceScriptId: string;
  voiceRecordingEnabled: boolean;
}

export type CallState = 'idle' | 'scheduled' | 'incoming' | 'active' | 'ended';

export interface EvidenceItem {
  id: string;
  type: 'photo' | 'video' | 'audio' | 'log';
  url?: string;
  timestamp: Date;
  location?: string;
  note?: string;
  isEncrypted: boolean;
}

export interface EvidenceVault {
  totalSizeGB: number;
  itemCount: number;
  lastSyncedAt: Date;
  photos: EvidenceItem[];
  videos: EvidenceItem[];
  audio: EvidenceItem[];
  logs: EvidenceItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
}

export interface ChatAction {
  label: string;
  type: 'call' | 'share-location' | 'navigate' | 'text';
  value: string;
}

export interface SafetyLesson {
  id: string;
  title: string;
  category: 'escape' | 'workplace' | 'transport' | 'night';
  durationMinutes: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export interface HiddenSOSConfig {
  powerButtonTrigger: boolean;
  gestureTrigger: boolean;
  fakePinTrigger: boolean;
  silentMode: boolean;
  fakePin?: string;
}

export type NavTab = 'home' | 'guardian' | 'safety' | 'vault' | 'profile';

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  guardianMode: GuardianModeState;
  sosData: SOSData;
  contacts: Contact[];
  activeNavTab: NavTab;
}
