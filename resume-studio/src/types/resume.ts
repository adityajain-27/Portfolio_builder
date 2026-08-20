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

const educationEntry = z.object({
  institution: z.string().max(LIMITS.education.institution, "Too long"),
  date: z.string().max(LIMITS.education.date, "Too long"),
  degree: z.string().max(LIMITS.education.degree, "Too long"),
  score: z.string().max(LIMITS.education.score, "Too long"),
});

const experienceEntry = z.object({
  company: z.string().max(LIMITS.experience.company, "Too long"),
  date: z.string().max(LIMITS.experience.date, "Too long"),
  role: z.string().max(LIMITS.experience.role, "Too long"),
  location: z.string().max(LIMITS.experience.location, "Too long"),
  bullets: z.array(z.string()).default([]),
});

const projectEntry = z.object({
  name: z.string().max(LIMITS.projects.name, "Too long"),
  tech: z.string().max(LIMITS.projects.tech, "Too long"),
  link: z.string().optional().default(""),
  bullets: z.array(z.string()).default([]),
});

export const resumeSchema = z.object({
  full_name: z.string().min(1, "Required").max(LIMITS.full_name, "Too long"),
  summary: z
    .string()
    .max(LIMITS.summary_chars, "Too long")
    .refine((v) => v.trim().split(/\s+/).filter(Boolean).length <= LIMITS.summary_words, {
      message: `Keep the summary under ${LIMITS.summary_words} words`,
    }),
  contact: z.object({
    phone: z.string().default(""),
    email: z.string().email("Invalid email").or(z.literal("")).default(""),
    linkedin_url: z.string().default(""),
    github_url: z.string().default(""),
  }),
  education: z.array(educationEntry).max(LIMITS.education.max),
  skills: z.object({
    programming: z.string().max(LIMITS.skillsField),
    query: z.string().max(LIMITS.skillsField),
    web: z.string().max(LIMITS.skillsField),
    tools: z.string().max(LIMITS.skillsField),
    frameworks: z.string().max(LIMITS.skillsField),
    platforms: z.string().max(LIMITS.skillsField),
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