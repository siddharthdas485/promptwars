import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  type Firestore,
} from 'firebase/firestore';
import type { CaseSessionData } from '../types';

// Read config from placeholder env vars as requested by user
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyPlaceholderKeyForPreviewTesting',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'project-jury-courtroom.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'project-jury-courtroom',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'project-jury-courtroom.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn('[Firebase] Initialized in fallback mode:', err);
}

export { auth, db };

// Mock auth state for seamless preview testing when placeholder keys are used
const LOCAL_STORAGE_USER_KEY = 'projectjury_auth_user';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isPlaceholderAuth?: boolean;
}

export async function loginWithEmail(email: string, pass: string): Promise<AppUser> {
  if (auth && !firebaseConfig.apiKey.includes('Placeholder')) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || email.split('@')[0],
      };
    } catch (firebaseErr: unknown) {
      console.warn('[Firebase Auth] Real auth failed, checking fallback:', firebaseErr);
      // If error is invalid API key or network/project missing, allow preview sign-in
      const isConfigError =
        (firebaseErr as { code?: string })?.code?.includes('api-key') ||
        (firebaseErr as { code?: string })?.code?.includes('invalid-api-key') ||
        (firebaseErr as { code?: string })?.code?.includes('project-not-found');

      if (!isConfigError) {
        throw firebaseErr;
      }
    }
  }

  // Graceful simulated preview authentication with the provided credentials
  const demoUser: AppUser = {
    uid: 'petitioner_' + Math.random().toString(36).substring(2, 9),
    email: email || 'alex.vance@university.edu',
    displayName: (email ? email.split('@')[0] : 'Alex Vance').replace('.', ' ').toUpperCase(),
    isPlaceholderAuth: true,
  };
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
  window.dispatchEvent(new Event('projectjury_auth_changed'));
  return demoUser;
}

export async function registerWithEmail(email: string, pass: string): Promise<AppUser> {
  if (auth && !firebaseConfig.apiKey.includes('Placeholder')) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      return {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || email.split('@')[0],
      };
    } catch (err: unknown) {
      console.warn('[Firebase Auth Register] Fallback to preview register:', err);
    }
  }

  const demoUser: AppUser = {
    uid: 'petitioner_' + Math.random().toString(36).substring(2, 9),
    email: email || 'alex.vance@university.edu',
    displayName: (email ? email.split('@')[0] : 'Alex Vance').replace('.', ' ').toUpperCase(),
    isPlaceholderAuth: true,
  };
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
  window.dispatchEvent(new Event('projectjury_auth_changed'));
  return demoUser;
}

export async function logoutUser(): Promise<void> {
  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Signout error:', err);
    }
  }
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  window.dispatchEvent(new Event('projectjury_auth_changed'));
}

export function subscribeToAuth(callback: (user: AppUser | null) => void): () => void {
  // Check stored preview session first
  const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  let localUser: AppUser | null = stored ? JSON.parse(stored) : null;

  // Default pre-signed in demo user for immediate tribunal access if not signed out
  if (!stored && stored !== '') {
    localUser = {
      uid: 'petitioner_pj4091',
      email: 'alex.vance@university.edu',
      displayName: 'Alex Vance',
      isPlaceholderAuth: true,
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
  }

  callback(localUser);

  const handleCustomAuth = () => {
    const fresh = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    callback(fresh ? JSON.parse(fresh) : null);
  };

  window.addEventListener('projectjury_auth_changed', handleCustomAuth);

  let unsubscribeFirebase: (() => void) | null = null;
  if (auth) {
    unsubscribeFirebase = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const mapped: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Petitioner',
        };
        callback(mapped);
      }
    });
  }

  return () => {
    window.removeEventListener('projectjury_auth_changed', handleCustomAuth);
    if (unsubscribeFirebase) unsubscribeFirebase();
  };
}

export async function saveDocketRecord(data: CaseSessionData): Promise<void> {
  // Save to local storage for instant durability
  localStorage.setItem(`docket_${data.docketId}`, JSON.stringify(data));
  localStorage.setItem('latest_docket_id', data.docketId);

  // If Firestore is available, attempt to write
  if (db && !firebaseConfig.apiKey.includes('Placeholder')) {
    try {
      const ref = doc(db, 'dockets', data.docketId);
      await setDoc(ref, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[Firestore] Could not write remote document, preserved in localStorage:', err);
    }
  }
}

export async function loadDocketRecord(docketId: string): Promise<CaseSessionData | null> {
  if (db && !firebaseConfig.apiKey.includes('Placeholder')) {
    try {
      const ref = doc(db, 'dockets', docketId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as CaseSessionData;
      }
    } catch (err) {
      console.warn('[Firestore] Fetch failed, falling back to local storage:', err);
    }
  }

  const stored = localStorage.getItem(`docket_${docketId}`);
  if (stored) {
    return JSON.parse(stored) as CaseSessionData;
  }
  return null;
}
