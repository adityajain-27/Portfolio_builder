import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-ink-line bg-ink-soft text-slate/60">
          <FileQuestion size={22} />
        </div>
        <p className="eyebrow mb-2">404</p>
        <h1 className="font-display text-2xl font-semibold text-slate-bright">Page not found</h1>
        <p className="mt-2 text-sm text-slate">This page doesn't exist, or you don't have access to it.</p>
        <Link to="/" className="mt-8 inline-block">
          <Button>Back to home</Button>
        </Link>
      </motion.div>
    </div>
  );
}
