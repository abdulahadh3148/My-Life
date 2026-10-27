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
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { AppStateData } from '../utils/storage';
import { ManagedUser } from '../types';

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

/**
 * Register or update logged-in user in user management registry
 */
export async function recordUserLogin(
  user: User,
  stats?: { placesCount?: number; activitiesCount?: number }
): Promise<ManagedUser> {
  const email = user.email || 'user@mylife.app';
  const displayName = user.displayName || email.split('@')[0];
  const photoURL = user.photoURL || null;
  const isDefaultAdmin = email.toLowerCase().includes('abdul') || email.toLowerCase().includes('ahad') || email.toLowerCase().includes('admin');

  const now = new Date().toISOString();
  let existingUser: ManagedUser | null = null;

  // 1. Check local storage cache
  try {
    const rawLocal = localStorage.getItem('mylife_admin_users');
    if (rawLocal) {
      const users: ManagedUser[] = JSON.parse(rawLocal);
      existingUser = users.find(u => u.uid === user.uid) || null;
    }
  } catch (e) {
    console.error('Failed to read local users directory', e);
  }

  // 2. Check Firestore
  try {
    const userDocRef = doc(db, 'users_registry', user.uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      existingUser = snap.data() as ManagedUser;
    }
  } catch (e) {
    console.warn('Could not read user from Firestore users_registry, using local/fallback', e);
  }

  const managedUser: ManagedUser = {
    uid: user.uid,
    email,
    displayName,
    photoURL,
    role: existingUser?.role || (isDefaultAdmin ? 'admin' : 'user'),
    status: existingUser?.status || 'active',
    createdAt: existingUser?.createdAt || now,
    lastLoginAt: now,
    placesCount: stats?.placesCount ?? existingUser?.placesCount ?? 0,
    activitiesCount: stats?.activitiesCount ?? existingUser?.activitiesCount ?? 0
  };

  // 3. Save to Firestore
  try {
    const userDocRef = doc(db, 'users_registry', user.uid);
    await setDoc(userDocRef, managedUser, { merge: true });
  } catch (e) {
    console.warn('Could not save user to Firestore users_registry', e);
  }

  // 4. Update local storage cache
  try {
    const rawLocal = localStorage.getItem('mylife_admin_users');
    let users: ManagedUser[] = rawLocal ? JSON.parse(rawLocal) : [];
    const index = users.findIndex(u => u.uid === user.uid);
    if (index >= 0) {
      users[index] = managedUser;
    } else {
      users.unshift(managedUser);
    }
    localStorage.setItem('mylife_admin_users', JSON.stringify(users));
  } catch (e) {
    console.error('Failed to write local users directory', e);
  }

  return managedUser;
}

/**
 * Fetch all registered users for Admin panel
 */
export async function getManagedUsersFromCloud(): Promise<ManagedUser[]> {
  let list: ManagedUser[] = [];

  // Try Firestore first
  try {
    const colRef = collection(db, 'users_registry');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      list = snap.docs.map(d => d.data() as ManagedUser);
    }
  } catch (e) {
    console.warn('Could not fetch users_registry from Firestore, using local cache', e);
  }

  // Fallback to local storage if empty or offline
  if (list.length === 0) {
    try {
      const rawLocal = localStorage.getItem('mylife_admin_users');
      if (rawLocal) {
        list = JSON.parse(rawLocal);
      }
    } catch (e) {
      console.error('Error reading mylife_admin_users', e);
    }
  }

  // Sort by lastLoginAt descending
  return list.sort((a, b) => new Date(b.lastLoginAt).getTime() - new Date(a.lastLoginAt).getTime());
}

/**
 * Update user role or status from Admin panel
 */
export async function updateManagedUserInCloud(uid: string, updates: Partial<ManagedUser>): Promise<void> {
  // Update Firestore
  try {
    const userDocRef = doc(db, 'users_registry', uid);
    await updateDoc(userDocRef, updates);
  } catch (e) {
    console.warn('Failed to update user in Firestore users_registry', e);
  }

  // Update local storage
  try {
    const rawLocal = localStorage.getItem('mylife_admin_users');
    if (rawLocal) {
      let users: ManagedUser[] = JSON.parse(rawLocal);
      users = users.map(u => u.uid === uid ? { ...u, ...updates } : u);
      localStorage.setItem('mylife_admin_users', JSON.stringify(users));
    }
  } catch (e) {
    console.error('Failed to update user in local storage', e);
  }
}

/**
 * Delete a user from Admin panel
 */
export async function deleteManagedUserFromCloud(uid: string): Promise<void> {
  // Delete from Firestore
  try {
    const userDocRef = doc(db, 'users_registry', uid);
    await deleteDoc(userDocRef);
  } catch (e) {
    console.warn('Failed to delete user in Firestore users_registry', e);
  }

  // Delete from local storage
  try {
    const rawLocal = localStorage.getItem('mylife_admin_users');
    if (rawLocal) {
      let users: ManagedUser[] = JSON.parse(rawLocal);
      users = users.filter(u => u.uid !== uid);
      localStorage.setItem('mylife_admin_users', JSON.stringify(users));
    }
  } catch (e) {
    console.error('Failed to delete user in local storage', e);
  }
}

