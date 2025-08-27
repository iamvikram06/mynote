import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaCloud, FaTimes } from "react-icons/fa";

export default function Toast({ message, type = "success", visible, onClose }) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheck className="w-4 h-4" />;
      case "cloud":
        return <FaCloud className="w-4 h-4" />;
      default:
        return <FaCheck className="w-4 h-4" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-200";
      case "cloud":
        return "bg-sky-50 dark:bg-sky-900/10 border-sky-200 dark:border-sky-800/50 text-sky-800 dark:text-sky-200";
      default:
        return "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-200";
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.3,
          }}
          className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-sm sm:w-full mx-auto sm:mx-0 p-4 rounded-lg border shadow-lg backdrop-blur-sm ${getColors()}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
