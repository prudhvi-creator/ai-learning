import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useSettingsStore } from '../store/settingsStore';

export function useFirestoreSync() {
  const { user, loading: authLoading, initializeAuth } = useAuthStore();
  const { loadFromFirestore: loadProgress } = useProgressStore();
  const { loadFromFirestore: loadBookmarks } = useBookmarkStore();
  const { loadFromFirestore: loadSettings } = useSettingsStore();
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  // Sync data whenever user logs in
  useEffect(() => {
    let isMounted = true;

    async function syncUserData() {
      if (user) {
        setIsSyncing(true);
        try {
          await Promise.allSettled([
            loadProgress(user.uid),
            loadBookmarks(user.uid),
            loadSettings(user.uid),
          ]);
        } catch (error) {
          console.warn('Firestore sync failed, local state preserved:', error);
        } finally {
          if (isMounted) {
            setIsSyncing(false);
          }
        }
      }
    }

    if (!authLoading && user) {
      syncUserData();
    }

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, loadProgress, loadBookmarks, loadSettings]);

  return {
    isLoading: authLoading,
    isSyncing,
    isAuthenticated: !!user,
    user,
  };
}
