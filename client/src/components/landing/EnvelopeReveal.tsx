import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Linkedin, Github, FileText } from "lucide-react";

type Layout = "classic" | "sidebar" | "banner" | "minimal";

const NOTES: { name: string; role: string; entry: string; date: string; layout: Layout }[] = [
  { name: "Ananya Verma", role: "Software Engineer", entry: "Devnovate", date: "2024—25", layout: "classic" },
  { name: "Rohan Malhotra", role: "Backend Engineer", entry: "Cloudline", date: "2023—25", layout: "sidebar" },
  { name: "Ishita Rao", role: "Product Designer", entry: "Northbeam", date: "2022—25", layout: "banner" },
  { name: "Kabir Sethi", role: "Growth Marketer", entry: "Lattice", date: "2023—25", layout: "minimal" },
];

const STEP_MS = 260;
const HOLD_MS = 1300;
const STEPS = 5;

function NoteCard({ note }: { note: (typeof NOTES)[number] }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= STEPS; i++) {
      timers.push(setTimeout(() => setStep(i), i * STEP_MS));
    }
    return () => timers.forEach(clearTimeout);
  }, [note]);

  const contactRow = (dark = false) => (
    <p className={`mt-1 flex flex-wrap items-center justify-center gap-x-2 text-[7.5px] ${dark ? "text-white/75" : "text-ink/65"}`}>
      <span className="inline-flex items-center gap-0.5"><Phone size={7} /></span>
      <span className={`inline-flex items-center gap-0.5 ${dark ? "" : "text-cobalt-dim"}`}><Mail size={7} /></span>
      <span className={`inline-flex items-center gap-0.5 ${dark ? "" : "text-cobalt-dim"}`}><Linkedin size={7} /></span>
      <span className={`inline-flex items-center gap-0.5 ${dark ? "" : "text-cobalt-dim"}`}><Github size={7} /></span>
    </p>
  );

  const bar = (w: string, dark = false) => (
    <div className={`h-[3px] rounded-full ${dark ? "bg-white/25" : "bg-ink/10"} ${w}`} />
  );

  if (note.layout === "sidebar") {
    return (
      <div className="flex h-full w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: step >= 1 ? 1 : 0 }}
          className="flex h-full w-[38%] flex-col items-center justify-center bg-gradient-to-b from-cobalt to-cobalt-dim px-3 py-4 text-center"
        >
          <p className="text-[10px] font-bold leading-tight text-white">{note.name}</p>
          <p className="mt-1 text-[7px] text-white/70">{note.role}</p>
          {contactRow(true)}
        </motion.div>
        <div className="flex-1 space-y-3 p-4">
          {step >= 2 && (
            <motion.div initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}>
              <p className="border-b border-ink/20 pb-0.5 text-[8px] font-bold text-ink">Summary</p>
              <div className="mt-1.5 space-y-1">{bar("w-full")}{bar("w-4/5")}</div>
            </motion.div>
          )}
          {step >= 3 && (
            <motion.div initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}>
              <p className="border-b border-ink/20 pb-0.5 text-[8px] font-bold text-ink">Experience</p>
              <div className="mt-1.5 flex items-baseline justify-between text-[8px]">
                <span className="font-bold text-ink/90">{note.entry}</span>
                <span className="text-ink/50">{note.date}</span>
              </div>
              <div className="mt-1.5 space-y-1">{bar("w-full")}{bar("w-3/5")}</div>
            </motion.div>
          )}
          {step >= 4 && (
            <motion.div initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}>
              <p className="border-b border-ink/20 pb-0.5 text-[8px] font-bold text-ink">Skills</p>
              <div className="mt-1.5 space-y-1">{bar("w-4/5")}</div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  if (note.layout === "banner") {
    return (
      <div className="h-full w-full">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : -8 }}
          className="bg-gradient-to-r from-gold to-gold-soft px-4 py-4 text-center"
        >
          <p className="text-[12px] font-bold text-white">{note.name}</p>
          <p className="mt-0.5 text-[8px] text-white/85">{note.role}</p>
        </motion.div>
        <div className="space-y-3 p-4">
          {step >= 2 && contactRow(false)}
          {step >= 3 && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <p className="border-b border-ink/20 pb-0.5 text-[8px] font-bold text-ink">Experience</p>
              <div className="mt-1.5 flex items-baseline justify-between text-[8px]">
                <span className="font-bold text-ink/90">{note.entry}</span>
                <span className="text-ink/50">{note.date}</span>
              </div>
            </motion.div>
          )}
          {step >= 4 && <div className="space-y-1">{bar("w-full")}{bar("w-4/5")}{bar("w-3/5")}</div>}
        </div>
      </div>
    );
  }

  if (note.layout === "minimal") {
    return (
      <div className="flex h-full w-full flex-col justify-center px-6 py-6">
        {step >= 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-[12px] font-semibold tracking-wide text-ink">{note.name}</p>
            <p className="mt-0.5 text-[7.5px] uppercase tracking-[0.15em] text-ink/50">{note.role}</p>
          </motion.div>
        )}
        {step >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-1.5">
            {bar("w-full")}{bar("w-5/6")}
          </motion.div>
        )}
        {step >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-baseline justify-between text-[8px]">
            <span className="font-medium text-ink/80">{note.entry}</span>
            <span className="text-ink/40">{note.date}</span>
          </motion.div>
        )}
        {step >= 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 space-y-1.5">
            {bar("w-full")}{bar("w-3/5")}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full w-full p-5">
      {step >= 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-[12px] font-bold text-ink">{note.name}</p>
          {contactRow(false)}
        </motion.div>
      )}
      {step >= 2 && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
          <p className="border-b border-ink/25 pb-0.5 text-[8px] font-bold text-ink">Summary</p>
          <div className="mt-1.5 space-y-1">{bar("w-full")}{bar("w-4/5")}</div>
        </motion.div>
      )}
      {step >= 3 && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
          <p className="border-b border-ink/25 pb-0.5 text-[8px] font-bold text-ink">Experience</p>
          <div className="mt-1.5 flex items-baseline justify-between text-[8px]">
            <span className="font-bold text-ink/90">{note.entry}</span>
            <span className="text-ink/50">{note.date}</span>
          </div>
        </motion.div>
      )}
      {step >= 4 && <div className="mt-1.5 space-y-1">{bar("w-full")}{bar("w-3/5")}</div>}
    </div>
  );
}

