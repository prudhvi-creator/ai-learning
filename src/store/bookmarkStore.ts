import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import type { BookmarkEntry, NoteEntry } from '../types/progress';

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
  resetBookmarks: () => void;
  syncToFirestore: () => Promise<void>;
}

const syncBookmarksToFirestore = async (bookmarks: BookmarkEntry[], notes: NoteEntry[]) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
      userDocRef,
      { bookmarks, notes, lastSyncedAt: new Date().toISOString() },
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

      resetBookmarks: () => {
        set({ bookmarks: [], notes: [] });
        syncBookmarksToFirestore([], []);
      },

      syncToFirestore: async () => {
        const state = get();
        await syncBookmarksToFirestore(state.bookmarks, state.notes);
      },

      loadFromFirestore: async (uid: string) => {
        try {
          const userDocRef = doc(db, 'users', uid);
          const snap = await getDoc(userDocRef);
          const localState = get();

          if (snap.exists()) {
            const data = snap.data();
            const cloudBookmarks = (Array.isArray(data.bookmarks) ? data.bookmarks : []) as BookmarkEntry[];
            const cloudNotes = (Array.isArray(data.notes) ? data.notes : []) as NoteEntry[];

            // Merge bookmarks (dedup by lessonId)
            const bookmarkMap = new Map<string, BookmarkEntry>();
            (localState.bookmarks || []).forEach((b) => bookmarkMap.set(b.lessonId, b));
            cloudBookmarks.forEach((b) => bookmarkMap.set(b.lessonId, b));
            const mergedBookmarks = Array.from(bookmarkMap.values());

            // Merge notes (pick newer or non-empty content)
            const noteMap = new Map<string, NoteEntry>();
            (localState.notes || []).forEach((n) => noteMap.set(n.lessonId, n));
            cloudNotes.forEach((n) => {
              const existing = noteMap.get(n.lessonId);
              if (!existing || (n.updatedAt && (!existing.updatedAt || n.updatedAt >= existing.updatedAt))) {
                noteMap.set(n.lessonId, n);
              }
            });
            const mergedNotes = Array.from(noteMap.values());

            set({ bookmarks: mergedBookmarks, notes: mergedNotes });
            await setDoc(
              userDocRef,
              { bookmarks: mergedBookmarks, notes: mergedNotes, lastSyncedAt: new Date().toISOString() },
              { merge: true }
            );
          } else {
            // First time user, save current local bookmarks/notes to cloud
            await setDoc(
              userDocRef,
              { bookmarks: localState.bookmarks, notes: localState.notes, lastSyncedAt: new Date().toISOString() },
              { merge: true }
            );
          }
        } catch (error) {
          console.warn('Could not load bookmarks from Firestore (using local storage):', error);
        }
      },
    }),
    {
      name: 'agentic-ai-bookmarks',
    }
  )
);
