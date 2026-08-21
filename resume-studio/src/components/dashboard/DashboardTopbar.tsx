import { useNavigate } from "react-router-dom";
import { FileText, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function DashboardTopbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between border-b border-ink-line px-6 py-5 sm:px-10">
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
          className="flex items-center gap-1.5 text-sm text-slate hover:text-danger"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </header>
  );
}