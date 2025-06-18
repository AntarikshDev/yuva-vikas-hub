import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin Panel Routes
import SuperAdminDashboard from "./pages/admin/Dashboard";
import CandidateDirectory from "./pages/admin/CandidateDirectory";
import UserManagement from "./pages/admin/UserManagement";
import MasterDataManagement from "./pages/admin/MasterDataManagement";
import DocumentGenerator from "./pages/admin/DocumentGenerator";
import BatchManagement from "./pages/admin/BatchManagement";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";
import VideoLogManager from "./pages/admin/VideoLogManager";
import AIDropoutEngine from "./pages/admin/AIDropoutEngine";
import QualityTracker from "./pages/admin/QualityTracker";
import SosEscalationTracker from "./pages/admin/SosEscalationTracker";
import DataExportHub from "./pages/admin/DataExportHub";
import SystemSettings from "./pages/admin/SystemSettings";

// State Head Routes
import StateHeadDashboard from "./pages/state-head/Dashboard";
import StateOverview from "./pages/state-head/StateOverview";
import CenterPerformance from "./pages/state-head/CenterPerformance";
import TrainerSummary from "./pages/state-head/TrainerSummary";
import Reports from "./pages/state-head/Reports";
import DropoutInsights from "./pages/state-head/DropoutInsights";
import PPCScheduleMonitor from "./pages/state-head/PPCScheduleMonitor";
import BatchTracker from "./pages/state-head/BatchTracker";
import SOSTracker from "./pages/state-head/SOSTracker";
import ExportReports from "./pages/state-head/ExportReports";

// Mobilizer App Routes
import MobilizerNewCandidate from "./pages/mobilizer/NewCandidate";

// Candidate App Routes
import CandidateHome from "./pages/candidate/Home";

// Create a new QueryClient instance inside the component
const App = () => {
  // Create a new QueryClient instance inside the component to ensure React context works properly
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Admin Panel Routes */}
            <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/master-data" element={<MasterDataManagement />} />
            <Route path="/admin/documents" element={<DocumentGenerator />} />
            <Route path="/admin/batches" element={<BatchManagement />} />
            <Route path="/admin/candidates" element={<CandidateDirectory />} />
            <Route path="/admin/reports" element={<ReportsAnalytics />} />
            <Route path="/admin/videos" element={<VideoLogManager />} />
            <Route path="/admin/ai-dropout" element={<AIDropoutEngine />} />
            <Route path="/admin/quality" element={<QualityTracker />} />
            <Route path="/admin/sos" element={<SosEscalationTracker />} />
            <Route path="/admin/export" element={<DataExportHub />} />
            <Route path="/admin/settings" element={<SystemSettings />} />
            
            {/* State Head Routes */}
            <Route path="/state-head/dashboard" element={<StateHeadDashboard />} />
            <Route path="/state-head/state-overview" element={<StateOverview />} />
            <Route path="/state-head/center-performance" element={<CenterPerformance />} />
            <Route path="/state-head/trainer-summary" element={<TrainerSummary />} />
            <Route path="/state-head/reports" element={<Reports />} />
            <Route path="/state-head/dropout-insights" element={<DropoutInsights />} />
            <Route path="/state-head/ppc-schedule" element={<PPCScheduleMonitor />} />
            <Route path="/state-head/batch-tracker" element={<BatchTracker />} />
            <Route path="/state-head/sos-tracker" element={<SOSTracker />} />
            <Route path="/state-head/export-reports" element={<ExportReports />} />
            
            {/* Mobilizer App Routes */}
            <Route path="/mobilizer/new" element={<MobilizerNewCandidate />} />
            
            {/* Candidate App Routes */}
            <Route path="/candidate" element={<CandidateHome />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
