"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import Dashboard from "@/components/Dashboard";

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
      setCode("");
    }
  }

  if (authenticated) {
    return <Dashboard />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-[260px] flex flex-col items-center gap-8">
        <div className="w-16 h-16 rounded-full border border-neutral-700 flex items-center justify-center">
          <Lock className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <input
            type="password"
            inputMode="numeric"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder=""
            className={`w-full bg-white/5 backdrop-blur-sm border rounded-xl px-4 py-3.5 text-center text-lg tracking-[0.5em] outline-none transition-all placeholder:tracking-[0.3em] placeholder:text-neutral-600
              ${error
                ? "border-red-500/50"
                : "border-neutral-800 focus:border-neutral-600"
              }`}
            autoFocus
          />

          {error && (
            <p className="text-red-400/70 text-xs text-center">קוד שגוי</p>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black font-medium rounded-xl py-3.5 text-sm tracking-wide transition-all active:scale-[0.98] active:bg-neutral-200"
          >
            כניסה
          </button>
        </form>
      </div>
    </div>
  );
}
