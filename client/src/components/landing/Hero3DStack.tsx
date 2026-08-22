import { motion } from "framer-motion";
import { Phone, Mail, Linkedin, Github } from "lucide-react";

export function Hero3DStack() {
  return (
    <div className="relative flex h-[460px] w-full items-center justify-center" style={{ perspective: "1400px" }}>
      <motion.div
        className="absolute h-[380px] w-[280px] rounded-lg border border-ink-line bg-white shadow-card"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateY: -18, rotateX: 6, x: -70, y: 18, opacity: 0 }}
        animate={{ rotateY: [-18, -14, -18], rotateX: [6, 3, 6], x: -70, y: [18, 10, 18], opacity: 1 }}
        transition={{ opacity: { duration: 0.6 }, default: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
      >
        <div className="h-full w-full space-y-2 p-6 opacity-40">
          <div className="mx-auto h-2.5 w-2/3 rounded-full bg-ink/15" />
          <div className="mx-auto mt-1 h-1.5 w-1/3 rounded-full bg-ink/10" />
          <div className="mt-6 h-1.5 w-full rounded-full bg-ink/10" />
          <div className="h-1.5 w-5/6 rounded-full bg-ink/10" />
          <div className="h-1.5 w-4/6 rounded-full bg-ink/10" />
        </div>
      </motion.div>

      <motion.div
        className="absolute h-[380px] w-[280px] rounded-lg border border-ink-line bg-white shadow-card"
        initial={{ rotateY: 14, rotateX: -4, x: 60, y: -10, opacity: 0 }}
        animate={{ rotateY: [14, 18, 14], rotateX: [-4, -6, -4], x: 60, y: [-10, -2, -10], opacity: 1 }}
        transition={{ opacity: { duration: 0.6, delay: 0.1 }, default: { duration: 9, repeat: Infinity, ease: "easeInOut" } }}
      >
        <div className="h-full w-full space-y-2 p-6 opacity-50">
          <div className="mx-auto h-2.5 w-2/3 rounded-full bg-ink/15" />
          <div className="mx-auto mt-1 h-1.5 w-1/3 rounded-full bg-ink/10" />
          <div className="mt-6 h-1.5 w-full rounded-full bg-ink/10" />
          <div className="h-1.5 w-5/6 rounded-full bg-ink/10" />
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 h-[400px] w-[300px] overflow-hidden rounded-lg border border-ink-line bg-white shadow-card"
        initial={{ opacity: 0, y: 24, rotateX: 4 }}
        animate={{ opacity: 1, y: [0, -10, 0], rotateX: [4, 1, 4] }}
        transition={{ opacity: { duration: 0.6, delay: 0.2 }, default: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-cobalt via-cobalt-soft to-gold" />
        <div className="paper-surface h-full p-6 font-doc text-[10px] leading-relaxed text-ink/85">
          <div className="text-center">
            <p className="text-sm font-bold text-ink">Ananya Verma</p>
            <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2 text-[9px] text-ink/70">
              <span className="inline-flex items-center gap-0.5"><Phone size={8} /> Phone</span>
              <span className="inline-flex items-center gap-0.5 text-cobalt-dim"><Mail size={8} /> Email</span>
              <span className="inline-flex items-center gap-0.5 text-cobalt-dim"><Linkedin size={8} /> LinkedIn</span>
              <span className="inline-flex items-center gap-0.5 text-cobalt-dim"><Github size={8} /> GitHub</span>
            </p>
          </div>
          <div className="mt-3">
            <p className="border-b border-ink/25 pb-0.5 text-[9px] font-bold text-ink">Summary</p>
            <p className="mt-1 italic text-ink/70">Software engineer who ships fast, reliable product surfaces.</p>
          </div>
          <div className="mt-3">
            <p className="border-b border-ink/25 pb-0.5 text-[9px] font-bold text-ink">Experience</p>
            <div className="mt-1 flex items-baseline justify-between text-[9px]">
              <span className="font-bold text-ink/90">Devnovate</span>
              <span className="text-ink/60">2024—25</span>
            </div>
            <div className="mt-1.5 h-1 w-full rounded-full bg-ink/10" />
            <div className="mt-1 h-1 w-4/5 rounded-full bg-ink/10" />
            <div className="mt-1 h-1 w-3/5 rounded-full bg-ink/10" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}