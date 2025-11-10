import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { 
  fetchNationalKPIs, 
  fetchTargetTracking, 
  fetchStatePerformance,
  fetchCompliance,
  setFilters
} from '@/store/slices/directorSlice';
import { NationalKPICards } from '@/components/director/NationalKPICards';
import { TargetTrackingSection } from '@/components/director/TargetTrackingSection';
import { StateHeatmap } from '@/components/director/StateHeatmap';
import { CompliancePanel } from '@/components/director/CompliancePanel';
import { BatchLaunchAlerts } from '@/components/director/BatchLaunchAlerts';
import { AIInsightsPanel } from '@/components/director/AIInsightsPanel';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ExportDialog } from '@/components/director/ExportDialog';
import { KPIAlertDialog } from '@/components/director/KPIAlertDialog';

const DirectorDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { nationalKPIs, targetTracking, statePerformance, compliance, filters, isLoading } = useAppSelector(
    (state) => state.director
  );

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNationalKPIs());
    dispatch(fetchTargetTracking());
    dispatch(fetchStatePerformance());
    dispatch(fetchCompliance());
  }, [dispatch, filters]);

  return (
    <MainLayout role="director">
      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Director Dashboard</h1>
            <p className="text-muted-foreground">National-level overview and performance metrics</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <DateRangePicker
              value={filters.dateRange}
              onChange={(range) => dispatch(setFilters({ dateRange: range }))}
            />
            
            <Select value={filters.state} onValueChange={(value) => dispatch(setFilters({ state: value }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All States</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.program} onValueChange={(value) => dispatch(setFilters({ program: value }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Programs</SelectItem>
                <SelectItem value="retail">Retail Management</SelectItem>
                <SelectItem value="healthcare">Healthcare Assistant</SelectItem>
                <SelectItem value="hospitality">Hospitality Services</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setExportDialogOpen(true)} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button onClick={() => setAlertDialogOpen(true)} variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Set Alerts
            </Button>
          </div>
        </div>

        {/* Section 1: Overview Metrics */}
        <NationalKPICards kpis={nationalKPIs} isLoading={isLoading} />

        {/* Section 2: Target Tracking & Achievements */}
        <TargetTrackingSection targetTracking={targetTracking} isLoading={isLoading} />

        {/* Section 3: Program Health */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Program Health</h2>
          <StateHeatmap statePerformance={statePerformance} isLoading={isLoading} />
        </Card>

        {/* Section 4: Compliance & Alerts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CompliancePanel compliance={compliance} isLoading={isLoading} />
          <BatchLaunchAlerts batches={compliance?.upcomingBatches || []} isLoading={isLoading} />
        </div>

        {/* Section 5: AI & Insights */}
        <AIInsightsPanel />

        {/* Dialogs */}
        <ExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />
        <KPIAlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen} />
      </div>
    </MainLayout>
  );
};

export default DirectorDashboard;
