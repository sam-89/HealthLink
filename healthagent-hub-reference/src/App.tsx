import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { AgentDashboard } from "@/pages/agent/AgentDashboard";
import { AgentServicesPage } from "@/pages/agent/AgentServicesPage";
import ApplyLicensePage from "@/pages/agent/ApplyLicensePage";
import NewInsuranceLicensePage from "@/pages/agent/NewInsuranceLicensePage";
import { OnboardingWizard } from "@/pages/agent/OnboardingWizard";
import { AgentDocumentsPage } from "@/pages/agent/AgentDocumentsPage";
import { AgentProfilePage } from "@/pages/agent/AgentProfilePage";
import { AgencyDashboard } from "@/pages/agency/AgencyDashboard";
import { AgentsPage } from "@/pages/agency/AgentsPage";
import { DocumentCenterPage } from "@/pages/agency/DocumentCenterPage";
import { CompliancePage } from "@/pages/agency/CompliancePage";
import { SettingsPage } from "@/pages/agency/SettingsPage";
import { OpsDashboard } from "@/pages/ops/OpsDashboard";
import { VerificationQueuePage } from "@/pages/ops/VerificationQueuePage";
import { DocumentReviewPage } from "@/pages/ops/DocumentReviewPage";
import { AgenciesPage } from "@/pages/ops/AgenciesPage";
import { AllAgentsPage } from "@/pages/ops/AllAgentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            {/* Agent Portal */}
            <Route element={<ProtectedRoute allowedRoles={['agent']}><MainLayout /></ProtectedRoute>}>
              <Route path="/agent" element={<AgentDashboard />} />
              <Route path="/agent/onboarding" element={<OnboardingWizard />} />
              <Route path="/agent/documents" element={<AgentDocumentsPage />} />
              <Route path="/agent/profile" element={<AgentProfilePage />} />
              {/* Licensing routes - more specific paths first */}
              <Route path="/agent/services/licensing/new-insurance" element={<NewInsuranceLicensePage />} />
              <Route path="/agent/services/licensing/apply" element={<ApplyLicensePage />} />
              {/* General services route last */}
              <Route path="/agent/services" element={<AgentServicesPage />} />
            </Route>

            {/* Agency Portal */}
            <Route element={<ProtectedRoute allowedRoles={['agency']}><MainLayout /></ProtectedRoute>}>
              <Route path="/agency" element={<AgencyDashboard />} />
              <Route path="/agency/agents" element={<AgentsPage />} />
              <Route path="/agency/documents" element={<DocumentCenterPage />} />
              <Route path="/agency/compliance" element={<CompliancePage />} />
              <Route path="/agency/settings" element={<SettingsPage />} />
            </Route>

            {/* Ops Portal */}
            <Route element={<ProtectedRoute allowedRoles={['ops']}><MainLayout /></ProtectedRoute>}>
              <Route path="/ops" element={<OpsDashboard />} />
              <Route path="/ops/queue" element={<VerificationQueuePage />} />
              <Route path="/ops/documents" element={<DocumentReviewPage />} />
              <Route path="/ops/agencies" element={<AgenciesPage />} />
              <Route path="/ops/agents" element={<AllAgentsPage />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
