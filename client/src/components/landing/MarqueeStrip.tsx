const ITEMS = [
  "Live typeset preview",
  "Google Doc export",
  "PDF download",
  "ATS-clean structure",
  "Zero data in guest mode",
  "Password-gated access",
  "Editable after saving",
  "6 real sections",
];

export function MarqueeStrip() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-ink-line bg-canvas-soft py-4">
      <div className="flex w-max animate-marquee gap-3">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-2 rounded-full border border-ink-line bg-white px-4 py-1.5 font-mono text-[11px] tracking-wide text-slate"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cobalt" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}