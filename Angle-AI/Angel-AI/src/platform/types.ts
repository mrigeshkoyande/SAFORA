// ============================================================
// Platform Abstraction Layer Types — SAFORA
// ============================================================

export type PlatformType = 'ios' | 'android' | 'web';

export interface PlatformInfo {
  platform: PlatformType;
  isNative: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  isTablet: boolean;
  model?: string;
  osVersion?: string;
  appVersion?: string;
}

export interface NetworkStatusInfo {
  connected: boolean;
  connectionType: 'wifi' | 'cellular' | 'none' | 'unknown';
}

export interface KeyboardState {
  isVisible: boolean;
  keyboardHeight: number;
}

export interface AppStateInfo {
  isActive: boolean;
}

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface GeoLocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  speed?: number | null;
  heading?: number | null;
  timestamp: number;
}

export interface PhotoResult {
  filepath: string;
  webviewPath?: string;
  base64String?: string;
  format: string;
}

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  dialogTitle?: string;
  files?: string[];
}

export interface LocalNotificationItem {
  id: number;
  title: string;
  body: string;
  schedule?: { at?: Date; in?: number };
  sound?: string;
  smallIcon?: string;
  iconColor?: string;
  extra?: Record<string, unknown>;
}

export type HapticImpactStyle = 'heavy' | 'medium' | 'light';
export type HapticNotificationType = 'success' | 'warning' | 'error';
