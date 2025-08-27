import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";

function isValidEmail(e) {
  return !!e && /\S+@\S+\.\S+/.test(e);
}

export default function EmailAuthModal({
  open,
  onClose,
  onSignIn,
  onSignUp,
  onReset,
  loading: parentLoading = false,
  error: parentError = null,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Use parent loading state if provided, otherwise use local
  const isLoading = parentLoading || loading;

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setMode("signin");
      setError("");
      setSuccess("");
      setShowPassword(false);
      setLoading(false);
    }
  }, [open]);

  // Handle parent error
  useEffect(() => {
    if (parentError) {
      setError(parentError);
    }
  }, [parentError]);

  const submit = async () => {
    setError("");
    setSuccess("");
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (mode !== "reset" && password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        await onSignIn(email.trim(), password);
        setSuccess("Signed in successfully.");
      } else if (mode === "signup") {
        await onSignUp(email.trim(), password);
        setSuccess("Account created. You are signed in.");
      } else if (mode === "reset") {
        await onReset(email.trim());
        setSuccess("Password reset email sent.");
      }
    } catch (e) {
      setError(e?.message || String(e) || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  const getModeConfig = () => {
    switch (mode) {
      case "signin":
        return {
          title: "Sign in",
          subtitle: "Welcome back to My Notes",
          buttonText: "Sign In",
        };
      case "signup":
        return {
          title: "Sign up",
          subtitle: "Create your account to get started",
          buttonText: "Sign Up",
        };
      case "reset":
        return {
          title: "Reset password",
          subtitle: "Enter your email to receive a reset link",
          buttonText: "Send Reset Link",
        };
      default:
        return {};
    }
  };

  const config = getModeConfig();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 flex items-center backdrop-blur-sm justify-center p-4 sm:p-6 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3,
            }}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-lg max-w-sm w-full p-6 sm:p-6 border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {config.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {config.subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 border outline-none border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-white focus:border-white transition-all"
                  placeholder="Email address"
                  autoComplete="email"
                  inputMode="email"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              {mode !== "reset" && (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-1 focus:ring-white focus:border-white transition-all"
                    placeholder="Enter your password"
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    type="button"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}

              {/* Error/Success Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-lg"
                  >
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50 rounded-lg"
                  >
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {success}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                onClick={submit}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  isLoading
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900"
                }`}
              >
                {isLoading ? "Please wait..." : config.buttonText}
              </button>

              {/* Mode Switcher */}
              <div className="text-center">
                {mode === "signin" ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setMode("reset");
                        setError("");
                        setSuccess("");
                      }}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                      disabled={isLoading}
                    >
                      Forgot password?
                    </button>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Don't have an account?{" "}
                      <button
                        onClick={() => {
                          setMode("signup");
                          setError("");
                          setSuccess("");
                        }}
                        className="text-slate-900 dark:text-slate-100 hover:underline font-medium"
                        disabled={isLoading}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setMode("signin");
                        setError("");
                        setSuccess("");
                      }}
                      className="text-slate-900 dark:text-slate-100 hover:underline font-medium"
                      disabled={isLoading}
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
