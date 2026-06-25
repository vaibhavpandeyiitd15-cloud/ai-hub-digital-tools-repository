import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getAdminStats } from "@/lib/admin-data";
import { isAdminAuthenticated } from "@/lib/auth/admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const stats = await getAdminStats();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar pendingBookings={stats.pendingBookings} />
      <div className="flex-1">
        <div className="border-b border-[var(--border)] bg-white px-6 py-4 lg:hidden">
          <p className="font-[family-name:var(--font-barlow)] text-sm font-bold text-brand">
            AI Hub CMS
          </p>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </div>
    </div>
  );
}
