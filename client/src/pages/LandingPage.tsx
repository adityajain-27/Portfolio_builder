import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { LockButton } from "@/components/LockButton";
import { GateModal } from "@/components/GateModal";
import { useGateStore } from "@/store/gateStore";

const TYPESET_LINES = [
  "Aditya Sharma",
  "Full-Stack Engineer",
  "aditya@mail.com  ·  linkedin.com/in/aditya",
  "",
  "EXPERIENCE",
  "Senior Developer — Devnovate  2024 — Present",
];

function TypesetPreview() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= TYPESET_LINES.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 420);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="paper-surface relative w-full max-w-md rounded-sm p-8 font-mono text-[13px] leading-relaxed text-ink/80">
      <div className="absolute -right-3 -top-3 h-full w-full rounded-sm border border-ink-line/40 -z-10" />
      {TYPESET_LINES.slice(0, visible).map((line, i) => (
        <div
          key={i}
          className={
            i === 0
              ? "font-display text-lg font-semibold text-ink animate-type-settle"
              : i === 1
              ? "text-cobalt-dim font-medium animate-type-settle"
              : i === 4
              ? "mt-4 text-[11px] tracking-widest text-gold border-b border-ink/10 pb-1 animate-type-settle"
              : "animate-type-settle text-ink/70"
          }
        >
          {line || "\u00A0"}
        </div>
      ))}
      <span className="inline-block h-4 w-[2px] animate-pulse bg-cobalt align-middle" />
    </div>
  );
}

export function LandingPage() {
  const [gateOpen, setGateOpen] = useState(false);
  const unlocked = useGateStore((s) => s.isUnlocked());
  const navigate = useNavigate();

  function handleLockClick() {
    if (unlocked) {
      navigate("/enter");
    } else {
      setGateOpen(true);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-slate-bright">
          <FileText size={18} className="text-cobalt" />
          SkillCred
        </div>
        <LockButton onClick={handleLockClick} />
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-10 sm:px-10 lg:flex-row lg:items-center lg:gap-16 lg:pt-20">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mb-5"
          >
            Resume Studio · Document Generation
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl font-semibold leading-[1.1] text-slate-bright sm:text-5xl"
          >
            Every resume, <span className="text-cobalt-soft italic">typeset</span> to perfection.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-base leading-relaxed text-slate"
          >
            A private studio for building resumes that read like they were laid out by
            hand — structured, ATS-clean, and generated as a real document in seconds.
            Access is by invitation only.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {[
              { icon: Zap, label: "Live typeset preview" },
              { icon: ShieldCheck, label: "Gated, private access" },
              { icon: Sparkles, label: "One-click doc export" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-slate">
                <Icon size={15} className="text-gold" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16 flex flex-1 justify-center lg:mt-0"
        >
          <div className="animate-float-slow">
            <TypesetPreview />
          </div>
        </motion.div>
      </main>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-grain" />

      <GateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onUnlocked={() => {
          setGateOpen(false);
          navigate("/enter");
        }}
      />
    </div>
  );
}