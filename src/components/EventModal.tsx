"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface EventModalProps {
  date: Date | null;
  onClose: () => void;
  onSave: (event: { title: string; date: string; time: string }) => void;
}

export default function EventModal({ date, onClose, onSave }: EventModalProps) {
  const defaultDate = date
    ? date.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(defaultDate);
  const [time, setTime] = useState("09:00");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), date: eventDate, time });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-t-2xl p-6 pb-10 animate-[slideUp_0.3s_ease-out]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">אירוע חדש</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center active:bg-neutral-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 mb-1.5 block">שם האירוע</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="למשל: פגישה עם דני"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-600"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">תאריך</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-500 transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">שעה</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-500 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-medium rounded-xl py-3.5 text-sm tracking-wide transition-all active:scale-[0.98] active:bg-neutral-200 mt-2"
          >
            שמור
          </button>
        </form>
      </div>
    </div>
  );
}
