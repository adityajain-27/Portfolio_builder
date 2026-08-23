import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Linkedin, Github } from "lucide-react";

const NOTES = [
  { name: "Ananya Verma", role: "Software Engineer", entry: "Devnovate", date: "2024—25", rotate: -6 },
  { name: "Rohan Malhotra", role: "Backend Engineer", entry: "Cloudline", date: "2023—25", rotate: 4 },
  { name: "Ishita Rao", role: "Product Designer", entry: "Northbeam", date: "2022—25", rotate: -3 },
  { name: "Kabir Sethi", role: "Growth Marketer", entry: "Lattice", date: "2023—25", rotate: 5 },
];

function Note({ note, fanIndex }: { note: (typeof NOTES)[number]; fanIndex: number }) {
  const xOffset = (fanIndex - 1.5) * 46;
  return (
    <motion.div
      initial={{ y: 60, opacity: 0, scale: 0.55, rotate: 0, x: 0 }}
      animate={{ y: -150 - fanIndex * 6, opacity: 1, scale: 1, rotate: note.rotate, x: xOffset }}
      exit={{ y: -190, opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-0 left-1/2 h-[220px] w-[170px] -translate-x-1/2 overflow-hidden rounded-md border border-ink-line bg-white shadow-card"
      style={{ zIndex: 10 + fanIndex }}
    >
      <div className="h-[2px] w-full bg-gradient-to-r from-cobalt via-cobalt-soft to-gold" />
      <div className="paper-surface h-full p-4 font-doc text-[8px] leading-relaxed text-ink/85">
        <div className="text-center">
          <p className="text-[11px] font-bold text-ink">{note.name}</p>
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-x-1 text-[7px] text-ink/60">
            <span className="inline-flex items-center gap-0.5"><Phone size={6} /></span>
            <span className="inline-flex items-center gap-0.5 text-cobalt-dim"><Mail size={6} /></span>
            <span className="inline-flex items-center gap-0.5 text-cobalt-dim"><Linkedin size={6} /></span>
            <span className="inline-flex items-center gap-0.5 text-cobalt-dim"><Github size={6} /></span>
          </p>
        </div>
        <div className="mt-2">
          <p className="border-b border-ink/25 pb-0.5 text-[7px] font-bold text-ink">Summary</p>
          <div className="mt-1 h-1 w-full rounded-full bg-ink/10" />
          <div className="mt-1 h-1 w-4/5 rounded-full bg-ink/10" />
        </div>
        <div className="mt-2">
          <p className="border-b border-ink/25 pb-0.5 text-[7px] font-bold text-ink">Experience</p>
          <div className="mt-1 flex items-baseline justify-between text-[7px]">
            <span className="font-bold text-ink/90">{note.entry}</span>
            <span className="text-ink/60">{note.date}</span>
          </div>
          <div className="mt-1 h-1 w-full rounded-full bg-ink/10" />
          <div className="mt-1 h-1 w-3/5 rounded-full bg-ink/10" />
        </div>
      </div>
    </motion.div>
  );
}

export function EnvelopeReveal() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let i = 0;
    let cancelled = false;
    function step() {
      if (cancelled) return;
      i = i >= NOTES.length ? 0 : i + 1;
      setVisibleCount(i);
      const delay = i === 0 ? 900 : 750;
      setTimeout(step, delay);
    }
    const t = setTimeout(step, 500);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="relative flex h-[460px] w-full items-center justify-center">
      <div className="absolute bottom-8 left-1/2 h-[150px] w-[280px] -translate-x-1/2">
        <div className="absolute inset-0 rounded-lg border border-ink-line bg-canvas-soft shadow-card" />
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "140px solid transparent",
            borderRight: "140px solid transparent",
            borderTop: "70px solid #F6F6F3",
          }}
        />
        <div className="absolute inset-0 rounded-lg border border-ink-line" />
      </div>

      <AnimatePresence>
        {NOTES.slice(0, visibleCount).map((note, idx) => (
          <Note key={note.name} note={note} fanIndex={idx} />
        ))}
      </AnimatePresence>
    </div>
  );
}