import { Lock, LockOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useGateStore } from "@/store/gateStore";
import { cn } from "@/lib/utils";

interface LockButtonProps {
  onClick: () => void;
  className?: string;
}

export function LockButton({ onClick, className }: LockButtonProps) {
  const unlocked = useGateStore((s) => s.isUnlocked());

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs tracking-wide transition-colors",
        unlocked
          ? "border-gold/40 bg-gold/10 text-gold-soft hover:bg-gold/15"
          : "border-ink-line bg-ink-soft text-slate hover:border-cobalt/50 hover:text-slate-bright",
        className
      )}
      aria-label={unlocked ? "Studio unlocked, click to enter" : "Unlock resume studio"}
    >
      <span className="relative flex h-2 w-2">
        {!unlocked && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobalt/60" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            unlocked ? "bg-gold" : "bg-cobalt"
          )}
        />
      </span>
      {unlocked ? <LockOpen size={13} /> : <Lock size={13} />}
      {unlocked ? "Studio Unlocked" : "Unlock Studio"}
    </motion.button>
  );
}