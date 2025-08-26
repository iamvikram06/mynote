import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUSES = [
  {
    id: "todo",
    label: "To Do",
    color: "bg-sky-50 border-sky-200 dark:bg-sky-950/30 dark:border-sky-800/50",
    headerColor: "bg-sky-500",
  },
  {
    id: "in-progress",
    label: "In Progress",
    color:
      "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50",
    headerColor: "bg-amber-500",
  },
  {
    id: "done",
    label: "Done",
    color:
      "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50",
    headerColor: "bg-emerald-500",
  },
];

function KanbanView({ notes, activeId, onSelect, onDelete, onUpdateStatus }) {
  const [draggedNote, setDraggedNote] = useState(null);

  const notesByStatus = notes.reduce((acc, note) => {
    const status = note.status || "todo";
    if (!acc[status]) acc[status] = [];
    acc[status].push(note);
    return acc;
  }, {});

  const handleDragStart = (e, note) => {
    setDraggedNote(note);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (draggedNote && draggedNote.status !== targetStatus) {
      onUpdateStatus(draggedNote.id, targetStatus);
    }
    setDraggedNote(null);
  };

  const handleDragEnd = () => {
    setDraggedNote(null);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      {/* Board */}
      <div className="flex gap-2 cursor-pointer sm:gap-4 md:gap-6 overflow-x-auto pb-4">
        {STATUSES.map((status) => (
          <div
            key={status.id}
            className={`flex-shrink-0 w-64 sm:w-72 md:w-80 rounded-lg border ${status.color} p-3 sm:p-4`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            <div
              className={`${status.headerColor} -m-3 sm:-m-4 mb-3 sm:mb-4 p-3 sm:p-4 rounded-t-lg`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-white">
                  {status.label}
                </h3>
                <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-white font-medium">
                  {notesByStatus[status.id]?.length || 0}
                </span>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <AnimatePresence>
                {(notesByStatus[status.id] || []).map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, note)}
                    onDragEnd={handleDragEnd}
                    className={`group cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 sm:p-3 shadow-sm hover:shadow-md transition-all ${
                      activeId === note.id ? "ring-2 ring-blue-500" : ""
                    } ${
                      draggedNote?.id === note.id ? "opacity-50" : ""
                    } hover:border-slate-300 dark:hover:border-slate-600`}
                    onClick={() => onSelect(note.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs sm:text-sm truncate mb-1 text-slate-900 dark:text-slate-100">
                          {note.title || "Untitled"}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                          {note.content || ""}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {(note.tags || []).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(note.id);
                        }}
                        className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty state for column */}
              {(notesByStatus[status.id] || []).length === 0 && (
                <div className="text-center py-6 sm:py-8 text-slate-400 dark:text-slate-500">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-2">
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <p className="text-xs">Drop notes here</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanView;
