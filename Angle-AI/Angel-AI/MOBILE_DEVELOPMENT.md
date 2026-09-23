# 📱 Seraphina — Enterprise Mobile Engineering & Capacitor 7 Guide

This document details the enterprise-grade mobile architecture, native plugin integrations, build workflows, and distribution procedures for transforming the **Seraphina AI Guardian** React + TypeScript + Vite web application into production-ready **Android**, **iOS**, and **Progressive Web Application (PWA)** clients using **Capacitor 7**.

---

## 🏛️ 1. Enterprise Architecture & Platform Abstraction Layer

To ensure strict separation of concerns, zero UI rewrites, and 100% web compatibility, all Capacitor-specific logic is isolated inside `src/platform/`. **The UI layer never directly invokes Capacitor APIs or plugins.**

```text
src/
├── platform/
│   ├── index.ts          # Central module export
│   ├── types.ts          # Typed platform interfaces & error boundaries
│   ├── provider.tsx      # <PlatformProvider> (Lifecycle, Back-Button, Offline UX)
│   ├── services/
│   │   └── index.ts      # 17 Native Plugin Wrappers with Web Fallbacks
│   └── hooks/
│       └── index.ts      # Reusable React Hooks (usePlatform, useNetwork, etc.)
```

### Key Architectural Safeguards
1. **Zero Crash Guarantee (Web Fallbacks):** Every native plugin wrapper in `src/platform/services/` wraps calls in `try/catch` blocks and checks `Capacitor.isNativePlatform()`. If a plugin is unsupported (e.g., running in Chrome or Safari), it falls back to standard Web APIs (`navigator.geolocation`, `navigator.share`, `localStorage`, `navigator.vibrate`, `window.history`).
2. **Native Android Back Navigation:** `PlatformProvider` registers `App.addListener('backButton')`. When the hardware or gesture back button is triggered on Android, it seamlessly integrates with React Router (`window.history.back()`). If the user is on the root dashboard or auth screen, it calls `App.exitApp()`, ensuring Seraphina behaves exactly like a native Android app.
3. **Graceful Offline UI:** `useNetwork` monitors real-time connectivity. When offline, `PlatformProvider` automatically displays an edge-to-edge safe-area respecting warning banner, while Service Worker caching and IndexedDB/localStorage keep safety features active.
4. **Portrait Safety UX:** On mobile devices (phones), `PlatformProvider` locks orientation to portrait to ensure rapid one-handed emergency SOS execution. Tablets and web browsers remain responsive and flexible.

---

## 🔌 2. Native Plugins & Capabilities

Seraphina integrates 17 Capacitor v7 plugins, initialized lazily and strictly wrapped:

| Plugin Package | Purpose in Seraphina | Web Fallback |
| :--- | :--- | :--- |
| **`@capacitor/app`** | App state monitoring, Android hardware back button, programmatic exit. | `document.visibilityState` |
| **`@capacitor/haptics`** | Tactile feedback on SOS button hold, lesson card taps, and alert toggles. | `navigator.vibrate()` |
| **`@capacitor/status-bar`** | Edge-to-edge dark icons on warm cream background (`#fff8f7`). | No-op (handled by browser theme) |
| **`@capacitor/splash-screen`** | Immersive launch screen auto-hidden after React mounting. | No-op |
| **`@capacitor/network`** | Live connection monitoring and offline mode detection. | `navigator.onLine` & DOM events |
| **`@capacitor/preferences`** | Persistent encrypted storage for user settings and Guardian Circle. | `window.localStorage` |
| **`@capacitor/geolocation`** | High-accuracy GPS tracking and journey checkpoint monitoring. | `navigator.geolocation` |
| **`@capacitor/camera`** | Capturing emergency photo evidence directly to the vault. | HTML5 File Input / WebRTC |
| **`@capacitor/filesystem`** | Storing audio logs and video evidence locally before cloud sync. | No-op / Blob memory |
| **`@capacitor/share`** | Sharing live location links and emergency dispatches. | `navigator.share()` / Clipboard |
| **`@capacitor/clipboard`** | Quick copy/paste of emergency coordinates or vault links. | `navigator.clipboard` |
| **`@capacitor/browser`** | In-app browser popovers for Terms of Service and Privacy Policy. | `window.open(..., '_blank')` |
| **`@capacitor/push-notifications`** | Receiving Guardian circle alerts and check-in reminders. | Web Push API |
| **`@capacitor/local-notifications`** | Triggering Dummy Call arrival countdown overlays. | Web Notifications |
| **`@capacitor/screen-orientation`** | Portrait locking on mobile phones for emergency ergonomics. | CSS Screen Orientation API |
| **`@capacitor/device`** | Hardware model, OS version, and battery monitoring. | UserAgent parsing |
| **`@capacitor/keyboard`** | Keyboard avoidance and layout resizing on mobile inputs. | VisualViewport API |

