"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

const ACCESS_CODE = "1";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code === ACCESS_CODE) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setCode("");
    }
  }

  if (authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6">
        <p className="text-sm tracking-widest uppercase opacity-40">
          בבנייה
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-[280px]">
        <div className="flex justify-center mb-10">
          <div className="w-14 h-14 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center">
            <Lock className="w-5 h-5" strokeWidth={1.5} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={shaking ? "animate-[shake_0.5s_ease-in-out]" : ""}>
            <input
              type="password"
              inputMode="numeric"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              placeholder="קוד"
              className={`w-full bg-transparent border-b py-3 text-center text-lg tracking-[0.3em] outline-none transition-all
                ${error
                  ? "border-neutral-900 dark:border-neutral-100"
                  : "border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100"
                }`}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-[11px] text-center tracking-wide opacity-50">
              קוד שגוי
            </p>
          )}

          <button
            type="submit"
            className="w-full border border-neutral-200 dark:border-neutral-800 rounded-full py-3 text-sm tracking-wide
              active:bg-black active:text-white dark:active:bg-white dark:active:text-black
              transition-all duration-150"
          >
            כניסה
          </button>
        </form>
      </div>
    </div>
  );
}
