import { ReactNode, useEffect } from "react";
import { useForm, useFieldArray, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Plus, Trash2, AlertTriangle } from "lucide-react";
import { resumeSchema, emptyResume, LIMITS, type ResumeData } from "@/types/resume";
import { wordCount } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/wizard/TextField";
import { TextAreaField } from "@/components/wizard/TextAreaField";
import { BulletsEditor } from "@/components/wizard/BulletsEditor";
import { WizardProgress } from "@/components/wizard/WizardProgress";
import { LivePreview } from "@/components/wizard/LivePreview";

const STEP_LABELS = ["Basics", "Summary", "Education", "Experience", "Projects", "Skills", "Review"];
const LAST_STEP = STEP_LABELS.length - 1;

const STEP_FIELDS: Path<ResumeData>[][] = [
  ["full_name", "contact.email", "contact.phone", "contact.linkedin_url", "contact.github_url"],
  ["summary"],
  ["education"],
  ["experience"],
  ["projects"],
  ["skills", "achievements"],
  [],
];

const charOver = (v: string | undefined, max: number) => (v?.length ?? 0) > max;
const wordsOver = (v: string | undefined, max: number) => wordCount(v ?? "") > max;

/** Soft-limit overflow check for the step currently on screen — used only to
 * surface a warning, never to block navigation (see types/resume.ts). */
function stepHasOverflow(step: number, v: ResumeData): boolean {
  switch (step) {
    case 0:
      return (
        charOver(v.full_name, LIMITS.full_name) ||
        charOver(v.contact.email, 60) ||
        charOver(v.contact.phone, 20) ||
        charOver(v.contact.linkedin_url, 80) ||
        charOver(v.contact.github_url, 80)
      );
    case 1:
      return wordsOver(v.summary, LIMITS.summary_words) || charOver(v.summary, LIMITS.summary_chars);
    case 2:
      return v.education.some(
        (e) =>
          charOver(e.institution, LIMITS.education.institution) ||
          charOver(e.date, LIMITS.education.date) ||
          charOver(e.degree, LIMITS.education.degree) ||
          charOver(e.score, LIMITS.education.score)
      );
    case 3:
      return v.experience.some(
        (e) =>
          charOver(e.company, LIMITS.experience.company) ||
          charOver(e.date, LIMITS.experience.date) ||
          charOver(e.role, LIMITS.experience.role) ||
          charOver(e.location, LIMITS.experience.location)
      );
    case 4:
      return v.projects.some(
        (p) => charOver(p.name, LIMITS.projects.name) || charOver(p.tech, LIMITS.projects.tech)
      );
    case 5:
      return Object.values(v.skills).some((s) => charOver(s, LIMITS.skillsField));
    default:
      return false;
  }
}

interface ResumeWizardFormProps {
  initialData?: ResumeData;
  eyebrow: string;
  heading: string;
  reviewNote: string;
  renderReviewAction: (data: ResumeData) => ReactNode;
}

