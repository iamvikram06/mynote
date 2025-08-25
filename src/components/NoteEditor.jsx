import React, { useEffect, useState } from "react";

function NoteEditor({ note, onChange, onUpdateTags }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id]);

  useEffect(() => {
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

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 md:p-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full bg-transparent text-lg md:text-xl font-semibold outline-none placeholder:text-slate-400"
      />
      <div className="mt-2 flex items-center gap-2">
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
          className="flex-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <button
          onClick={addTag}
          className="text-xs px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
        >
          Add
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {(note.tags || []).map((t) => (
          <span
            key={t}
            className="text-[10px] px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800"
          >
            #{t}
            <button
              onClick={() => removeTag(t)}
              className="ml-1 text-[10px] text-slate-500 hover:underline"
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
        className="mt-3 w-full min-h-[50vh] resize-none bg-transparent outline-none text-sm md:text-base leading-6"
      />
    </div>
  );
}

export default NoteEditor;
