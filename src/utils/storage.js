const STORAGE_KEY = "mynote.notes.v1";

// Pluggable storage mode: 'local' (default) or 'cloud'
let storageMode = "local";
let cloudImpl = null; // should provide fetchUserNotes(userId) and saveUserNotesBulk(userId, notes) and saveUserNote(userId, note)
let currentUserId = null;

export function setStorageMode(mode, impl = null, userId = null) {
  storageMode = mode === "cloud" ? "cloud" : "local";
  cloudImpl = impl;
  currentUserId = userId;
}

function generateId() {
  try {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
  } catch {}
  // Fallback for older browsers
  const randomPart = Math.random().toString(16).slice(2);
  return `${Date.now()}-${randomPart}`;
}

export function loadNotes() {
  try {
    if (storageMode === "cloud" && cloudImpl && currentUserId) {
      // Cloud load is async; return empty here — caller can call loadNotesRemote explicitly.
      return [];
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((n) => ({
      id: n.id || generateId(),
      title: n.title || "Untitled",
      content: n.content || "",
      tags: Array.isArray(n.tags) ? n.tags : [],
      colorClass: n.colorClass || null,
      status: n.status || "todo",
      updatedAt: typeof n.updatedAt === "number" ? n.updatedAt : Date.now(),
    }));
  } catch (error) {
    console.warn("Failed to load notes:", error);
    return [];
  }
}

export function saveNotes(notes) {
  try {
    if (!Array.isArray(notes)) {
      console.warn("Attempted to save non-array notes:", notes);
      return;
    }
    if (storageMode === "cloud" && cloudImpl && currentUserId) {
      // attempt to save to cloud in background
      try {
        cloudImpl
          .saveUserNotesBulk(currentUserId, notes)
          .catch((e) => console.warn("Cloud save failed:", e));
      } catch (e) {
        console.warn("Cloud save threw:", e);
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  } catch (error) {
    console.warn("Failed to save notes:", error);
  }
}

// Remote helpers (async)
export async function loadNotesRemote() {
  if (!(cloudImpl && currentUserId && cloudImpl.fetchUserNotes)) return [];
  try {
    const remote = await cloudImpl.fetchUserNotes(currentUserId);
    if (!Array.isArray(remote)) return [];
    return remote.map((n) => ({
      id: n.id || generateId(),
      title: n.title || "Untitled",
      content: n.content || "",
      tags: Array.isArray(n.tags) ? n.tags : [],
      colorClass: n.colorClass || null,
      status: n.status || "todo",
      updatedAt: typeof n.updatedAt === "number" ? n.updatedAt : Date.now(),
    }));
  } catch (e) {
    console.warn("Failed to load remote notes:", e);
    return [];
  }
}

export async function saveNoteRemote(note) {
  if (!(cloudImpl && currentUserId && cloudImpl.saveUserNote)) return;
  try {
    await cloudImpl.saveUserNote(currentUserId, note);
  } catch (e) {
    console.warn("Failed to save remote note:", e);
  }
}
