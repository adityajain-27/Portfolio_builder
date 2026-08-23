import { InputHTMLAttributes, forwardRef } from "react";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Counter } from "./Counter";
import { cn } from "@/lib/utils";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  maxLength: number;
  error?: string;
  hint?: string;
  /** Shown instead of the default overflow copy when `value` exceeds `maxLength`. */
  overflowMessage?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      maxLength,
      error,
      hint,
      overflowMessage = "Over the recommended length — it may get cut off or crowd the layout.",
      value,
      className,
      ...props
    },
    ref
  ) => {
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
        <AnimatePresence>
          {overLimit && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 flex items-start gap-1.5 rounded-md border border-warn/30 bg-warn/10 px-2.5 py-1.5 text-[11px] leading-relaxed text-warn"
            >
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              {overflowMessage}
            </motion.div>
          )}
        </AnimatePresence>
        {hint && !error && !overLimit && <p className="mt-1 text-[11px] text-slate/70">{hint}</p>}
        {error && <p className="mt-1 text-[11px] text-danger">{error}</p>}
      </div>
    );
  }
);
TextField.displayName = "TextField";