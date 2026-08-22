import { useNavigate } from "react-router-dom";
import { FileText, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function DashboardTopbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 bg-canvas/90 backdrop-blur-sm">
      <div className="h-[3px] w-full bg-gradient-to-r from-cobalt via-cobalt-soft to-gold" />
      <div className="flex items-center justify-between border-b border-ink-line px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-slate-bright">
          <FileText size={18} className="text-cobalt" />
          SkillCred
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate sm:inline">{user?.email}</span>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center gap-1.5 text-sm text-slate transition-colors hover:text-danger"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}