import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const LandingPage = ({ onGetStarted }) => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div
      className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors"
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
    >
      {/* Cursor-follow glow */}
      {mounted && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 z-[60]"
          animate={{ x: cursor.x, y: cursor.y }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 0.4,
          }}
        >
          <div
            className="w-80 h-80 rounded-full blur-3xl opacity-60 mix-blend-screen"
            style={{
              background:
                "radial-gradient(40% 40% at 50% 50%, rgba(250,204,21,0.45), rgba(56,189,248,0.35), rgba(99,102,241,0.25), rgba(255,255,255,0))",
            }}
          />
          <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
        </motion.div>
      )}

      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white dark:text-slate-900"
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
            <span className="text-xl uppercase font-semibold">
              My Notes
              <span className="text-xl uppercase text-yellow-500 font-semibold">
                .
              </span>
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section - Full Screen */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
              Organize Your
              <span className="block text-slate-600 dark:text-slate-400">
                Thoughts Simply
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              A clean, minimalist note-taking app that helps you capture ideas,
              manage tasks, and organize your thoughts without distractions.
            </p>

            {/* Trust Badges */}
            <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
              <span className="px-4 py-2 rounded-full text-sm bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                No account required
              </span>
              <span className="px-4 py-2 rounded-full text-sm bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Private by default
              </span>
              <span className="px-4 py-2 rounded-full text-sm bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Local Storage
              </span>
            </div>

            <motion.button
              onClick={onGetStarted}
              className="inline-flex items-center gap-3 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-10 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-slate-400"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Full Screen */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              Everything You Need
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Powerful features designed to help you stay organized and
              productive
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-left md:text-center rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center mb-4 md:mx-auto">
                <svg
                  className="w-8 h-8 text-slate-600 dark:text-slate-400"
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
              <h3 className="text-2xl font-semibold mb-2">Smart Notes</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Create, edit, and organize notes with tags and categories
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-left md:text-center rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center mb-4 md:mx-auto">
                <svg
                  className="w-8 h-8 text-slate-600 dark:text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Kanban Board</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Visualize your workflow with drag-and-drop kanban boards
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-left md:text-center rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center mb-4 md:mx-auto">
                <svg
                  className="w-8 h-8 text-slate-600 dark:text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Todo Lists</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Track tasks and manage your daily productivity
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works - Full Screen */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              How it works
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Three simple steps to capture ideas and stay organized
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <h3 className="text-xl font-semibold">Create notes</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Click “New Note”, jot down ideas, todos, or plans. Your work
                autosaves instantly.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <h3 className="text-xl font-semibold">Organize & track</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Add tags, switch to Kanban for status, or use the Todo view for
                tasks.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <h3 className="text-xl font-semibold">Private & offline</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Data stays in your browser. Export anytime for backup, import to
                restore.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Full Screen */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who have already organized their thoughts
              with MyNote. Export or import your notes anytime.
            </p>

            <motion.button
              onClick={onGetStarted}
              className="inline-flex items-center gap-3 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-12 py-5 rounded-lg text-xl font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-slate-400"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Organizing Now
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.button>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">
              Tip: You can back up or restore notes anytime via export/import.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
              Made with
              <svg
                className="w-4 h-4 text-rose-500"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.197 2.25 12.634 2.25 9.318 2.25 6.284 4.649 4 7.5 4A5.5 5.5 0 0112 6.102 5.5 5.5 0 0116.5 4c2.851 0 5.25 2.284 5.25 5.318 0 3.316-2.438 5.879-4.739 8.188a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.003a.75.75 0 01-.66 0z" />
              </svg>
              for minimal productivity · Open source on
              <a
                href="https://github.com/yourname/mynote"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted underline-offset-4 hover:opacity-80"
              >
                GitHub
              </a>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              MyNote · Local-first · No sign-up · Offline ready · Open source
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
