import { cn } from "@/lib/utils";

export function WizardProgress({
  step,
  total,
  labels,
  onStepClick,
}: {
  step: number;
  total: number;
  labels: string[];
  onStepClick?: (i: number) => void;
}) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <span className="eyebrow">
          Step {step + 1} of {total} — {labels[step]}
        </span>
        <span className="font-mono text-[11px] text-slate/70">{Math.round(((step + 1) / total) * 100)}%</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const clickable = !!onStepClick && i <= step;
          return (
            <button
              key={i}
              type="button"
              disabled={!clickable}
              onClick={() => onStepClick?.(i)}
              title={clickable ? `Back to ${labels[i]}` : labels[i]}
              className={cn(
                "h-1.5 flex-1 overflow-hidden rounded-full bg-ink-line transition-colors duration-300",
                clickable && "cursor-pointer hover:bg-ink-line/60"
              )}
            >
              <div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r from-cobalt to-cobalt-soft transition-all duration-500",
                  i < step ? "w-full" : i === step ? "w-full shadow-glow" : "w-0"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}