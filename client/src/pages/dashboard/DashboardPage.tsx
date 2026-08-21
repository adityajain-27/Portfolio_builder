import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FilePlus2, ExternalLink, Download, Pencil, FileX, Loader2, Trash2 } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { Button } from "@/components/ui/Button";

interface SavedResumeSummary {
  id: string;
  full_name: string | null;
  google_doc_url: string;
  download_url: string;
  created_at: string;
}

export function DashboardPage() {
  const [resumes, setResumes] = useState<SavedResumeSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/studio/resumes")
      .then((res) => setResumes(res.data))
      .catch((err) => setError(apiErrorMessage(err, "Couldn't load your resumes")));
  }, []);

  async function confirmDelete(id: string) {
    setDeletingId(id);
    try {
      await api.delete(`/studio/resumes/${id}`);
      setResumes((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't delete this resume"));
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardTopbar />

      <main className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="eyebrow mb-2">Dashboard</p>
            <h1 className="font-display text-2xl font-semibold text-slate-bright">Your resumes</h1>
          </div>
          <Link to="/dashboard/new">
            <Button size="md">
              <FilePlus2 size={15} /> New resume
            </Button>
          </Link>
        </div>

        {!resumes && !error && (
          <div className="flex items-center gap-2 py-16 text-sm text-slate">
            <Loader2 size={15} className="animate-spin" /> Loading your resumes...
          </div>
        )}

        {error && <p className="py-8 text-sm text-danger">{error}</p>}

        {resumes && resumes.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-line py-20 text-center">
            <FileX size={28} className="mb-4 text-slate/50" />
            <p className="font-display text-lg text-slate-bright">Nothing here yet</p>
            <p className="mt-1.5 max-w-xs text-sm text-slate">
              Build your first resume — it'll show up here, ready to edit anytime.
            </p>
            <Link to="/dashboard/new" className="mt-6">
              <Button>
                <FilePlus2 size={15} /> New resume
              </Button>
            </Link>
          </div>
        )}

        {resumes && resumes.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-ink-line bg-ink-soft p-6"
              >
                <h3 className="font-display text-lg font-semibold text-slate-bright">
                  {r.full_name || "Untitled"}
                </h3>
                <p className="mt-1 font-mono text-[11px] text-slate/60">
                  {new Date(r.created_at).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link to={`/dashboard/resume/${r.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil size={13} /> Edit
                    </Button>
                  </Link>
                  <a href={r.download_url} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="sm">
                      <Download size={13} /> PDF
                    </Button>
                  </a>
                  <a href={r.google_doc_url} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="sm">
                      <ExternalLink size={13} /> Doc
                    </Button>
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-slate/50 hover:bg-danger/10 hover:text-danger"
                    onClick={() => setPendingDeleteId(r.id)}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>

                <AnimatePresence>
                  {pendingDeleteId === r.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 14 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden rounded-lg border border-danger/30 bg-danger/5 p-3"
                    >
                      <p className="text-xs text-slate-bright">Delete this resume? This can't be undone.</p>
                      <div className="mt-2.5 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 border border-danger/40 px-3 text-xs text-danger hover:bg-danger/10"
                          disabled={deletingId === r.id}
                          onClick={() => confirmDelete(r.id)}
                        >
                          {deletingId === r.id ? <Loader2 size={12} className="animate-spin" /> : "Delete"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-3 text-xs"
                          onClick={() => setPendingDeleteId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}