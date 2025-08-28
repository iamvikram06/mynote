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
import HelpModal from "./components/HelpModal";
import Toast from "./components/Toast";

// Utils
import { loadNotes, saveNotes, setStorageMode } from "./utils/storage";
import {
  initFirebase,
  signOut as fbSignOut,
  onAuthChange,
  fetchUserNotes,
  saveUserNotesBulk,
  saveUserNote,
  signUpWithEmail,
  signInWithEmail,
  sendResetEmail,
  deleteUserNote,
} from "./utils/firebase";
import EmailAuthModal from "./components/EmailAuthModal";
import { useSpeechRecognition } from "./utils/speech";
import { IoHelp } from "react-icons/io5";
import { enqueueSave, enqueueDelete, subscribeNoteStatus } from "./utils/sync";

function App() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [activeView, setActiveView] = useState("notes");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [voiceRequested, setVoiceRequested] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  // Cloud/auth state
  const [cloudEnabled, setCloudEnabled] = useState(false);
  const [user, setUser] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [emailAuthOpen, setEmailAuthOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  // Speech recognition
  const {
    supported: speechSupported,
    listening: isListening,
    transcript,
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

  // Init firebase if env vars present (optional)
  useEffect(() => {
    // Try to read firebase config from window.__FIREBASE_CONFIG__ or env
    const cfg =
      window.__FIREBASE_CONFIG__ ||
      (process.env.REACT_APP_FIREBASE_API_KEY
        ? {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId:
              process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID,
          }
        : null);

    if (cfg) {
      try {
        initFirebase(cfg);
        setFirebaseReady(true);
        // wire auth listener
        const unsub = onAuthChange((u) => {
          console.log(
            "Auth state changed:",
            u ? `User: ${u.email}` : "No user"
          );
          setUser(
            u
              ? { uid: u.uid, email: u.email, displayName: u.displayName }
              : null
          );
          // Clear any auth errors when user state changes
          setAuthError(null);
        });
        return () => unsub && unsub();
      } catch (e) {
        console.warn("Firebase init error:", e);
        setAuthError("Failed to initialize Firebase");
      }
    }
  }, []);

  // When cloud is enabled and user is set, switch storage mode and load remote notes
  useEffect(() => {
    if (cloudEnabled && user) {
      // set storage to cloud (provide implementation)
      setStorageMode(
        "cloud",
        {
          fetchUserNotes: fetchUserNotes,
          saveUserNotesBulk: saveUserNotesBulk,
          saveUserNote: saveUserNote,
        },
        user.uid
      );

      // load remote notes and replace local state
      (async () => {
        try {
          const remote = await fetchUserNotes(user.uid);
          if (Array.isArray(remote)) {
            // Merge strategy: if both local and remote have data, ask the user
            const local = loadNotes();
            if (local.length > 0 && remote.length > 0) {
              // Ask user preference
              const uploadLocal = window.confirm(
                "Cloud data found. Click OK to upload local notes to cloud and keep local copy. Click Cancel to continue to other choices."
              );
              if (uploadLocal) {
                // upload all local to cloud
                saveUserNotesBulk(user.uid, local).catch((e) =>
                  console.warn("Bulk upload failed:", e)
                );
                // keep local notes
                setNotes(local.map((n) => ({ ...n, _syncStatus: "pending" })));
              } else {
                const useCloud = window.confirm(
                  "Use cloud notes and replace local notes? Click OK to replace local with cloud. Click Cancel to merge (upload missing local notes)"
                );
                if (useCloud) {
                  setNotes(
                    remote.map((n) => ({ ...n, _syncStatus: "synced" }))
                  );
                } else {
                  // merge: upload local notes that don't exist remotely
                  const remoteIds = new Set(remote.map((r) => r.id));
                  const toUpload = local.filter((l) => !remoteIds.has(l.id));
                  if (toUpload.length > 0)
                    saveUserNotesBulk(user.uid, toUpload).catch((e) =>
                      console.warn("Bulk merge upload failed:", e)
                    );
                  // combine remote + local uniques
                  const combined = [...toUpload, ...remote].map((n) => ({
                    ...n,
                    _syncStatus: "synced",
                  }));
                  setNotes(combined);
                }
              }
            } else if (remote.length > 0) {
              setNotes(remote.map((n) => ({ ...n, _syncStatus: "synced" })));
            } else {
              // remote empty: keep local
              const localOnly = loadNotes();
              setNotes(
                localOnly.map((n) => ({ ...n, _syncStatus: "pending" }))
              );
              // optional: upload local automatically
            }
          }
        } catch (e) {
          console.warn("Failed to load remote notes:", e);
        }
      })();
      // subscribe to per-note sync status updates
      const unsubbers = [];
      notes.forEach((n) => {
        const unsub = subscribeNoteStatus(n.id, (status) => {
          setNotes((prev) =>
            prev.map((p) => (p.id === n.id ? { ...p, _syncStatus: status } : p))
          );
        });
        unsubbers.push(unsub);
      });
      return () => {
        unsubbers.forEach((u) => u && u());
      };
    } else if (!cloudEnabled) {
      // switch back to local
      setStorageMode("local", null, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudEnabled, user]);

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
      status: null,
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
      status: activeView === "notes" ? null : "todo",
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
    // If cloud mode, save remote as well (enqueue)
    if (cloudEnabled && user) {
      enqueueSave(user.uid, { ...newNote }, saveUserNote);
    }
  };

  // Auth handlers

  const handleEmailSignIn = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithEmail(email, password);
      setEmailAuthOpen(false);
      console.log("User signed in successfully");
    } catch (error) {
      console.error("Sign in error:", error);
      setAuthError(error.message || "Failed to sign in");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSignUp = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signUpWithEmail(email, password);
      setEmailAuthOpen(false);
      console.log("User signed up successfully");
    } catch (error) {
      console.error("Sign up error:", error);
      setAuthError(error.message || "Failed to sign up");
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePasswordReset = async (email) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await sendResetEmail(email);
      setEmailAuthOpen(false);
      console.log("Password reset email sent");
    } catch (error) {
      console.error("Password reset error:", error);
      setAuthError(error.message || "Failed to send reset email");
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut();
      // when signing out, disable cloud mode
      setCloudEnabled(false);
    } catch (e) {
      console.warn("Sign-out failed:", e);
    }
  };

  const updateNote = (id, updater) => {
    setNotes((prev) => {
      const next = prev.map((n) =>
        n.id === id ? { ...updater(n), updatedAt: Date.now() } : n
      );
      if (cloudEnabled && user) {
        const updated = next.find((x) => x.id === id);
        if (updated) {
          enqueueSave(user.uid, updated, saveUserNote);
        }
      }
      return next;
    });
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeId === id) setActiveId(null);
    if (cloudEnabled && user) {
      enqueueDelete(user.uid, id, deleteUserNote);
    }
  };

  const updateNoteStatus = (id, status) => {
    setNotes((prev) => {
      const next = prev.map((n) =>
        n.id === id
          ? { ...n, status: status || null, updatedAt: Date.now() }
          : n
      );
      if (cloudEnabled && user) {
        const updated = next.find((x) => x.id === id);
        if (updated) enqueueSave(user.uid, updated, saveUserNote);
      }
      return next;
    });
  };

  const updateNoteCategory = (id, category) => {
    setNotes((prev) => {
      const next = prev.map((n) =>
        n.id === id ? { ...n, category, updatedAt: Date.now() } : n
      );
      if (cloudEnabled && user) {
        const updated = next.find((x) => x.id === id);
        if (updated) enqueueSave(user.uid, updated, saveUserNote);
      }
      return next;
    });
  };

  const exportNotes = () => {
    try {
      const payload = {
        exportedAt: Date.now(),
        count: notes.length,
        notes: notes,
      };
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = new Date().toISOString().replace(/[:]/g, "-");
      a.href = url;
      a.download = `mynotes-export-${ts}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setToast({
        visible: true,
        message: `Exported ${notes.length} note${
          notes.length !== 1 ? "s" : ""
        }`,
        type: "success",
      });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 2000);
    } catch (e) {
      console.warn("Export failed:", e);
      setToast({ visible: true, message: "Export failed", type: "error" });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 2500);
    }
  };

  // Reminder scheduler
  useEffect(() => {
    let intervalId;
    const canNotify = () =>
      typeof window !== "undefined" && "Notification" in window;
    const requestPermissionIfNeeded = async () => {
      if (!canNotify()) return false;
      if (Notification.permission === "granted") return true;
      if (Notification.permission === "denied") return false;
      try {
        const res = await Notification.requestPermission();
        return res === "granted";
      } catch {
        return false;
      }
    };

    const computeNextTime = (currentMs, recur) => {
      if (!currentMs) return null;
      const dayMs = 24 * 60 * 60 * 1000;
      switch (recur) {
        case "daily":
          return currentMs + dayMs;
        case "weekly":
          return currentMs + 7 * dayMs;
        case "monthly":
          return currentMs + 30 * dayMs; // simple month approximation
        default:
          return null;
      }
    };

    const tick = async () => {
      const ok = await requestPermissionIfNeeded();
      if (!ok) return;
      const now = Date.now();
      const updatedNotes = [];
      let changed = false;
      notes.forEach((n) => {
        const shouldRemind =
          typeof n.remindAt === "number" && n.remindAt && n.remindAt <= now;
        const recentlyNotified =
          typeof n.lastNotifiedAt === "number" &&
          n.lastNotifiedAt &&
          now - n.lastNotifiedAt < 60 * 1000; // avoid duplicate within 1 min
        if (shouldRemind && !recentlyNotified) {
          try {
            const body = n.content ? n.content.slice(0, 120) : "";
            new Notification(n.title || "Reminder", { body });
          } catch {}
          const nextRemind = computeNextTime(n.remindAt, n.recurrence);
          const nextDue = computeNextTime(n.dueAt, n.recurrence);
          const next = {
            ...n,
            lastNotifiedAt: now,
            remindAt: nextRemind,
            dueAt: nextDue ?? n.dueAt,
            updatedAt: now,
          };
          updatedNotes.push(next);
          changed = true;
        } else {
          updatedNotes.push(n);
        }
      });
      if (changed) {
        setNotes(updatedNotes);
      }
    };

    intervalId = window.setInterval(tick, 60000); // check every minute
    // run one immediate check on mount
    tick();
    return () => intervalId && clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle sidebar with Ctrl/Cmd + B
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setSidebarCollapsed(!sidebarCollapsed);

        // Show toast notification
        setToast({
          visible: true,
          message: !sidebarCollapsed ? "Sidebar hidden" : "Sidebar shown",
          type: "success",
        });
        // Auto-hide after 2 seconds
        setTimeout(() => {
          setToast((prev) => ({ ...prev, visible: false }));
        }, 2000);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarCollapsed]);

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
          className="min-h-[100dvh] bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors"
        >
          <div className="flex min-h-[100dvh] h-dvh overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <div
              className={`fixed md:relative z-50 h-full transition-all duration-300 ease-in-out ${
                sidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full md:translate-x-0"
              } ${
                sidebarCollapsed
                  ? "md:w-0 md:opacity-0 md:overflow-hidden"
                  : "md:w-60 md:opacity-100"
              }`}
            >
              <Sidebar
                activeView={activeView}
                onViewChange={setActiveView}
                onClose={() => setSidebarOpen(false)}
                user={user}
                firebaseReady={firebaseReady}
                cloudEnabled={cloudEnabled}
                onCloudToggle={(e) => {
                  const enabled = e.target.checked;
                  setCloudEnabled(enabled);

                  // Show toast notification
                  if (user) {
                    setToast({
                      visible: true,
                      message: enabled
                        ? "Cloud sync enabled"
                        : "Cloud sync disabled",
                      type: enabled ? "cloud" : "success",
                    });
                    setTimeout(() => {
                      setToast((prev) => ({ ...prev, visible: false }));
                    }, 3000);
                  }
                }}
                onSignIn={() => setEmailAuthOpen(true)}
                onSignOut={signOut}
                collapsed={sidebarCollapsed}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Top Header */}
              <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Mobile menu button */}
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="md:hidden p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 touch-target "
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

                    {/* Desktop sidebar toggle */}
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="hidden md:flex p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors bg-slate-100 dark:bg-slate-800"
                      title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {sidebarCollapsed ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        )}
                      </svg>
                    </button>

                    <h1 className="text-lg sm:text-xl font-semibold truncate">
                      {activeView === "notes" && "All Notes"}
                      {activeView === "kanban" && "Kanban Board"}
                      {activeView === "todo" && "Todo List"}
                    </h1>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Voice / speech button */}
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
                      className={`rounded-md border px-2 py-1.5 sm:px-2 sm:py-1.5 text-sm focus:outline-none focus:ring-2 flex items-center gap-1 ${
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
                        className={`w-4 h-4 align-middle ${
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
                      <span className="hidden sm:inline">
                        {isListening ? "Recording…" : "Voice to Note"}
                      </span>
                    </button>

                    {/* Home */}
                    <button
                      onClick={() => setShowLanding(true)}
                      className="rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-2 sm:px-3 py-1 sm:py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l9-9 9 9M4 10v8a2 2 0 002 2h3m10-10v8a2 2 0 01-2 2h-3"
                        />
                      </svg>
                      <span className="hidden sm:inline">Home</span>
                    </button>

                    {/* Export All Notes */}
                    <button
                      onClick={exportNotes}
                      className="rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-2 sm:px-3 py-1 sm:py-1.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 flex items-center gap-2"
                      title="Export all notes"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                        />
                      </svg>
                      <span className="hidden sm:inline">Export</span>
                    </button>

                    <ThemeToggle />
                  </div>
                </div>
              </header>

              {/* Content Area */}
              <main className="flex-1 overflow-hidden min-h-0">
                {activeView === "notes" && (
                  <div className="h-full flex flex-col xl:flex-row min-h-0">
                    {/* Notes Sidebar */}
                    <div className="w-full xl:w-80 border-b xl:border-b-0 xl:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-900">
                      {/* Header with search */}
                      <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 sticky top-0 z-10">
                        <div className="mb-2 sm:mb-3">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {filteredNotes.length} note
                            {filteredNotes.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <SearchBar value={query} onChange={setQuery} />
                      </div>

                      {/* Tags filter */}
                      {allTags.length > 0 && (
                        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
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
                      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800 max-h-[45vh] xl:max-h-none">
                        <NoteList
                          notes={filteredNotes}
                          activeId={activeId}
                          onSelect={setActiveId}
                          onDelete={deleteNote}
                        />
                      </div>
                    </div>

                    {/* Note Editor */}
                    <div className="flex-1 bg-white dark:bg-slate-950 min-h-0 overflow-y-auto xl:overflow-visible h-[55vh] xl:h-auto">
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
                              onDelete={deleteNote}
                            />
                          </motion.div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-3 sm:p-4 md:p-6 lg:p-8">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                              <svg
                                className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400"
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
                            <h3 className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                              No note selected
                            </h3>
                            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xs sm:max-w-sm px-2">
                              Select a note from the list or create a new one to
                              get started
                            </p>
                            <button
                              onClick={createNote}
                              className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-md hover:opacity-90 transition-opacity text-sm sm:text-base"
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
                              onDelete={deleteNote}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </main>
              {/* Floating Help Button */}
              <button
                onClick={() => setHelpOpen(true)}
                className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 rounded-full p-3 sm:p-3 shadow-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400 touch-target"
                title="How to use the app"
                aria-label="Open help"
              >
                <IoHelp className="w-6 h-6" />
              </button>
            </div>
            {/* Help Modal */}
            <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
            <EmailAuthModal
              open={emailAuthOpen}
              onClose={() => setEmailAuthOpen(false)}
              onSignIn={handleEmailSignIn}
              onSignUp={handleEmailSignUp}
              onReset={handlePasswordReset}
              loading={authLoading}
              error={authError}
            />
            {/* Toast Notification */}
            <Toast
              visible={toast.visible}
              message={toast.message}
              type={toast.type}
              onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
