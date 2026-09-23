/* eslint-disable react/only-export-components */
import React, { useEffect, useState, type ReactNode } from 'react';
import {
  nativePlatform,
  nativeSplashScreen,
  nativeStatusBar,
  nativeApp,
  nativeNetwork,
  nativeOrientation,
} from './services';
import type { PlatformInfo, NetworkStatusInfo } from './types';
import { PlatformContext } from './context';

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    platform: 'web',
    isNative: false,
    isIOS: false,
    isAndroid: false,
    isWeb: true,
    isTablet: false,
  });
  const [networkStatus, setNetworkStatus] = useState<NetworkStatusInfo>({
    connected: true,
    connectionType: 'wifi',
  });

  useEffect(() => {
    // 1. Initialize platform info
    nativePlatform.getInfo().then((info) => {
      setPlatformInfo(info);
      if (info.isNative && !info.isTablet) {
        // Lock mobile phones to portrait for safety UX; tablets stay flexible
        nativeOrientation.lockPortrait();
      }
    });

    // 2. Initialize network & listener
    nativeNetwork.getStatus().then(setNetworkStatus);
    const removeNetListener = nativeNetwork.onStatusChange(setNetworkStatus);

    // 3. Status Bar configuration
    nativeStatusBar.setStyle(true); // Dark style (dark icons on light background)
    nativeStatusBar.setBackgroundColor('#fff8f7');

    // 4. Hide Splash Screen smoothly once React has mounted
    const timer = setTimeout(() => {
      nativeSplashScreen.hide();
    }, 400);

    // 5. Android Native Back Button behavior
    const removeBackListener = nativeApp.onBackButton((canGoBack) => {
      const path = window.location.pathname;
      const isRootPath = path === '/' || path === '/home' || path === '/auth';

      if (!isRootPath && canGoBack && window.history.length > 1) {
        window.history.back();
      } else {
        // Exit app gracefully if on root screen in Android
        nativeApp.exitApp();
      }
    });

    return () => {
      clearTimeout(timer);
      removeNetListener();
      removeBackListener();
    };
  }, []);

  return (
    <PlatformContext.Provider value={{ platformInfo, networkStatus }}>
      {children}
      {/* Graceful Offline UI Banner */}
      {!networkStatus.connected && (
        <div
          role="alert"
          className="fixed top-0 left-0 right-0 z-[100] bg-error text-on-error px-4 py-2 text-center font-inter text-label-sm font-semibold shadow-md transition-all duration-300"
          style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }}
        >
          ⚠️ You are offline. Safety features and Evidence Vault are running in offline cached mode.
        </div>
      )}
    </PlatformContext.Provider>
  );
}
