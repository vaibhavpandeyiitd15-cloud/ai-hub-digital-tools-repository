export function SiteFooter() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-white/80 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Unilever AI Hub</p>
        <p className="text-white/60">AI Hub Tool Guide v0.2.0</p>
      </div>
    </footer>
  );
}
