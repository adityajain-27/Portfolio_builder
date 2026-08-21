import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import type { ResumeData } from "@/types/resume";
import { api, apiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ResumeWizardForm } from "@/components/wizard/ResumeWizardForm";

export function GuestWizardPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ download_url: string; google_doc_url: string } | null>(null);

  async function handleGenerate(data: ResumeData) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await api.post("/studio/generate", data);
      setResult(res.data);
    } catch (err) {
      setSubmitError(apiErrorMessage(err, "Couldn't generate the document. Try again."));
    } finally {
      setSubmitting(false);
    }
  }

  if (result) return <GuestResult result={result} onStartOver={() => window.location.reload()} />;

  return (
    <ResumeWizardForm
      eyebrow="Guest Build · Nothing is saved"
      heading="Build your resume"
      reviewNote="Everything looks good? Generating creates the document — nothing from this form is stored anywhere."
      renderReviewAction={(data) => (
        <div className="space-y-3">
          {submitError && <p className="text-sm text-danger">{submitError}</p>}
          <Button onClick={() => handleGenerate(data)} disabled={submitting} size="lg">
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {submitting ? "Generating..." : "Generate resume"}
          </Button>
        </div>
      )}
    />
  );
}

function GuestResult({ result, onStartOver }: { result: { download_url: string; google_doc_url: string }; onStartOver: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-soft">
          <Sparkles size={22} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-slate-bright">Your resume is ready</h1>
        <p className="mt-2 text-sm text-slate">Nothing from this session was saved — grab your links now.</p>
        <div className="mt-8 flex flex-col gap-3">
          <a href={result.download_url} target="_blank" rel="noreferrer">
            <Button className="w-full" size="lg">
              Download PDF
            </Button>
          </a>
          <a href={result.google_doc_url} target="_blank" rel="noreferrer">
            <Button className="w-full" variant="outline" size="lg">
              Open Google Doc
            </Button>
          </a>
          <Button variant="ghost" onClick={onStartOver}>
            Build another
          </Button>
        </div>
      </motion.div>
    </div>
  );
}