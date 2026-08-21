import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  UserCircle2,
  FileEdit,
  PenSquare,
  Eye,
  Download,
} from "lucide-react";
import { GateModal } from "@/components/GateModal";
import { Button } from "@/components/ui/Button";
import { useGateStore } from "@/store/gateStore";

const DEMO_PERSONAS = [
  {
    name: "Aditya Sharma",
    role: "Full-Stack Engineer",
    summary: "Full-stack engineer focused on shipping fast, reliable product surfaces.",
    section: "Experience",
    entry: "Senior Developer — Devnovate",
    date: "2024 — Present",
    bullets: ["Led migration to a service-oriented backend, cutting p95 latency 40%.", "Shipped a design system used across 6 product teams."],
  },
  {
    name: "Meher Kaur",
    role: "Product Designer",
    summary: "Product designer who turns fuzzy problems into shipped, measurable design.",
    section: "Projects",
    entry: "Studio — Design system for a fintech app",
    date: "React · Figma",
    bullets: ["Cut onboarding drop-off by 22% through a redesigned flow.", "Built and documented a 40-component design system."],
  },
];

function DocShowcase() {
  const [personaIdx, setPersonaIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const persona = DEMO_PERSONAS[personaIdx];
  const totalLines = 4 + persona.bullets.length;

  useEffect(() => {
    if (lineIdx < totalLines) {
      const t = setTimeout(() => setLineIdx((v) => v + 1), 380);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPersonaIdx((v) => (v + 1) % DEMO_PERSONAS.length);
      setLineIdx(0);
    }, 2200);
    return () => clearTimeout(t);
  }, [lineIdx, totalLines]);

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card">
      <div className="h-[3px] w-full bg-gradient-to-r from-cobalt via-cobalt-soft to-gold" />
      <div className="flex items-center justify-between border-b border-ink-line px-4 py-2.5">
        <span className="eyebrow">Live Preview</span>
        <span className="flex items-center gap-1.5 rounded-full border border-ink-line bg-canvas px-2 py-0.5 font-mono text-[9px] tracking-wide text-slate">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobalt/50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cobalt" />
          </span>
          Live
        </span>
      </div>

      <div className="bg-canvas-soft p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={personaIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="paper-surface min-h-[280px] rounded-sm p-6 font-doc text-[11px] leading-relaxed text-ink/85"
          >
            {lineIdx >= 1 && (
              <div className="animate-type-settle text-center">
                <h3 className="text-base font-bold text-ink">{persona.name}</h3>
                <p className="mt-0.5 text-[10px] text-ink/60">{persona.role}</p>
              </div>
            )}
            {lineIdx >= 2 && (
              <div className="animate-type-settle mt-3">
                <p className="border-b border-ink/25 pb-0.5 text-[11px] font-bold text-ink">Summary</p>
                <p className="mt-1 italic text-ink/75">{persona.summary}</p>
              </div>
            )}
            {lineIdx >= 3 && (
              <div className="animate-type-settle mt-3">
                <p className="border-b border-ink/25 pb-0.5 text-[11px] font-bold text-ink">{persona.section}</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-bold text-ink">{persona.entry}</span>
                  <span className="font-bold text-ink/60">{persona.date}</span>
                </div>
              </div>
            )}
            {persona.bullets.map((b, i) => (
              lineIdx >= 4 + i && (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-4 mt-1 list-disc text-ink/75 before:mr-1.5 before:content-['•']"
                >
                  {b}
                </motion.p>
              )
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [gateOpen, setGateOpen] = useState(false);
  const [intendedPath, setIntendedPath] = useState<string>("/enter");
  const unlocked = useGateStore((s) => s.isUnlocked());
  const navigate = useNavigate();

  function goTo(path: string) {
    if (unlocked) {
      navigate(path);
    } else {
      setIntendedPath(path);
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
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="sm" onClick={() => goTo("/guest/build")} className="hidden sm:inline-flex">
            <FileEdit size={14} /> Try as guest
          </Button>
          <Button variant="outline" size="sm" onClick={() => goTo("/auth")}>
            <UserCircle2 size={14} /> Log in
          </Button>
          <Button size="sm" onClick={() => goTo("/guest/build")} className="sm:hidden">
            Start <ArrowRight size={14} />
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 pt-6 sm:px-10 lg:flex-row lg:items-center lg:gap-16 lg:pt-16">
        <div className="max-w-xl">
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="eyebrow mb-5">
            Resume Studio · Document Generation
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl font-semibold leading-[1.1] text-slate-bright sm:text-5xl"
          >
            Every resume, <span className="text-cobalt italic">typeset</span> to perfection.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-base leading-relaxed text-slate"
          >
            A private studio for building resumes that read like they were laid out by hand —
            structured, ATS-clean, and generated as a real Google Doc + PDF in seconds. Access is
            by invitation only.
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

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" onClick={() => goTo("/enter")}>
              Enter the studio <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => goTo("/guest/build")}>
              Try without an account
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16 flex flex-1 justify-center lg:mt-0"
        >
          <div className="animate-float-slow">
            <DocShowcase />
          </div>
        </motion.div>
      </main>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24 sm:px-10">
        <p className="eyebrow mb-3 text-center">How it works</p>
        <h2 className="text-center font-display text-2xl font-semibold text-slate-bright">
          Three steps. One clean document.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            { icon: PenSquare, title: "Fill the form", desc: "Guided steps for basics, experience, projects, and skills — nothing extra." },
            { icon: Eye, title: "Watch it typeset", desc: "A live preview updates as you type, laid out exactly like the final document." },
            { icon: Download, title: "Export instantly", desc: "One click generates a real Google Doc and a downloadable PDF, ready to send." },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i }}
              className="rounded-2xl border border-ink-line bg-white p-6 shadow-card"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-cobalt/30 bg-cobalt/10 text-cobalt">
                <Icon size={17} />
              </div>
              <h3 className="font-display text-base font-semibold text-slate-bright">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-grain" />

      <GateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        onUnlocked={() => {
          setGateOpen(false);
          navigate(intendedPath);
        }}
      />
    </div>
  );
}