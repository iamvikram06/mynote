const STORAGE_KEY = "mynote.notes.v1";

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.warn("Failed to save notes:", error);
  }
}
