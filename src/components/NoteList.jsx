import React from "react";

const NoteList = ({ notes, activeId, onSelect, onDelete }) => {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg border-2 border-sky-200 dark:border-sky-700">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-sky-600 dark:text-sky-400"
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
        <h3 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
          No notes found
        </h3>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-sm">
          Try adjusting your search or create your first note to get started
        </p>
      </div>
    );
  }

  const getNoteStyles = (note, isActive) => {
    if (!isActive) {
      return "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600";
    }

    if (note.category === "notes") {
      return "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg scale-[1.02]";
    }

    if (note.status === "done") {
      return "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-lg scale-[1.02]";
    }

    if (note.status === "in-progress") {
      return "border-amber-500 bg-amber-50 dark:bg-amber-900/30 shadow-lg scale-[1.02]";
    }

    return "border-sky-500 bg-sky-50 dark:bg-sky-900/30 shadow-lg scale-[1.02]";
  };

  const getActiveIndicatorColor = (note) => {
    if (note.category === "notes") return "bg-purple-500";
    if (note.status === "done") return "bg-emerald-500";
    if (note.status === "in-progress") return "bg-amber-500";
    return "bg-sky-500";
  };

  const getStatusColor = (note) => {
    if (note.status === "done") {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
    }
    if (note.status === "in-progress") {
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
    }
    return "bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400";
  };

  const getStatusText = (note) => {
    if (note.status === "done") return "✓ Done";
    if (note.status === "in-progress") return "⟳ In Progress";
    return "";
  };

  const getTopBarColor = (note) => {
    if (note.status === "done") return "bg-emerald-500";
    if (note.status === "in-progress") return "bg-amber-500";
    return "bg-sky-500";
  };

  return (
    <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelect(note.id)}
          className={`group relative cursor-pointer rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${getNoteStyles(note, activeId === note.id)}`}
        >
          {/* Active indicator */}
          {activeId === note.id && (
            <div
              className={`absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 rounded-r-full shadow-sm ${getActiveIndicatorColor(note)}`}
            ></div>
          )}

          {/* Color accent bar - only for todos */}
          {note.category === "todo" && (
            <div
              className={`absolute top-[-1px] left-0 right-0 h-2 rounded-t-lg ${getTopBarColor(note)}`}
            ></div>
          )}

          <div className="p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors text-sm sm:text-base">
                  {note.title || "Untitled"}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                  {note.content || "No content"}
                </p>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 sm:p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 hover:text-red-700 dark:hover:text-red-400 flex-shrink-0"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-200 border border-sky-200 dark:border-sky-600 group-hover:bg-sky-200 dark:group-hover:bg-sky-900/60 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="flex items-center gap-1 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
                  <span className="hidden sm:inline">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="sm:hidden">
                    {new Date(note.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </span>
              </div>

              {/* Status indicator - only for todos */}
              {note.category === "todo" && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(note)}`}
                >
                  {getStatusText(note)}
                </span>
              )}

              {/* Notes indicator - only for notes */}
              {note.category === "notes" && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                  📝 Notes
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
