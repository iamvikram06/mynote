// Minimal Firebase wrappers (modular v9+). This file is optional —
// configure the app by setting FIREBASE_API_KEY etc in your environment
// and call the helpers from storage when cloud mode is enabled.

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

let app = null;
let auth = null;
let db = null;

// If you want to bootstrap the app quickly, provide a default config here.
// This uses the config you supplied; it's safe to override via
// window.__FIREBASE_CONFIG__ or REACT_APP_ env vars in App.jsx.
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAdBof6xdEX-cI44HMMZVq4KDrMioOZSXY",
  authDomain: "my-notes0.firebaseapp.com",
  projectId: "my-notes0",
  storageBucket: "my-notes0.firebasestorage.app",
  messagingSenderId: "628655993989",
  appId: "1:628655993989:web:3fbb662373a7e26542a5ec",
  measurementId: "G-MEFW2ZD94N",
};

if (typeof window !== "undefined" && !window.__FIREBASE_CONFIG__) {
  try {
    window.__FIREBASE_CONFIG__ = DEFAULT_FIREBASE_CONFIG;
  } catch (e) {
    // ignore
  }
}

export function initFirebase(config) {
  try {
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    return { app, auth, db };
  } catch (e) {
    console.warn("Firebase init failed:", e);
    return null;
  }
}

export function getAuthInstance() {
  return auth;
}

export function onAuthChange(cb) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase not initialized");
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signUpWithEmail(email, password) {
  if (!auth) throw new Error("Firebase not initialized");
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithEmail(email, password) {
  if (!auth) throw new Error("Firebase not initialized");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function sendResetEmail(email) {
  if (!auth) throw new Error("Firebase not initialized");
  return sendPasswordResetEmail(auth, email);
}

export async function signOut() {
  if (!auth) return;
  return fbSignOut(auth);
}

// Notes stored in collection `notes` under document per user (userId -> notes subcollection)
export function getDb() {
  return db;
}

export async function fetchUserNotes(userId) {
  if (!db) throw new Error("Firestore not initialized");
  const notesCol = collection(db, "users", userId, "notes");
  const q = query(notesCol, orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveUserNote(userId, note) {
  if (!db) throw new Error("Firestore not initialized");
  const ref = doc(db, "users", userId, "notes", note.id);
  await setDoc(ref, note, { merge: true });
}

export async function saveUserNotesBulk(userId, notes) {
  if (!db) throw new Error("Firestore not initialized");
  const promises = notes.map((n) => saveUserNote(userId, n));
  await Promise.all(promises);
}
