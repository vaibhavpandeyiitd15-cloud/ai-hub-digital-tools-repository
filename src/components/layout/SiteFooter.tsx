export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-brand-dark text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(0,166,81,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0,51,160,0.2) 0%, transparent 50%)",
        }}
      />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 pb-20 pr-20 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between sm:pr-28">
        <p>&copy; {new Date().getFullYear()} Unilever Desire Lab</p>
        <p className="text-white/50">
          <a href="/admin" className="text-white/40 hover:text-white/70">
            Desire Lab CMS
          </a>
        </p>
      </div>
    </footer>
  );
}
