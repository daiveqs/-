"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const ACCESS_CODE = "1";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [showCode, setShowCode] = useState(false);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">MyDashboard</h1>
          <p className="text-lg text-slate-400">הממשק בבנייה... בקרוב כאן יהיה הדשבורד שלך</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">MyDashboard</h1>
        <p className="text-slate-400 text-center mb-6">הזן קוד גישה</p>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <input
              type={showCode ? "text" : "password"}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              placeholder="קוד גישה"
              className={`w-full bg-slate-700 text-white rounded-lg px-4 py-3 text-center text-lg outline-none transition-all
                ${error ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-blue-500"}`}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">
              קוד שגוי, נסה שוב
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 transition-colors"
          >
            כניסה
          </button>
        </form>
      </div>
    </div>
  );
}
