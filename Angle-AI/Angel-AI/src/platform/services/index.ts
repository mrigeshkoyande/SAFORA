import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Network } from '@capacitor/network';
import { Preferences } from '@capacitor/preferences';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { ScreenOrientation } from '@capacitor/screen-orientation';

import type {
  PlatformInfo,
  NetworkStatusInfo,
  GeoLocationCoordinates,
  PhotoResult,
  ShareOptions,
  LocalNotificationItem,
  HapticImpactStyle,
  HapticNotificationType,
} from '../types';

const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform() as 'ios' | 'android' | 'web';

// ── Platform Info ─────────────────────────────────────────────
export const nativePlatform = {
  getInfo: async (): Promise<PlatformInfo> => {
    try {
      const info = await Device.getInfo();
      const appInfo = await App.getInfo().catch(() => ({ version: '1.0.0' }));
      return {
        platform,
        isNative,
        isIOS: platform === 'ios',
        isAndroid: platform === 'android',
        isWeb: platform === 'web',
        isTablet: info.isVirtual || false, // approximation
        model: info.model,
        osVersion: info.osVersion,
        appVersion: appInfo.version,
      };
    } catch {
      return {
        platform: 'web',
        isNative: false,
        isIOS: false,
        isAndroid: false,
        isWeb: true,
        isTablet: false,
      };
    }
  },
  isNative: () => isNative,
  getPlatform: () => platform,
};

// ── App & Lifecycle ───────────────────────────────────────────
export const nativeApp = {
  exitApp: () => {
    if (isNative && platform === 'android') {
      App.exitApp();
    }
  },
  onAppStateChange: (callback: (isActive: boolean) => void) => {
    if (isNative) {
      const handler = App.addListener('appStateChange', (state) => {
        callback(state.isActive);
      });
      return () => { handler.then(h => h.remove()); };
    } else {
      const onVisibility = () => callback(document.visibilityState === 'visible');
      document.addEventListener('visibilitychange', onVisibility);
      return () => document.removeEventListener('visibilitychange', onVisibility);
    }
  },
  onBackButton: (callback: (canGoBack: boolean) => void) => {
    if (isNative && platform === 'android') {
      const handler = App.addListener('backButton', (data) => {
        callback(data.canGoBack);
      });
      return () => { handler.then(h => h.remove()); };
    }
    return () => {};
  },
};

// ── Haptics ───────────────────────────────────────────────────
export const nativeHaptics = {
  impact: async (style: HapticImpactStyle = 'medium') => {
    if (!isNative) return;
    try {
      const map: Record<HapticImpactStyle, ImpactStyle> = {
        heavy: ImpactStyle.Heavy,
        medium: ImpactStyle.Medium,
        light: ImpactStyle.Light,
      };
      await Haptics.impact({ style: map[style] });
    } catch { /* ignore */ }
  },
  notification: async (type: HapticNotificationType = 'success') => {
    if (!isNative) return;
    try {
      const map: Record<HapticNotificationType, NotificationType> = {
        success: NotificationType.Success,
        warning: NotificationType.Warning,
        error: NotificationType.Error,
      };
      await Haptics.notification({ type: map[type] });
    } catch { /* ignore */ }
  },
  vibrate: async (duration = 300) => {
    if (isNative) {
      try { await Haptics.vibrate({ duration }); } catch { /* ignore */ }
    } else if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  },
};

// ── Status Bar ────────────────────────────────────────────────
export const nativeStatusBar = {
  setStyle: async (dark: boolean) => {
    if (!isNative) return;
    try {
      await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
    } catch { /* ignore */ }
  },
  setBackgroundColor: async (color: string) => {
    if (!isNative || platform !== 'android') return;
    try {
      await StatusBar.setBackgroundColor({ color });
    } catch { /* ignore */ }
  },
  show: async () => { if (isNative) try { await StatusBar.show(); } catch { /* ignore */ } },
  hide: async () => { if (isNative) try { await StatusBar.hide(); } catch { /* ignore */ } },
};

// ── Splash Screen ─────────────────────────────────────────────
export const nativeSplashScreen = {
  show: async () => { if (isNative) try { await SplashScreen.show(); } catch { /* ignore */ } },
  hide: async () => { if (isNative) try { await SplashScreen.hide(); } catch { /* ignore */ } },
};

