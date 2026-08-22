import { motion } from "framer-motion";
import { Eye, FileType2, ShieldCheck, RefreshCcw, Download, LayoutGrid } from "lucide-react";

const FEATURES = [
  { icon: Eye, title: "Live typeset preview", desc: "See the exact layout — fonts, spacing, section order — update as you type. No surprises at export." },
  { icon: LayoutGrid, title: "Structured, not freeform", desc: "Six fixed sections in the right order every time: Summary, Education, Skills, Experience, Projects, Achievements." },
  { icon: FileType2, title: "Real Google Doc output", desc: "Not a flattened image — a genuine, editable Google Doc you can keep refining after export." },
  { icon: Download, title: "PDF, instantly", desc: "One click gets you a downloadable PDF alongside the doc — ready to attach and send." },
  { icon: RefreshCcw, title: "Edit in place", desc: "Logged-in resumes update the same saved record — no clutter of duplicate versions on your dashboard." },
  { icon: ShieldCheck, title: "Guest mode, zero storage", desc: "Don't want an account? Build and export with nothing saved — not your data, not the resume." },
];

export function WhatsInside() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 sm:px-10">
      <p className="eyebrow mb-3 text-center">What's Inside</p>
      <h2 className="text-center font-display text-2xl font-semibold text-slate-bright sm:text-3xl">
        Everything a resume tool should do — nothing it shouldn't.
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: (i % 3) * 0.08, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-ink-line bg-white p-6 shadow-card transition-shadow duration-300 hover:shadow-glow"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-cobalt/30 bg-cobalt/10 text-cobalt">
              <f.icon size={17} />
            </div>
            <h3 className="font-display text-base font-semibold text-slate-bright">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}