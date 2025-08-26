import React from "react";

function SearchBar({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by title, content, or tags..."
      className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 placeholder:text-slate-400"
    />
  );
}

export default SearchBar;
