import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import appletConfig from '../../firebase-applet-config.json';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || appletConfig?.apiKey;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig?.authDomain;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig?.projectId;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig?.storageBucket;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig?.messagingSenderId;
const appId = import.meta.env.VITE_FIREBASE_APP_ID || appletConfig?.appId;

export const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
};

export const isFirebaseConfigured = Boolean(apiKey && projectId && authDomain);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error('Failed to initialize Firebase app:', error);
  }
} else {
  console.warn(
    'Firebase Authentication setup required: Missing VITE_FIREBASE_API_KEY or VITE_FIREBASE_PROJECT_ID.'
  );
}

export { app, auth };
