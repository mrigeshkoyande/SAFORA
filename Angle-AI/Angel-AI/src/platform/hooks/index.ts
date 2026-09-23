import { useState, useEffect, useCallback } from 'react';
import {
  nativePlatform,
  nativeNetwork,
  nativeApp,
  nativeHaptics,
  nativeStatusBar,
  nativeSplashScreen,
  nativePreferences,
  nativeGeolocation,
  nativeCamera,
  nativeAudio,
  nativeFilesystem,
  nativeShare,
  nativeClipboard,
  nativeBrowser,
  nativeLocalNotifications,
  nativePush,
  nativeOrientation,
} from '../services';
import type {
  PlatformInfo,
  NetworkStatusInfo,
  KeyboardState,
  AppStateInfo,
  SafeAreaInsets,
  HapticImpactStyle,
  HapticNotificationType,
} from '../types';

// ── 1. usePlatform ────────────────────────────────────────────
export function usePlatform(): PlatformInfo {
  const [info, setInfo] = useState<PlatformInfo>({
    platform: 'web',
    isNative: false,
    isIOS: false,
    isAndroid: false,
    isWeb: true,
    isTablet: false,
  });

  useEffect(() => {
    nativePlatform.getInfo().then(setInfo).catch(() => {
      setInfo({
        platform: 'web',
        isNative: false,
        isIOS: false,
        isAndroid: false,
        isWeb: true,
        isTablet: false,
      });
    });
  }, []);

  return info;
}

// ── 2. useNetwork ─────────────────────────────────────────────
export function useNetwork(): NetworkStatusInfo {
  const [status, setStatus] = useState<NetworkStatusInfo>({
    connected: true,
    connectionType: 'wifi',
  });

  useEffect(() => {
    nativeNetwork.getStatus().then(setStatus).catch(() => {
      setStatus({ connected: navigator.onLine, connectionType: navigator.onLine ? 'wifi' : 'none' });
    });
    const removeListener = nativeNetwork.onStatusChange(setStatus);
    return () => { removeListener(); };
  }, []);

  return status;
}

// ── 3. useKeyboard ────────────────────────────────────────────
export function useKeyboard(): KeyboardState {
  const [state, setState] = useState<KeyboardState>({
    isVisible: false,
    keyboardHeight: 0,
  });

  useEffect(() => {
    if (!nativePlatform.isNative()) return;
    // Check window visual viewport changes as fallback or supplement
    const onResize = () => {
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height;
        if (heightDiff > 150) {
          setState({ isVisible: true, keyboardHeight: heightDiff });
        } else {
          setState({ isVisible: false, keyboardHeight: 0 });
        }
      }
    };
    window.visualViewport?.addEventListener('resize', onResize);
    return () => window.visualViewport?.removeEventListener('resize', onResize);
  }, []);

  return state;
}

// ── 4. useAppState ────────────────────────────────────────────
export function useAppState(): AppStateInfo {
  const [state, setState] = useState<AppStateInfo>({ isActive: true });

  useEffect(() => {
    const removeListener = nativeApp.onAppStateChange((isActive) => {
      setState({ isActive });
    });
    return () => { removeListener(); };
  }, []);

  return state;
}

// ── 5. useSafeArea ────────────────────────────────────────────
export function useSafeArea(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const computeInsets = () => {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      const top = parseInt(style.getPropertyValue('--safe-area-inset-top') || '0', 10);
      const bottom = parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0', 10);
      const left = parseInt(style.getPropertyValue('--safe-area-inset-left') || '0', 10);
      const right = parseInt(style.getPropertyValue('--safe-area-inset-right') || '0', 10);
      setInsets({ top: isNaN(top) ? 0 : top, bottom: isNaN(bottom) ? 0 : bottom, left: isNaN(left) ? 0 : left, right: isNaN(right) ? 0 : right });
    };
    computeInsets();
    window.addEventListener('resize', computeInsets);
    return () => window.removeEventListener('resize', computeInsets);
  }, []);

  return insets;
}

// ── 6. useHaptics ─────────────────────────────────────────────
export function useHaptics() {
  const impact = useCallback((style?: HapticImpactStyle) => nativeHaptics.impact(style), []);
  const notification = useCallback((type?: HapticNotificationType) => nativeHaptics.notification(type), []);
  const vibrate = useCallback((duration?: number) => nativeHaptics.vibrate(duration), []);

  return { impact, notification, vibrate };
}

// ── 7. useCapacitor ───────────────────────────────────────────
export function useCapacitor() {
  return {
    platform: nativePlatform,
    app: nativeApp,
    haptics: nativeHaptics,
    statusBar: nativeStatusBar,
    splashScreen: nativeSplashScreen,
    network: nativeNetwork,
    preferences: nativePreferences,
    geolocation: nativeGeolocation,
    camera: nativeCamera,
    audio: nativeAudio,
    filesystem: nativeFilesystem,
    share: nativeShare,
    clipboard: nativeClipboard,
    browser: nativeBrowser,
    localNotifications: nativeLocalNotifications,
    push: nativePush,
    orientation: nativeOrientation,
  };
}
