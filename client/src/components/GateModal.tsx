import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, Loader2, AlertCircle, X } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { useGateStore } from "@/store/gateStore";
import { Button } from "@/components/ui/Button";

interface GateModalProps {
  open: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

export function GateModal({ open, onClose, onUnlocked }: GateModalProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const setGate = useGateStore((s) => s.setGate);

  useEffect(() => {
    if (open) {
      setPassword("");
      setError(null);
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/studio/gate", { password });
      setGate(res.data.gate_token);
      onUnlocked();
    } catch (err) {
      setError(apiErrorMessage(err, "Incorrect password"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Unlock resume studio"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-sm rounded-2xl border border-ink-line bg-ink-soft p-7 shadow-paper"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 text-slate/50 transition-colors hover:text-slate-bright"
            >
              <X size={16} />
            </button>

            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-cobalt/30 bg-cobalt/10 text-cobalt-soft">
              <KeyRound size={19} />
            </div>

            <h2 className="font-display text-lg font-semibold text-slate-bright">
              Unlock the studio
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate">
              Access is invite-only. Enter the studio password to continue.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Studio password"
                autoComplete="off"
                className="w-full rounded-lg border border-ink-line bg-ink px-3.5 py-2.5 text-sm text-slate-bright placeholder:text-slate/50 outline-none transition-colors focus:border-cobalt/60"
              />

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 text-xs text-danger"
                  >
                    <AlertCircle size={13} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" disabled={loading || !password} className="w-full" size="md">
                {loading ? <Loader2 size={15} className="animate-spin" /> : "Unlock"}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
