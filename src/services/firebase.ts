import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { AppStateData } from '../utils/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAO6Jxsa8y-_fi0R1zmhgGEUDeBIgWwJNk",
  authDomain: "mylife-os-ba5ac.firebaseapp.com",
  projectId: "mylife-os-ba5ac",
  storageBucket: "mylife-os-ba5ac.firebasestorage.app",
  messagingSenderId: "1006427331654",
  appId: "1:1006427331654:web:d75febe95e76dbb490be47",
  measurementId: "G-N3RN4SPEYH"
};

// Initialize Firebase safely (avoid re-initialization during HMR)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in using Google Popup
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Sign out user
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Listen to auth state change
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Save user data state to Cloud Firestore
 */
export async function saveUserDataToCloud(userId: string, data: Partial<AppStateData>): Promise<void> {
  if (!userId) return;
  const userDocRef = doc(db, 'users', userId);
  
  // Clean payload for Firestore (ensure no undefined fields)
  const payload = JSON.parse(JSON.stringify(data));
  payload.updatedAt = new Date().toISOString();
  payload.lastCloudSync = new Date().toISOString();

  await setDoc(userDocRef, payload, { merge: true });
}

/**
 * Fetch user data state from Cloud Firestore
 */
export async function loadUserDataFromCloud(userId: string): Promise<AppStateData | null> {
  if (!userId) return null;
  const userDocRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userDocRef);

  if (snapshot.exists()) {
    return snapshot.data() as AppStateData;
  }
  return null;
}

/**
 * Compress an image file to a lightweight data URL (WebP/JPEG)
 * Keeps max dimension under 1280px with 0.8 quality to preserve HD clarity
 * while keeping file size small (~80KB) for instant Cloud Firestore storage.
 */
export function compressImageFile(file: File, maxDimension = 1280, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Try WebP first, fallback to JPEG
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
