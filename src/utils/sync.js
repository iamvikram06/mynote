
let listeners = new Map(); // noteId -> Set(callback)
const queue = []; // items: {type:'save'|'delete', userId, note, attempts}
let running = false;

const MAX_ATTEMPTS = 5;
const BASE_DELAY = 1000; // 1s

export function subscribeNoteStatus(noteId, cb) {
  if (!listeners.has(noteId)) listeners.set(noteId, new Set());
  listeners.get(noteId).add(cb);
  return () => {
    const s = listeners.get(noteId);
    if (s) s.delete(cb);
  };
}

function emitStatus(noteId, status) {
  const s = listeners.get(noteId);
  if (!s) return;
  for (const cb of s) cb(status);
}

export function enqueueSave(userId, note, saveFn) {
  queue.push({ type: "save", userId, note, attempts: 0, saveFn });
  emitStatus(note.id, "pending");
  runQueue();
}

export function enqueueDelete(userId, noteId, deleteFn) {
  queue.push({ type: "delete", userId, noteId, attempts: 0, deleteFn });
  emitStatus(noteId, "pending");
  runQueue();
}

async function runQueue() {
  if (running) return;
  running = true;
  while (queue.length > 0) {
    const item = queue.shift();
    const id = item.note ? item.note.id : item.noteId;
    emitStatus(id, "syncing");
    try {
      if (item.type === "save") {
        await item.saveFn(item.userId, item.note);
      } else if (item.type === "delete") {
        await item.deleteFn(item.userId, item.noteId);
      }
      emitStatus(id, "synced");
    } catch (e) {
      item.attempts = (item.attempts || 0) + 1;
      if (item.attempts < MAX_ATTEMPTS) {
        const delay = BASE_DELAY * Math.pow(2, item.attempts - 1);
        emitStatus(id, "retrying");
        // requeue with backoff
        await new Promise((res) => setTimeout(res, delay));
        queue.push(item);
      } else {
        emitStatus(id, "error");
      }
    }
  }
  running = false;
}

// Expose helpers for tests
export function _drainQueueForTest() {
  return runQueue();
}
