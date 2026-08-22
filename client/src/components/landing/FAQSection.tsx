import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Do I need an account to try it?",
    a: "No. Guest mode lets you build and export a resume with nothing stored — no email, no database entry, nothing saved once you close the tab.",
  },
  {
    q: "What do I get when I log in?",
    a: "A dashboard where every resume you generate is saved, editable in place, and re-exportable any time — instead of starting from scratch.",
  },
  {
    q: "What format do I actually get?",
    a: "A real Google Doc (so you can keep editing it) plus a downloadable PDF, generated from the exact same template you see in the live preview.",
  },
  {
    q: "Why is access password-protected?",
    a: "The studio is currently invite-only while it's being refined — the password gate keeps it limited to people who've been given access.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 sm:px-10">
      <p className="eyebrow mb-3 text-center">Questions</p>
      <h2 className="text-center font-display text-2xl font-semibold text-slate-bright">
        Before you start
      </h2>

      <div className="mt-8 divide-y divide-ink-line rounded-2xl border border-ink-line bg-white shadow-card">
        {FAQS.map((f, i) => (
          <div key={f.q}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4.5 text-left"
            >
              <span className="text-sm font-medium text-slate-bright">{f.q}</span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-slate transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-4.5 text-sm leading-relaxed text-slate">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}