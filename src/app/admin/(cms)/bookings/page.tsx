import { BookingInbox, BookingSlotCollatedView } from "@/components/admin/BookingInbox";
import { getBookingsCollatedByToolAndSlot, getBookingsForAdmin } from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Bookings | Desire Lab CMS",
};

const filters = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

type PageProps = {
  searchParams: Promise<{ status?: string; view?: string }>;
};

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const { status = "ALL", view = "slots" } = await searchParams;
  const collatedSlots = await getBookingsCollatedByToolAndSlot(status);
  const bookings = view === "all" ? await getBookingsForAdmin(status) : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-barlow)] text-3xl font-bold text-brand">
          Training slot requests
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Review requests collated by tool and slot, or browse every individual request
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "ALL"
                ? `/admin/bookings?view=${view}`
                : `/admin/bookings?status=${filter.value}&view=${view}`
            }
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition",
              status === filter.value
                ? "bg-brand text-white"
                : "bg-white text-[var(--text-secondary)] ring-1 ring-[var(--border)] hover:text-brand",
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="mb-6 flex gap-2">
        <Link
          href={`/admin/bookings?${status === "ALL" ? "" : `status=${status}&`}view=slots`}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold transition",
            view !== "all"
              ? "bg-brand text-white"
              : "bg-white text-[var(--text-secondary)] ring-1 ring-[var(--border)] hover:text-brand",
          )}
        >
          By tool & slot
        </Link>
        <Link
          href={`/admin/bookings?${status === "ALL" ? "" : `status=${status}&`}view=all`}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold transition",
            view === "all"
              ? "bg-brand text-white"
              : "bg-white text-[var(--text-secondary)] ring-1 ring-[var(--border)] hover:text-brand",
          )}
        >
          All requests
        </Link>
      </div>

      {view === "all" ? (
        <BookingInbox bookings={bookings} />
      ) : (
        <BookingSlotCollatedView slots={collatedSlots} />
      )}
    </div>
  );
}
