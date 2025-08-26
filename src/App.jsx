import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Components
import SearchBar from "./components/SearchBar";
import TagFilter from "./components/TagFilter";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import ThemeToggle from "./components/ThemeToggle";
import KanbanView from "./components/KanbanView";
import Sidebar from "./components/Sidebar";
import TodoList from "./components/TodoList";
import LandingPage from "./components/LandingPage";

// Utils
import { loadNotes, saveNotes } from "./utils/storage";
import { useSpeechRecognition } from "./utils/speech";

function App() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [activeView, setActiveView] = useState("notes");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [voiceRequested, setVoiceRequested] = useState(false);

  // Speech recognition
  const {
    supported: speechSupported,
    listening: isListening,
    transcript,
    // error is available if needed
    // error: speechError,
    start: startListening,
    stop: stopListening,
    reset: resetSpeech,
  } = useSpeechRecognition({ continuous: false, interimResults: true });

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

  const createNoteFromVoice = (text) => {
    const raw = (text || "").trim();
    if (!raw) return;
    const firstLine = raw.split(/\n|\.|!|\?/)[0].trim();
    const suggestedTitle = firstLine
      ? firstLine.slice(0, 60) + (firstLine.length > 60 ? "…" : "")
      : "Voice Note";
    const newNote = {
      id: crypto.randomUUID(),
      title: suggestedTitle || "Voice Note",
      content: raw,
      tags: [],
      category: "notes",
      status: undefined,
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
  };

  // After user toggles recording, when it ends create a note from transcript
  useEffect(() => {
    if (!voiceRequested) return;
    if (isListening) return;
    if (transcript && transcript.trim()) {
      createNoteFromVoice(transcript);
    }
    setVoiceRequested(false);
    resetSpeech();
  }, [isListening, transcript, voiceRequested, resetSpeech]);

  const createNote = () => {
    const newNote = {
      id: crypto.randomUUID(),
      title: "Untitled",
      content: "",
      tags: [],
      category: activeView === "notes" ? "notes" : "todo",
      status: activeView === "notes" ? undefined : "todo",
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

  const updateNoteStatus = (id, status) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status, updatedAt: Date.now() } : n
      )
    );
  };

  const updateNoteCategory = (id, category) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, category, updatedAt: Date.now() } : n
      )
    );
  };

  const selected = useMemo(
    () => notes.find((n) => n.id === activeId) || null,
    [notes, activeId]
  );

  // Close sidebar on mobile when view changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [activeView]);

  return (
    <AnimatePresence mode="wait">
      {showLanding ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LandingPage onGetStarted={() => setShowLanding(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-dvh bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors"
        >
          <div className="flex h-screen">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <div
              className={`fixed md:relative z-50 h-full transition-transform duration-300 ease-in-out ${
                sidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full md:translate-x-0"
              }`}
            >
              <Sidebar
                activeView={activeView}
                onViewChange={setActiveView}
                onClose={() => setSidebarOpen(false)}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top Header */}
              <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="md:hidden p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>

                    <h1 className="text-lg sm:text-xl font-semibold truncate">
                      {activeView === "notes" && "All Notes"}
                      {activeView === "kanban" && "Kanban Board"}
                      {activeView === "todo" && "Todo List"}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={createNote}
                      className="rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-3 py-1.5 text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400 whitespace-nowrap"
                    >
                      New Note
                    </button>
                    <button
                      onClick={() => {
                        if (!speechSupported) return;
                        if (isListening) {
                          stopListening();
                        } else {
                          setVoiceRequested(true);
                          startListening();
                        }
                      }}
                      title={
                        !speechSupported
                          ? "Speech recognition not supported"
                          : isListening
                          ? "Stop recording"
                          : "Add by voice"
                      }
                      className={`rounded-md border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 whitespace-nowrap flex items-center gap-1 ${
                        isListening
                          ? "border-rose-500 text-rose-600 dark:text-rose-400 focus:ring-rose-400"
                          : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 focus:ring-slate-400"
                      } ${
                        !speechSupported
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                      disabled={!speechSupported}
                    >
                      <svg
                        className={`w-4 h-4 ${
                          isListening ? "animate-pulse" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 1.5a3 3 0 013 3v6a3 3 0 11-6 0v-6a3 3 0 013-3zm7.5 9a7.5 7.5 0 01-15 0M12 19.5v3"
                        />
                      </svg>
                      {isListening ? "Recording…" : "Voice"}
                    </button>
                    <button
                      onClick={() => setShowLanding(true)}
                      className="rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 whitespace-nowrap"
                    >
                      Home
                    </button>
                    <ThemeToggle />
                  </div>
                </div>
              </header>

              {/* Content Area */}
              <main className="flex-1 overflow-hidden">
                {activeView === "notes" && (
                  <div className="h-full flex flex-col lg:flex-row">
                    {/* Notes Sidebar */}
                    <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-900">
                      {/* Header with search */}
                      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
                        <div className="mb-3">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {filteredNotes.length} note
                            {filteredNotes.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <SearchBar value={query} onChange={setQuery} />
                      </div>

                      {/* Tags filter */}
                      {allTags.length > 0 && (
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
                          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Filter by tags
                          </h3>
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
                      )}

                      {/* Notes list */}
                      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800">
                        <NoteList
                          notes={filteredNotes}
                          activeId={activeId}
                          onSelect={setActiveId}
                          onDelete={deleteNote}
                        />
                      </div>
                    </div>

                    {/* Note Editor */}
                    <div className="flex-1 bg-white dark:bg-slate-950 min-h-0">
                      <AnimatePresence mode="wait">
                        {selected ? (
                          <motion.div
                            key={selected.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.15 }}
                            className="h-full"
                          >
                            <NoteEditor
                              note={selected}
                              onChange={(next) =>
                                updateNote(selected.id, () => next)
                              }
                              onUpdateTags={(tags) =>
                                updateNote(selected.id, (n) => ({ ...n, tags }))
                              }
                              onUpdateStatus={updateNoteStatus}
                              onUpdateCategory={updateNoteCategory}
                              onClose={() => setActiveId(null)}
                              enableVoice
                            />
                          </motion.div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-8">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                              <svg
                                className="w-8 h-8 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                              No note selected
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                              Select a note from the list or create a new one to
                              get started
                            </p>
                            <button
                              onClick={createNote}
                              className="mt-4 px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-md hover:opacity-90 transition-opacity"
                            >
                              Create New Note
                            </button>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {activeView === "kanban" && (
                  <div className="h-full overflow-y-auto">
                    <KanbanView
                      notes={filteredNotes}
                      activeId={activeId}
                      onSelect={setActiveId}
                      onDelete={deleteNote}
                      onUpdateStatus={updateNoteStatus}
                    />

                    {/* Modal for editing notes in Kanban view */}
                    {selected && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-medium">Edit Note</h3>
                            <button
                              onClick={() => setActiveId(null)}
                              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                              <svg
                                className="w-6 h-6"
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
                          </div>
                          <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <NoteEditor
                              note={selected}
                              onChange={(next) =>
                                updateNote(selected.id, () => next)
                              }
                              onUpdateTags={(tags) =>
                                updateNote(selected.id, (n) => ({ ...n, tags }))
                              }
                              onUpdateStatus={updateNoteStatus}
                              onUpdateCategory={updateNoteCategory}
                              onClose={() => setActiveId(null)}
                              enableVoice
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeView === "todo" && (
                  <div className="h-full overflow-y-auto">
                    <TodoList
                      notes={filteredNotes}
                      activeId={activeId}
                      onSelect={setActiveId}
                      onDelete={deleteNote}
                      onUpdateStatus={updateNoteStatus}
                    />

                    {/* Modal for editing todos */}
                    {selected && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-medium">Edit Todo</h3>
                            <button
                              onClick={() => setActiveId(null)}
                              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                              <svg
                                className="w-6 h-6"
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
                          </div>
                          <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <NoteEditor
                              note={selected}
                              onChange={(next) =>
                                updateNote(selected.id, () => next)
                              }
                              onUpdateTags={(tags) =>
                                updateNote(selected.id, (n) => ({ ...n, tags }))
                              }
                              onUpdateStatus={updateNoteStatus}
                              onUpdateCategory={updateNoteCategory}
                              onClose={() => setActiveId(null)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </main>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
