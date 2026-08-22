import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Phone, Mail, Linkedin, Github } from "lucide-react";
import type { ResumeData } from "@/types/resume";

// Matches the exact labels used in the real Google Doc template
// (server/apps_script — {{SKILL_PROGRAMMING}}, {{SKILL_QUERY}}, etc.)
const SKILL_LABELS: Record<string, string> = {
  programming: "Programming Languages",
  query: "Query Languages",
  web: "Web Technologies",
  tools: "Developer Tools",
  frameworks: "Frameworks and Libraries",
  platforms: "Platforms",
};

export function LivePreview({ data }: { data: ResumeData }) {
  const skillLines = Object.entries(data.skills).filter(([, v]) => v.trim());

  // Section order mirrors the real template exactly:
  // Summary → Education → Technical Skills → Experience → Projects → Achievements
  const sections = useMemo(() => {
    const list: { key: string; title: string; node: React.ReactNode }[] = [];

    if (data.summary) {
      list.push({ key: "summary", title: "Summary", node: <p className="italic text-ink/80">{data.summary}</p> });
    }

    if (data.education.length > 0) {
      list.push({
        key: "education",
        title: "Education",
        node: data.education.map((ed, i) => (
          <div key={i} className="mb-1.5">
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-ink">{ed.institution || "Institution"}</span>
              <span className="font-bold text-ink/70">{ed.date}</span>
            </div>
            <p className="italic text-ink/70">
              {ed.degree}
              {ed.score ? `  ·  ${ed.score}` : ""}
            </p>
          </div>
        )),
      });
    }

    if (skillLines.length > 0) {
      list.push({
        key: "skills",
        title: "Technical Skills",
        node: skillLines.map(([k, v]) => (
          <p key={k} className="text-ink/85">
            <span className="font-bold text-ink">{SKILL_LABELS[k] ?? k}:</span> {v}
          </p>
        )),
      });
    }

    if (data.experience.length > 0) {
      list.push({
        key: "experience",
        title: "Experience",
        node: data.experience.map((ex, i) => (
          <div key={i} className="mb-2.5">
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-ink">{ex.company || "Company"}</span>
              <span className="font-bold text-ink/70">{ex.date}</span>
            </div>
            <p className="italic text-ink/70">
              {ex.role}
              {ex.location ? `  ·  ${ex.location}` : ""}
            </p>
            {ex.bullets.filter(Boolean).length > 0 && (
              <ul className="ml-4 mt-1 list-disc space-y-0.5 text-ink/80">
                {ex.bullets.filter(Boolean).map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        )),
      });
    }

    if (data.projects.length > 0) {
      list.push({
        key: "projects",
        title: "Projects",
        node: data.projects.map((p, i) => (
          <div key={i} className="mb-2.5">
            <p>
              <span className="font-bold text-ink">{p.name || "Project name"}</span>
              {p.tech && <span className="italic text-ink/70"> | {p.tech}</span>}
              {p.link && (
                <>
                  {" "}
                  <span className="text-cobalt-dim underline underline-offset-2">View Project</span>
                </>
              )}
            </p>
            {p.bullets.filter(Boolean).length > 0 && (
              <ul className="ml-4 mt-1 list-disc space-y-0.5 text-ink/80">
                {p.bullets.filter(Boolean).map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        )),
      });
    }

    if (data.achievements.filter(Boolean).length > 0) {
      list.push({
        key: "achievements",
        title: "Achievements",
        node: (
          <ul className="ml-4 list-disc space-y-0.5 text-ink/80">
            {data.achievements.filter(Boolean).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        ),
      });
    }

    return list;
  }, [data, skillLines]);

  const hasContact = data.contact.email || data.contact.phone || data.contact.linkedin_url || data.contact.github_url;

  return (
    <div className="sticky top-8 w-full overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card">
      {/* Accent bar — signals "this is a live, generated document" */}
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

      {/* Recessed "page" area, matching the real doc's typography (serif, centered header) */}
      <div className="max-h-[80vh] overflow-y-auto bg-canvas-soft p-6 sm:p-9">
        <div className="paper-surface relative mx-auto min-h-[1000px] w-full max-w-[720px] overflow-hidden rounded-sm p-10 font-doc text-[13px] leading-relaxed text-ink/85 sm:p-14">
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="rotate-[-22deg] select-none whitespace-nowrap font-display text-[70px] font-semibold text-ink/[0.025] sm:text-[100px]">
              SKILLCRED
            </span>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={data.full_name || "untitled"}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <h2 className="text-xl font-bold tracking-wide text-ink">
                  {data.full_name || "Your Name"}
                </h2>
                {hasContact && (
                  <p className="mt-1.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-ink/80">
                    {data.contact.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone size={10} /> Phone
                      </span>
                    )}
                    {data.contact.email && (
                      <span className="inline-flex items-center gap-1 text-cobalt-dim underline underline-offset-2">
                        <Mail size={10} /> Email
                      </span>
                    )}
                    {data.contact.linkedin_url && (
                      <span className="inline-flex items-center gap-1 text-cobalt-dim underline underline-offset-2">
                        <Linkedin size={10} /> LinkedIn
                      </span>
                    )}
                    {data.contact.github_url && (
                      <span className="inline-flex items-center gap-1 text-cobalt-dim underline underline-offset-2">
                        <Github size={10} /> GitHub
                      </span>
                    )}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {sections.map((s) => (
              <Section key={s.key} title={s.title}>
                {s.node}
              </Section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="border-b border-ink/25 pb-0.5 text-[13px] font-bold text-ink">{title}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}