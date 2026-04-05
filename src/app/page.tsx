"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

const ACCESS_CODE = "1";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code === ACCESS_CODE) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3">MyDashboard</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            הממשק בבנייה...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-xs">
        <div className="flex justify-center mb-8">
          <Lock className="w-8 h-8" />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="קוד"
            className={`w-full bg-transparent border rounded-lg px-4 py-3 text-center text-lg outline-none transition-all
              ${error
                ? "border-red-500"
                : "border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white"
              }`}
            autoFocus
          />

          {error && (
            <p className="text-red-500 text-xs text-center mt-2">
              קוד שגוי
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg py-3 mt-4 transition-colors"
          >
            כניסה
          </button>
        </form>
      </div>
    </div>
  );
}
