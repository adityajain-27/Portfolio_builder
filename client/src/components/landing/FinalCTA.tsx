import { motion } from "framer-motion";
import { ArrowRight, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCTA({ onEnter, onGuest }: { onEnter: () => void; onGuest: () => void }) {
  return (
    <section className="relative z-10 mx-auto max-w-4xl px-6 pb-28 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-ink-line bg-ink px-8 py-16 text-center shadow-card sm:px-16"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-64 w-64 animate-drift rounded-full bg-cobalt/20 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-64 w-64 animate-drift-slow rounded-full bg-gold/20 blur-3xl" />
        </div>
        <div className="relative">
          <p className="eyebrow mb-4 text-white/50">Ready when you are</p>
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Build a resume that reads like it was <span className="italic text-cobalt-soft">typeset</span>, not typed.
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={onEnter}>
              Build your resume <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="outline" onClick={onGuest} className="border-white/20 text-white hover:border-white/40 hover:bg-white/5">
              <FileEdit size={15} /> Try without an account
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}