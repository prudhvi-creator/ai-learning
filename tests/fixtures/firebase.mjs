// In-memory Firebase boundary: tests never connect to a real project.
export const auth = { currentUser: null };
export const db = {};
export const googleProvider = {};
export const documents = new Map();
export const writes = [];
export const controls = { read: null, nextUser: { uid: 'alice' } };
const listeners = new Set();
export const doc = (_db, collection, uid) => `${collection}/${uid}`;
export function snapshot(data) {
  const copy = data === undefined ? undefined : structuredClone(data);
  return { exists: () => copy !== undefined, data: () => copy };
}
export async function getDocFromServer(ref) {
  return controls.read ? controls.read(ref) : snapshot(documents.get(ref));
}
export async function setDoc(ref, data, options) {
  writes.push({ ref, data: structuredClone(data), options });
  documents.set(ref, { ...documents.get(ref), ...structuredClone(data) });
}
export function changeUser(user) {
  auth.currentUser = user;
  listeners.forEach((listener) => listener(user));
}
export function onAuthStateChanged(_auth, listener) {
  listeners.add(listener);
  listener(auth.currentUser);
  return () => listeners.delete(listener);
}
export async function signInWithPopup() {
  changeUser(controls.nextUser);
  return { user: auth.currentUser };
}
export async function signOut() {
  changeUser(null);
}
