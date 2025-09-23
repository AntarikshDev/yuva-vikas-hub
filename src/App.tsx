
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from '@/store';
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
import Attendance from "./pages/state-head/Attendance";

// Mobilizer App Routes
import MobilizerNewCandidate from "./pages/mobilizer/NewCandidate";

// Candidate App Routes
import CandidateHome from "./pages/candidate/Home";

// Counsellor Routes
import CounsellorDashboard from "./pages/counsellor/Dashboard";
import CounsellorOFRManagement from "./pages/counsellor/OFRManagement";
import CandidateManagement from "./pages/counsellor/CandidateManagement";
import CounsellorReports from "./pages/counsellor/Reports";
import MandatorySheets from "./pages/counsellor/MandatorySheets";
import VideoLogs from "./pages/counsellor/VideoLogs";
import ParentConsentSummary from "./pages/counsellor/ParentConsentSummary";
import PendingTasks from "./pages/counsellor/PendingTasks";
import CounsellorProfile from "./pages/counsellor/Profile";

// Center Manager Routes
import CenterManagerDashboard from "./pages/center-manager/Dashboard";
import EnrollmentBatch from "./pages/center-manager/EnrollmentBatch";
import CounsellingVerification from "./pages/center-manager/CounsellingVerification";
import DocumentCompliance from "./pages/center-manager/DocumentCompliance";
import CenterMandatorySheets from "./pages/center-manager/MandatorySheets";
import VideoLogsOrientation from "./pages/center-manager/VideoLogsOrientation";
import AttendanceModule from "./pages/center-manager/AttendanceModule";
import PlacementCoordination from "./pages/center-manager/PlacementCoordination";
import TravelLetterManagement from "./pages/center-manager/TravelLetterManagement";
import PostPlacementTracking from "./pages/center-manager/PostPlacementTracking";
import CenterReportsExports from "./pages/center-manager/ReportsExports";
import CenterProfileSettings from "./pages/center-manager/ProfileSettings";

// Admin Routes (formerly MIS-Admin)
import AdminDashboard from "./pages/mis-admin/Dashboard";
import AdminUserManagement from "./pages/mis-admin/UserManagement";
import AdminLookupConfiguration from "./pages/mis-admin/LookupConfiguration";
import AdminDataManagement from "./pages/mis-admin/DataManagement";
import AdminReportsLibrary from "./pages/mis-admin/ReportsLibrary";
import AdminAlertsManagement from "./pages/mis-admin/AlertsManagement";
import AdminAuditCompliance from "./pages/mis-admin/AuditCompliance";
import AdminProfileSettings from "./pages/mis-admin/ProfileSettings";

// MIS Routes (new center-specific MIS)
import MISDashboard from "./pages/mis/Dashboard";
import DailyActivityManagement from "./pages/mis/DailyActivityManagement";
import ReadyForMigration from "./pages/mis/ReadyForMigration";
import CurriculumManagement from "./pages/mis/CurriculumManagement";

// Trainer Pages
import TrainerDashboard from "./pages/trainer/Dashboard";
import TrainerProfile from "./pages/trainer/Profile";
import TrainerReports from "./pages/trainer/Reports";
import TrainerVideoLogs from "./pages/trainer/VideoLogs";
import TrainerCurriculumPlanner from "./pages/trainer/CurriculumPlanner";
import TrainerAssessmentEvaluation from "./pages/trainer/AssessmentEvaluation";
import TrainerAttendanceManagement from "./pages/trainer/AttendanceManagement";
import TrainerFeedbackManagement from "./pages/trainer/FeedbackManagement";
import CurriculumSchedule from "./pages/trainer/CurriculumSchedule";
import CompanyHRDashboard from "./pages/company-hr/Dashboard";
import CompanyHRBatchManagement from "./pages/company-hr/BatchManagement";
import CompanyHRCandidateManagement from "./pages/company-hr/CandidateManagement";
import CompanyHRTravelManagement from "./pages/company-hr/TravelManagement";
import CompanyHRInterviewScheduler from "./pages/company-hr/InterviewScheduler";
import CompanyHRFeedbackManagement from "./pages/company-hr/FeedbackManagement";
import CompanyHRReports from "./pages/company-hr/Reports";
import CompanyHRProfile from "./pages/company-hr/Profile";

