import type { Metadata } from "next";
import { isAdminPasswordConfigured } from "@/lib/auth/admin";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In | AI Hub CMS",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <AdminLoginForm passwordConfigured={isAdminPasswordConfigured()} />
    </div>
  );
}
