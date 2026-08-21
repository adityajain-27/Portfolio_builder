import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { RequireGate } from "@/components/RequireGate";
import { RequireAuth } from "@/components/RequireAuth";
import { StudioEntryPage } from "@/pages/StudioEntryPage";
import { GuestWizardPage } from "@/pages/guest/GuestWizardPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { SavedResumePage } from "@/pages/dashboard/SavedResumePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Everything past here requires the gate password to have been entered. */}
        <Route element={<RequireGate />}>
          <Route path="/enter" element={<StudioEntryPage />} />
          <Route path="/guest/build" element={<GuestWizardPage />} />

          <Route path="/auth" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Dashboard additionally requires a logged-in user (JWT). */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/new" element={<SavedResumePage />} />
            <Route path="/dashboard/resume/:id/edit" element={<SavedResumePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}