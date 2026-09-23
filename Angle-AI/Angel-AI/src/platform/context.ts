import { createContext, useContext } from 'react';
import type { PlatformInfo, NetworkStatusInfo } from './types';

interface PlatformContextValue {
  platformInfo: PlatformInfo;
  networkStatus: NetworkStatusInfo;
}

export const PlatformContext = createContext<PlatformContextValue>({
  platformInfo: {
    platform: 'web',
    isNative: false,
    isIOS: false,
    isAndroid: false,
    isWeb: true,
    isTablet: false,
  },
  networkStatus: {
    connected: true,
    connectionType: 'wifi',
  },
});

export function usePlatformContext() {
  return useContext(PlatformContext);
}
