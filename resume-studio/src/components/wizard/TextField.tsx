import { InputHTMLAttributes, forwardRef } from "react";
import { Counter } from "./Counter";
import { cn } from "@/lib/utils";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  maxLength: number;
  error?: string;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, maxLength, error, hint, value, className, ...props }, ref) => {
    const len = typeof value === "string" ? value.length : 0;
    const overLimit = len > maxLength;

    return (
      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label className="text-xs font-medium text-slate-bright">{label}</label>
          <Counter current={len} max={maxLength} unit="chars" />
        </div>
        <input
          ref={ref}
          value={value}
          className={cn(
            "w-full rounded-lg border bg-ink-soft px-3.5 py-2.5 text-sm text-slate-bright placeholder:text-slate/50 outline-none transition-colors focus:border-cobalt/60",
            overLimit || error ? "border-danger/60" : "border-ink-line",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="mt-1 text-[11px] text-slate/70">{hint}</p>}
        {error && <p className="mt-1 text-[11px] text-danger">{error}</p>}
      </div>
    );
  }
);
TextField.displayName = "TextField";