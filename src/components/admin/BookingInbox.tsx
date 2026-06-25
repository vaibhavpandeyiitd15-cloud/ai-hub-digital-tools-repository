"use client";

import { useActionState } from "react";
import type { Booking, BookingStatus } from "@prisma/client";
import { updateBookingStatusAction } from "@/lib/actions/bookings";

type BookingRow = Booking & {
  tool: { id: string; name: string; slug: string; pocName: string };
};

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

export function BookingInbox({ bookings }: { bookings: BookingRow[] }) {
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
                  {booking.preferredDate.toLocaleDateString("en-GB")} ·{" "}
                  {booking.preferredTime} · {booking.durationMinutes} min
                  {booking.message && (
                    <p className="mt-1 max-w-xs truncate text-xs" title={booking.message}>
                      {booking.message}
                    </p>
                  )}
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
  );
}