export function EnvelopeReveal() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let i = -1;
    let cancelled = false;
    function cycle() {
      if (cancelled) return;
      i = (i + 1) % NOTES.length;
      setActiveIndex(i);
      setTimeout(() => {
        if (cancelled) return;
        setActiveIndex(null);
        setTimeout(cycle, 400);
      }, STEPS * STEP_MS + HOLD_MS);
    }
    const t = setTimeout(cycle, 500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  const note = activeIndex !== null ? NOTES[activeIndex] : null;

  return (
    <div className="relative flex h-[500px] w-full items-center justify-center">
      <div className="absolute bottom-10 left-1/2 h-[170px] w-[320px] -translate-x-1/2">
        <div className="absolute inset-0 rounded-xl border border-ink-line bg-gradient-to-b from-white to-canvas-soft shadow-card" />
        <div className="absolute inset-x-0 bottom-0 h-[3px] rounded-b-xl bg-gradient-to-r from-cobalt via-cobalt-soft to-gold" />
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "160px solid transparent",
            borderRight: "160px solid transparent",
            borderTop: "82px solid #F1EFE8",
            filter: "drop-shadow(0 1px 0 rgba(24,27,34,0.06))",
          }}
        />
        <div className="absolute inset-0 rounded-xl border border-ink-line" />
        <div className="absolute left-1/2 top-[68px] flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-cobalt to-cobalt-dim shadow-card">
          <FileText size={14} className="text-white" />
        </div>
      </div>

      <div className="absolute bottom-[128px] left-1/2 -translate-x-1/2" style={{ perspective: "1200px" }}>
        <AnimatePresence mode="wait">
          {note && (
            <motion.div
              key={activeIndex}
              initial={{ y: 90, opacity: 0, scale: 0.7, rotateX: -12 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ y: 40, opacity: 0, scale: 0.85, transition: { duration: 0.35 } }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="h-[300px] w-[240px] overflow-hidden rounded-lg border border-ink-line bg-white shadow-card"
            >
              <div className="h-[3px] w-full bg-gradient-to-r from-cobalt via-cobalt-soft to-gold" />
              <div className="paper-surface h-full font-doc text-ink/85">
                <NoteCard note={note} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}