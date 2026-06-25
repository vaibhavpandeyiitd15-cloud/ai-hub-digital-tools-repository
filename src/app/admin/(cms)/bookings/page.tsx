import { BookingInbox } from "@/components/admin/BookingInbox";
import { getBookingsForAdmin } from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Bookings | AI Hub CMS",
};

const filters = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const { status = "ALL" } = await searchParams;
  const bookings = await getBookingsForAdmin(status);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-barlow)] text-3xl font-bold text-brand">
          Training bookings
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Review and update status for training requests from employees
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "ALL"
                ? "/admin/bookings"
                : `/admin/bookings?status=${filter.value}`
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

      <BookingInbox bookings={bookings} />
    </div>
  );
}
