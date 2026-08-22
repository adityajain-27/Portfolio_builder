import { cn } from "@/lib/utils";

export function WizardProgress({ step, total, labels }: { step: number; total: number; labels: string[] }) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <span className="eyebrow">
          Step {step + 1} of {total} — {labels[step]}
        </span>
        <span className="font-mono text-[11px] text-slate/70">{Math.round(((step + 1) / total) * 100)}%</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 overflow-hidden rounded-full bg-ink-line transition-colors duration-300"
            )}
          >
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r from-cobalt to-cobalt-soft transition-all duration-500",
                i < step ? "w-full" : i === step ? "w-full shadow-glow" : "w-0"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}