import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const CARDS = [
  {
    name: "Rohan Malhotra",
    tag: "Backend Engineer",
    summary: "Backend engineer specializing in distributed systems and API design.",
    entry: "Staff Engineer — Cloudline",
    rotate: -4,
  },
  {
    name: "Ishita Rao",
    tag: "Product Designer",
    summary: "Product designer focused on research-driven, accessible interfaces.",
    entry: "Design Lead — Northbeam",
    rotate: 2,
  },
  {
    name: "Kabir Sethi",
    tag: "Growth Marketer",
    summary: "Growth marketer who scales acquisition through experimentation.",
    entry: "Marketing Manager — Lattice",
    rotate: -1,
  },
];

export function TemplateGallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative z-10 mx-auto max-w-6xl px-6 pb-8 sm:px-10">
      <p className="eyebrow mb-3 text-center">One Template, Every Career</p>
      <h2 className="text-center font-display text-2xl font-semibold text-slate-bright sm:text-3xl">
        The same clean layout — built for any resume.
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-center text-sm text-slate">
        Engineer, designer, marketer — the structure holds up no matter what you fill it with.
      </p>

      <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            animate={inView ? { opacity: 1, y: 0, rotate: c.rotate } : {}}
            whileHover={{ rotate: 0, y: -8, scale: 1.03 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            className="w-64 shrink-0 overflow-hidden rounded-lg border border-ink-line bg-white shadow-card"
            style={{ transformOrigin: "bottom center" }}
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-cobalt via-cobalt-soft to-gold" />
            <div className="paper-surface p-5 font-doc text-[10px] leading-relaxed text-ink/85">
              <div className="text-center">
                <h3 className="text-sm font-bold text-ink">{c.name}</h3>
                <p className="mt-0.5 text-[9px] text-ink/60">{c.tag}</p>
              </div>
              <div className="mt-3">
                <p className="border-b border-ink/25 pb-0.5 text-[10px] font-bold text-ink">Summary</p>
                <p className="mt-1 italic text-ink/75">{c.summary}</p>
              </div>
              <div className="mt-3">
                <p className="border-b border-ink/25 pb-0.5 text-[10px] font-bold text-ink">Experience</p>
                <p className="mt-1 font-bold text-ink/90">{c.entry}</p>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-ink/10" />
                <div className="mt-1 h-1.5 w-4/5 rounded-full bg-ink/10" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}