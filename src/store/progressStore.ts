import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDocFromServer, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase.ts';
import { createCloudSession } from '../lib/cloudSession.ts';

const cloudSession = createCloudSession(() => auth.currentUser?.uid);
import type { UserProgress } from '../types/progress.ts';

interface ProgressStore extends UserProgress {
  completeLesson: (lessonId: string, moduleId: string) => void;
  recordQuizScore: (quizId: string, score: number) => void;
  completeProject: (projectId: string) => void;
  addTimeSpent: (minutes: number) => void;
  setCurrentLesson: (lessonId: string, moduleId: string) => void;
  checkStreak: () => void;
  addWeakArea: (moduleId: string) => void;
  removeWeakArea: (moduleId: string) => void;
  resetProgress: (syncCloud?: boolean) => void;
  loadFromFirestore: (uid: string) => Promise<void>;
  cancelCloudSync: () => void;
  syncToFirestore: () => Promise<void>;
}

const defaultProgress: UserProgress = {
  lessonsCompleted: [],
  quizScores: {},
  projectsCompleted: [],
  streak: 0,
  lastActiveDate: '',
  currentModuleId: 'foundations',
  currentLessonId: 'what-is-programming',
  timeSpentMinutes: 0,
  weakAreas: [],
  xp: 0,
  level: 1,
};

export const levelForXP = (xp: number) => Math.floor(xp / 200) + 1;

export const calculateTotalXP = (
  lessonsCompleted: string[],
  projectsCompleted: string[],
  quizScores: Record<string, number>
) => {
  const lessonXP = lessonsCompleted.length * 50;
  const projectXP = projectsCompleted.length * 500;
  const quizXP = Object.values(quizScores).reduce((sum, score) => sum + (Number.isFinite(score) ? score : 0), 0);
  return lessonXP + projectXP + quizXP;
};

const localDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const sanitizeProgress = (state?: Partial<UserProgress> | null): UserProgress => {
  const safeState = state || {};
  const lessonsCompleted = Array.isArray(safeState.lessonsCompleted) ? safeState.lessonsCompleted : [];
  const projectsCompleted = Array.isArray(safeState.projectsCompleted) ? safeState.projectsCompleted : [];
  const quizScores: Record<string, number> = {};
  if (safeState.quizScores && typeof safeState.quizScores === 'object') {
    for (const [k, v] of Object.entries(safeState.quizScores)) {
      if (typeof v === 'number' && Number.isFinite(v)) {
        quizScores[k] = Math.max(0, Math.min(100, v));
      }
    }
  }
  const xp = typeof safeState.xp === 'number' && Number.isFinite(safeState.xp)
    ? safeState.xp
    : calculateTotalXP(lessonsCompleted, projectsCompleted, quizScores);
  const level = levelForXP(xp);

  return {
    lessonsCompleted,
    quizScores,
    projectsCompleted,
    streak: typeof safeState.streak === 'number' ? Math.max(0, safeState.streak) : 0,
    lastActiveDate: typeof safeState.lastActiveDate === 'string' ? safeState.lastActiveDate : '',
    currentModuleId: typeof safeState.currentModuleId === 'string' ? safeState.currentModuleId : 'foundations',
    currentLessonId: typeof safeState.currentLessonId === 'string' ? safeState.currentLessonId : 'what-is-programming',
    timeSpentMinutes: typeof safeState.timeSpentMinutes === 'number' ? Math.max(0, safeState.timeSpentMinutes) : 0,
    weakAreas: Array.isArray(safeState.weakAreas) ? safeState.weakAreas : [],
    xp,
    level,
  };
};

