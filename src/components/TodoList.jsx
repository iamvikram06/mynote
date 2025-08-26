import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TodoList = ({ notes, activeId, onSelect, onDelete, onUpdateStatus }) => {
  const [filter, setFilter] = useState("all");

  const filters = [
    { id: "all", name: "All", color: "bg-slate-500" },
    { id: "pending", name: "Pending", color: "bg-amber-500" },
    {
      id: "completed",
      name: "Completed",
      color: "bg-emerald-500",
    },
  ];

  const filteredNotes = useMemo(() => {
    switch (filter) {
      case "pending":
        return notes.filter((note) => note.status !== "done");
      case "completed":
        return notes.filter((note) => note.status === "done");
      default:
        return notes;
    }
  }, [notes, filter]);

  const stats = useMemo(() => {
    const total = notes.length;
    const completed = notes.filter((note) => note.status === "done").length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [notes]);

  const toggleStatus = (noteId) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      const newStatus = note.status === "done" ? "todo" : "done";
      onUpdateStatus(noteId, newStatus);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.total}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Total Tasks
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-3 sm:p-4 border border-amber-200 dark:border-amber-800 shadow-sm"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
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
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {stats.pending}
                </p>
                <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-500">
                  Pending
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-3 sm:p-4 border border-emerald-200 dark:border-emerald-800 shadow-sm sm:col-span-2 md:col-span-1"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">
                  {stats.completed}
                </p>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-500">
                  Completed
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              Overall Progress
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              {stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 sm:h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
                }%`,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-2 sm:h-3 bg-emerald-500 rounded-full shadow-sm"
            ></motion.div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
          {filters.map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium transition-all duration-200 text-sm whitespace-nowrap ${
                filter === filterOption.id
                  ? `${filterOption.color} text-white shadow-lg`
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {filterOption.name}
            </button>
          ))}
        </div>
      </div>

      {/* Todo Items */}
      <div className="space-y-2 sm:space-y-3">
        <AnimatePresence mode="wait">
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`group relative cursor-pointer rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
                activeId === note.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-lg"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
              onClick={() => onSelect(note.id)}
            >
              {/* Active indicator */}
              {activeId === note.id && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-blue-500 rounded-r-full shadow-sm"></div>
              )}

              <div className="p-3 sm:p-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStatus(note.id);
                    }}
                    className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                      note.status === "done"
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-slate-300 dark:border-slate-600 hover:border-green-400 dark:hover:border-green-500"
                    }`}
                  >
                    {note.status === "done" && (
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-semibold mb-1 sm:mb-2 line-clamp-1 transition-all duration-200 text-sm sm:text-base ${
                        note.status === "done"
                          ? "text-slate-500 dark:text-slate-400 line-through"
                          : "text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}
                    >
                      {note.title || "Untitled"}
                    </h4>
                    <p
                      className={`text-xs sm:text-sm line-clamp-2 leading-relaxed transition-all duration-200 ${
                        note.status === "done"
                          ? "text-slate-400 dark:text-slate-500 line-through"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {note.content || "No content"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(note.id);
                      }}
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 hover:text-red-700 dark:hover:text-red-400 transform hover:scale-110 transition-all duration-200"
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
                </div>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 ml-8 sm:ml-10">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-2 sm:mt-3 ml-8 sm:ml-10 text-xs text-slate-500 dark:text-slate-400">
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
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : note.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
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
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {filteredNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-sky-100 dark:bg-sky-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg border-2 border-sky-200 dark:border-sky-700">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-sky-600 dark:text-sky-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {filter === "all"
                ? "No tasks yet"
                : filter === "pending"
                ? "No pending tasks"
                : "No completed tasks"}
            </h3>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-sm">
              {filter === "all"
                ? "Create your first task to get started with your productivity journey"
                : filter === "pending"
                ? "Great job! All your tasks are completed"
                : "Complete some tasks to see them here"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
