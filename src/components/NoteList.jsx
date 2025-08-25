import React from "react";

function NoteList({ notes, activeId, onSelect, onDelete }) {
  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-800">
      {notes.length === 0 && (
        <li className="p-3 text-sm text-slate-500">No notes found.</li>
      )}
      {notes.map((n) => (
        <li
          key={n.id}
          className={`p-3 cursor-pointer ${
            activeId === n.id
              ? "bg-slate-50 dark:bg-slate-900"
              : "hover:bg-slate-50 dark:hover:bg-slate-900"
          }`}
          onClick={() => onSelect(n.id)}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">
                  {n.title || "Untitled"}
                </h3>
                <span className="text-[10px] text-slate-500">
                  {new Date(n.updatedAt).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">
                {n.content || ""}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {(n.tags || []).map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(n.id);
              }}
              className="text-xs text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
