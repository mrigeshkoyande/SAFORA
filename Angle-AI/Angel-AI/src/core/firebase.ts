import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

export const isFirebaseConfigured = Boolean(apiKey && authDomain && projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let analytics: unknown = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
    };

    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();

    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
      import('firebase/analytics')
        .then(({ getAnalytics, isSupported }) => {
          isSupported().then((supported) => {
            if (supported && app) {
              try {
                analytics = getAnalytics(app);
              } catch {
                // Ignore analytics error
              }
            }
          }).catch(() => {});
        })
        .catch(() => {
          // Ignore ad-blocker blocking firebase/analytics module
        });
    }
  } catch (err) {
    console.warn('⚠️ Firebase initialization deferred: missing or invalid credentials.', err);
  }
} else {
  console.info('ℹ️ SAFORA running in client mode — Firebase credentials not set. Set VITE_FIREBASE_* environment variables to enable live Firebase Auth & Analytics.');
}

export { app, analytics, auth, googleProvider };
