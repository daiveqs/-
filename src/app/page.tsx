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
          <p className="text-sm text-neutral-500">הממשק בבנייה...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="bg-neutral-900 rounded-2xl p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-full">
            <Lock className="w-8 h-8 text-black" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">MyDashboard</h1>
        <p className="text-neutral-500 text-center mb-6">הזן קוד</p>

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
            className={`w-full bg-neutral-800 text-white rounded-lg px-4 py-3 text-center text-lg outline-none transition-all
              ${error ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-white"}`}
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm text-center mt-2">
              קוד שגוי
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold rounded-lg py-3 mt-4 transition-colors active:bg-neutral-300"
          >
            כניסה
          </button>
        </form>
      </div>
    </div>
  );
}