---

## 🎣 3. Reusable Platform Hooks

Import these hooks anywhere in your React components without coupling your UI to Capacitor:

```tsx
import {
  usePlatform,
  useNetwork,
  useKeyboard,
  useAppState,
  useSafeArea,
  useHaptics,
  useCapacitor,
} from './platform';

// Example Usage in a Component:
export function MyComponent() {
  const { isNative, isIOS, isAndroid } = usePlatform();
  const { connected, connectionType } = useNetwork();
  const { isVisible, keyboardHeight } = useKeyboard();
  const { impact, notification } = useHaptics();

  const handleAction = () => {
    impact('medium');
    // perform safety action...
  };

  return (
    <div style={{ paddingBottom: isVisible ? keyboardHeight : 0 }}>
      {/* Responsive UI */}
    </div>
  );
}
```

---

## 🛠️ 4. Build & Development Workflow

The project is pre-configured with unified npm scripts in `package.json`:

```bash
# 1. Build the web application for production (outputs to dist/)
npm run build

# 2. Sync web assets and plugin configurations to Android & iOS projects
npm run cap:sync

# 3. Open native projects in their respective IDEs
npm run cap:open:android
npm run cap:open:ios
```

### Standard Iteration Loop
Whenever you make changes to React components, styling, or TypeScript logic:
```bash
npm run build && npm run cap:sync
```

---

## 🤖 5. Android Setup & Production Distribution

### Android Configuration (`android/`)
* **Package Name:** `com.seraphina.guardian`
* **Minimum SDK:** API 23 (Android 6.0 Marshmallow)
* **Target SDK:** API 34+ (Android 14)
* **Edge-to-Edge & Safe Area:** Configured via `StatusBar` plugin and CSS environment variables (`env(safe-area-inset-*)`).

### Required Permissions (`android/app/src/main/AndroidManifest.xml`)
The following permissions are automatically injected by our Capacitor plugins:
* `android.permission.INTERNET` & `ACCESS_NETWORK_STATE` (Network & API)
* `android.permission.ACCESS_FINE_LOCATION` & `ACCESS_COARSE_LOCATION` (Guardian GPS)
* `android.permission.CAMERA` (Evidence Vault)
* `android.permission.READ_EXTERNAL_STORAGE` & `WRITE_EXTERNAL_STORAGE` (Filesystem Vault)
* `android.permission.VIBRATE` (Haptics & SOS alerts)
* `android.permission.POST_NOTIFICATIONS` (Push & Local Alerts)

### Step 1: Generating an Debug APK for Local Testing
1. Open the Android project:
   ```bash
   npm run cap:open:android
   ```
2. In Android Studio, wait for Gradle sync to finish.
3. Select **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
4. Locate your debug APK in `android/app/build/outputs/apk/debug/app-debug.apk`.

### Step 2: Generating a Production Release APK / AAB (Android App Bundle)
1. In Android Studio, select **Build → Generate Signed Bundle / APK...**
2. Choose **Android App Bundle** (Recommended for Google Play Store) or **APK** (for direct sideloading/enterprise distribution). Click **Next**.
3. **Keystore Setup:**
   * Click **Create new...** under Keystore path.
   * Choose a secure file path (e.g., `seraphina-release-key.jks`).
   * Enter a secure Keystore password and Key password.
   * Fill in Alias (e.g., `seraphina-key`) and Certificate details (Name, Organization).
4. Select **Release** build variant.
5. Click **Create**.
6. **Output Locations:**
   * **AAB (Play Store):** `android/app/release/app-release.aab`
   * **Signed APK:** `android/app/release/app-release.apk`

---

## 🍎 6. iOS Setup & App Store Distribution

### iOS Configuration (`ios/`)
* **Bundle Identifier:** `com.seraphina.guardian`
* **Minimum Deployment Target:** iOS 14.0+
* **Capabilities:** App Transport Security (ATS) enabled, Dark Mode supported, Safe Area layout guides integrated.

