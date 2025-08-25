import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Components
import SearchBar from "./components/SearchBar";
import TagFilter from "./components/TagFilter";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import ThemeToggle from "./components/ThemeToggle";

// Utils
import { loadNotes, saveNotes } from "./utils/storage";
import { exportAsJson, exportAsMarkdown, importFromJson } from "./utils/io";

function App() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);

  // Derived
  const allTags = useMemo(() => {
    const tagSet = new Set();
    notes.forEach((n) => (n.tags || []).forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter((n) => {
      const matchesQuery =
        q.length === 0 ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((t) => (n.tags || []).includes(t));
      return matchesQuery && matchesTags;
    });
  }, [notes, query, activeTags]);

  // Autosave
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const createNote = () => {
    const newNote = {
      id: crypto.randomUUID(),
      title: "Untitled",
      content: "",
      tags: [],
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
  };

  const updateNote = (id, updater) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...updater(n), updatedAt: Date.now() } : n
      )
    );
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const selected = useMemo(
    () => notes.find((n) => n.id === activeId) || null,
    [notes, activeId]
  );

  const NoteCard = ({ note }) => (
    <button
      onClick={() => setActiveId(note.id)}
      className="text-left rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-sm hover:bg-slate-50/60 dark:hover:bg-slate-900 transition-colors"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium truncate mr-2">
          {note.title || "Untitled"}
        </h3>
        <span className="text-[10px] text-slate-500">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
        {note.content}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {(note.tags || []).map((t) => (
          <span
            key={t}
            className="text-[10px] px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800"
          >
            #{t}
          </span>
        ))}
      </div>
    </button>
  );

  const recentTags = allTags.slice(0, 4);

  return (
    <div className="min-h-dvh bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-4 md:py-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            MY NOTES
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:block w-64">
              <SearchBar value={query} onChange={setQuery} />
            </div>
            <button
              onClick={createNote}
              className="rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-3 py-1.5 text-sm md:text-base hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              New Note
            </button>
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block col-span-3 lg:col-span-2">
            <div className="sticky top-4 space-y-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <p className="text-xs uppercase text-slate-500 mb-2">Filters</p>
                <TagFilter
                  tags={allTags}
                  active={activeTags}
                  onToggle={(t) => {
                    setActiveTags((prev) =>
                      prev.includes(t)
                        ? prev.filter((x) => x !== t)
                        : [...prev, t]
                    );
                  }}
                />
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <NoteList
                  notes={filteredNotes}
                  activeId={activeId}
                  onSelect={setActiveId}
                  onDelete={deleteNote}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => exportAsJson(notes)}
                  className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-sm hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => exportAsMarkdown(notes)}
                  className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-sm hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  Export MD
                </button>
                <label className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                  Import JSON
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const loaded = await importFromJson(file);
                      setNotes(loaded);
                      setActiveId(loaded[0]?.id ?? null);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="col-span-12 md:col-span-9 lg:col-span-10">
            {/* Recent Folders (tags) */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Recent Folders</h2>
                <div className="md:hidden w-44">
                  <SearchBar value={query} onChange={setQuery} />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentTags.map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      setActiveTags((prev) =>
                        prev.includes(t) ? prev : [...prev, t]
                      )
                    }
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-800 mb-3" />
                    <p className="font-medium">{t}</p>
                    <p className="text-xs text-slate-500 mt-1">Open folder</p>
                  </button>
                ))}
                {recentTags.length === 0 && (
                  <div className="col-span-2 md:col-span-4 text-sm text-slate-500">
                    No tags yet. Add tags to notes to see folders.
                  </div>
                )}
              </div>
            </section>

            {/* My Notes */}
            <section className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">My Notes</h2>
                <span className="text-xs text-slate-500">
                  {filteredNotes.length} items
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((n) => (
                  <NoteCard key={n.id} note={n} />
                ))}
              </div>
            </section>

            {/* Editor */}
            <section className="mt-8">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <NoteEditor
                      note={selected}
                      onChange={(next) => updateNote(selected.id, () => next)}
                      onUpdateTags={(tags) =>
                        updateNote(selected.id, (n) => ({ ...n, tags }))
                      }
                    />
                  </motion.div>
                ) : (
                  <div className="h-full min-h-[20vh] grid place-items-center border border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
                    <p className="text-slate-500">
                      Select or create a note to edit
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
