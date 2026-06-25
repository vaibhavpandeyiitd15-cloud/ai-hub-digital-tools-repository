export function DatabaseSetupBanner() {
  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="font-semibold">Database not connected</p>
      <p className="mt-1">
        Copy <code className="rounded bg-amber-100 px-1">.env.example</code> to{" "}
        <code className="rounded bg-amber-100 px-1">.env.local</code>, set{" "}
        <code className="rounded bg-amber-100 px-1">DATABASE_URL</code>, then run{" "}
        <code className="rounded bg-amber-100 px-1">npm run db:setup</code> (requires
        PostgreSQL — use Docker or a Neon/Vercel Postgres URL).
      </p>
    </div>
  );
}
