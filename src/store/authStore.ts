import { create } from 'zustand';
import { 
  type User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase.ts';

import { useProgressStore } from './progressStore.ts';
import { useBookmarkStore } from './bookmarkStore.ts';
import { useSettingsStore } from './settingsStore.ts';

interface AuthState {
  user: User | null;
  sessionId: number;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  sessionId: 0,
  loading: true,
  error: null,

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      // The auth listener is the single owner of session transitions.
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
      console.error('Google sign-in error:', err);
      set({ error: errorMsg, loading: false });
    }
  },

  signOut: async () => {
    useProgressStore.getState().cancelCloudSync();
    useBookmarkStore.getState().cancelCloudSync();
    useSettingsStore.getState().cancelCloudSync();
    set((state) => ({ loading: true, error: null, sessionId: state.sessionId + 1 }));
    try {
      await firebaseSignOut(auth);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Sign out failed.';
      console.error('Sign out error:', err);
      set({ error: errorMsg, loading: false });
    }
  },

  clearError: () => set({ error: null }),

  initializeAuth: () => {
    set({ loading: true });
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Invalidate old reads/writes before React renders the new session.
      useProgressStore.getState().cancelCloudSync();
      useBookmarkStore.getState().cancelCloudSync();
      useSettingsStore.getState().cancelCloudSync();
      const previousUid = get().user?.uid;
      if (!user || (previousUid && previousUid !== user.uid)) {
        useProgressStore.getState().resetProgress();
        useBookmarkStore.getState().resetBookmarks();
        useSettingsStore.getState().resetSettings();
      }
      set((state) => ({ user, sessionId: state.sessionId + 1, loading: false, error: null }));
    });
    return unsubscribe;
  },
}));
