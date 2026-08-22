import { ReactNode } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { FloatingBlobs } from "@/components/landing/FloatingBlobs";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-16">
      <FloatingBlobs />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-semibold text-slate-bright">
          <FileText size={18} className="text-cobalt" />
          SkillCred
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card">
          <div className="h-[3px] w-full bg-gradient-to-r from-cobalt via-cobalt-soft to-gold" />
          <div className="p-8">
            <h1 className="font-display text-2xl font-semibold text-slate-bright">{title}</h1>
            <p className="mt-1.5 text-sm text-slate">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}