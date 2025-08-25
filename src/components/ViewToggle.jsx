import React from "react";

function ViewToggle({ view, onViewChange }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <button
        onClick={() => onViewChange("list")}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          view === "list"
            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          List
        </div>
      </button>
      <button
        onClick={() => onViewChange("kanban")}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          view === "kanban"
            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2" />
          </svg>
          Kanban
        </div>
      </button>
    </div>
  );
}

export default ViewToggle;