// PPC Admin imports
import PPCAdminDashboard from "./pages/ppc-admin/Dashboard";
import PPCAdminPrePlacement from "./pages/ppc-admin/PrePlacementCompliance";
import PPCAdminPostPlacement from "./pages/ppc-admin/PostPlacementManagement";
import PPCAdminPOCManagement from "./pages/ppc-admin/POCManagement";
import PPCAdminSOSMonitoring from "./pages/ppc-admin/SOSMonitoring";
import PPCAdminReports from "./pages/ppc-admin/Reports";
import PPCAdminProfile from "./pages/ppc-admin/Profile";

// POC imports
import POCDashboard from "./pages/poc/Dashboard";
import POCVisitManagement from "./pages/poc/VisitManagement";
import POCSOSManagement from "./pages/poc/SOSManagement";
import POCTravelManagement from "./pages/poc/TravelManagement";
import POCWelfareFacilitation from "./pages/poc/WelfareFacilitation";
import POCReports from "./pages/poc/Reports";
import POCProfile from "./pages/poc/Profile";

// Administration Department imports
import AdminDeptDashboard from "./pages/admin-department/Dashboard";
import RentManagement from "./pages/admin-department/RentManagement";
import VendorManagement from "./pages/admin-department/VendorManagement";
import ExpenseManagement from "./pages/admin-department/ExpenseManagement";
import TicketBooking from "./pages/admin-department/TicketBooking";
import AdminDeptReports from "./pages/admin-department/Reports";
import PropertyManagement from "./pages/admin-department/PropertyManagement";
import FoodVendorManagement from "./pages/admin-department/FoodVendorManagement";
import PettyCashManagement from "./pages/admin-department/PettyCashManagement";
import PurchaseOrderManagement from "./pages/admin-department/PurchaseOrderManagement";
import TicketBookingApproval from "./pages/admin-department/TicketBookingApproval";


// Candidate Pages
import CandidateProfile from "./pages/candidate/Profile";
import CandidateProgress from "./pages/candidate/Progress";
import CandidateAttendance from "./pages/candidate/Attendance";
import CandidateDocuments from "./pages/candidate/Documents";

// Layout
import { MainLayout } from "./layouts/MainLayout";

