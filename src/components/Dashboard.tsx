"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Plus, Trash2, Menu, X } from "lucide-react";
import Calendar, { CalendarEvent } from "./Calendar";
import EventModal from "./EventModal";

type TabId = "general" | "training" | "finance";

const STORAGE_KEY = "dashboard-events";

function loadEvents(): CalendarEvent[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveEvents(events: CalendarEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  function addEvent(event: { title: string; description: string; date: string; time: string }) {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      ...event,
    };
    const updated = [...events, newEvent];
    setEvents(updated);
    saveEvents(updated);
  }

  function deleteEvent(id: string) {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    saveEvents(updated);
  }

  const tabLabel = activeTab === "general" ? "כללי" : activeTab === "training" ? "אימונים" : "כספים";

  const selectedDateEvents = events
    .filter((e) => e.date === format(selectedDate, "yyyy-MM-dd"))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => setShowMenu(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-neutral-900 transition-colors"
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <h1 className="text-base font-semibold">{tabLabel}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
        </button>
      </header>

      {/* Hamburger menu overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowMenu(false)} />
          <div className="absolute top-0 right-0 h-full w-64 bg-neutral-950 border-l border-neutral-800 p-6 animate-[slideRight_0.25s_ease-out]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-semibold text-neutral-400">תפריט</h2>
              <button
                onClick={() => setShowMenu(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center active:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {([
                { id: "general" as TabId, label: "כללי" },
                { id: "training" as TabId, label: "אימונים" },
                { id: "finance" as TabId, label: "כספים" },
              ]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMenu(false);
                  }}
                  className={`w-full text-right px-4 py-3 rounded-xl text-sm transition-colors
                    ${activeTab === tab.id ? "bg-white text-black font-medium" : "text-neutral-400 active:bg-neutral-900"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 px-5 pb-8 overflow-y-auto">
        {activeTab === "general" && (
          <div className="space-y-4 mt-2">
            <Calendar
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            {/* Selected day events */}
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-3">
                {format(selectedDate, "EEEE, d בMMMM", { locale: he })}
              </h3>

              {selectedDateEvents.length === 0 ? (
                <div className="bg-neutral-900 rounded-xl p-4 text-center">
                  <p className="text-sm text-neutral-500">אין אירועים</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-neutral-900 rounded-xl p-4 flex items-start justify-between"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="text-xs text-neutral-500 font-mono w-12 pt-0.5 shrink-0">
                          {event.time}
                        </span>
                        <div className="min-w-0">
                          <span className="text-sm block">{event.title}</span>
                          {event.description && (
                            <span className="text-xs text-neutral-500 block mt-0.5">{event.description}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-neutral-600 active:text-red-400 transition-colors p-1 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "training" && (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-neutral-500">בקרוב</p>
          </div>
        )}

        {activeTab === "finance" && (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-neutral-500">בקרוב</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <EventModal
          date={selectedDate}
          onClose={() => setShowModal(false)}
          onSave={addEvent}
        />
      )}
    </div>
  );
}
