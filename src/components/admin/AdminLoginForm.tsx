"use client";

import { useActionState } from "react";
import Image from "next/image";
import { loginAction, type AuthActionState } from "@/lib/actions/auth";

const initialState: AuthActionState = {};

export function AdminLoginForm({ passwordConfigured }: { passwordConfigured: boolean }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="w-full max-w-md animate-scale-in rounded-2xl border border-[var(--border)] bg-white p-8 shadow-xl">
      <div className="mb-8 text-center">
        <Image
          src="/assets/unilever-logo.png"
          alt="Unilever"
          width={48}
          height={48}
          className="mx-auto h-12 w-12 object-contain"
        />
        <h1 className="mt-4 font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
          Desire Lab CMS
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Sign in to manage tools and bookings
        </p>
      </div>

      {!passwordConfigured && (
        <div className="mb-4 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-[var(--text-primary)]">
          <strong>ADMIN_PASSWORD</strong> is not set. Add it to{" "}
          <code className="text-xs">.env.local</code> for local dev, or in the{" "}
          <a
            href="https://vercel.com/vaibhavpandeyiitd15-8555s-projects/desire-lab/settings/environment-variables"
            className="font-medium text-brand underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel project settings
          </a>{" "}
          (Production + Preview), then redeploy. Sync from Vercel with{" "}
          <code className="text-xs">npx vercel env pull .env.local --environment=production</code>.
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-brand">
            Admin password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={!passwordConfigured || pending}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50"
            placeholder="Enter admin password"
          />
        </div>

        {state.error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={!passwordConfigured || pending}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