const syncProgressToFirestore = async (state?: Partial<UserProgress>) => {
  const uid = auth.currentUser?.uid;
  if (!uid || !cloudSession.canWrite(uid)) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    const current = useProgressStore.getState();
    const dataToSave = sanitizeProgress({ ...current, ...(state || {}) });
    await setDoc(userDocRef, { progress: dataToSave, lastSyncedAt: new Date().toISOString() }, { mergeFields: ['progress', 'lastSyncedAt'] });
  } catch (error) {
    console.warn('Firestore sync warning (data still saved locally):', error);
  }
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...defaultProgress,

      completeLesson: (lessonId, moduleId) => {
        get().checkStreak();
        const state = get();
        if (!state.lessonsCompleted.includes(lessonId)) {
          const nextLessons = [...state.lessonsCompleted, lessonId];
          const nextXP = state.xp + 50;
          const nextLevel = levelForXP(nextXP);
          const updated = {
            lessonsCompleted: nextLessons,
            xp: nextXP,
            level: nextLevel,
            currentLessonId: lessonId,
            currentModuleId: moduleId,
          };
          set(updated);
          syncProgressToFirestore(updated);
        }
      },

      recordQuizScore: (quizId, score) => {
        if (!Number.isFinite(score)) return;
        get().checkStreak();
        const state = get();
        const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
        const prevScore = state.quizScores[quizId] ?? 0;
        const bestScore = Math.max(prevScore, normalizedScore);
        const xpDelta = bestScore - prevScore;
        const nextXP = Math.max(0, state.xp + xpDelta);
        const updated = {
          quizScores: { ...state.quizScores, [quizId]: bestScore },
          xp: nextXP,
          level: levelForXP(nextXP),
        };
        set(updated);
        syncProgressToFirestore(updated);
      },

      completeProject: (projectId) => {
        get().checkStreak();
        const state = get();
        if (!state.projectsCompleted.includes(projectId)) {
          const nextProjects = [...state.projectsCompleted, projectId];
          const nextXP = state.xp + 500;
          const nextLevel = levelForXP(nextXP);
          const updated = {
            projectsCompleted: nextProjects,
            xp: nextXP,
            level: nextLevel,
          };
          set(updated);
          syncProgressToFirestore(updated);
        }
      },

      addTimeSpent: (minutes) => {
        if (!minutes || minutes <= 0) return;
        const nextMinutes = get().timeSpentMinutes + minutes;
        set({ timeSpentMinutes: nextMinutes });
        syncProgressToFirestore({ timeSpentMinutes: nextMinutes });
      },

      setCurrentLesson: (lessonId, moduleId) => {
        set({ currentLessonId: lessonId, currentModuleId: moduleId });
        syncProgressToFirestore({ currentLessonId: lessonId, currentModuleId: moduleId });
      },

      checkStreak: () => {
        const now = new Date();
        const today = localDate(now);
        const state = get();
        if (state.lastActiveDate === today) return;

        now.setDate(now.getDate() - 1);
        const yesterday = localDate(now);
        const newStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
        const updated = { streak: newStreak, lastActiveDate: today };
        set(updated);
        syncProgressToFirestore(updated);
      },

      addWeakArea: (moduleId) => {
        const state = get();
        if (!state.weakAreas.includes(moduleId)) {
          const nextWeakAreas = [...state.weakAreas, moduleId];
          set({ weakAreas: nextWeakAreas });
          syncProgressToFirestore({ weakAreas: nextWeakAreas });
        }
      },

      removeWeakArea: (moduleId) => {
        const state = get();
        const nextWeakAreas = state.weakAreas.filter((id) => id !== moduleId);
        set({ weakAreas: nextWeakAreas });
        syncProgressToFirestore({ weakAreas: nextWeakAreas });
      },

      resetProgress: (syncCloud = false) => {
        if (!syncCloud) cloudSession.invalidate();
        set(defaultProgress);
        if (syncCloud) {
          syncProgressToFirestore(defaultProgress);
        }
      },

      syncToFirestore: async () => {
        await syncProgressToFirestore(get());
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
            const rawProgress = (data?.progress && typeof data.progress === 'object')
              ? data.progress
              : data;
            const cloudProgress = sanitizeProgress(rawProgress as Partial<UserProgress>);
            
            // Ensure XP and level reflect the loaded completion data
            const calculatedXP = calculateTotalXP(
              cloudProgress.lessonsCompleted,
              cloudProgress.projectsCompleted,
              cloudProgress.quizScores
            );
            cloudProgress.xp = Math.max(cloudProgress.xp, calculatedXP);
            cloudProgress.level = levelForXP(cloudProgress.xp);

            set(cloudProgress);
          } else {
            // New cloud account: initialize clean progress
            const clean = sanitizeProgress(defaultProgress);
            set(clean);
          }
          request.complete();
        } catch (error) {
          if (request.isCurrent()) throw error;
        }
      },
    }),
    {
      name: 'agentic-ai-progress',
      version: 2,
      migrate: (persistedState) => {
        const state = { ...defaultProgress, ...(persistedState as Partial<UserProgress>) };
        state.xp = calculateTotalXP(state.lessonsCompleted || [], state.projectsCompleted || [], state.quizScores || {});
        state.level = levelForXP(state.xp);
        return state;
      },
    }
  )
);
