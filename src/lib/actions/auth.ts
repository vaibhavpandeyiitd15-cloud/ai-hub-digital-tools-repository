"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  isAdminPasswordConfigured,
  setAdminSession,
} from "@/lib/auth/admin";

export type AuthActionState = {
  error?: string;
};

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isAdminPasswordConfigured()) {
    return { error: "Admin password is not configured. Set ADMIN_PASSWORD in environment." };
  }

  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD?.trim();

  if (!password || password !== expected) {
    return { error: "Invalid password" };
  }

  await setAdminSession();
  redirect("/admin/tools");
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
