"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Plus, Calendar as CalendarIcon, Dumbbell, Wallet, Trash2 } from "lucide-react";
import Calendar, { CalendarEvent } from "./Calendar";
import EventModal from "./EventModal";

const TABS = [
  { id: "general", label: "כללי", icon: CalendarIcon },
  { id: "training", label: "אימונים", icon: Dumbbell },
  { id: "finance", label: "כספים", icon: Wallet },
] as const;

type TabId = (typeof TABS)[number]["id"];

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  function addEvent(event: { title: string; date: string; time: string }) {
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

  const selectedDateEvents = selectedDate
    ? events
        .filter((e) => e.date === format(selectedDate, "yyyy-MM-dd"))
        .sort((a, b) => a.time.localeCompare(b.time))
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <h1 className="text-lg font-bold tracking-tight">MyDashboard</h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-5 pb-24 overflow-y-auto">
        {activeTab === "general" && (
          <div className="space-y-4 mt-2">
            <Calendar
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            {/* Selected day events */}
            {selectedDate && (
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
                        className="bg-neutral-900 rounded-xl p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-neutral-500 font-mono w-12">
                            {event.time}
                          </span>
                          <span className="text-sm">{event.title}</span>
                        </div>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-neutral-600 active:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "training" && (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-neutral-500">אימונים - בקרוב</p>
          </div>
        )}

        {activeTab === "finance" && (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-neutral-500">כספים - בקרוב</p>
          </div>
        )}
      </main>

      {/* Bottom tabs */}
      <nav className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors
                  ${isActive ? "text-white" : "text-neutral-600"}`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

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
