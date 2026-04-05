"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Plus, Pencil, Trash2, Menu } from "lucide-react";
import Calendar, { CalendarEvent } from "./Calendar";
import EventModal from "./EventModal";

type TabId = "general" | "training" | "finance";

const TABS: { id: TabId; label: string }[] = [
  { id: "general", label: "כללי" },
  { id: "training", label: "אימונים" },
  { id: "finance", label: "כספים" },
];

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
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  function updateEvent(id: string, event: { title: string; description: string; date: string; time: string }) {
    const updated = events.map((e) => (e.id === id ? { ...e, ...event } : e));
    setEvents(updated);
    saveEvents(updated);
  }

  function deleteEvent(id: string) {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    saveEvents(updated);
  }

  function openNewEvent() {
    setEditingEvent(null);
    setShowModal(true);
  }

  function openEditEvent(event: CalendarEvent) {
    setEditingEvent(event);
    setShowModal(true);
  }

  function handleSave(event: { title: string; description: string; date: string; time: string }) {
    if (editingEvent) {
      updateEvent(editingEvent.id, event);
    } else {
      addEvent(event);
    }
  }

  const tabLabel = TABS.find((t) => t.id === activeTab)!.label;

  const selectedDateEvents = events
    .filter((e) => e.date === format(selectedDate, "yyyy-MM-dd"))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 rounded-xl flex items-center justify-center active:bg-neutral-900 transition-colors"
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <h1 className="text-base font-semibold">{tabLabel}</h1>
        <button
          onClick={openNewEvent}
          className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
        </button>
      </header>

      {/* Menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50 animate-[fadeIn_150ms_ease-out]" />
          <div className="absolute top-0 right-0 h-full w-56 bg-neutral-950 p-5 pt-6 animate-[slideIn_150ms_ease-out]">
            <div className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(tab.id);
                    setMenuOpen(false);
                  }}
                  className={`w-full text-right px-4 py-3 rounded-xl text-sm transition-colors
                    ${activeTab === tab.id
                      ? "bg-white text-black font-medium"
                      : "text-neutral-400 active:bg-neutral-900"
                    }`}
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
                    <div key={event.id}>
                      <div className="bg-neutral-900 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-xs text-neutral-500 font-mono w-12 shrink-0">
                            {event.time}
                          </span>
                          <div className="min-w-0">
                            <span className="text-sm block">{event.title}</span>
                            {event.description && (
                              <span className="text-xs text-neutral-500 block mt-0.5">{event.description}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => openEditEvent(event)}
                            className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center active:bg-neutral-700 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5 text-neutral-400" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(event.id)}
                            className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center active:bg-red-500/25 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                      {confirmDeleteId === event.id && (
                        <div className="flex gap-2 mt-1.5">
                          <button
                            onClick={() => {
                              deleteEvent(event.id);
                              setConfirmDeleteId(null);
                            }}
                            className="flex-1 bg-red-500 text-white text-xs font-medium rounded-lg py-2 active:scale-[0.98] transition-all"
                          >
                            מחק
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="flex-1 bg-neutral-800 text-neutral-400 text-xs font-medium rounded-lg py-2 active:scale-[0.98] transition-all"
                          >
                            ביטול
                          </button>
                        </div>
                      )}
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
          editingEvent={editingEvent}
          onClose={() => {
            setShowModal(false);
            setEditingEvent(null);
          }}
          onSave={handleSave}
          onDelete={editingEvent ? () => deleteEvent(editingEvent.id) : undefined}
        />
      )}
    </div>
  );
}
