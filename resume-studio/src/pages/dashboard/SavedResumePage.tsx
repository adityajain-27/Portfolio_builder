import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ResumeData } from "@/types/resume";
import { emptyResume } from "@/types/resume";
import { api, apiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { ResumeWizardForm } from "@/components/wizard/ResumeWizardForm";

export function SavedResumePage() {
  const { id } = useParams(); // present when editing, absent when creating new
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
      // Editing updates the SAME saved record in place (PUT); creating a fresh
      // one goes through the generate-and-save POST. No more duplicate entries.
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-soft">
              <CheckCircle2 size={22} />
            </div>
            <h1 className="font-display text-2xl font-semibold text-slate-bright">Saved to your dashboard</h1>
            <div className="mt-8 flex flex-col gap-3">
              <a href={saved.download_url} target="_blank" rel="noreferrer">
                <Button className="w-full" size="lg">
                  Download PDF
                </Button>
              </a>
              <a href={saved.google_doc_url} target="_blank" rel="noreferrer">
                <Button className="w-full" variant="outline" size="lg">
                  Open Google Doc
                </Button>
              </a>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Back to dashboard
              </Button>
            </div>
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