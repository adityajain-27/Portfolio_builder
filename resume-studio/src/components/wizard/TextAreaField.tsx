import { TextareaHTMLAttributes, forwardRef } from "react";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { wordCount, cn } from "@/lib/utils";
import { Counter } from "./Counter";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  maxWords: number;
  error?: string;
  overflowMessage?: string;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (
    {
      label,
      maxWords,
      error,
      overflowMessage = "This won't fully fit — trim it or the layout will spill onto a second page.",
      value,
      className,
      ...props
    },
    ref
  ) => {
    const text = typeof value === "string" ? value : "";
    const words = wordCount(text);
    const over = words > maxWords;

    return (
      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label className="text-xs font-medium text-slate-bright">{label}</label>
          <Counter current={words} max={maxWords} unit="words" />
        </div>
        <textarea
          ref={ref}
          value={value}
          rows={4}
          className={cn(
            "w-full resize-none rounded-lg border bg-ink-soft px-3.5 py-2.5 text-sm leading-relaxed text-slate-bright placeholder:text-slate/50 outline-none transition-colors focus:border-cobalt/60",
            over || error ? "border-danger/60" : "border-ink-line",
            className
          )}
          {...props}
        />
        <AnimatePresence>
          {over && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-start gap-2 rounded-md border border-warn/30 bg-warn/10 px-3 py-2 text-[11px] leading-relaxed text-warn"
            >
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              {overflowMessage}
            </motion.div>
          )}
        </AnimatePresence>
        {error && !over && <p className="mt-1 text-[11px] text-danger">{error}</p>}
      </div>
    );
  }
);
TextAreaField.displayName = "TextAreaField";