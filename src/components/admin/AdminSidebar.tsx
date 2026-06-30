"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FolderTree,
  LayoutGrid,
  LogOut,
  Wrench,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/tools", label: "Tools", icon: Wrench },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
];

type AdminSidebarProps = {
  pendingBookings?: number;
};

export function AdminSidebar({ pendingBookings = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-r border-[var(--border)] bg-white lg:min-h-screen lg:w-64">
      <div className="border-b border-[var(--border)] px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/unilever-logo.png"
            alt="Unilever"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <div>
            <p className="font-[family-name:var(--font-barlow)] text-sm font-bold text-brand">
              Desire Lab CMS
            </p>
            <p className="text-xs text-[var(--text-secondary)]">Admin</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-brand text-white"
                  : "text-[var(--text-secondary)] hover:bg-surface hover:text-brand",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {label === "Bookings" && pendingBookings > 0 && (
                <span
                  className={cn(
                    "ml-auto rounded-full px-2 py-0.5 text-xs font-semibold",
                    active ? "bg-white/20 text-white" : "bg-warning/15 text-warning",
                  )}
                >
                  {pendingBookings}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-[var(--border)] p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-surface hover:text-brand"
        >
          <LayoutGrid className="h-4 w-4" />
          View catalog
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-danger/5 hover:text-danger"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
