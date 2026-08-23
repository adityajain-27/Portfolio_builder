import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  UserCircle2,
  FileEdit,
  LayoutTemplate,
  ListChecks,
  Lock,
} from "lucide-react";
import { GateModal } from "@/components/GateModal";
import { Button } from "@/components/ui/Button";
import { useGateStore } from "@/store/gateStore";
import { FloatingBlobs } from "@/components/landing/FloatingBlobs";
import { EnvelopeReveal } from "@/components/landing/EnvelopeReveal";
import { MarqueeStrip } from "@/components/landing/MarqueeStrip";
import { WhatsInside } from "@/components/landing/WhatsInside";
import { TemplateGallery } from "@/components/landing/TemplateGallery";
import { FullResumeShowcase } from "@/components/landing/FullResumeShowcase";
import { WhoItsFor } from "@/components/landing/WhoItsFor";
import { FinalCTA } from "@/components/landing/FinalCTA";

const FACTS = [
  { icon: ListChecks, value: "6", label: "structured sections, always in the right order" },
  { icon: LayoutTemplate, value: "3", label: "steps from blank form to finished document" },
  { icon: Lock, value: "0", label: "data stored when you build as a guest" },
];

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
    <div className="relative min-h-screen overflow-hidden bg-white">
      <FloatingBlobs />

      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-slate-bright">
          <FileText size={18} className="text-cobalt" />
          Folio
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

      <main className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-16 pt-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6 lg:pt-14">
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

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-ink-line pt-6"
          >
            {FACTS.map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <div className="flex items-center gap-1.5 text-cobalt">
                  <Icon size={13} />
                  <span className="font-display text-xl font-semibold text-slate-bright">{value}</span>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-slate">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <EnvelopeReveal />
        </motion.div>
      </main>

      <MarqueeStrip />

      <WhatsInside />
      <TemplateGallery />
      <FullResumeShowcase />
      <WhoItsFor />
      <FinalCTA onEnter={() => goTo("/enter")} onGuest={() => goTo("/guest/build")} />

      <footer className="relative z-10 border-t border-ink-line px-6 py-8 text-center text-xs text-slate sm:px-10">
        Folio — private resume studio.
      </footer>

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