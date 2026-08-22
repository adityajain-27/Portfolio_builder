import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Repeat2, Rocket } from "lucide-react";

const AUDIENCE = [
  { icon: GraduationCap, title: "Students & freshers", desc: "Turn coursework, projects, and internships into a structured, recruiter-ready format." },
  { icon: Briefcase, title: "Working professionals", desc: "Keep a polished resume on hand, updated in minutes whenever a new role comes up." },
  { icon: Repeat2, title: "Career switchers", desc: "Reframe past experience clearly for a new domain without wrestling with formatting." },
  { icon: Rocket, title: "Founders & builders", desc: "Show projects and impact with a layout that reads clean on paper and on screen." },
];

export function WhoItsFor() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 sm:px-10">
      <p className="eyebrow mb-3 text-center">Who It's For</p>
      <h2 className="text-center font-display text-2xl font-semibold text-slate-bright sm:text-3xl">
        Built for anyone who needs a resume, fast.
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCE.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-2xl border border-ink-line bg-canvas-soft p-6 text-center"
          >
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
              <a.icon size={19} />
            </div>
            <h3 className="font-display text-sm font-semibold text-slate-bright">{a.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate">{a.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}