import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Save, AlertCircle, CheckCircle2, Download, ExternalLink, FileCheck2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ResumeData } from "@/types/resume";
import { emptyResume } from "@/types/resume";
import { api, apiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { ResumeWizardForm } from "@/components/wizard/ResumeWizardForm";

export function SavedResumePage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<ResumeData | null>(isEditing ? null : emptyResume);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState<{ download_url: string; google_doc_url: string } | null>(null);

  useEffect(() => {
    if (!isEditing) return;
    api
      .get(`/studio/resumes/${id}`)
      .then((res) => setInitialData(res.data.data))
      .catch((err) => setLoadError(apiErrorMessage(err, "Couldn't load this resume")));
  }, [id, isEditing]);

  async function handleSave(data: ResumeData) {
    setSaving(true);
    setSaveError(null);
    try {
      const res = isEditing
        ? await api.put(`/studio/resumes/${id}`, data)
        : await api.post("/studio/resumes/generate", data);
      setSaved(res.data);
    } catch (err) {
      setSaveError(apiErrorMessage(err, "Couldn't save. Try again."));
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return (
      <div className="min-h-screen">
        <DashboardTopbar />
        <div className="flex flex-col items-center py-24 text-center">
          <AlertCircle className="mb-3 text-danger" size={22} />
          <p className="text-sm text-danger">{loadError}</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate("/dashboard")}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen">
        <DashboardTopbar />
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate">
          <Loader2 size={15} className="animate-spin" /> Loading resume...
        </div>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="min-h-screen">
        <DashboardTopbar />
        <div className="flex flex-col items-center px-6 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 16 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold"
            >
              <CheckCircle2 size={26} />
            </motion.div>
            <h1 className="font-display text-2xl font-semibold text-slate-bright">Saved to your dashboard</h1>
            <p className="mt-2 text-sm text-slate">
              {isEditing ? "Your changes are live — grab the updated links below." : "It's ready and saved — grab your links below."}
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-ink-line bg-white text-left shadow-card">
              <div className="h-[3px] w-full bg-gradient-to-r from-cobalt via-cobalt-soft to-gold" />
              <div className="flex items-center gap-3 border-b border-ink-line px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-canvas text-cobalt">
                  <FileCheck2 size={17} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-bright">Resume.pdf</p>
                  <p className="font-mono text-[10px] text-slate/60">Saved just now</p>
                </div>
              </div>
              <div className="flex flex-col gap-2.5 p-5">
                <a href={saved.download_url} target="_blank" rel="noreferrer">
                  <Button className="w-full" size="lg">
                    <Download size={16} /> Download PDF
                  </Button>
                </a>
                <a href={saved.google_doc_url} target="_blank" rel="noreferrer">
                  <Button className="w-full" variant="outline" size="lg">
                    <ExternalLink size={16} /> Open Google Doc
                  </Button>
                </a>
              </div>
            </div>

            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mt-5">
              Back to dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardTopbar />
      <ResumeWizardForm
        initialData={initialData}
        eyebrow={isEditing ? "Editing · Saved to your dashboard" : "New resume · Saved to your dashboard"}
        heading={isEditing ? "Edit resume" : "Build your resume"}
        reviewNote="Saving generates the document and adds it to your dashboard."
        renderReviewAction={(data) => (
          <div className="space-y-3">
            <AnimatePresence>
              {saveError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-danger">
                  {saveError}
                </motion.p>
              )}
            </AnimatePresence>
            <Button onClick={() => handleSave(data)} disabled={saving} size="lg">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving..." : "Save resume"}
            </Button>
          </div>
        )}
      />
    </div>
  );
}