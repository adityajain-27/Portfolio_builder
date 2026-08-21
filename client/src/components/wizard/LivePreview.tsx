import { motion, AnimatePresence } from "framer-motion";
import type { ResumeData } from "@/types/resume";

export function LivePreview({ data }: { data: ResumeData }) {
  const hasContact = data.contact.email || data.contact.phone || data.contact.linkedin_url || data.contact.github_url;
  const skillLines = Object.entries(data.skills).filter(([, v]) => v.trim());

  return (
    <div className="paper-surface sticky top-8 w-full rounded-sm p-8 font-mono text-[11px] leading-relaxed text-ink/85 sm:p-10">
      <AnimatePresence mode="wait">
        <motion.div key={data.full_name || "untitled"} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }}>
          <h2 className="font-display text-xl font-semibold text-ink">
            {data.full_name || "Your Name"}
          </h2>
          {hasContact && (
            <p className="mt-1 flex flex-wrap gap-x-3 text-[10px] text-cobalt-dim underline decoration-cobalt-dim/40 underline-offset-2">
              {data.contact.email && <span>Email</span>}
              {data.contact.phone && <span>Phone</span>}
              {data.contact.linkedin_url && <span>LinkedIn</span>}
              {data.contact.github_url && <span>GitHub</span>}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {data.summary && (
        <Section title="Summary">
          <p className="text-ink/75">{data.summary}</p>
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education">
          {data.education.map((ed, i) => (
            <Row key={i} left={ed.institution} right={ed.date} sub={`${ed.degree}${ed.score ? "  ·  " + ed.score : ""}`} />
          ))}
        </Section>
      )}

      {data.experience.length > 0 && (
        <Section title="Experience">
          {data.experience.map((ex, i) => (
            <div key={i} className="mb-2">
              <Row left={`${ex.role || "Role"} — ${ex.company || "Company"}`} right={ex.date} sub={ex.location} />
              {ex.bullets.filter(Boolean).length > 0 && (
                <ul className="ml-4 mt-1 list-disc space-y-0.5 text-ink/70">
                  {ex.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects">
          {data.projects.map((p, i) => (
            <div key={i} className="mb-2">
              <Row left={p.name} right={p.tech} />
              {p.bullets.filter(Boolean).length > 0 && (
                <ul className="ml-4 mt-1 list-disc space-y-0.5 text-ink/70">
                  {p.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {skillLines.length > 0 && (
        <Section title="Skills">
          {skillLines.map(([k, v]) => (
            <p key={k} className="text-ink/70">
              <span className="text-ink/90 capitalize">{k}:</span> {v}
            </p>
          ))}
        </Section>
      )}

      {data.achievements.filter(Boolean).length > 0 && (
        <Section title="Achievements">
          <ul className="ml-4 list-disc space-y-0.5 text-ink/70">
            {data.achievements.filter(Boolean).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="border-b border-ink/15 pb-1 text-[10px] tracking-widest text-gold-soft">
        {title.toUpperCase()}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Row({ left, right, sub }: { left: string; right?: string; sub?: string }) {
  return (
    <div className="mb-1">
      <div className="flex items-baseline justify-between">
        <span className="font-medium text-ink/90">{left}</span>
        {right && <span className="text-ink/50">{right}</span>}
      </div>
      {sub && <p className="text-ink/60">{sub}</p>}
    </div>
  );
}