// ── Network ───────────────────────────────────────────────────
export const nativeNetwork = {
  getStatus: async (): Promise<NetworkStatusInfo> => {
    try {
      const status = await Network.getStatus();
      return {
        connected: status.connected,
        connectionType: status.connectionType as NetworkStatusInfo['connectionType'],
      };
    } catch {
      return {
        connected: navigator.onLine,
        connectionType: 'wifi',
      };
    }
  },
  onStatusChange: (callback: (status: NetworkStatusInfo) => void) => {
    if (isNative) {
      const handler = Network.addListener('networkStatusChange', (status) => {
        callback({
          connected: status.connected,
          connectionType: status.connectionType as NetworkStatusInfo['connectionType'],
        });
      });
      return () => { handler.then(h => h.remove()); };
    } else {
      const onOnline = () => callback({ connected: true, connectionType: 'wifi' });
      const onOffline = () => callback({ connected: false, connectionType: 'none' });
      window.addEventListener('online', onOnline);
      window.addEventListener('offline', onOffline);
      return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
      };
    }
  },
};

// ── Preferences Storage ───────────────────────────────────────
export const nativePreferences = {
  get: async (key: string): Promise<string | null> => {
    try {
      const { value } = await Preferences.get({ key });
      return value;
    } catch {
      return localStorage.getItem(key);
    }
  },
  set: async (key: string, value: string): Promise<void> => {
    try {
      await Preferences.set({ key, value });
    } catch {
      localStorage.setItem(key, value);
    }
  },
  remove: async (key: string): Promise<void> => {
    try {
      await Preferences.remove({ key });
    } catch {
      localStorage.removeItem(key);
    }
  },
  clear: async (): Promise<void> => {
    try {
      await Preferences.clear();
    } catch {
      localStorage.clear();
    }
  },
};

// ── Geolocation ───────────────────────────────────────────────
export const nativeGeolocation = {
  getCurrentPosition: async (): Promise<GeoLocationCoordinates> => {
    try {
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      return {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        altitude: pos.coords.altitude,
        speed: pos.coords.speed,
        heading: pos.coords.heading,
        timestamp: pos.timestamp,
      };
    } catch (e) {
      console.warn('Geolocation error or web fallback:', e);
      return {
        latitude: 51.5074,
        longitude: -0.1278,
        accuracy: 10,
        timestamp: Date.now(),
      };
    }
  },
  watchPosition: async (callback: (pos: GeoLocationCoordinates) => void): Promise<string> => {
    try {
      const id = await Geolocation.watchPosition({ enableHighAccuracy: true }, (pos, err) => {
        if (pos && !err) {
          callback({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            speed: pos.coords.speed,
            heading: pos.coords.heading,
            timestamp: pos.timestamp,
          });
        }
      });
      return id;
    } catch {
      return 'web-watch-0';
    }
  },
  clearWatch: async (id: string) => {
    try { await Geolocation.clearWatch({ id }); } catch { /* ignore */ }
  },
};

// ── Camera ────────────────────────────────────────────────────
const openWebFilePicker = (source: 'camera' | 'photos'): Promise<PhotoResult | null> => {
  if (typeof document === 'undefined') return Promise.resolve(null);

  return new Promise((resolve) => {
    const input = document.createElement('input');
    let settled = false;

    const cleanup = () => {
      window.removeEventListener('focus', handleFocus);
      input.remove();
    };

    const finish = (result: PhotoResult | null) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    const handleFocus = () => {
      window.setTimeout(() => {
        if (!input.files || input.files.length === 0) {
          finish(null);
        }
      }, 300);
    };

    input.type = 'file';
    input.accept = 'image/*';
    if (source === 'camera') {
      input.capture = 'environment';
    }
    input.style.position = 'fixed';
    input.style.left = '-9999px';

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) {
        finish(null);
        return;
      }

      finish({
        filepath: file.name,
        webviewPath: URL.createObjectURL(file),
        format: file.type.split('/')[1] || 'jpeg',
      });
    }, { once: true });

    document.body.appendChild(input);
    window.addEventListener('focus', handleFocus);
    input.click();
  });
};

export const nativeCamera = {
  getPhoto: async (source: 'camera' | 'photos' = 'camera'): Promise<PhotoResult | null> => {
    if (!isNative || platform === 'web') {
      try {
        return await openWebFilePicker(source);
      } catch (e) {
        console.warn('Web camera/file picker unavailable:', e);
        return null;
      }
    }

    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      });
      return {
        filepath: photo.path || '',
        webviewPath: photo.webPath,
        format: photo.format,
      };
    } catch (e) {
      console.warn('Camera cancelled or unavailable:', e);
      return null;
    }
  },
};

// ── Audio ─────────────────────────────────────────────────────
let activeAudio: HTMLAudioElement | null = null;
let audioOperation = Promise.resolve();

const enqueueAudioOperation = (operation: () => Promise<void>) => {
  audioOperation = audioOperation.then(operation, operation);
  return audioOperation;
};

