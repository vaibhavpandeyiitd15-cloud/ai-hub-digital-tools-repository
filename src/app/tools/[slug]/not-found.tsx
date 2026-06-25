import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-brand">
        Tool not found
      </h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        This tool may not exist or has been removed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-semibold text-brand hover:underline"
      >
        Back to catalog
      </Link>
    </div>
  );
}
