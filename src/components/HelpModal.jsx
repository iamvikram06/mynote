import React, { useEffect, useState } from "react";

function HelpModal({ open, onClose }) {
  // internal mount + show state so we can play exit animation before unmounting
  const [mounted, setMounted] = useState(open);
  const [show, setShow] = useState(open);

  useEffect(() => {
    let timeout;
    if (open) {
      setMounted(true);
      timeout = setTimeout(() => setShow(true), 20);
    } else {
      setShow(false);
      timeout = setTimeout(() => setMounted(false), 300);
    }
    return () => clearTimeout(timeout);
  }, [open]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${
          show ? "bg-opacity-50 opacity-100" : "bg-opacity-0 opacity-0"
        }`}
      />

      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-modal-title"
          className={`w-full max-w-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
            show
              ? "opacity-100 translate-y-0 sm:scale-100"
              : "opacity-0 translate-y-6 sm:translate-y-8 sm:scale-95"
          }`}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 id="help-modal-title" className="text-lg font-semibold">
              How to use MyNote
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
              aria-label="Close help"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="px-4 sm:px-6 py-4 overflow-y-auto max-h-[calc(90vh-72px)]">
            <section className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                MyNote helps you capture notes, manage todos, and organize work
                with a simple Kanban board.
              </p>

              <div>
                <h3 className="font-medium mb-1">Views</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    <strong>Notes</strong>: Create and edit rich text notes. Use
                    tags to organize.
                  </li>
                  <li>
                    <strong>Todo List</strong>: Track tasks with statuses (todo
                    → in progress → done).
                  </li>
                  <li>
                    <strong>Kanban Board</strong>: Drag cards across columns by
                    status.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-1">Core actions</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    <strong>New Note</strong>: Click the New Note button in the
                    header.
                  </li>
                  <li>
                    <strong>Voice</strong>: Start/stop recording to auto-create
                    a note from speech.
                  </li>
                  <li>
                    <strong>Search</strong>: Filter by title, content, or tags.
                  </li>
                  <li>
                    <strong>Tags</strong>: Add tags inside the editor; filter
                    from the sidebar.
                  </li>
                  <li>
                    <strong>Theme</strong>: Use the theme toggle to switch
                    light/dark.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-1">Editing</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Select a note to open it in the editor panel.</li>
                  <li>
                    Update title, content, tags, and (for todos) status and
                    category.
                  </li>
                  <li>Use the close button in the editor to deselect.</li>
                </ul>
              </div>       
              <div>
                <h3 className="font-medium mb-1">Storage</h3>
                <p className="text-sm">
                  Notes are saved locally in your browser. Clearing site data
                  resets your notes.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
