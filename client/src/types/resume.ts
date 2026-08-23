import { z } from "zod";

// These limits mirror server/src/schemas/resume.py field-for-field.
// Keeping them in sync here means the wizard blocks bad input BEFORE
// a wasted round-trip to the API ever happens.
export const LIMITS = {
  full_name: 40,
  summary_words: 50, // enforced as a word count per product decision
  summary_chars: 220, // hard backend ceiling, kept as a safety net
  education: { max: 3, institution: 45, date: 25, degree: 55, score: 20 },
  experience: { max: 3, company: 45, date: 25, role: 55, location: 20 },
  // Fixed bullet slots per template — not free-add. Slot index (1-based) -> bullet count.
  experienceBulletSlots: { 1: 4, 2: 2, 3: 4 } as Record<number, number>,
  projects: { max: 2, name: 30, tech: 45, bulletsPerProject: 2 },
  skillsField: 110,
  achievements: { max: 2 },
} as const;

// NOTE ON LIMITS: the numbers in LIMITS are *soft, advisory* limits — they tell
// the user roughly how much text fits cleanly in the generated layout. They are
// intentionally NOT enforced as blocking validation here (see `clampResumeToLimits`
// below for where the hard ceiling actually gets applied, right before an API call).
// Going over a soft limit should show a warning in the UI, never trap the user on
// a step. Only genuinely required fields (a name, a valid email) block navigation.
const educationEntry = z.object({
  institution: z.string().default(""),
  date: z.string().default(""),
  degree: z.string().default(""),
  score: z.string().default(""),
});

const experienceEntry = z.object({
  company: z.string().default(""),
  date: z.string().default(""),
  role: z.string().default(""),
  location: z.string().default(""),
  bullets: z.array(z.string()).default([]),
});

const projectEntry = z.object({
  name: z.string().default(""),
  tech: z.string().default(""),
  link: z.string().optional().default(""),
  bullets: z.array(z.string()).default([]),
});

export const resumeSchema = z.object({
  full_name: z.string().min(1, "Required"),
  summary: z.string().default(""),
  contact: z.object({
    phone: z.string().default(""),
    email: z.string().email("Invalid email").or(z.literal("")).default(""),
    linkedin_url: z.string().default(""),
    github_url: z.string().default(""),
  }),
  education: z.array(educationEntry).max(LIMITS.education.max),
  skills: z.object({
    programming: z.string().default(""),
    query: z.string().default(""),
    web: z.string().default(""),
    tools: z.string().default(""),
    frameworks: z.string().default(""),
    platforms: z.string().default(""),
  }),
  experience: z.array(experienceEntry).max(LIMITS.experience.max),
  projects: z.array(projectEntry).max(LIMITS.projects.max),
  achievements: z.array(z.string()).max(LIMITS.achievements.max),
});

export type ResumeData = z.infer<typeof resumeSchema>;

export const emptyResume: ResumeData = {
  full_name: "",
  summary: "",
  contact: { phone: "", email: "", linkedin_url: "", github_url: "" },
  education: [],
  skills: { programming: "", query: "", web: "", tools: "", frameworks: "", platforms: "" },
  experience: [],
  projects: [],
  achievements: [],
};

function clampStr(v: string, max: number): string {
  return v.length > max ? v.slice(0, max) : v;
}

function clampWords(v: string, maxWords: number): string {
  const words = v.trim().split(/\s+/).filter(Boolean);
  return words.length > maxWords ? words.slice(0, maxWords).join(" ") : v;
}

/**
 * The wizard lets people type past the soft LIMITS (with a visible warning)
 * so they're never blocked mid-flow. The backend, however, has a hard
 * `max_length` on every one of these fields (server/src/schemas/resume.py)
 * and will reject the request outright if we send it over-limit text.
 *
 * Call this right before any API call that submits resume data, so a user
 * who ignored the warnings still gets a successful generate/save instead of
 * a confusing 422 — the trim only happens at the submission boundary, never
 * while they're actively editing.
 */
export function clampResumeToLimits(data: ResumeData): ResumeData {
  return {
    ...data,
    full_name: clampStr(data.full_name, LIMITS.full_name),
    summary: clampStr(clampWords(data.summary, LIMITS.summary_words), LIMITS.summary_chars),
    education: data.education.map((e) => ({
      institution: clampStr(e.institution, LIMITS.education.institution),
      date: clampStr(e.date, LIMITS.education.date),
      degree: clampStr(e.degree, LIMITS.education.degree),
      score: clampStr(e.score, LIMITS.education.score),
    })),
    experience: data.experience.map((e) => ({
      company: clampStr(e.company, LIMITS.experience.company),
      date: clampStr(e.date, LIMITS.experience.date),
      role: clampStr(e.role, LIMITS.experience.role),
      location: clampStr(e.location, LIMITS.experience.location),
      bullets: e.bullets,
    })),
    projects: data.projects.map((p) => ({
      name: clampStr(p.name, LIMITS.projects.name),
      tech: clampStr(p.tech, LIMITS.projects.tech),
      link: p.link,
      bullets: p.bullets,
    })),
    skills: {
      programming: clampStr(data.skills.programming, LIMITS.skillsField),
      query: clampStr(data.skills.query, LIMITS.skillsField),
      web: clampStr(data.skills.web, LIMITS.skillsField),
      tools: clampStr(data.skills.tools, LIMITS.skillsField),
      frameworks: clampStr(data.skills.frameworks, LIMITS.skillsField),
      platforms: clampStr(data.skills.platforms, LIMITS.skillsField),
    },
  };
}