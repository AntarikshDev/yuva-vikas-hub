
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

// State Head Routes
import StateHeadDashboard from "./pages/state-head/Dashboard";

// Mobilizer App Routes
import MobilizerNewCandidate from "./pages/mobilizer/NewCandidate";

// Candidate App Routes
import CandidateHome from "./pages/candidate/Home";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin Panel Routes */}
          <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/admin/candidates" element={<CandidateDirectory />} />
          
          {/* State Head Routes */}
          <Route path="/state-head/dashboard" element={<StateHeadDashboard />} />
          
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

export default App;
