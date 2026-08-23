import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileEdit, UserCircle2, ArrowRight, ShieldOff, Save } from "lucide-react";

const PATHS = [
  {
    key: "guest",
    to: "/guest/build",
    icon: FileEdit,
    title: "Build as guest",
    desc: "Fill the form, generate your resume, download it. Nothing about you is stored — not your data, not the resume.",
    tag: "No account · Nothing saved",
    tagIcon: ShieldOff,
    accent: "cobalt" as const,
  },
  {
    key: "account",
    to: "/auth",
    icon: UserCircle2,
    title: "Sign in / Create account",
    desc: "Your resumes are saved to a dashboard. Come back anytime to edit, regenerate, or start a new one.",
    tag: "Saved to your dashboard",
    tagIcon: Save,
    accent: "gold" as const,
  },
];

export function StudioEntryPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <p className="eyebrow mb-3">Resume Studio</p>
        <h1 className="font-display text-3xl font-semibold text-slate-bright sm:text-4xl">
          How do you want to build?
        </h1>
        <p className="mt-3 text-sm text-slate">Two paths. Pick the one that fits.</p>
      </motion.div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
        {PATHS.map((p, i) => (
          <motion.button
            key={p.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i }}
            whileHover={{ y: -3 }}
            onClick={() => navigate(p.to)}
            className={
              "group relative flex flex-col items-start overflow-hidden rounded-2xl border border-ink-line bg-white text-left shadow-card transition-shadow duration-300 " +
              (p.accent === "cobalt"
                ? "hover:shadow-glow"
                : "hover:shadow-[0_0_0_1px_rgba(169,128,63,0.35),0_8px_28px_-8px_rgba(169,128,63,0.35)]")
            }
          >
            <div className={"h-[3px] w-full " + (p.accent === "cobalt" ? "bg-gradient-to-r from-cobalt to-cobalt-soft" : "bg-gradient-to-r from-gold to-gold-soft")} />
            <div className="flex flex-col items-start p-7">
            <div
              className={
                "mb-5 flex h-11 w-11 items-center justify-center rounded-full border " +
                (p.accent === "cobalt"
                  ? "border-cobalt/30 bg-cobalt/10 text-cobalt-soft"
                  : "border-gold/30 bg-gold/10 text-gold-soft")
              }
            >
              <p.icon size={19} />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-bright">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">{p.desc}</p>

            <div className="mt-5 flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-slate">
              <p.tagIcon size={12} />
              {p.tag}
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-slate-bright opacity-0 transition-opacity group-hover:opacity-100">
              Continue <ArrowRight size={14} />
            </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}