import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-bright">{label}</label>
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-ink-soft px-3.5 py-2.5 text-sm text-slate-bright placeholder:text-slate/50 outline-none transition-colors focus:border-cobalt/60",
          error ? "border-danger/60" : "border-ink-line",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-[11px] text-danger">{error}</p>}
    </div>
  )
);
AuthInput.displayName = "AuthInput";