// Create a new QueryClient instance inside the component
const App = () => {
  // Create a new QueryClient instance inside the component to ensure React context works properly
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
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
            <Route path="/state-head/attendance" element={<Attendance />} />
            <Route path="/state-head/dropout-insights" element={<DropoutInsights />} />
            <Route path="/state-head/ppc-schedule" element={<PPCScheduleMonitor />} />
            <Route path="/state-head/batch-tracker" element={<BatchTracker />} />
            <Route path="/state-head/sos-tracker" element={<SOSTracker />} />
            <Route path="/state-head/export-reports" element={<ExportReports />} />
            
            {/* Mobilizer App Routes */}
            <Route path="/mobilizer/new" element={<MobilizerNewCandidate />} />
            
            {/* Candidate App Routes */}
            <Route path="/candidate" element={<MainLayout role="candidate" title="Dashboard"><CandidateHome /></MainLayout>} />
            <Route path="/candidate/profile" element={<MainLayout role="candidate" title="My Profile"><CandidateProfile /></MainLayout>} />
            <Route path="/candidate/progress" element={<MainLayout role="candidate" title="Training Progress"><CandidateProgress /></MainLayout>} />
            <Route path="/candidate/attendance" element={<MainLayout role="candidate" title="My Attendance"><CandidateAttendance /></MainLayout>} />
            <Route path="/candidate/documents" element={<MainLayout role="candidate" title="My Documents"><CandidateDocuments /></MainLayout>} />
            
            {/* Trainer Routes */}
            <Route path="/trainer" element={<MainLayout role="trainer" title="Dashboard"><TrainerDashboard /></MainLayout>} />
            <Route path="/trainer/curriculum-planner" element={<MainLayout role="trainer" title="Curriculum Planner"><TrainerCurriculumPlanner /></MainLayout>} />
            <Route path="/trainer/attendance-management" element={<MainLayout role="trainer" title="Attendance Management"><TrainerAttendanceManagement /></MainLayout>} />
            <Route path="/trainer/video-logs" element={<MainLayout role="trainer" title="Video Logs"><TrainerVideoLogs /></MainLayout>} />
            <Route path="/trainer/assessment-evaluation" element={<MainLayout role="trainer" title="Assessment Evaluation"><TrainerAssessmentEvaluation /></MainLayout>} />
            <Route path="/trainer/feedback-management" element={<MainLayout role="trainer" title="Feedback Management"><TrainerFeedbackManagement /></MainLayout>} />
            <Route path="/trainer/curriculum-schedule" element={<MainLayout role="trainer" title="Curriculum Schedule"><CurriculumSchedule /></MainLayout>} />
            <Route path="/trainer/reports" element={<MainLayout role="trainer" title="Reports & Analytics"><TrainerReports /></MainLayout>} />
            <Route path="/trainer/profile" element={<MainLayout role="trainer" title="Profile & Settings"><TrainerProfile /></MainLayout>} />
            
        {/* Counsellor Routes */}
        <Route path="/counsellor/dashboard" element={<CounsellorDashboard />} />
        <Route path="/counsellor/ofr-management" element={<CounsellorOFRManagement />} />
        <Route path="/counsellor/candidates" element={<CandidateManagement />} />
        <Route path="/counsellor/reports" element={<CounsellorReports />} />
        <Route path="/counsellor/mandatory-sheets" element={<MandatorySheets />} />
        <Route path="/counsellor/video-logs" element={<VideoLogs />} />
        <Route path="/counsellor/parent-consent" element={<ParentConsentSummary />} />
        <Route path="/counsellor/pending-tasks" element={<PendingTasks />} />
        <Route path="/counsellor/profile" element={<CounsellorProfile />} />

        {/* Center Manager Routes */}
        <Route path="/center-manager/dashboard" element={<MainLayout role="center_manager" title="Dashboard"><CenterManagerDashboard /></MainLayout>} />
        <Route path="/center-manager/enrollment" element={<MainLayout role="center_manager" title="Enrollment & Batch"><EnrollmentBatch /></MainLayout>} />
        <Route path="/center-manager/counselling" element={<MainLayout role="center_manager" title="Counselling Verification"><CounsellingVerification /></MainLayout>} />
        <Route path="/center-manager/documents" element={<MainLayout role="center_manager" title="Document Compliance"><DocumentCompliance /></MainLayout>} />
        <Route path="/center-manager/mandatory-sheets" element={<MainLayout role="center_manager" title="Mandatory Sheets"><CenterMandatorySheets /></MainLayout>} />
        <Route path="/center-manager/video-logs" element={<MainLayout role="center_manager" title="Video Logs & Orientation"><VideoLogsOrientation /></MainLayout>} />
        <Route path="/center-manager/attendance" element={<MainLayout role="center_manager" title="Attendance Module"><AttendanceModule /></MainLayout>} />
        <Route path="/center-manager/placement" element={<MainLayout role="center_manager" title="Placement Coordination"><PlacementCoordination /></MainLayout>} />
        <Route path="/center-manager/travel-letters" element={<MainLayout role="center_manager" title="Travel Letter Management"><TravelLetterManagement /></MainLayout>} />
        <Route path="/center-manager/post-placement" element={<MainLayout role="center_manager" title="Post-Placement Tracking"><PostPlacementTracking /></MainLayout>} />
        <Route path="/center-manager/reports" element={<MainLayout role="center_manager" title="Reports & Exports"><CenterReportsExports /></MainLayout>} />
        <Route path="/center-manager/profile" element={<MainLayout role="center_manager" title="Profile & Settings"><CenterProfileSettings /></MainLayout>} />

        {/* Admin Routes (new global admin) */}
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

        {/* MIS Routes (new center-specific MIS) */}
        <Route path="/mis/dashboard" element={<MainLayout role="mis" title="MIS Dashboard"><MISDashboard /></MainLayout>} />
        <Route path="/mis/daily-activities" element={<MainLayout role="mis" title="Daily Activity Management"><DailyActivityManagement /></MainLayout>} />
        <Route path="/mis/ready-for-migration" element={<MainLayout role="mis" title="Ready for Migration"><ReadyForMigration /></MainLayout>} />
        <Route path="/mis/curriculum" element={<MainLayout role="mis" title="Curriculum Management"><CurriculumManagement /></MainLayout>} />

        {/* Company HR Routes */}
        <Route path="/company-hr/dashboard" element={<MainLayout role="company_hr" title="Dashboard"><CompanyHRDashboard /></MainLayout>} />
        <Route path="/company-hr/batch-management" element={<MainLayout role="company_hr" title="Batch Management"><CompanyHRBatchManagement /></MainLayout>} />
        <Route path="/company-hr/candidate-management" element={<MainLayout role="company_hr" title="Candidate Management"><CompanyHRCandidateManagement /></MainLayout>} />
        <Route path="/company-hr/travel-management" element={<MainLayout role="company_hr" title="Travel Management"><CompanyHRTravelManagement /></MainLayout>} />
        <Route path="/company-hr/interview-scheduler" element={<MainLayout role="company_hr" title="Interview Scheduler"><CompanyHRInterviewScheduler /></MainLayout>} />
        <Route path="/company-hr/feedback-management" element={<MainLayout role="company_hr" title="Feedback Management"><CompanyHRFeedbackManagement /></MainLayout>} />
        <Route path="/company-hr/reports" element={<MainLayout role="company_hr" title="Reports"><CompanyHRReports /></MainLayout>} />
        <Route path="/company-hr/profile" element={<MainLayout role="company_hr" title="Profile"><CompanyHRProfile /></MainLayout>} />

        {/* PPC Admin Routes */}
        <Route path="/ppc-admin/dashboard" element={<MainLayout role="ppc_admin" title="Dashboard"><PPCAdminDashboard /></MainLayout>} />
        <Route path="/ppc-admin/pre-placement" element={<MainLayout role="ppc_admin" title="Pre-Placement Compliance"><PPCAdminPrePlacement /></MainLayout>} />
        <Route path="/ppc-admin/post-placement" element={<MainLayout role="ppc_admin" title="Post-Placement Management"><PPCAdminPostPlacement /></MainLayout>} />
        <Route path="/ppc-admin/poc-management" element={<MainLayout role="ppc_admin" title="POC Management"><PPCAdminPOCManagement /></MainLayout>} />
        <Route path="/ppc-admin/sos-monitoring" element={<MainLayout role="ppc_admin" title="SOS Monitoring"><PPCAdminSOSMonitoring /></MainLayout>} />
        <Route path="/ppc-admin/reports" element={<MainLayout role="ppc_admin" title="Reports & Analytics"><PPCAdminReports /></MainLayout>} />
        <Route path="/ppc-admin/profile" element={<MainLayout role="ppc_admin" title="Profile"><PPCAdminProfile /></MainLayout>} />

        {/* POC Routes */}
        <Route path="/poc/dashboard" element={<MainLayout role="poc" title="Dashboard"><POCDashboard /></MainLayout>} />
        <Route path="/poc/visits" element={<MainLayout role="poc" title="Visit Management"><POCVisitManagement /></MainLayout>} />
        <Route path="/poc/sos" element={<MainLayout role="poc" title="SOS Management"><POCSOSManagement /></MainLayout>} />
        <Route path="/poc/travel" element={<MainLayout role="poc" title="Travel Management"><POCTravelManagement /></MainLayout>} />
        <Route path="/poc/welfare" element={<MainLayout role="poc" title="Welfare Facilitation"><POCWelfareFacilitation /></MainLayout>} />
        <Route path="/poc/reports" element={<MainLayout role="poc" title="Reports"><POCReports /></MainLayout>} />
        <Route path="/poc/profile" element={<MainLayout role="poc" title="Profile"><POCProfile /></MainLayout>} />
            
            {/* Catch-all route */}
            {/* Admin Department Routes */}
            <Route path="/admin-department/dashboard" element={<MainLayout role="admin" title="Administration Dashboard"><AdminDeptDashboard /></MainLayout>} />
            <Route path="/admin-department/property-management" element={<MainLayout role="admin" title="Property Management"><PropertyManagement /></MainLayout>} />
            <Route path="/admin-department/rent-management" element={<MainLayout role="admin" title="Rent Management"><RentManagement /></MainLayout>} />
            <Route path="/admin-department/vendor-management" element={<MainLayout role="admin" title="Vendor Management"><VendorManagement /></MainLayout>} />
            <Route path="/admin-department/food-vendor-management" element={<MainLayout role="admin" title="Food Vendor Management"><FoodVendorManagement /></MainLayout>} />
            <Route path="/admin-department/expense-management" element={<MainLayout role="admin" title="Expense Management"><ExpenseManagement /></MainLayout>} />
            <Route path="/admin-department/petty-cash-management" element={<MainLayout role="admin" title="Petty Cash Management"><PettyCashManagement /></MainLayout>} />
            <Route path="/admin-department/purchase-order-management" element={<MainLayout role="admin" title="Purchase Order Management"><PurchaseOrderManagement /></MainLayout>} />
            <Route path="/admin-department/ticket-booking" element={<MainLayout role="admin" title="Ticket Booking"><TicketBooking /></MainLayout>} />
            <Route path="/admin-department/ticket-booking-approval" element={<MainLayout role="admin" title="Ticket Booking Approval"><TicketBookingApproval /></MainLayout>} />
            <Route path="/admin-department/reports" element={<MainLayout role="admin" title="Reports"><AdminDeptReports /></MainLayout>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </Provider>
  );
};

export default App;