export function ResumeWizardForm({ initialData, eyebrow, heading, reviewNote, renderReviewAction }: ResumeWizardFormProps) {
  // Step lives in the URL (?step=N) instead of plain useState. This means the
  // browser/mobile-gesture back button steps back through the wizard one step
  // at a time (matching the in-page ← Back button) instead of throwing the
  // whole in-progress form away.
  const [searchParams, setSearchParams] = useSearchParams();
  const rawStep = Number(searchParams.get("step"));
  const step = Number.isInteger(rawStep) && rawStep >= 0 && rawStep <= LAST_STEP ? rawStep : 0;

  useEffect(() => {
    if (!searchParams.has("step")) {
      const next = new URLSearchParams(searchParams);
      next.set("step", "0");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToStep(target: number, opts?: { replace?: boolean }) {
    const clamped = Math.max(0, Math.min(target, LAST_STEP));
    const next = new URLSearchParams(searchParams);
    next.set("step", String(clamped));
    setSearchParams(next, opts);
  }

  const {
    register,
    control,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData ?? emptyResume,
    mode: "onChange",
  });

  const education = useFieldArray({ control, name: "education" });
  const experience = useFieldArray({ control, name: "experience" });
  const projects = useFieldArray({ control, name: "projects" });
  const values = watch();
  const overflow = stepHasOverflow(step, values);

  async function goNext() {
    // Only genuinely required fields (name present, email well-formed) can block
    // moving forward. Being over a soft character/word limit never blocks —
    // it's shown as a warning instead (see `overflow` above).
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) goToStep(step + 1);
  }
  function goBack() {
    goToStep(step - 1);
  }

  return (
    <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1.1fr_1fr] lg:px-12 lg:py-14 xl:px-16">
      <div>
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h1 className="mb-8 font-display text-2xl font-semibold text-slate-bright">{heading}</h1>

        <WizardProgress step={step} total={STEP_LABELS.length} labels={STEP_LABELS} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <div className="space-y-4">
                <TextField
                  label="Full name"
                  maxLength={LIMITS.full_name}
                  value={values.full_name}
                  {...register("full_name")}
                  error={errors.full_name?.message}
                />
                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    label="Email"
                    maxLength={60}
                    type="email"
                    value={values.contact.email}
                    {...register("contact.email")}
                    error={errors.contact?.email?.message}
                  />
                  <TextField label="Phone" maxLength={20} value={values.contact.phone} {...register("contact.phone")} />
                  <TextField
                    label="LinkedIn URL"
                    maxLength={80}
                    value={values.contact.linkedin_url}
                    {...register("contact.linkedin_url")}
                  />
                  <TextField
                    label="GitHub URL"
                    maxLength={80}
                    value={values.contact.github_url}
                    {...register("contact.github_url")}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <TextAreaField
                label="Professional summary"
                maxWords={LIMITS.summary_words}
                value={values.summary}
                {...register("summary")}
                error={errors.summary?.message}
              />
            )}

            {step === 2 && (
              <RepeatSection
                title="Education"
                items={education.fields}
                max={LIMITS.education.max}
                onAdd={() => education.append({ institution: "", date: "", degree: "", score: "" })}
                onRemove={education.remove}
              >
                {(i) => (
                  <div className="grid grid-cols-2 gap-3">
                    <TextField
                      label="Institution"
                      maxLength={LIMITS.education.institution}
                      value={values.education[i]?.institution ?? ""}
                      {...register(`education.${i}.institution`)}
                    />
                    <TextField
                      label="Date"
                      maxLength={LIMITS.education.date}
                      placeholder="2022 — 2026"
                      value={values.education[i]?.date ?? ""}
                      {...register(`education.${i}.date`)}
                    />
                    <TextField
                      label="Degree"
                      maxLength={LIMITS.education.degree}
                      value={values.education[i]?.degree ?? ""}
                      {...register(`education.${i}.degree`)}
                    />
                    <TextField
                      label="Score"
                      maxLength={LIMITS.education.score}
                      placeholder="8.9 CGPA"
                      value={values.education[i]?.score ?? ""}
                      {...register(`education.${i}.score`)}
                    />
                  </div>
                )}
              </RepeatSection>
            )}

            {step === 3 && (
              <RepeatSection
                title="Experience"
                items={experience.fields}
                max={LIMITS.experience.max}
                onAdd={() => experience.append({ company: "", date: "", role: "", location: "", bullets: [] })}
                onRemove={experience.remove}
              >
                {(i) => (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <TextField
                        label="Company"
                        maxLength={LIMITS.experience.company}
                        value={values.experience[i]?.company ?? ""}
                        {...register(`experience.${i}.company`)}
                      />
                      <TextField
                        label="Date"
                        maxLength={LIMITS.experience.date}
                        placeholder="Jun 2024 — Present"
                        value={values.experience[i]?.date ?? ""}
                        {...register(`experience.${i}.date`)}
                      />
                      <TextField
                        label="Role"
                        maxLength={LIMITS.experience.role}
                        value={values.experience[i]?.role ?? ""}
                        {...register(`experience.${i}.role`)}
                      />
                      <TextField
                        label="Location"
                        maxLength={LIMITS.experience.location}
                        value={values.experience[i]?.location ?? ""}
                        {...register(`experience.${i}.location`)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-bright">
                        Highlights{" "}
                        <span className="text-slate/50">
                          (max {LIMITS.experienceBulletSlots[i + 1] ?? 2} lines — fixed by the template)
                        </span>
                      </label>
                      <BulletsEditor
                        bullets={values.experience[i]?.bullets || []}
                        max={LIMITS.experienceBulletSlots[i + 1] ?? 2}
                        onChange={(b) => setValue(`experience.${i}.bullets`, b, { shouldValidate: true })}
                      />
                    </div>
                  </div>
                )}
              </RepeatSection>
            )}

            {step === 4 && (
              <RepeatSection
                title="Projects"
                items={projects.fields}
                max={LIMITS.projects.max}
                onAdd={() => projects.append({ name: "", tech: "", link: "", bullets: [] })}
                onRemove={projects.remove}
              >
                {(i) => (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <TextField
                        label="Project name"
                        maxLength={LIMITS.projects.name}
                        value={values.projects[i]?.name ?? ""}
                        {...register(`projects.${i}.name`)}
                      />
                      <TextField
                        label="Tech stack"
                        maxLength={LIMITS.projects.tech}
                        value={values.projects[i]?.tech ?? ""}
                        {...register(`projects.${i}.tech`)}
                      />
                    </div>
                    <TextField
                      label="Link (optional)"
                      maxLength={100}
                      value={values.projects[i]?.link ?? ""}
                      {...register(`projects.${i}.link`)}
                    />
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-bright">
                        Highlights <span className="text-slate/50">(max {LIMITS.projects.bulletsPerProject} lines — fixed by the template)</span>
                      </label>
                      <BulletsEditor
                        bullets={values.projects[i]?.bullets || []}
                        max={LIMITS.projects.bulletsPerProject}
                        onChange={(b) => setValue(`projects.${i}.bullets`, b, { shouldValidate: true })}
                      />
                    </div>
                  </div>
                )}
              </RepeatSection>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {(["programming", "query", "web", "tools", "frameworks", "platforms"] as const).map((k) => (
                    <TextField
                      key={k}
                      label={k[0].toUpperCase() + k.slice(1)}
                      maxLength={LIMITS.skillsField}
                      value={values.skills[k]}
                      {...register(`skills.${k}`)}
                    />
                  ))}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-bright">
                    Achievements (max {LIMITS.achievements.max})
                  </label>
                  <BulletsEditor
                    bullets={values.achievements}
                    max={LIMITS.achievements.max}
                    placeholder="An award, ranking, or notable result"
                    onChange={(b) => setValue("achievements", b, { shouldValidate: true })}
                  />
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <p className="text-sm text-slate">{reviewNote}</p>
                {renderReviewAction(values)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {step < LAST_STEP && (
          <>
            <AnimatePresence>
              {overflow && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 flex items-start gap-2 rounded-lg border border-warn/30 bg-warn/10 px-3.5 py-2.5 text-xs leading-relaxed text-warn"
                >
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <span>
                    One or more fields on this step are over the recommended limit. You can still continue — but
                    the extra text may get cut off or spill your resume onto a second page. Check the live preview
                    before generating.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between">
              <Button variant="ghost" onClick={goBack} disabled={step === 0}>
                <ArrowLeft size={15} /> Back
              </Button>
              <Button onClick={goNext}>
                Next <ArrowRight size={15} />
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="hidden lg:block">
        <LivePreview data={values} />
      </div>
    </div>
  );
}

function RepeatSection({
  title,
  items,
  max,
  onAdd,
  onRemove,
  children,
}: {
  title: string;
  items: { id: string }[];
  max: number;
  onAdd: () => void;
  onRemove: (i: number) => void;
  children: (i: number) => ReactNode;
}) {
  return (
    <div className="space-y-5">
      {items.map((f, i) => (
        <div key={f.id} className="rounded-xl border border-ink-line bg-ink-soft p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate/70">
              {title} {i + 1}
            </span>
            <button type="button" onClick={() => onRemove(i)} className="text-slate/50 hover:text-danger">
              <Trash2 size={14} />
            </button>
          </div>
          {children(i)}
        </div>
      ))}
      {items.length < max && (
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus size={13} /> Add {title.toLowerCase()}
        </Button>
      )}
      {items.length === 0 && <p className="text-sm text-slate/60">Optional — skip if not applicable.</p>}
    </div>
  );
}