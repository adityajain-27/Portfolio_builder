import { ReactNode } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex items-center gap-2 font-display text-lg font-semibold text-slate-bright">
          <FileText size={18} className="text-cobalt" />
          SkillCred
        </div>
        <h1 className="font-display text-2xl font-semibold text-slate-bright">{title}</h1>
        <p className="mt-1.5 text-sm text-slate">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </motion.div>
    </div>
  );
}