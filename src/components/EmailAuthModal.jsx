import React, { useEffect, useState } from "react";

function isValidEmail(e) {
  return !!e && /\S+@\S+\.\S+/.test(e);
}

export default function EmailAuthModal({
  open,
  onClose,
  onSignIn,
  onSignUp,
  onReset,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  if (!open) return null;

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

  return (
    <div className="fixed min-w-full inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">
            {mode === "signin" && "Sign in"}
            {mode === "signup" && "Create account"}
            {mode === "reset" && "Reset password"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <div>
          <div className="mb-3">
            <label className="block text-sm text-slate-600 dark:text-slate-300">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2 py-2 border rounded mt-1 text-black"
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
            />
          </div>

          {mode !== "reset" && (
            <div className="mb-3">
              <label className="block text-sm text-slate-600 dark:text-slate-300">
                Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 px-2 py-2 border rounded mt-1"
                  placeholder="At least 6 characters"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                />
                <button
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-sm text-slate-600 hover:underline"
                  type="button"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}

          {error && <div className="text-sm text-rose-600 mb-2">{error}</div>}
          {success && (
            <div className="text-sm text-green-600 mb-2">{success}</div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div>
              <button
                onClick={submit}
                disabled={loading}
                className={`px-3 py-2 bg-slate-900 text-white rounded ${
                  loading ? "opacity-60" : "hover:opacity-90"
                }`}
              >
                {loading
                  ? "Please wait..."
                  : mode === "signin"
                  ? "Sign in"
                  : mode === "signup"
                  ? "Create account"
                  : "Send reset"}
              </button>
            </div>

            <div className="ml-auto text-sm flex items-center gap-3">
              {mode !== "signin" ? (
                <button
                  onClick={() => {
                    setMode("signin");
                    setError("");
                    setSuccess("");
                  }}
                  className="underline"
                >
                  Back to sign in
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMode("signup");
                      setError("");
                      setSuccess("");
                    }}
                    className="underline"
                  >
                    Create account
                  </button>
                  <button
                    onClick={() => {
                      setMode("reset");
                      setError("");
                      setSuccess("");
                    }}
                    className="underline"
                  >
                    Forgot?
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
