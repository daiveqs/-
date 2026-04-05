"use client";

import { useState } from "react";
import { X } from "lucide-react";
import ScrollPicker from "./ScrollPicker";
import { CalendarEvent } from "./Calendar";

interface EventModalProps {
  date: Date;
  editingEvent?: CalendarEvent | null;
  onClose: () => void;
  onSave: (event: { title: string; description: string; date: string; time: string }) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

export default function EventModal({ date, editingEvent, onClose, onSave }: EventModalProps) {
  const eventDate = editingEvent?.date ??
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

  const [title, setTitle] = useState(editingEvent?.title ?? "");
  const [description, setDescription] = useState(editingEvent?.description ?? "");
  const [hour, setHour] = useState(editingEvent ? editingEvent.time.split(":")[0] : "09");
  const [minute, setMinute] = useState(editingEvent ? editingEvent.time.split(":")[1] : "00");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      date: eventDate,
      time: `${hour}:${minute}`,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-t-2xl p-6 pb-10 animate-[slideUp_0.3s_ease-out]">
        <div className="flex items-center justify-end mb-6">
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
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-500 transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 mb-1.5 block">תיאור</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-neutral-500 transition-colors resize-none"
            />
          </div>

          {/* Time picker - iPhone style */}
          <div>
            <label className="text-xs text-neutral-400 mb-1.5 block">שעה</label>
            <div className="flex items-center bg-neutral-900 rounded-xl overflow-hidden">
              <div className="flex-1">
                <ScrollPicker items={MINUTES} value={minute} onChange={setMinute} />
              </div>
              <span className="text-lg text-neutral-500 px-1">:</span>
              <div className="flex-1">
                <ScrollPicker items={HOURS} value={hour} onChange={setHour} />
              </div>
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
