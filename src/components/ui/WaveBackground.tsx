export function WaveBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="wave-layer wave-layer-1 absolute -bottom-px left-0 w-[200%] text-brand/8"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z"
        />
      </svg>
      <svg
        className="wave-layer wave-layer-2 absolute -bottom-px left-0 w-[200%] text-success/10"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,80 C320,40 640,100 960,60 C1200,28 1320,52 1440,72 L1440,120 L0,120 Z"
        />
      </svg>
      <svg
        className="wave-layer wave-layer-3 absolute -bottom-px left-0 w-[200%] text-[#FF6B4A]/12"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,90 C400,50 800,110 1200,70 C1320,58 1380,85 1440,95 L1440,120 L0,120 Z"
        />
      </svg>
      <div className="vitality-orb vitality-orb-1" />
      <div className="vitality-orb vitality-orb-2" />
      <div className="vitality-orb vitality-orb-3" />
    </div>
  );
}
