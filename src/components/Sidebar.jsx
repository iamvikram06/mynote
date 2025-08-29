import React from "react";
import AnimatedTitle from "./AnimatedTitle";

function Sidebar({
  activeView,
  onViewChange,
  onClose,
  user,
  firebaseReady,
  cloudEnabled,
  onCloudToggle,
  onSignIn,
  onSignOut,
  collapsed = false,
}) {
  const menuItems = [
    {
      id: "notes",
      label: "Notes",
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },

    {
      id: "todo",
      label: "Todo List",
      icon: (
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
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      id: "kanban",
      label: "Kanban Board",
      icon: (
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
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2"
          />
        </svg>
      ),
    },
    {
      id: "insights",
      label: "Insights",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3v18h18M9 17V9m4 8v-5m4 5V5"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-all duration-300 ease-in-out ${
        collapsed
          ? "w-0 opacity-0 overflow-hidden"
          : "w-64 sm:w-56 md:w-60 opacity-100"
      }`}
    >
      {/* Logo/Header */}
      <div
        className={`p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ${
          collapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <AnimatedTitle
            className="text-lg sm:text-xl uppercase font-semibold tracking-tight text-slate-900 dark:text-slate-100"
            ariaLabel="My Notes"
            direction="forward"
            mode="alternating"
          >
            {"My Notes."}
          </AnimatedTitle>
          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 sm:p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
      </div>

      {/* Navigation Menu */}
      <nav
        className={`flex-1 p-2 sm:p-3 transition-all duration-300 ${
          collapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeView === item.id
                    ? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-l-4 border-sky-500"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Authentication Footer */}
      <div
        className={`p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 transition-all duration-300 ${
          collapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* User Status */}
        {user ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                {(user.displayName || user.email).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {user.displayName || user.email}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Sign Out"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>

            {/* Cloud Sync Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Cloud
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={cloudEnabled}
                  onChange={onCloudToggle}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Sign In Button */}
            <button
              onClick={onSignIn}
              disabled={!firebaseReady}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                !firebaseReady
                  ? "bg-slate-800 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700 text-white shadow-sm hover:shadow-md"
              }`}
              title="Sign In"
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In
            </button>
          </div>
        )}

        {/* App Info */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            My Notes<span className="text-yellow-500">.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
