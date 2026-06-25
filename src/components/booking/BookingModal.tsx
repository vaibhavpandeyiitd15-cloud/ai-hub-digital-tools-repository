"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";
import type { BookingTool } from "@/components/booking/BookingProvider";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  tool: BookingTool | null;
  tools?: BookingTool[];
};

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function buildCalendarDays(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];

  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  return cells;
}

export function BookingModal({
  open,
  onClose,
  tool: initialTool,
  tools = [],
}: BookingModalProps) {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState<30 | 60>(30);
  const [toolId, setToolId] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);

  const toolList = tools.length > 0 ? tools : initialTool ? [initialTool] : [];
  const selectedTool =
    toolList.find((t) => t.id === toolId) ?? initialTool ?? toolList[0] ?? null;

  useEffect(() => {
    if (!open) return;
    const t = initialTool ?? toolList[0];
    if (t) {
      setToolId(t.id);
      setSubject(`Training request: ${t.name}`);
    }
    setSuccessId(null);
    setError("");
  }, [open, initialTool, toolList]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const calendarDays = useMemo(() => buildCalendarDays(viewDate), [viewDate]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!selectedTool || !selectedDate || !selectedTime) {
      setError("Please select a tool, date, and time.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: selectedTool.id,
          requesterName,
          requesterEmail,
          preferredDate: formatDateKey(selectedDate),
          preferredTime: selectedTime,
          durationMinutes: duration,
          subject,
          message: message || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to submit request");
        return;
      }
      setSuccessId(data.id);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const monthLabel = viewDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in">
        {/* Outlook-style header bar */}
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-gradient-to-r from-brand to-brand-light px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 id="booking-title" className="font-[family-name:var(--font-barlow)] text-lg font-semibold">
                Book Training Session
              </h2>
              <p className="text-xs text-white/80">Outlook-style scheduling request</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-white/15"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {successId ? (
          <div className="px-6 py-12 text-center animate-fade-up">
            <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
            <h3 className="mt-4 font-[family-name:var(--font-barlow)] text-xl font-semibold text-brand">
              Request sent
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {selectedTool?.pocName} will follow up via email to confirm your
              session.
            </p>
            <p className="mt-4 rounded-lg bg-surface px-4 py-2 text-xs text-[var(--text-secondary)]">
              Reference: <span className="font-mono font-medium">{successId}</span>
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-light"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-h-[calc(90vh-4rem)] overflow-y-auto">
            <div className="grid md:grid-cols-5">
              {/* Calendar panel */}
              <div className="border-b border-[var(--border)] bg-surface p-5 md:col-span-2 md:border-b-0 md:border-r">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setViewDate(
                        new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1),
                      )
                    }
                    className="rounded-lg p-1.5 hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4 text-brand" />
                  </button>
                  <span className="font-[family-name:var(--font-barlow)] text-sm font-semibold text-brand">
                    {monthLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setViewDate(
                        new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1),
                      )
                    }
                    className="rounded-lg p-1.5 hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4 text-brand" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[var(--text-secondary)]">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="mt-1 grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    if (!day) {
                      return <div key={`empty-${i}`} />;
                    }
                    const isPast = day < today;
                    const isSelected =
                      selectedDate &&
                      formatDateKey(day) === formatDateKey(selectedDate);
                    const isToday = formatDateKey(day) === formatDateKey(today);

                    return (
                      <button
                        key={formatDateKey(day)}
                        type="button"
                        disabled={isPast}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "aspect-square rounded-lg text-sm transition",
                          isPast && "cursor-not-allowed text-gray-300",
                          !isPast && "hover:bg-brand/10 hover:text-brand",
                          isSelected &&
                            "bg-brand font-semibold text-white hover:bg-brand",
                          isToday && !isSelected && "ring-1 ring-brand/40",
                        )}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                    <Clock className="h-3.5 w-3.5" /> Time
                  </label>
                  <div className="grid max-h-32 grid-cols-3 gap-1.5 overflow-y-auto">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={cn(
                          "rounded-md border px-2 py-1.5 text-xs transition",
                          selectedTime === slot
                            ? "border-brand bg-brand text-white"
                            : "border-[var(--border)] bg-white hover:border-brand/40",
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form panel */}
              <div className="space-y-4 p-5 md:col-span-3">
                {toolList.length > 1 ? (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                      Tool *
                    </label>
                    <select
                      value={toolId}
                      onChange={(e) => {
                        setToolId(e.target.value);
                        const t = toolList.find((x) => x.id === e.target.value);
                        if (t) setSubject(`Training request: ${t.name}`);
                      }}
                      className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      required
                    >
                      {toolList.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : selectedTool ? (
                  <div className="rounded-lg border border-brand/15 bg-brand/5 px-4 py-3">
                    <p className="text-xs text-[var(--text-secondary)]">Tool</p>
                    <p className="font-[family-name:var(--font-barlow)] font-semibold text-brand">
                      {selectedTool.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      POC: {selectedTool.pocName}
                    </p>
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                      Your name *
                    </label>
                    <input
                      type="text"
                      value={requesterName}
                      onChange={(e) => setRequesterName(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                      Your email *
                    </label>
                    <input
                      type="email"
                      value={requesterEmail}
                      onChange={(e) => setRequesterEmail(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                    Duration *
                  </label>
                  <select
                    value={duration}
                    onChange={(e) =>
                      setDuration(Number(e.target.value) as 30 | 60)
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                    Message / agenda
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    placeholder="What would you like to cover in this session?"
                  />
                </div>

                {error ? (
                  <p className="text-sm text-danger">{error}</p>
                ) : null}

                <div className="flex justify-end gap-3 border-t border-[var(--border)] pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-light disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send Request"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
