import { ReactNode, useState } from "react";
import { useForm, useFieldArray, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { resumeSchema, emptyResume, LIMITS, type ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/wizard/TextField";
import { TextAreaField } from "@/components/wizard/TextAreaField";
import { BulletsEditor } from "@/components/wizard/BulletsEditor";
import { WizardProgress } from "@/components/wizard/WizardProgress";
import { LivePreview } from "@/components/wizard/LivePreview";

const STEP_LABELS = ["Basics", "Summary", "Education", "Experience", "Projects", "Skills", "Review"];

const STEP_FIELDS: Path<ResumeData>[][] = [
  ["full_name", "contact.email", "contact.phone", "contact.linkedin_url", "contact.github_url"],
  ["summary"],
  ["education"],
  ["experience"],
  ["projects"],
  ["skills", "achievements"],
  [],
];

interface ResumeWizardFormProps {
  initialData?: ResumeData;
  eyebrow: string;
  heading: string;
  reviewNote: string;
  /** Rendered in place of the default Generate button on the last step. */
  renderReviewAction: (data: ResumeData) => ReactNode;
}

export function ResumeWizardForm({ initialData, eyebrow, heading, reviewNote, renderReviewAction }: ResumeWizardFormProps) {
  const [step, setStep] = useState(0);

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

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1fr_420px] lg:px-10">
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
                <TextField label="Full name" maxLength={LIMITS.full_name} {...register("full_name")} error={errors.full_name?.message} />
                <div className="grid grid-cols-2 gap-4">
                  <TextField label="Email" maxLength={60} type="email" {...register("contact.email")} error={errors.contact?.email?.message} />
                  <TextField label="Phone" maxLength={20} {...register("contact.phone")} />
                  <TextField label="LinkedIn URL" maxLength={80} {...register("contact.linkedin_url")} />
                  <TextField label="GitHub URL" maxLength={80} {...register("contact.github_url")} />
                </div>
              </div>
            )}

            {step === 1 && (
              <TextAreaField
                label="Professional summary"
                maxWords={LIMITS.summary_words}
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
                    <TextField label="Institution" maxLength={LIMITS.education.institution} {...register(`education.${i}.institution`)} />
                    <TextField label="Date" maxLength={LIMITS.education.date} placeholder="2022 — 2026" {...register(`education.${i}.date`)} />
                    <TextField label="Degree" maxLength={LIMITS.education.degree} {...register(`education.${i}.degree`)} />
                    <TextField label="Score" maxLength={LIMITS.education.score} placeholder="8.9 CGPA" {...register(`education.${i}.score`)} />
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
                      <TextField label="Company" maxLength={LIMITS.experience.company} {...register(`experience.${i}.company`)} />
                      <TextField label="Date" maxLength={LIMITS.experience.date} placeholder="Jun 2024 — Present" {...register(`experience.${i}.date`)} />
                      <TextField label="Role" maxLength={LIMITS.experience.role} {...register(`experience.${i}.role`)} />
                      <TextField label="Location" maxLength={LIMITS.experience.location} {...register(`experience.${i}.location`)} />
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
                        onChange={(b) => experience.update(i, { ...values.experience[i], bullets: b })}
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
                      <TextField label="Project name" maxLength={LIMITS.projects.name} {...register(`projects.${i}.name`)} />
                      <TextField label="Tech stack" maxLength={LIMITS.projects.tech} {...register(`projects.${i}.tech`)} />
                    </div>
                    <TextField label="Link (optional)" maxLength={100} {...register(`projects.${i}.link`)} />
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-bright">
                        Highlights <span className="text-slate/50">(max {LIMITS.projects.bulletsPerProject} lines — fixed by the template)</span>
                      </label>
                      <BulletsEditor
                        bullets={values.projects[i]?.bullets || []}
                        max={LIMITS.projects.bulletsPerProject}
                        onChange={(b) => projects.update(i, { ...values.projects[i], bullets: b })}
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
                    <TextField key={k} label={k[0].toUpperCase() + k.slice(1)} maxLength={LIMITS.skillsField} {...register(`skills.${k}`)} />
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

        {step < 6 && (
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={goBack} disabled={step === 0}>
              <ArrowLeft size={15} /> Back
            </Button>
            <Button onClick={goNext}>
              Next <ArrowRight size={15} />
            </Button>
          </div>
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