### Required Privacy Usage Descriptions (`ios/App/App/Info.plist`)
When deploying to Xcode, ensure these privacy strings are present (Capacitor plugins configure these by default):
* `NSLocationWhenInUseUsageDescription`: *"Seraphina requires your location to monitor your journey and share live ETA with your Guardian circle."*
* `NSLocationAlwaysUsageDescription`: *"Seraphina monitors your journey in the background during active Guardian Mode."*
* `NSCameraUsageDescription`: *"Seraphina uses the camera to capture emergency photo evidence for your encrypted vault."*
* `NSPhotoLibraryUsageDescription`: *"Seraphina saves and uploads emergency visual evidence to your vault."*
* `NSMicrophoneUsageDescription`: *"Seraphina records ambient emergency audio during SOS alerts."*

### Step 1: Testing on Simulator or Physical Device
1. Open Xcode:
   ```bash
   npm run cap:open:ios
   ```
2. In Xcode, select your target device (e.g., *iPhone 16 Pro* or your connected physical iPhone).
3. Select the **App** project in the left navigator → **Signing & Capabilities** tab.
4. Select your Apple Developer Account under **Team**.
5. Press **Cmd + R** (or click the Play button) to build and run.

### Step 2: App Store Submission & Production Build
1. In Xcode, ensure your device target is set to **Any iOS Device (arm64)**.
2. Go to **Product → Scheme → Edit Scheme...** and verify the **Archive** build configuration is set to **Release**.
3. Go to **Product → Archive**.
4. Once archiving completes, the **Xcode Organizer** window will open.
5. Select your archive and click **Distribute App**.
6. Choose **App Store Connect** → **Upload** → **Next**.
7. Let Xcode automatically manage signing and symbols, then click **Upload**.
8. Complete your store listing, screenshots, and review submission in [App Store Connect](https://appstoreconnect.apple.com/).

---

## 🌐 7. Progressive Web App (PWA) Support

Seraphina maintains 100% PWA compatibility via `vite-plugin-pwa` and Workbox:
* **Service Worker (`sw.js`):** Automatically precaches all HTML, CSS, JS, and font assets for instant offline loading.
* **Web Manifest (`manifest.webmanifest`):** Configured with standalone display mode, portrait orientation, theme color (`#fff8f7`), and maskable app icons.
* **Runtime Caching:** Google Fonts and external Unsplash avatars are cached using `CacheFirst` and `StaleWhileRevalidate` strategies.

---

## 🧪 8. Testing Instructions across Platforms

1. **Web / Mobile Browser Testing:**
   ```bash
   npm run preview
   ```
   * Open Chrome DevTools → Toggle Device Toolbar (iPhone / Pixel emulation).
   * Verify safe-area padding, touch interactions, and offline warning banner by toggling *Offline* mode in the Network tab.

2. **Native Android Testing:**
   * Connect an Android device with USB Debugging enabled.
   * Run `npm run cap:open:android` and deploy.
   * **Test Hardware Back Button:** Navigate from Home → Vault → tap physical back button. Verify it returns to Home. Tap back again from Home; verify the app exits cleanly.
   * **Test Haptics:** Hold down the circular SOS button; feel the tactile vibration feedback.

3. **Native iOS Testing:**
   * Run `npm run cap:open:ios` and deploy to iPhone.
   * **Test Safe Areas:** Verify TopBar and BottomNav respect the Dynamic Island / Notch and bottom Home Indicator without clipping text or icons.
   * **Test Keyboard Avoidance:** Tap an input field on the Auth or Escape Coach screen; verify the layout smoothly resizes without hiding the active input.

---

## 🛠️ 9. Capacitor 7 Diagnostic & Troubleshooting Commands

If you encounter native hardware permission conflicts or asset sync discrepancies during mobile compilation, run these diagnostic tools:

### Verify Native Plugin Readiness
To inspect installed Capacitor plugins and verify compatibility with your target Android/iOS SDKs:
```bash
npx cap doctor
```

### Reset & Clean Mobile Builds
If native gradle or Xcode cache files cause unexpected build failures after upgrading plugins:
```bash
# Clean and re-sync Android platform
cd android && ./gradlew clean && cd ..
npx cap sync android

# Clean and re-sync iOS platform (macOS)
npx cap sync ios
```

### Debugging Hardware Permissions on Device
To view live runtime console logs, network payloads, and native plugin errors while the app is running on a physical Android device or emulator:
```bash
npx cap run android -l --external
```
*(This starts a live-reload web server accessible from your mobile device over local Wi-Fi or USB connection)*

---

<div align="center">

**Seraphina AI Guardian — One Codebase. Three Enterprise Platforms.**

</div>
