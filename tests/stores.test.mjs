import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

const storage = new Map();
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  },
});
globalThis.window = { localStorage: globalThis.localStorage };
storage.set('agentic-ai-progress', JSON.stringify({ version: 0, state: {
  lessonsCompleted: ['first'], projectsCompleted: ['project'], quizScores: { quiz: 80 },
  xp: 8550, level: 1,
} }));

const { useProgressStore } = await import('../src/store/progressStore.ts');
const { useSettingsStore } = await import('../src/store/settingsStore.ts');
const { useBookmarkStore } = await import('../src/store/bookmarkStore.ts');
const migrated = useProgressStore.getState();

beforeEach(() => {
  useProgressStore.getState().resetProgress();
  useBookmarkStore.setState({ bookmarks: [], notes: [] });
});

test('legacy progress repairs inflated quiz XP and stale levels without losing completions', () => {
  assert.equal(migrated.xp, 630);
  assert.equal(migrated.level, 4);
  assert.deepEqual(migrated.lessonsCompleted, ['first']);
  assert.deepEqual(migrated.projectsCompleted, ['project']);
  assert.deepEqual(migrated.quizScores, { quiz: 80 });
});

test('lesson and project completion award XP once and update levels', () => {
  const store = useProgressStore.getState();
  for (const id of ['one', 'two', 'three', 'four', 'four']) store.completeLesson(id, 'module');
  assert.equal(useProgressStore.getState().xp, 200);
  assert.equal(useProgressStore.getState().level, 2);
  store.completeProject('project');
  store.completeProject('project');
  assert.equal(useProgressStore.getState().xp, 700);
  assert.equal(useProgressStore.getState().level, 4);
});

test('percentage quiz scores award at most 100 XP, with credit only for improvements', () => {
  const { recordQuizScore } = useProgressStore.getState();
  recordQuizScore('quiz', 80);
  assert.equal(useProgressStore.getState().xp, 80);
  recordQuizScore('quiz', 80);
  recordQuizScore('quiz', 40);
  assert.equal(useProgressStore.getState().xp, 80);
  assert.equal(useProgressStore.getState().quizScores.quiz, 80);
  recordQuizScore('quiz', 100);
  assert.equal(useProgressStore.getState().xp, 100);
  recordQuizScore('another', 100);
  assert.equal(useProgressStore.getState().level, 2);
});

test('invalid quiz values cannot corrupt progress', () => {
  const { recordQuizScore } = useProgressStore.getState();
  recordQuizScore('invalid', NaN);
  recordQuizScore('invalid', Infinity);
  recordQuizScore('low', -50);
  recordQuizScore('high', 200);
  assert.deepEqual(useProgressStore.getState().quizScores, { low: 0, high: 100 });
  assert.equal(useProgressStore.getState().xp, 100);
});

test('streaks follow local calendar days and count a day only once', (t) => {
  process.env.TZ = 'America/New_York';
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-09-18T03:30:00Z') });
  const { checkStreak } = useProgressStore.getState();
  checkStreak();
  checkStreak();
  assert.equal(useProgressStore.getState().lastActiveDate, '2026-09-17');
  assert.equal(useProgressStore.getState().streak, 1);
  t.mock.timers.setTime(new Date('2026-09-18T04:30:00Z').getTime());
  useProgressStore.getState().completeLesson('one', 'module');
  assert.equal(useProgressStore.getState().lastActiveDate, '2026-09-18');
  assert.equal(useProgressStore.getState().streak, 2);
  t.mock.timers.setTime(new Date('2026-09-20T12:00:00Z').getTime());
  checkStreak();
  assert.equal(useProgressStore.getState().streak, 1);
});

test('streaks survive the 23-hour daylight-saving transition', (t) => {
  process.env.TZ = 'America/New_York';
  useProgressStore.setState({ lastActiveDate: '2026-03-08', streak: 3 });
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-03-09T04:30:00Z') });
  useProgressStore.getState().checkStreak();
  assert.equal(useProgressStore.getState().streak, 4);
});

test('reset clears progress while preserving callable actions and saving the reset', () => {
  useProgressStore.getState().completeLesson('one', 'module');
  useProgressStore.getState().resetProgress();
  assert.equal(useProgressStore.getState().xp, 0);
  assert.equal(useProgressStore.getState().level, 1);
  assert.deepEqual(useProgressStore.getState().lessonsCompleted, []);
  assert.equal(typeof useProgressStore.getState().completeLesson, 'function');
  assert.equal(JSON.parse(storage.get('agentic-ai-progress')).state.xp, 0);
});

test('theme and beginner controls update the persisted settings API', () => {
  const { setTheme, toggleTheme, toggleBeginnerMode } = useSettingsStore.getState();
  setTheme('dark');
  toggleTheme();
  assert.equal(useSettingsStore.getState().theme, 'light');
  toggleTheme();
  assert.equal(useSettingsStore.getState().theme, 'dark');
  const before = useSettingsStore.getState().beginnerMode;
  toggleBeginnerMode();
  assert.equal(useSettingsStore.getState().beginnerMode, !before);
  assert.equal(JSON.parse(storage.get('agentic-ai-settings')).state.beginnerMode, !before);
});

test('notes remain isolated by lesson and survive rehydration', async () => {
  const { saveNote } = useBookmarkStore.getState();
  saveNote('first', 'First draft');
  saveNote('second', 'Second lesson');
  saveNote('first', 'Updated draft');
  await useBookmarkStore.persist.rehydrate();
  assert.equal(useBookmarkStore.getState().getNote('first'), 'Updated draft');
  assert.equal(useBookmarkStore.getState().getNote('second'), 'Second lesson');
  assert.equal(useBookmarkStore.getState().notes.length, 2);
});
