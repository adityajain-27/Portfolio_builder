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
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= step ? "bg-cobalt" : "bg-ink-line"
            )}
          />
        ))}
      </div>
    </div>
  );
}