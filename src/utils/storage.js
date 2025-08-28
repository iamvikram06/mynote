const STORAGE_KEY = "mynote.notes.v1";

// Pluggable storage mode: 'local' (default) or 'cloud'
let storageMode = "local";
let cloudImpl = null; // should provide fetchUserNotes(userId) and saveUserNotesBulk(userId, notes) and saveUserNote(userId, note)
let currentUserId = null;

export function setStorageMode(mode, impl = null, userId = null) {
  storageMode = mode === "cloud" ? "cloud" : "local";
  cloudImpl = impl;
  currentUserId = userId;
  console.log(
    `Storage mode switched to: ${storageMode}${
      userId ? ` for user: ${userId}` : ""
    }`
  );
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
      console.log("Cloud mode active, returning empty notes for sync");
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
      category: n.category || "notes",
      // Reminders fields
      dueAt: typeof n.dueAt === "number" ? n.dueAt : null,
      remindAt: typeof n.remindAt === "number" ? n.remindAt : null,
      recurrence: typeof n.recurrence === "string" ? n.recurrence : "none",
      lastNotifiedAt:
        typeof n.lastNotifiedAt === "number" ? n.lastNotifiedAt : null,
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
        console.log(
          `Saving ${notes.length} notes to cloud for user ${currentUserId}`
        );
        cloudImpl
          .saveUserNotesBulk(currentUserId, notes)
          .then(() => console.log("Cloud save completed"))
          .catch((e) => console.warn("Cloud save failed:", e));
      } catch (e) {
        console.warn("Cloud save threw:", e);
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      console.log(`Saved ${notes.length} notes to local storage`);
    }
  } catch (error) {
    console.warn("Failed to save notes:", error);
  }
}

// Remote helpers (async)
export async function loadNotesRemote() {
  if (!(cloudImpl && currentUserId && cloudImpl.fetchUserNotes)) {
    console.warn(
      "Cannot load remote notes: missing cloud implementation or user ID"
    );
    return [];
  }
  try {
    console.log(`Loading remote notes for user ${currentUserId}`);
    const remote = await cloudImpl.fetchUserNotes(currentUserId);
    if (!Array.isArray(remote)) return [];
    console.log(`Loaded ${remote.length} remote notes`);
    return remote.map((n) => ({
      id: n.id || generateId(),
      title: n.title || "Untitled",
      content: n.content || "",
      tags: Array.isArray(n.tags) ? n.tags : [],
      colorClass: n.colorClass || null,
      status: n.status || null, // Use null instead of undefined
      category: n.category || "notes",
      updatedAt: typeof n.updatedAt === "number" ? n.updatedAt : Date.now(),
    }));
  } catch (e) {
    console.warn("Failed to load remote notes:", e);
    return [];
  }
}

export async function saveNoteRemote(note) {
  if (!(cloudImpl && currentUserId && cloudImpl.saveUserNote)) {
    console.warn(
      "Cannot save remote note: missing cloud implementation or user ID"
    );
    return;
  }
  try {
    await cloudImpl.saveUserNote(currentUserId, note);
    console.log(`Saved note ${note.id} to cloud`);
  } catch (e) {
    console.warn("Failed to save remote note:", e);
    throw e;
  }
}
