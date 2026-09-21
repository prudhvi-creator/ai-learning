import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useSettingsStore } from '../store/settingsStore';

export function useFirestoreSync() {
  const { user, sessionId, loading: authLoading, initializeAuth } = useAuthStore();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ sessionId: number; attempt: number; error: string | null } | null>(null);

  useEffect(() => initializeAuth(), [initializeAuth]);

  useEffect(() => {
    if (authLoading || !user?.uid) return;
    let active = true;
    const stores = [useProgressStore, useBookmarkStore, useSettingsStore];

    Promise.all(stores.map((store) => store.getState().loadFromFirestore(user.uid)))
      .then(() => {
        if (active) setResult({ sessionId, attempt, error: null });
      })
      .catch(() => {
        if (!active) return;
        stores.forEach((store) => store.getState().cancelCloudSync());
        setResult({ sessionId, attempt, error: 'Your saved data could not be loaded. Check your connection and retry.' });
      });

    return () => {
      active = false;
      stores.forEach((store) => store.getState().cancelCloudSync());
    };
  }, [user?.uid, sessionId, authLoading, attempt]);

  const currentResult = result?.sessionId === sessionId && result.attempt === attempt ? result : null;
  const syncError = user ? currentResult?.error ?? null : null;
  const isSyncing = !!user && !authLoading && !currentResult;

  return {
    isLoading: authLoading || (!!user && (!currentResult || !!syncError)),
    isSyncing,
    syncError,
    retrySync: () => setAttempt((value) => value + 1),
    isAuthenticated: !!user,
    user,
  };
}
