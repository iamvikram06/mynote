import React from "react";

const NoteList = ({ notes, activeId, onSelect, onDelete, layout = "list" }) => {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-3 sm:p-4 md:p-6 lg:p-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6 shadow-lg border-2 border-sky-200 dark:border-sky-700">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-sky-600 dark:text-sky-400"
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
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
          No notes found
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xs sm:max-w-sm px-2">
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
    if (note.status === "todo") return "○ Todo";

    return "";
  };

  const getTopBarColor = (note) => {
    if ((note.category || "notes") === "notes") return "bg-purple-500";
    if (note.status === "done") return "bg-emerald-500";
    if (note.status === "in-progress") return "bg-amber-500";
    return "bg-sky-500";
  };

  // Due date helpers
  const getDueBadge = (note) => {
    if (typeof note.dueAt !== "number" || !note.dueAt) return null;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const isOverdue = note.dueAt < now;
    const isSoon = note.dueAt >= now && note.dueAt - now <= oneDay; // next 24h
    const dateStr = new Date(note.dueAt).toLocaleDateString();
    const base =
      "px-1.5 right-2 py-0.5 rounded-full text-[8px] xs:text-[9px] sm:text-[10px] font-medium border whitespace-nowrap flex-shrink-0 pointer-events-none select-none";
    const cls = isOverdue
      ? `${base} bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800`
      : isSoon
      ? `${base} bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800`
      : `${base} bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600`;
    const label = isOverdue ? "Overdue" : isSoon ? "Due soon" : "Due";
    return (
      <span className={cls} title={dateStr}>
        {label}: {dateStr}
      </span>
    );
  };

  // Responsive container classes
  const containerClass =
    layout === "grid"
      ? "p-2 sm:p-3 md:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4"
      : "p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3 md:space-y-4";

  return (
    <div className={containerClass}>
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelect(note.id)}
          className={`group relative cursor-pointer rounded-lg sm:rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${getNoteStyles(
            note,
            activeId === note.id
          )}`}
        >

          {/* Color accent bar */}
          <div
            className={`absolute top-[-1px] left-0 right-0 h-1.5 sm:h-2 rounded-t-lg sm:rounded-t-xl ${getTopBarColor(
              note
            )}`}
          ></div>

          {/* Header row with inline due badge */}
          <div className="p-2 sm:p-3 md:p-4 pr-12 sm:pr-16 pb-8 sm:pb-10">
            {/* Title + Description */}
            <div className="mb-2 sm:mb-3">
              <h4
                className="font-semibold text-slate-900 dark:text-slate-100 mb-1 sm:mb-2 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors text-sm sm:text-base md:text-base leading-tight"
                title={note.title || "Untitled"}
              >
                {note.title || "Untitled"}
              </h4>
              <p
                className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors"
                title={note.content || "No content"}
              >
                {note.content || "No content"}
              </p>
            </div>

            {/* ✅ Due Badge - now moved here and always visible */}
            {getDueBadge(note) && (
              <div className="mb-2 sm:mb-3">{getDueBadge(note)}</div>
            )}

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mb-2 sm:mb-3">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-200 border border-sky-200 dark:border-sky-600 group-hover:bg-sky-200 dark:group-hover:bg-sky-900/60 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-300">
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <span className="flex items-center gap-1 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
                  <span className="hidden sm:inline">
                    {new Date(
                      typeof note.dueAt === "number" && note.dueAt
                        ? note.dueAt
                        : note.updatedAt
                    ).toLocaleDateString()}
                  </span>
                  <span className="sm:hidden">
                    {new Date(
                      typeof note.dueAt === "number" && note.dueAt
                        ? note.dueAt
                        : note.updatedAt
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </span>
              </div>

              {/* Status indicator - only for todos */}
              {note.category === "todo" && (
                <span
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(
                    note
                  )}`}
                >
                  {getStatusText(note)}
                </span>
              )}

              {/* Notes indicator - only for notes */}
              {note.category === "notes" && (
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                  📝 Notes
                </span>
              )}
            </div>
          </div>

          {/* Delete Button - top-right corner */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="absolute top-4 right-2 sm:top-4 sm:right-3 flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-800 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 text-xs sm:text-sm font-medium transition-all opacity-100 sm:opacity-0 group-hover:opacity-100 touch-manipulation"
            title="Delete note"
            aria-label="Delete note"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
