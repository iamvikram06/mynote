import React, { useEffect, useState } from "react";

function HelpModal({ open, onClose }) {
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

      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
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
              How to use MY NOTES<span className="text-yellow-400">.</span>
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

              <h3 className="font-medium mb-1">Views</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  <strong>Notes</strong>: Write and edit rich-text notes. Use
                  tags to keep things organized.
                </li>
                <li>
                  <strong>Todo List</strong>: Track tasks as they move from
                  “Todo” → “In Progress” → “Done”.
                </li>
                <li>
                  <strong>Kanban Board</strong>: Drag and drop cards across
                  columns by status.
                </li>
              </ul>
              <div>
                <h3 className="font-medium mb-1">Core Actions</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>
                    <strong>New Note</strong>: Click the "Create Note" button in
                    the header to create a new note.
                  </li>
                  <li>
                    <strong>Voice to Note</strong>: Record your voice to
                    automatically transcribe notes.
                  </li>
                  <li>
                    <strong>Search</strong>: Quickly find notes by title,
                    content, or tag.
                  </li>
                  <li>
                    <strong>Tags</strong>: Add tags while editing; filter by tag
                    from the sidebar.
                  </li>
                  <li>
                    <strong>Theme</strong>: Use the toggle to switch between
                    light and dark mode.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-1">Editing</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Select a note to open it in the editor.</li>
                  <li>
                    Edit title, content, tags, and for todos — status and
                    category.
                  </li>
                  <li>
                    Click the close button in the editor to deselect a note.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-1">Local & Cloud Storage</h3>
                <p className="text-sm">
                  Notes are saved locally in your browser by default. Sign in to
                  enable cloud sync and access your notes across devices.
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
