import React from "react";
import AnimatedTitle from "./AnimatedTitle";

function Sidebar({ activeView, onViewChange, onClose }) {
  // const navigate = useNavigation();

  // const home = {
  //   navigate('/home');
  // }
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
  ];

  return (
    <div className="w-56 md:w-60 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
      {/* Logo/Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
            {/* <div
              className="w-7 h-7 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105 hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)] hover:bg-yellow-50 dark:hover:bg-yellow-900/10 cursor-pointer group"
              aria-hidden="true"
            >
              <svg
                className="w-5 h-5 text-white dark:text-slate-900 group-hover:text-yellow-500 transition-colors"
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
              </div> */}
          <AnimatedTitle
            className="text-xl uppercase font-semibold tracking-tight text-slate-900 dark:text-slate-100"
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
              className="md:hidden p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

      {/* Footer */}
      <div className="p-4 flex border-t border-slate-200 dark:border-slate-800">
      
        <div className="flex items-center gap-1 mr-1">
          <span className="w-2 h-2 bg-rose-500"></span>
          <span className="w-2 h-2 bg-amber-500"></span>
          <span className="w-2 h-2 bg-sky-500 "></span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Organize your thoughts
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
