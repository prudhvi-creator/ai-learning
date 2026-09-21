import assert from 'node:assert/strict';
import { beforeEach, afterEach, test } from 'node:test';
import { registerHooks } from 'node:module';
import * as firebase from './fixtures/firebase.mjs';

const mockUrl = new URL('./fixtures/firebase.mjs', import.meta.url).href;
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.endsWith('/lib/firebase.ts') || ['firebase/firestore', 'firebase/auth'].includes(specifier)) {
      return { url: mockUrl, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
const storage = new Map();
globalThis.window = { localStorage: {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
} };
const { useProgressStore: progress } = await import('../src/store/progressStore.ts');
const { useBookmarkStore: bookmarks } = await import('../src/store/bookmarkStore.ts');
const { useSettingsStore: settings } = await import('../src/store/settingsStore.ts');
const { useAuthStore: auth } = await import('../src/store/authStore.ts');
const stores = [progress, bookmarks, settings];
const load = (uid) => Promise.all(stores.map((store) => store.getState().loadFromFirestore(uid)));
const saved = {
  progress: { lessonsCompleted: ['lesson-1', 'lesson-2'], projectsCompleted: ['project'], quizScores: { quiz: 80 }, xp: 680 },
  bookmarks: [{ lessonId: 'lesson-1', savedAt: '2026-09-01' }],
  notes: [{ lessonId: 'lesson-2', content: 'Keep this note', updatedAt: '2026-09-01' }],
  settings: { theme: 'light', userName: 'Alice' },
};
let unsubscribe;
beforeEach(() => {
  firebase.controls.read = null;
  firebase.auth.currentUser = null;
  firebase.documents.clear();
  firebase.writes.length = 0;
  firebase.documents.set('users/alice', structuredClone(saved));
  unsubscribe = auth.getState().initializeAuth();
});
afterEach(() => unsubscribe());

test('sign out and sign back in restores progress, notes, bookmarks and settings without empty writes', async () => {
  await auth.getState().signInWithGoogle();
  await load('alice');
  progress.getState().completeLesson('lesson-3', 'module');
  const cloudBeforeLogout = structuredClone(firebase.documents.get('users/alice'));
  const oldSession = auth.getState().sessionId;
  await auth.getState().signOut();
  assert.equal(progress.getState().xp, 0);
  assert.deepEqual(firebase.documents.get('users/alice'), cloudBeforeLogout);
  firebase.writes.length = 0;
  await auth.getState().signInWithGoogle();
  assert.notEqual(auth.getState().sessionId, oldSession);
  // Reproduce render effects firing before cloud hydration finishes.
  progress.getState().checkStreak();
  progress.getState().setCurrentLesson('what-is-programming', 'foundations');
  await Promise.all(stores.map((store) => store.getState().syncToFirestore()));
  assert.equal(firebase.writes.length, 0);
  await load('alice');
  assert.equal(progress.getState().xp, 730);
  assert.deepEqual(progress.getState().lessonsCompleted, ['lesson-1', 'lesson-2', 'lesson-3']);
  assert.equal(bookmarks.getState().getNote('lesson-2'), 'Keep this note');
  assert.equal(bookmarks.getState().isBookmarked('lesson-1'), true);
  assert.equal(settings.getState().theme, 'light');
  assert.equal(firebase.writes.length, 0);
});

test('failed cloud reads reject and leave writes blocked until a successful retry', async () => {
  firebase.changeUser({ uid: 'alice' });
  firebase.controls.read = async () => { throw new Error('permission-denied'); };
  const results = await Promise.allSettled(stores.map((store) => store.getState().loadFromFirestore('alice')));
  assert.ok(results.every((result) => result.status === 'rejected'));
  progress.getState().checkStreak();
  bookmarks.getState().saveNote('local', 'unsynced');
  settings.getState().setTheme('dark');
  assert.equal(firebase.writes.length, 0);
  assert.deepEqual(firebase.documents.get('users/alice'), saved);
  firebase.controls.read = null;
  await load('alice');
  assert.equal(progress.getState().xp, 680);
  progress.getState().completeLesson('lesson-3', 'module');
  assert.equal(firebase.documents.get('users/alice').progress.xp, 730);
});

test('late reads from a signed-out account cannot replace the new account data', async () => {
  firebase.changeUser({ uid: 'alice' });
  const pending = [];
  firebase.controls.read = () => new Promise((resolve) => pending.push(resolve));
  const oldLoad = load('alice');
  firebase.changeUser({ uid: 'bob' });
  firebase.documents.set('users/bob', { progress: { lessonsCompleted: ['bob-lesson'], xp: 50 }, settings: { userName: 'Bob' } });
  firebase.controls.read = null;
  await load('bob');
  pending.forEach((resolve) => resolve(firebase.snapshot(saved)));
  await oldLoad;
  assert.deepEqual(progress.getState().lessonsCompleted, ['bob-lesson']);
  assert.equal(settings.getState().userName, 'Bob');
  assert.deepEqual(bookmarks.getState().notes, []);
  assert.equal(firebase.writes.length, 0);
});

test('a cancelled load cannot reopen writes even after the same user signs in again', async () => {
  firebase.changeUser({ uid: 'alice' });
  const pending = [];
  firebase.controls.read = () => new Promise((resolve) => pending.push(resolve));
  const oldLoad = load('alice');
  await auth.getState().signOut();
  await auth.getState().signInWithGoogle();
  pending.forEach((resolve) => resolve(firebase.snapshot(saved)));
  await oldLoad;
  assert.equal(progress.getState().xp, 0);
  await Promise.all(stores.map((store) => store.getState().syncToFirestore()));
  assert.equal(firebase.writes.length, 0);
  firebase.controls.read = null;
  await load('alice');
  assert.equal(progress.getState().xp, 680);
});

test('duplicate initialization reads apply only the latest result', async () => {
  firebase.changeUser({ uid: 'alice' });
  let resolveOld;
  firebase.controls.read = () => new Promise((resolve) => { resolveOld = resolve; });
  const oldLoad = progress.getState().loadFromFirestore('alice');
  progress.getState().cancelCloudSync();
  firebase.controls.read = null;
  await progress.getState().loadFromFirestore('alice');
  resolveOld(firebase.snapshot({ progress: { xp: 0 } }));
  await oldLoad;
  assert.equal(progress.getState().xp, 680);
});

test('reading a new account does not create empty documents or copy another account data', async () => {
  firebase.changeUser({ uid: 'alice' });
  await load('alice');
  firebase.changeUser({ uid: 'new-user' });
  await load('new-user');
  assert.equal(progress.getState().xp, 0);
  assert.deepEqual(bookmarks.getState().notes, []);
  assert.equal(firebase.writes.length, 0);
  progress.getState().completeLesson('first', 'foundations');
  assert.deepEqual(firebase.documents.get('users/new-user').progress.lessonsCompleted, ['first']);
  assert.deepEqual(firebase.documents.get('users/alice'), saved);
});

test('explicit user reset still replaces cloud progress including old quiz scores', async () => {
  firebase.changeUser({ uid: 'alice' });
  await load('alice');
  progress.getState().resetProgress(true);
  const write = firebase.writes.at(-1);
  assert.deepEqual(write.options.mergeFields, ['progress', 'lastSyncedAt']);
  assert.equal(write.data.progress.xp, 0);
  assert.deepEqual(write.data.progress.quizScores, {});
  assert.deepEqual(firebase.documents.get('users/alice').notes, saved.notes);
});
