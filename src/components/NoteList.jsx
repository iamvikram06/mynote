import React from "react";

const NoteList = ({ notes, activeId, onSelect, onDelete }) => {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-20 h-20 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg border-2 border-sky-200 dark:border-sky-700">
          <svg
            className="w-10 h-10 text-sky-600 dark:text-sky-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
          No notes found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          Try adjusting your search or create your first note to get started
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelect(note.id)}
          className={`group relative cursor-pointer rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
            activeId === note.id
              ? `border-${
                  note.status === "done"
                    ? "emerald"
                    : note.status === "in-progress"
                    ? "amber"
                    : "sky"
                }-500 bg-${
                  note.status === "done"
                    ? "emerald"
                    : note.status === "in-progress"
                    ? "amber"
                    : "sky"
                }-50 dark:bg-${
                  note.status === "done"
                    ? "emerald"
                    : note.status === "in-progress"
                    ? "amber"
                    : "sky"
                }-950/20 shadow-lg scale-[1.02]`
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
          }`}
        >
          {/* Active indicator */}
          {activeId === note.id && (
            <div
              className={`rounded-r-full shadow-sm ${
                note.status === "done"
                  ? "bg-emerald-500"
                  : note.status === "in-progress"
                  ? "bg-amber-500"
                  : "bg-sky-500"
              }`}
            ></div>
          )}

          {/* Color accent bar */}
          <div
            className={`absolute top-[-1px] left-0 right-0 h-2 rounded-t-lg ${
              note.status === "done"
                ? "bg-emerald-500"
                : note.status === "in-progress"
                ? "bg-amber-500"
                : "bg-sky-500"
            }`}
          ></div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {note.title || "Untitled"}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {note.content || "No content"}
                </p>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {new Date(note.updatedAt).toLocaleDateString()}
              </span>

              {/* Status indicator */}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  note.status === "done"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : note.status === "in-progress"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                    : "bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400"
                }`}
              >
                {note.status === "done"
                  ? "✓ Done"
                  : note.status === "in-progress"
                  ? "⟳ In Progress"
                  : "○ Todo"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
