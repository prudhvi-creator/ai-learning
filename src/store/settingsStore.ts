import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import type { UserSettings } from '../types/progress';

interface SettingsStore extends UserSettings {
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  toggleBeginnerMode: () => void;
  setDailyGoal: (minutes: number) => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  setUserName: (name: string) => void;
  toggleNotifications: () => void;
  loadFromFirestore: (uid: string) => Promise<void>;
  resetSettings: () => void;
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

const syncSettingsToFirestore = async (state: UserSettings) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
      userDocRef,
      { settings: state, lastSyncedAt: new Date().toISOString() },
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
        syncSettingsToFirestore({ ...get(), theme });
      },

      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: nextTheme });
        syncSettingsToFirestore({ ...get(), theme: nextTheme });
      },

      toggleBeginnerMode: () => {
        const nextVal = !get().beginnerMode;
        set({ beginnerMode: nextVal });
        syncSettingsToFirestore({ ...get(), beginnerMode: nextVal });
      },

      setDailyGoal: (minutes) => {
        set({ dailyGoalMinutes: minutes });
        syncSettingsToFirestore({ ...get(), dailyGoalMinutes: minutes });
      },

      setFontSize: (size) => {
        set({ fontSize: size });
        syncSettingsToFirestore({ ...get(), fontSize: size });
      },

      setUserName: (name) => {
        set({ userName: name });
        syncSettingsToFirestore({ ...get(), userName: name });
      },

      toggleNotifications: () => {
        const nextVal = !get().notifications;
        set({ notifications: nextVal });
        syncSettingsToFirestore({ ...get(), notifications: nextVal });
      },

      resetSettings: () => {
        set(defaultSettings);
        syncSettingsToFirestore(defaultSettings);
      },

      syncToFirestore: async () => {
        await syncSettingsToFirestore(get());
      },

      loadFromFirestore: async (uid: string) => {
        try {
          const userDocRef = doc(db, 'users', uid);
          const snap = await getDoc(userDocRef);
          const localState = get();

          if (snap.exists()) {
            const data = snap.data();
            const cloudSettings = (data.settings || {}) as Partial<UserSettings>;
            const merged: UserSettings = {
              ...defaultSettings,
              ...localState,
              ...cloudSettings,
            };
            set(merged);
          } else {
            const user = auth.currentUser;
            const initial = {
              ...localState,
              userName: localState.userName === 'Learner' && user?.displayName ? user.displayName : localState.userName,
            };
            set(initial);
            await setDoc(userDocRef, { settings: initial, lastSyncedAt: new Date().toISOString() }, { merge: true });
          }
        } catch (error) {
          console.warn('Could not load settings from Firestore (using local storage):', error);
        }
      },
    }),
    {
      name: 'agentic-ai-settings',
    }
  )
);
