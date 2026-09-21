import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import type { UserProgress } from '../types/progress';

interface ProgressStore extends UserProgress {
  completeLesson: (lessonId: string, moduleId: string) => void;
  recordQuizScore: (quizId: string, score: number) => void;
  completeProject: (projectId: string) => void;
  addTimeSpent: (minutes: number) => void;
  setCurrentLesson: (lessonId: string, moduleId: string) => void;
  checkStreak: () => void;
  addWeakArea: (moduleId: string) => void;
  removeWeakArea: (moduleId: string) => void;
  resetProgress: () => void;
  loadFromFirestore: (uid: string) => Promise<void>;
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

const syncProgressToFirestore = async (state: UserProgress) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    const dataToSave: UserProgress = {
      lessonsCompleted: state.lessonsCompleted,
      quizScores: state.quizScores,
      projectsCompleted: state.projectsCompleted,
      streak: state.streak,
      lastActiveDate: state.lastActiveDate,
      currentModuleId: state.currentModuleId,
      currentLessonId: state.currentLessonId,
      timeSpentMinutes: state.timeSpentMinutes,
      weakAreas: state.weakAreas,
      xp: state.xp,
      level: state.level,
    };
    await setDoc(userDocRef, { progress: dataToSave, lastSyncedAt: new Date().toISOString() }, { merge: true });
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
          syncProgressToFirestore({ ...get(), ...updated });
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
        syncProgressToFirestore({ ...get(), ...updated });
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
          syncProgressToFirestore({ ...get(), ...updated });
        }
      },

      addTimeSpent: (minutes) => {
        if (!minutes || minutes <= 0) return;
        const nextMinutes = get().timeSpentMinutes + minutes;
        set({ timeSpentMinutes: nextMinutes });
        syncProgressToFirestore({ ...get(), timeSpentMinutes: nextMinutes });
      },

      setCurrentLesson: (lessonId, moduleId) => {
        set({ currentLessonId: lessonId, currentModuleId: moduleId });
        syncProgressToFirestore({ ...get(), currentLessonId: lessonId, currentModuleId: moduleId });
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
        syncProgressToFirestore({ ...get(), ...updated });
      },

      addWeakArea: (moduleId) => {
        const state = get();
        if (!state.weakAreas.includes(moduleId)) {
          const nextWeakAreas = [...state.weakAreas, moduleId];
          set({ weakAreas: nextWeakAreas });
          syncProgressToFirestore({ ...get(), weakAreas: nextWeakAreas });
        }
      },

      removeWeakArea: (moduleId) => {
        const state = get();
        const nextWeakAreas = state.weakAreas.filter((id) => id !== moduleId);
        set({ weakAreas: nextWeakAreas });
        syncProgressToFirestore({ ...get(), weakAreas: nextWeakAreas });
      },

      resetProgress: () => {
        set(defaultProgress);
        syncProgressToFirestore(defaultProgress);
      },

      syncToFirestore: async () => {
        await syncProgressToFirestore(get());
      },

      loadFromFirestore: async (uid: string) => {
        try {
          const userDocRef = doc(db, 'users', uid);
          const snap = await getDoc(userDocRef);
          const localState = get();

          if (snap.exists()) {
            const data = snap.data();
            const cloudProgress = (data.progress || {}) as Partial<UserProgress>;

            // Merge local and cloud data smartly (union of completed items, max scores)
            const lessonsCompleted = Array.from(
              new Set([...(localState.lessonsCompleted || []), ...(cloudProgress.lessonsCompleted || [])])
            );
            const projectsCompleted = Array.from(
              new Set([...(localState.projectsCompleted || []), ...(cloudProgress.projectsCompleted || [])])
            );
            
            const quizScores: Record<string, number> = {
              ...(localState.quizScores || {}),
              ...(cloudProgress.quizScores || {}),
            };
            if (cloudProgress.quizScores) {
              for (const [k, v] of Object.entries(cloudProgress.quizScores)) {
                quizScores[k] = Math.max(quizScores[k] ?? 0, v);
              }
            }

            const totalXP = calculateTotalXP(lessonsCompleted, projectsCompleted, quizScores);
            const finalXP = Math.max(totalXP, localState.xp || 0, cloudProgress.xp || 0);

            const merged: UserProgress = {
              lessonsCompleted,
              projectsCompleted,
              quizScores,
              streak: Math.max(localState.streak || 0, cloudProgress.streak || 0),
              lastActiveDate: cloudProgress.lastActiveDate || localState.lastActiveDate || '',
              currentModuleId: cloudProgress.currentModuleId || localState.currentModuleId || 'foundations',
              currentLessonId: cloudProgress.currentLessonId || localState.currentLessonId || 'what-is-programming',
              timeSpentMinutes: Math.max(localState.timeSpentMinutes || 0, cloudProgress.timeSpentMinutes || 0),
              weakAreas: Array.from(
                new Set([...(localState.weakAreas || []), ...(cloudProgress.weakAreas || [])])
              ),
              xp: finalXP,
              level: levelForXP(finalXP),
            };

            set(merged);
            // Write back merged progress to ensure cloud and local are fully in sync
            await setDoc(userDocRef, { progress: merged, lastSyncedAt: new Date().toISOString() }, { merge: true });
          } else {
            // First time cloud user, push local progress to Firestore
            const initial = get();
            await setDoc(userDocRef, { progress: initial, lastSyncedAt: new Date().toISOString() }, { merge: true });
          }
        } catch (error) {
          console.warn('Could not load progress from Firestore (using local storage):', error);
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
