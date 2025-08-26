import React, { useEffect, useState, useRef } from "react";

function NoteEditor({
  note,
  onChange,
  onUpdateTags,
  onUpdateStatus,
  onUpdateCategory,
  onClose,
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagInput, setTagInput] = useState("");
  const isInitialMount = useRef(true);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const next = { ...note, title, content };
    onChange(next);
  }, [title, content]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    const nextTags = Array.from(new Set([...(note.tags || []), t]));
    onUpdateTags(nextTags);
    setTagInput("");
  };

  const removeTag = (t) => {
    const nextTags = (note.tags || []).filter((x) => x !== t);
    onUpdateTags(nextTags);
  };

  const categoryOptions = [
    {
      value: "notes",
      label: "Notes",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    {
      value: "todo",
      label: "Todo",
      color: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
    },
  ];

  const statusOptions = [
    {
      value: "todo",
      label: "To Do",
      color: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
    },
    {
      value: "in-progress",
      label: "In Progress",
      color:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    },
    {
      value: "done",
      label: "Done",
      color:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    },
  ];

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 sm:p-4 md:p-4">
      {/* Header with close button */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
          Editing Note
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            title="Close note"
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full bg-transparent text-base sm:text-lg md:text-xl font-semibold outline-none placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
      />

      {/* Category and Status Selection */}
      <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        {onUpdateCategory && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
              Category:
            </label>
            <select
              value={note.category || "notes"}
              onChange={(e) => onUpdateCategory(note.id, e.target.value)}
              className="text-xs px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900 dark:text-slate-100"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {onUpdateStatus && note.category === "todo" && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
              Status:
            </label>
            <select
              value={note.status || "todo"}
              onChange={(e) => onUpdateStatus(note.id, e.target.value)}
              className="text-xs px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900 dark:text-slate-100"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add tag and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          className="flex-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
        />
        <button
          onClick={addTag}
          className="text-xs px-3 py-1 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-slate-100 whitespace-nowrap"
        >
          Add
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {(note.tags || []).map((t) => (
          <span
            key={t}
            className="text-[10px] px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
          >
            #{t}
            <button
              onClick={() => removeTag(t)}
              className="ml-1 text-[10px] text-slate-500 hover:underline dark:text-slate-400 dark:hover:text-slate-300"
            >
              x
            </button>
          </span>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing..."
        className="mt-3 w-full min-h-[40vh] sm:min-h-[50vh] resize-none bg-transparent outline-none text-sm sm:text-base leading-6 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
      />
    </div>
  );
}

export default NoteEditor;
