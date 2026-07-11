"use client";

import { useState } from "react";
import { useActionState } from "react";
import type { BookingStatus } from "@prisma/client";
import { updateBookingStatusAction } from "@/lib/actions/bookings";
import type { CollatedBookingSlot } from "@/lib/admin-data";

const statusLabels: Record<BookingStatus, string> = {
  PENDING: "Pending",
  CONTACTED: "Contacted",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    PENDING: "bg-warning/15 text-warning",
    CONTACTED: "bg-brand/10 text-brand",
    COMPLETED: "bg-success/15 text-success",
    CANCELLED: "bg-danger/10 text-danger",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function BookingStatusForm({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: BookingStatus;
}) {
  const [, formAction, pending] = useActionState(updateBookingStatusAction, {});

  return (
    <form action={formAction} className="inline-flex items-center gap-2">
      <input type="hidden" name="bookingId" value={bookingId} />
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        disabled={pending}
        className="rounded-lg border border-[var(--border)] bg-white px-2 py-1 text-xs outline-none focus:border-brand"
      >
        {(Object.keys(statusLabels) as BookingStatus[]).map((s) => (
          <option key={s} value={s}>
            {statusLabels[s]}
          </option>
        ))}
      </select>
    </form>
  );
}

export function BookingSlotCollatedView({ slots }: { slots: CollatedBookingSlot[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  if (slots.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-white px-6 py-12 text-center">
        <p className="text-[var(--text-secondary)]">No training slot requests yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {slots.map((slot) => {
        const isOpen = openKey === slot.key;
        const slotLabel = `${slot.preferredDate.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })} · ${slot.preferredTime} · ${slot.durationMinutes} min`;

        return (
          <div
            key={slot.key}
            className="overflow-hidden rounded-xl border border-[var(--border)] bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenKey(isOpen ? null : slot.key)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface/50"
              aria-expanded={isOpen}
            >
              <div>
                <p className="font-medium text-brand">{slot.toolName}</p>
                <p className="text-sm text-[var(--text-secondary)]">{slotLabel}</p>
                <p className="text-xs text-[var(--text-secondary)]">POC: {slot.pocName}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-brand">{slot.requestCount}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  request{slot.requestCount === 1 ? "" : "s"}
                  {slot.pendingCount > 0 ? ` · ${slot.pendingCount} pending` : ""}
                </p>
              </div>
            </button>

            {isOpen ? (
              <div className="border-t border-[var(--border)] bg-surface/30">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Requested</th>
                        <th className="px-4 py-3 font-semibold">Requester</th>
                        <th className="px-4 py-3 font-semibold">Subject</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {slot.bookings.map((booking) => (
                        <tr key={booking.id} className="bg-white">
                          <td className="px-4 py-3 text-[var(--text-secondary)]">
                            {booking.createdAt.toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <p>{booking.requesterName}</p>
                            <a
                              href={`mailto:${booking.requesterEmail}`}
                              className="text-xs text-brand hover:underline"
                            >
                              {booking.requesterEmail}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-[var(--text-secondary)]">
                            <p>{booking.subject}</p>
                            {booking.message ? (
                              <p className="mt-1 max-w-xs truncate text-xs" title={booking.message}>
                                {booking.message}
                              </p>
                            ) : null}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-4 py-3">
                            <BookingStatusForm
                              bookingId={booking.id}
                              currentStatus={booking.status}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Flat list view for individual booking rows */
export function BookingInbox({
  bookings,
}: {
  bookings: CollatedBookingSlot["bookings"];
}) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-white px-6 py-12 text-center">
        <p className="text-[var(--text-secondary)]">No booking requests yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-surface text-xs uppercase tracking-wide text-[var(--text-secondary)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Tool</th>
              <th className="px-4 py-3 font-semibold">Requester</th>
              <th className="px-4 py-3 font-semibold">Preferred slot</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-surface/50">
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {booking.createdAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-brand">{booking.tool.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    POC: {booking.tool.pocName}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p>{booking.requesterName}</p>
                  <a
                    href={`mailto:${booking.requesterEmail}`}
                    className="text-xs text-brand hover:underline"
                  >
                    {booking.requesterEmail}
                  </a>
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {booking.preferredDate.toLocaleDateString("en-GB")} · {booking.preferredTime} ·{" "}
                  {booking.durationMinutes} min
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-4 py-3">
                  <BookingStatusForm bookingId={booking.id} currentStatus={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