export const nativeAudio = {
  play: async (src: string, options: { loop?: boolean; volume?: number } = {}) => {
    await enqueueAudioOperation(async () => {
      try {
        if (activeAudio) {
          activeAudio.pause();
          activeAudio.currentTime = 0;
        }

        const audio = new Audio(src);
        audio.loop = options.loop ?? false;
        audio.volume = options.volume ?? 1;
        activeAudio = audio;
        await audio.play();
      } catch (e) {
        console.warn('Audio playback unavailable:', e);
        activeAudio = null;
      }
    });
  },
  pause: async () => {
    await enqueueAudioOperation(async () => {
      if (!activeAudio) return;
      try {
        activeAudio.pause();
      } catch (e) {
        console.warn('Audio pause unavailable:', e);
      } finally {
        activeAudio = null;
      }
    });
  },
  stop: async () => {
    await enqueueAudioOperation(async () => {
      if (!activeAudio) return;
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      } catch (e) {
        console.warn('Audio stop unavailable:', e);
      } finally {
        activeAudio = null;
      }
    });
  },
};

// ── Filesystem ────────────────────────────────────────────────
export const nativeFilesystem = {
  writeFile: async (filename: string, dataBase64: string): Promise<string> => {
    try {
      const res = await Filesystem.writeFile({
        path: filename,
        data: dataBase64,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      return res.uri;
    } catch (e) {
      console.warn('Filesystem error:', e);
      return '';
    }
  },
  readFile: async (filename: string): Promise<string | null> => {
    try {
      const res = await Filesystem.readFile({
        path: filename,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      return typeof res.data === 'string' ? res.data : null;
    } catch {
      return null;
    }
  },
  deleteFile: async (filename: string): Promise<boolean> => {
    try {
      await Filesystem.deleteFile({ path: filename, directory: Directory.Data });
      return true;
    } catch {
      return false;
    }
  },
};

// ── Share & Clipboard ─────────────────────────────────────────
export const nativeShare = {
  share: async (options: ShareOptions): Promise<boolean> => {
    try {
      await Share.share(options);
      return true;
    } catch {
      if (navigator.share) {
        try {
          await navigator.share({
            title: options.title,
            text: options.text,
            url: options.url,
          });
          return true;
        } catch { return false; }
      }
      return false;
    }
  },
  canShare: async (): Promise<boolean> => {
    try {
      const res = await Share.canShare();
      return res.value;
    } catch {
      return !!navigator.share;
    }
  },
};

export const nativeClipboard = {
  write: async (text: string): Promise<boolean> => {
    try {
      await Clipboard.write({ string: text });
      return true;
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch { return false; }
    }
  },
  read: async (): Promise<string> => {
    try {
      const res = await Clipboard.read();
      return res.value;
    } catch {
      try {
        return await navigator.clipboard.readText();
      } catch { return ''; }
    }
  },
};

// ── Browser ───────────────────────────────────────────────────
export const nativeBrowser = {
  open: async (url: string) => {
    try {
      await Browser.open({ url, presentationStyle: 'popover' });
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  },
  close: async () => {
    try { await Browser.close(); } catch { /* ignore */ }
  },
};

// ── Notifications ─────────────────────────────────────────────
export const nativeLocalNotifications = {
  requestPermissions: async () => {
    if (!isNative) return false;
    try {
      const res = await LocalNotifications.requestPermissions();
      return res.display === 'granted';
    } catch { return false; }
  },
  schedule: async (items: LocalNotificationItem[]) => {
    if (!isNative) return;
    try {
      await LocalNotifications.schedule({
        notifications: items.map(item => ({
          id: item.id,
          title: item.title,
          body: item.body,
          schedule: item.schedule ? { at: item.schedule.at } : undefined,
          sound: item.sound || 'beep.wav',
          smallIcon: item.smallIcon || 'ic_stat_icon_config_sample',
          iconColor: item.iconColor || '#a33759',
          extra: item.extra,
        })),
      });
    } catch (e) {
      console.warn('Local notification error:', e);
    }
  },
  cancel: async (ids: number[]) => {
    if (!isNative) return;
    try {
      await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
    } catch { /* ignore */ }
  },
};

export const nativePush = {
  requestPermissions: async () => {
    if (!isNative) return false;
    try {
      const res = await PushNotifications.requestPermissions();
      if (res.receive === 'granted') {
        await PushNotifications.register();
        return true;
      }
      return false;
    } catch { return false; }
  },
};

// ── Screen Orientation ────────────────────────────────────────
export const nativeOrientation = {
  lockPortrait: async () => {
    if (!isNative) return;
    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
    } catch { /* ignore */ }
  },
  unlock: async () => {
    if (!isNative) return;
    try {
      await ScreenOrientation.unlock();
    } catch { /* ignore */ }
  },
};
