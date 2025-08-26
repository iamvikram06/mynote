import React from "react";

function TagFilter({ tags, active, onToggle }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {tags.map((tag) => {
        const isActive = active.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs border transition-colors ${
              isActive
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
            }`}
          >
            #{tag}
          </button>
        );
      })}
    </div>
  );
}

export default TagFilter;
