"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCircle2, Clock, X } from "lucide-react";
import type { BookingTool } from "@/components/booking/BookingProvider";
import {
  getAvailableTrainingSlots,
  groupTrainingSlotsByDate,
  type TrainingSlot,
} from "@/lib/content/training-slots";
import { cn } from "@/lib/utils";

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  tool: BookingTool | null;
  tools?: BookingTool[];
};

export function BookingModal({
  open,
  onClose,
  tool: initialTool,
  tools = [],
}: BookingModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<TrainingSlot | null>(null);
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

  const availableSlots = useMemo(() => getAvailableTrainingSlots(), [open]);
  const slotGroups = useMemo(
    () => groupTrainingSlotsByDate(availableSlots),
    [availableSlots],
  );

  useEffect(() => {
    if (!open) return;
    const t = initialTool ?? toolList[0];
    if (t) {
      setToolId(t.id);
      setSubject(`Training request: ${t.name}`);
    }
    setSelectedSlot(null);
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

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!selectedTool || !selectedSlot) {
      setError("Please select a tool and an available training slot.");
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
          preferredDate: selectedSlot.date,
          preferredTime: selectedSlot.time,
          durationMinutes: selectedSlot.durationMinutes,
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
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-gradient-to-r from-brand to-brand-light px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 id="booking-title" className="font-[family-name:var(--font-barlow)] text-lg font-semibold">
                Look for training slots
              </h2>
              <p className="text-xs text-white/80">
                Choose an available slot from August onwards
              </p>
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
              session on {selectedSlot?.label}.
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
              <div className="border-b border-[var(--border)] bg-surface p-5 md:col-span-2 md:border-b-0 md:border-r">
                <label className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  <Clock className="h-3.5 w-3.5" />
                  Available training slots
                </label>
                <p className="mb-4 text-xs text-[var(--text-secondary)]">
                  Select one date and time. Slots run on weekdays from August over the next
                  four weeks.
                </p>

                <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
                  {slotGroups.map((group) => (
                    <div key={group.date}>
                      <p className="mb-2 text-xs font-semibold text-brand">
                        {group.weekdayLabel}
                      </p>
                      <div className="space-y-2">
                        {group.slots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={cn(
                                "flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition",
                                isSelected
                                  ? "border-brand bg-brand text-white"
                                  : "border-[var(--border)] bg-white hover:border-brand/40 hover:bg-brand/5",
                              )}
                            >
                              <span className="font-medium">{slot.time}</span>
                              <span
                                className={cn(
                                  "text-xs",
                                  isSelected ? "text-white/80" : "text-[var(--text-secondary)]",
                                )}
                              >
                                {slot.durationMinutes} min
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 p-5 md:col-span-3">
                {selectedSlot ? (
                  <div className="rounded-lg border border-u-mint/30 bg-u-mint/10 px-4 py-3 text-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                      Selected slot
                    </p>
                    <p className="mt-1 font-semibold text-brand">{selectedSlot.label}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Duration: {selectedSlot.durationMinutes} minutes
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-secondary)]">
                    Pick a training slot from the list on the left.
                  </div>
                )}

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

                {error ? <p className="text-sm text-danger">{error}</p> : null}

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
                    disabled={submitting || !selectedSlot}
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
