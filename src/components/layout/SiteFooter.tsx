export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-brand-dark text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 50%, rgba(0,195,137,0.2) 0%, transparent 50%), radial-gradient(circle at 85% 40%, rgba(255,107,74,0.15) 0%, transparent 45%), radial-gradient(circle at 50% 100%, rgba(255,199,44,0.1) 0%, transparent 40%)",
        }}
      />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 pb-20 pr-20 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between sm:pr-28">
        <p>&copy; {new Date().getFullYear()} Unilever Desire Lab</p>
        <p className="text-white/50">
          <a href="/about" className="text-white/40 hover:text-white/70">
            Our journey
          </a>
          <span className="mx-2">·</span>
          <a href="/admin" className="text-white/40 hover:text-white/70">
            Desire Lab CMS
          </a>
        </p>
      </div>
    </footer>
  );
}
