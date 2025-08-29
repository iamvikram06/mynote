import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import AnimatedTitle from "./AnimatedTitle";
import { FaCheck } from "react-icons/fa6";
const LandingPage = ({ onGetStarted }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const finePointer =
      window.matchMedia && window.matchMedia("(pointer: fine)");
    const reducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled =
      !!finePointer &&
      finePointer.matches &&
      !(!!reducedMotion && reducedMotion.matches);
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    let lastTs = 0;

    const spawn = (x, y) => {
      const dot = document.createElement("div");
      dot.className = "cursor-trail";
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      document.body.appendChild(dot);
      const removeAfter = () => dot.remove();
      dot.addEventListener("animationend", removeAfter, { once: true });
    };

    const handleMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();
      const dt = now - lastTs;
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      const needed = Math.min(4, Math.max(1, Math.floor(dist / 14)));
      if (lastTs === 0) {
        spawn(x, y);
        lastTs = now;
        lastX = x;
        lastY = y;
        return;
      }
      if (dt > 30 || needed > 1) {
        for (let i = 0; i < needed; i++) {
          const t = (i + 1) / needed;
          spawn(lastX + dx * t, lastY + dy * t);
        }
        lastTs = now;
        lastX = x;
        lastY = y;
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {});
    };

    const attach = () => {
      if (!enabled) return;
      window.addEventListener("mousemove", handleMove, { passive: true });
    };
    const detach = () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
      document.querySelectorAll(".cursor-trail").forEach((el) => el.remove());
    };

    attach();

    const handleChange = () => {
      const isFine = finePointer ? finePointer.matches : true;
      const isReduced = reducedMotion ? reducedMotion.matches : false;
      const nextEnabled = isFine && !isReduced;
      if (nextEnabled === enabled) return;
      enabled = nextEnabled;
      detach();
      lastX = 0;
      lastY = 0;
      lastTs = 0;
      attach();
    };
    finePointer && finePointer.addEventListener?.("change", handleChange);
    reducedMotion && reducedMotion.addEventListener?.("change", handleChange);

    return () => {
      detach();
      finePointer && finePointer.removeEventListener?.("change", handleChange);
      reducedMotion &&
        reducedMotion.removeEventListener?.("change", handleChange);
    };
  }, [mounted]);

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header - Fixed */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800"
        style={{ paddingTop: `max(1rem, env(safe-area-inset-top))` }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105 hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)]  cursor-pointer group"
              aria-hidden="true"
            >
              <svg
                className="w-5 h-5 text-white dark:text-slate-900 transition-colors"
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
            <AnimatedTitle
              className="text-xl uppercase font-semibold tracking-tight text-slate-900 dark:text-slate-100"
              ariaLabel="My Notes"
              direction="forward"
              mode="alternating"
            >
              {"My Notes."}
            </AnimatedTitle>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <motion.button
              onClick={onGetStarted}
              className="inline-flex items-center gap-3 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-2 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </div>
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
            {/* Trust Badges */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <span className="flex items-center gap-2 px-3 py-2 rounded-full text-sm bg-gray-100 text-slate-900 border-[1px] border-slate-900 dark:border-white dark:bg-slate-900 dark:text-slate-300">
                <FaCheck className="w-4 h-4 text-slate-900 dark:text-slate-300 " />
                No account required
              </span>
            </div>
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

            <motion.button
              onClick={onGetStarted}
              className="inline-flex items-center gap-3 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-10 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity focus:outline-none"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start writing now
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
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 mb-4">
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
              Powerful features designed to stay you organized and productive.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                Create, edit, and organize notes with tags and categories.
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
                Visualize your workflow with drag-and-drop kanban boards.
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
                Track tasks and manage your daily productivity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Cloud Sync</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Optional cloud sync keeps your notes safe across devices.
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
                <h3 className="text-xl font-semibold">Sync & backup</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose local storage for privacy or enable cloud sync for
                cross-device access. Your data, your choice.
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
              Join us to organize your life and thoughts with MyNote
              <span className="text-yellow-500">.</span>
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
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
              built with
              <svg
                className="w-4 h-4 text-rose-500"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.197 2.25 12.634 2.25 9.318 2.25 6.284 4.649 4 7.5 4A5.5 5.5 0 0112 6.102 5.5 5.5 0 0116.5 4c2.851 0 5.25 2.284 5.25 5.318 0 3.316-2.438 5.879-4.739 8.188a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.003a.75.75 0 01-.66 0z" />
              </svg>
              · Open source on
              <a
                href="https://github.com/iamvikram06/mynote"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted underline-offset-4 hover:opacity-80"
              >
                GitHub
              </a>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              MyNote<span className="text-yellow-500">.</span> · Local & Cloud
              Storage · Optional sign-up · Open source
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
