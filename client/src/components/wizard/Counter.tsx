import { cn } from "@/lib/utils";

interface CounterProps {
  current: number;
  max: number;
  unit?: "chars" | "words";
}

export function Counter({ current, max, unit = "chars" }: CounterProps) {
  const ratio = current / max;
  const state = ratio > 1 ? "error" : ratio >= 0.85 ? "warn" : "ok";

  return (
    <span
      className={cn(
        "font-mono text-[11px] tabular-nums transition-colors",
        state === "ok" && "text-slate/70",
        state === "warn" && "text-warn",
        state === "error" && "text-danger"
      )}
    >
      {current}/{max} {unit}
    </span>
  );
}