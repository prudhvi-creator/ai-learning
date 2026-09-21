import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDocFromServer, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase.ts';
import { createCloudSession } from '../lib/cloudSession.ts';

const cloudSession = createCloudSession(() => auth.currentUser?.uid);
import type { UserSettings } from '../types/progress.ts';

interface SettingsStore extends UserSettings {
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  toggleBeginnerMode: () => void;
  setDailyGoal: (minutes: number) => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  setUserName: (name: string) => void;
  toggleNotifications: () => void;
  loadFromFirestore: (uid: string) => Promise<void>;
  cancelCloudSync: () => void;
  resetSettings: (syncCloud?: boolean) => void;
  syncToFirestore: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  theme: 'dark',
  beginnerMode: true,
  dailyGoalMinutes: 30,
  notifications: true,
  fontSize: 'md',
  userName: 'Learner',
};

export const sanitizeSettings = (state?: Partial<UserSettings> | null): UserSettings => {
  const safe = state || {};
  return {
    theme: safe.theme === 'light' ? 'light' : 'dark',
    beginnerMode: safe.beginnerMode ?? defaultSettings.beginnerMode,
    dailyGoalMinutes: typeof safe.dailyGoalMinutes === 'number' && Number.isFinite(safe.dailyGoalMinutes) ? safe.dailyGoalMinutes : defaultSettings.dailyGoalMinutes,
    notifications: safe.notifications ?? defaultSettings.notifications,
    fontSize: safe.fontSize === 'sm' || safe.fontSize === 'lg' ? safe.fontSize : 'md',
    userName: typeof safe.userName === 'string' && safe.userName.trim() ? safe.userName : defaultSettings.userName,
  };
};

const syncSettingsToFirestore = async (state?: Partial<UserSettings>) => {
  const uid = auth.currentUser?.uid;
  if (!uid || !cloudSession.canWrite(uid)) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    const current = useSettingsStore.getState();
    const settingsData = sanitizeSettings({ ...current, ...(state || {}) });
    await setDoc(
      userDocRef,
      { settings: settingsData, lastSyncedAt: new Date().toISOString() },
      { merge: true }
    );
  } catch (error) {
    console.warn('Firestore settings sync warning (data still saved locally):', error);
  }
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      setTheme: (theme) => {
        set({ theme });
        syncSettingsToFirestore({ theme });
      },

      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: nextTheme });
        syncSettingsToFirestore({ theme: nextTheme });
      },

      toggleBeginnerMode: () => {
        const nextVal = !get().beginnerMode;
        set({ beginnerMode: nextVal });
        syncSettingsToFirestore({ beginnerMode: nextVal });
      },

      setDailyGoal: (minutes) => {
        set({ dailyGoalMinutes: minutes });
        syncSettingsToFirestore({ dailyGoalMinutes: minutes });
      },

      setFontSize: (size) => {
        set({ fontSize: size });
        syncSettingsToFirestore({ fontSize: size });
      },

      setUserName: (name) => {
        set({ userName: name });
        syncSettingsToFirestore({ userName: name });
      },

      toggleNotifications: () => {
        const nextVal = !get().notifications;
        set({ notifications: nextVal });
        syncSettingsToFirestore({ notifications: nextVal });
      },

      resetSettings: (syncCloud = false) => {
        if (!syncCloud) cloudSession.invalidate();
        set(defaultSettings);
        if (syncCloud) {
          syncSettingsToFirestore(defaultSettings);
        }
      },

      syncToFirestore: async () => {
        await syncSettingsToFirestore(get());
      },

      cancelCloudSync: () => cloudSession.invalidate(),

      loadFromFirestore: async (uid: string) => {
        const request = cloudSession.beginLoad(uid);
        try {
          if (!request.isCurrent()) return;
          const userDocRef = doc(db, 'users', uid);
          const snap = await getDocFromServer(userDocRef);
          if (!request.isCurrent()) return;

          if (snap.exists()) {
            const data = snap.data();
            const rawSettings = (data?.settings && typeof data.settings === 'object')
              ? data.settings
              : data;
            const cloudSettings = sanitizeSettings(rawSettings as Partial<UserSettings>);
            set(cloudSettings);
          } else {
            const user = auth.currentUser;
            const initial = sanitizeSettings({
              ...defaultSettings,
              userName: user?.displayName || defaultSettings.userName,
            });
            set(initial);
          }
          request.complete();
        } catch (error) {
          if (request.isCurrent()) throw error;
        }
      },
    }),
    {
      name: 'agentic-ai-settings',
    }
  )
);
