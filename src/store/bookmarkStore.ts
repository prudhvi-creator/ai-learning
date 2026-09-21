import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDocFromServer, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase.ts';
import { createCloudSession } from '../lib/cloudSession.ts';

const cloudSession = createCloudSession(() => auth.currentUser?.uid);
import type { BookmarkEntry, NoteEntry } from '../types/progress.ts';

interface BookmarkStore {
  bookmarks: BookmarkEntry[];
  notes: NoteEntry[];
  addBookmark: (lessonId: string) => void;
  removeBookmark: (lessonId: string) => void;
  isBookmarked: (lessonId: string) => boolean;
  saveNote: (lessonId: string, content: string) => void;
  getNote: (lessonId: string) => string;
  deleteNote: (lessonId: string) => void;
  loadFromFirestore: (uid: string) => Promise<void>;
  cancelCloudSync: () => void;
  resetBookmarks: (syncCloud?: boolean) => void;
  syncToFirestore: () => Promise<void>;
}

export const sanitizeBookmarks = (bookmarks?: BookmarkEntry[] | null): BookmarkEntry[] => {
  if (!Array.isArray(bookmarks)) return [];
  return bookmarks
    .filter((b) => b && typeof b.lessonId === 'string')
    .map((b) => ({
      lessonId: b.lessonId,
      savedAt: typeof b.savedAt === 'string' ? b.savedAt : new Date().toISOString(),
    }));
};

export const sanitizeNotes = (notes?: NoteEntry[] | null): NoteEntry[] => {
  if (!Array.isArray(notes)) return [];
  return notes
    .filter((n) => n && typeof n.lessonId === 'string')
    .map((n) => ({
      lessonId: n.lessonId,
      content: typeof n.content === 'string' ? n.content : '',
      updatedAt: typeof n.updatedAt === 'string' ? n.updatedAt : new Date().toISOString(),
    }));
};

const syncBookmarksToFirestore = async (bookmarks?: BookmarkEntry[], notes?: NoteEntry[]) => {
  const uid = auth.currentUser?.uid;
  if (!uid || !cloudSession.canWrite(uid)) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    const current = useBookmarkStore.getState();
    const safeBookmarks = sanitizeBookmarks(bookmarks ?? current.bookmarks);
    const safeNotes = sanitizeNotes(notes ?? current.notes);
    await setDoc(
      userDocRef,
      { bookmarks: safeBookmarks, notes: safeNotes, lastSyncedAt: new Date().toISOString() },
      { merge: true }
    );
  } catch (error) {
    console.warn('Firestore bookmarks sync warning (data still saved locally):', error);
  }
};

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      notes: [],

      addBookmark: (lessonId) => {
        const state = get();
        if (!state.bookmarks.some((b) => b.lessonId === lessonId)) {
          const nextBookmarks = [
            ...state.bookmarks,
            { lessonId, savedAt: new Date().toISOString() },
          ];
          set({ bookmarks: nextBookmarks });
          syncBookmarksToFirestore(nextBookmarks, state.notes);
        }
      },

      removeBookmark: (lessonId) => {
        const state = get();
        const nextBookmarks = state.bookmarks.filter((b) => b.lessonId !== lessonId);
        set({ bookmarks: nextBookmarks });
        syncBookmarksToFirestore(nextBookmarks, state.notes);
      },

      isBookmarked: (lessonId) => {
        return get().bookmarks.some((b) => b.lessonId === lessonId);
      },

      saveNote: (lessonId, content) => {
        const state = get();
        const existingIdx = state.notes.findIndex((n) => n.lessonId === lessonId);
        const updatedAt = new Date().toISOString();
        let nextNotes: NoteEntry[];

        if (existingIdx >= 0) {
          nextNotes = [...state.notes];
          nextNotes[existingIdx] = { lessonId, content, updatedAt };
        } else {
          nextNotes = [...state.notes, { lessonId, content, updatedAt }];
        }

        set({ notes: nextNotes });
        syncBookmarksToFirestore(state.bookmarks, nextNotes);
      },

      getNote: (lessonId) => {
        return get().notes.find((n) => n.lessonId === lessonId)?.content ?? '';
      },

      deleteNote: (lessonId) => {
        const state = get();
        const nextNotes = state.notes.filter((n) => n.lessonId !== lessonId);
        set({ notes: nextNotes });
        syncBookmarksToFirestore(state.bookmarks, nextNotes);
      },

      resetBookmarks: (syncCloud = false) => {
        if (!syncCloud) cloudSession.invalidate();
        set({ bookmarks: [], notes: [] });
        if (syncCloud) {
          syncBookmarksToFirestore([], []);
        }
      },

      syncToFirestore: async () => {
        const state = get();
        await syncBookmarksToFirestore(state.bookmarks, state.notes);
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
            const cloudBookmarks = sanitizeBookmarks(data?.bookmarks);
            const cloudNotes = sanitizeNotes(data?.notes);
            set({ bookmarks: cloudBookmarks, notes: cloudNotes });
          } else {
            const safeBookmarks: BookmarkEntry[] = [];
            const safeNotes: NoteEntry[] = [];
            set({ bookmarks: safeBookmarks, notes: safeNotes });
          }
          request.complete();
        } catch (error) {
          if (request.isCurrent()) throw error;
        }
      },
    }),
    {
      name: 'agentic-ai-bookmarks',
    }
  )
);
