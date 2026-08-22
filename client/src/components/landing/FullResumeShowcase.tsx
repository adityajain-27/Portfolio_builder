import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, Linkedin, Github, Radio } from "lucide-react";

const DEMO = {
  name: "Ananya Verma",
  summary: "A software engineer who enjoys turning ambiguous problems into shipped, reliable products.",
  education: { institution: "Delhi Technological University", degree: "B.Tech, Computer Science", score: "8.7 CGPA", date: "2021 — 2025" },
  skills: [
    ["Programming Languages", "JavaScript, Python, Go"],
    ["Query Languages", "SQL, MongoDB Query Language"],
    ["Web Technologies", "React, Node.js, REST APIs"],
    ["Developer Tools", "Git, Docker, Postman"],
    ["Frameworks and Libraries", "Express, FastAPI, Tailwind CSS"],
    ["Platforms", "AWS, Vercel, Linux"],
  ],
  experience: {
    company: "Devnovate",
    role: "Software Engineer Intern",
    location: "Remote",
    date: "May 2025 — Aug 2025",
    bullets: [
      "Built and shipped 3 internal tools used daily by the ops team.",
      "Reduced API response time by 35% through query optimization.",
      "Wrote integration tests, raising coverage from 40% to 78%.",
    ],
  },
  project: {
    name: "Resume Studio",
    tech: "React · FastAPI · MongoDB",
    bullets: [
      "Designed a live-preview resume builder that generates real Google Docs.",
      "Implemented JWT auth and a password-gated guest mode.",
    ],
  },
  achievements: ["Finalist, Smart India Hackathon 2024", "Contributed to 2 open-source repos with 500+ combined stars"],
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export function FullResumeShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative z-10 mx-auto max-w-5xl px-6 pb-24 sm:px-10">
      <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="eyebrow mb-3 text-center">
        The Template
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="text-center font-display text-2xl font-semibold text-slate-bright sm:text-3xl"
      >
        Watch a full resume come together.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.05 }}
        className="mx-auto mt-3 max-w-lg text-center text-sm text-slate"
      >
        This is exactly the structure your resume will follow — same sections, same order, same
        typography as the real generated document.
      </motion.p>

      <div className="mt-12 overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card">
        <div className="h-[3px] w-full bg-gradient-to-r from-cobalt via-cobalt-soft to-gold" />
        <div className="flex items-center justify-between border-b border-ink-line px-5 py-3">
          <span className="eyebrow">Live Preview</span>
          <span className="flex items-center gap-1.5 rounded-full border border-ink-line bg-canvas px-2.5 py-1 font-mono text-[10px] tracking-wide text-slate">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobalt/50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cobalt" />
            </span>
            <Radio size={10} className="text-cobalt" />
            Live
          </span>
        </div>

        <div className="bg-canvas-soft p-6 sm:p-10">
          <div className="paper-surface relative mx-auto w-full max-w-[760px] overflow-hidden rounded-sm p-10 font-doc text-[13px] leading-relaxed text-ink/85 sm:p-14">
            <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <span className="rotate-[-22deg] select-none whitespace-nowrap font-display text-[90px] font-semibold text-ink/[0.025] sm:text-[130px]">
                SKILLCRED
              </span>
            </div>

            <div className="relative">
              <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} transition={{ duration: 0.4 }} className="text-center">
                <h3 className="text-2xl font-bold tracking-wide text-ink">{DEMO.name}</h3>
                <p className="mt-1.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-ink/80">
                  <span className="inline-flex items-center gap-1"><Phone size={10} /> Phone</span>
                  <span className="inline-flex items-center gap-1 text-cobalt-dim underline underline-offset-2"><Mail size={10} /> Email</span>
                  <span className="inline-flex items-center gap-1 text-cobalt-dim underline underline-offset-2"><Linkedin size={10} /> LinkedIn</span>
                  <span className="inline-flex items-center gap-1 text-cobalt-dim underline underline-offset-2"><Github size={10} /> GitHub</span>
                </p>
              </motion.div>

              <Block delay={0.15} inView={inView} title="Summary">
                <p className="italic text-ink/80">{DEMO.summary}</p>
              </Block>

              <Block delay={0.25} inView={inView} title="Education">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-ink">{DEMO.education.institution}</span>
                  <span className="font-bold text-ink/70">{DEMO.education.date}</span>
                </div>
                <p className="italic text-ink/70">{DEMO.education.degree} · {DEMO.education.score}</p>
              </Block>

              <Block delay={0.35} inView={inView} title="Technical Skills">
                {DEMO.skills.map(([label, val]) => (
                  <p key={label} className="text-ink/85">
                    <span className="font-bold text-ink">{label}:</span> {val}
                  </p>
                ))}
              </Block>

              <Block delay={0.5} inView={inView} title="Experience">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-ink">{DEMO.experience.company}</span>
                  <span className="font-bold text-ink/70">{DEMO.experience.date}</span>
                </div>
                <p className="italic text-ink/70">{DEMO.experience.role} · {DEMO.experience.location}</p>
                <ul className="ml-4 mt-1 list-disc space-y-0.5 text-ink/80">
                  {DEMO.experience.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </Block>

              <Block delay={0.65} inView={inView} title="Projects">
                <p>
                  <span className="font-bold text-ink">{DEMO.project.name}</span>
                  <span className="italic text-ink/70"> | {DEMO.project.tech}</span>{" "}
                  <span className="text-cobalt-dim underline underline-offset-2">View Project</span>
                </p>
                <ul className="ml-4 mt-1 list-disc space-y-0.5 text-ink/80">
                  {DEMO.project.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </Block>

              <Block delay={0.78} inView={inView} title="Achievements">
                <ul className="ml-4 list-disc space-y-0.5 text-ink/80">
                  {DEMO.achievements.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </Block>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Block({ title, children, delay, inView }: { title: string; children: React.ReactNode; delay: number; inView: boolean }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} transition={{ duration: 0.4, delay }} className="mt-4">
      <p className="border-b border-ink/25 pb-0.5 text-[13px] font-bold text-ink">{title}</p>
      <div className="mt-1.5">{children}</div>
    </motion.div>
  );
}