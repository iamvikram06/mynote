// Minimal Firebase wrappers (modular v9+). This file is optional —
// configure the app by setting FIREBASE_API_KEY etc in your environment
// and call the helpers from storage when cloud mode is enabled.

import { initializeApp } from "firebase/app";
import {
  getAuth,
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
  where,
} from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";

let app = null;
let auth = null;
let db = null;

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

// Helper function to clean note data by removing undefined values
// Firestore accepts null values but not undefined values
function cleanNoteData(note) {
  const cleaned = { ...note };
  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  return cleaned;
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

export async function signUpWithEmail(email, password) {
  if (!auth) throw new Error("Firebase not initialized");
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
}

export async function signInWithEmail(email, password) {
  if (!auth) throw new Error("Firebase not initialized");
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

export async function sendResetEmail(email) {
  if (!auth) throw new Error("Firebase not initialized");
  try {
    const result = await sendPasswordResetEmail(auth, email);
    return result;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
}

export async function signOut() {
  if (!auth) return;
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

// Notes stored in collection `notes` under document per user (userId -> notes subcollection)
export function getDb() {
  return db;
}

export async function fetchUserNotes(userId) {
  if (!db) throw new Error("Firestore not initialized");
  if (!userId) throw new Error("User ID is required");

  try {
  const notesCol = collection(db, "users", userId, "notes");
  const q = query(notesCol, orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching user notes:", error);
    throw error;
  }
}

export async function saveUserNote(userId, note) {
  if (!db) throw new Error("Firestore not initialized");
  if (!userId) throw new Error("User ID is required");
  if (!note || !note.id) throw new Error("Note with ID is required");

  try {
  const ref = doc(db, "users", userId, "notes", note.id);
    const cleanedNote = cleanNoteData(note);
    await setDoc(ref, cleanedNote, { merge: true });
  } catch (error) {
    console.error("Error saving user note:", error);
    throw error;
  }
}

export async function deleteUserNote(userId, noteId) {
  if (!db) throw new Error("Firestore not initialized");
  if (!userId) throw new Error("User ID is required");
  if (!noteId) throw new Error("Note ID is required");

  try {
  const ref = doc(db, "users", userId, "notes", noteId);
  await deleteDoc(ref);
  } catch (error) {
    console.error("Error deleting user note:", error);
    throw error;
  }
}

export async function saveUserNotesBulk(userId, notes) {
  if (!db) throw new Error("Firestore not initialized");
  if (!userId) throw new Error("User ID is required");
  if (!Array.isArray(notes)) throw new Error("Notes must be an array");

  try {
  const promises = notes.map((n) => saveUserNote(userId, n));
  await Promise.all(promises);
  } catch (error) {
    console.error("Error saving user notes bulk:", error);
    throw error;
  }
}
