import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchMobilisationData, setFilters } from '@/store/slices/directorSlice';
import { KPIRow } from '@/components/mobilisation/KPIRow';
import { ConversionFunnel } from '@/components/director/ConversionFunnel';
import { StateLeaderboard } from '@/components/director/StateLeaderboard';
import { ClusterPerformanceTable } from '@/components/director/ClusterPerformanceTable';
import { ActivityMetricsPanel } from '@/components/director/ActivityMetricsPanel';
import { ActivityDetailsDialog } from '@/components/director/ActivityDetailsDialog';
import { CandidatePipelineFlow } from '@/components/director/CandidatePipelineFlow';
import { CentreHealthPanel } from '@/components/director/CentreHealthPanel';
import { TargetAssignmentDialog } from '@/components/director/TargetAssignmentDialog';
import { ReportScheduleDialog } from '@/components/director/ReportScheduleDialog';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Calendar, Download, Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DateRange } from 'react-day-picker';

const MobilisationMonitoring = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mobilisationData, filters, isLoading } = useAppSelector((state) => state.director);

  const [targetDialogOpen, setTargetDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMobilisationData(filters));
  }, [dispatch, filters]);

  const handleExport = () => {
    console.log('Exporting mobilisation data...');
    // Implement export logic
  };

  const kpis = mobilisationData ? {
    stateTarget: mobilisationData.nationalTarget,
    achieved: mobilisationData.achieved,
    percentAchieved: mobilisationData.achievementPercent,
    activeClusters: mobilisationData.clusterPerformance.length,
    onTrackPercentage: 75,
    mobilisations: mobilisationData.conversionFunnel.mobilisations,
    counselling: mobilisationData.conversionFunnel.counselling,
    enrollments: mobilisationData.conversionFunnel.enrollments,
  } : null;

  return (
    <MainLayout role="director">
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">National Mobilisation Monitoring</h1>
            <p className="text-muted-foreground">Real-time mobilisation tracking across all states</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Mobile Filter Button */}
            <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <DateRangePicker
                    dateRange={filters.dateRange[0] && filters.dateRange[1] ? { from: new Date(filters.dateRange[0]), to: new Date(filters.dateRange[1]) } : undefined}
                    onDateRangeChange={(range) => dispatch(setFilters({ dateRange: [range?.from?.toISOString() || null, range?.to?.toISOString() || null] }))}
                  />
                  <Select value={filters.state} onValueChange={(value) => dispatch(setFilters({ state: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All States" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.program} onValueChange={(value) => dispatch(setFilters({ program: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Programs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      <SelectItem value="retail">Retail Management</SelectItem>
                      <SelectItem value="healthcare">Healthcare Assistant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-3">
              <DateRangePicker
                dateRange={filters.dateRange[0] && filters.dateRange[1] ? { from: new Date(filters.dateRange[0]), to: new Date(filters.dateRange[1]) } : undefined}
                onDateRangeChange={(range) => dispatch(setFilters({ dateRange: [range?.from?.toISOString() || null, range?.to?.toISOString() || null] }))}
              />
              
              <Select value={filters.state} onValueChange={(value) => dispatch(setFilters({ state: value }))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
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
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="retail">Retail Management</SelectItem>
                  <SelectItem value="healthcare">Healthcare Assistant</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.cluster} onValueChange={(value) => dispatch(setFilters({ cluster: value }))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Clusters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clusters</SelectItem>
                  <SelectItem value="mumbai">Mumbai Metro</SelectItem>
                  <SelectItem value="pune">Pune Region</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setTargetDialogOpen(true)}>
              <Target className="mr-2 h-4 w-4" />
              Assign Targets
            </Button>

            <Button onClick={() => setReportDialogOpen(true)} variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Report
            </Button>

            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Section 1: National Target Summary */}
        <KPIRow kpis={kpis} isLoading={isLoading} />

        {/* Section 2: Conversion Funnel */}
        <ConversionFunnel 
          funnel={mobilisationData?.conversionFunnel} 
          isLoading={isLoading} 
        />

        {/* Section 3: State & Cluster Performance */}
        <div className="grid gap-6 lg:grid-cols-2">
          <StateLeaderboard 
            states={mobilisationData?.stateLeaderboard || []} 
            isLoading={isLoading} 
          />
            <ActivityMetricsPanel 
              activities={mobilisationData?.activities} 
              isLoading={isLoading}
              onCardClick={() => setActivityDialogOpen(true)}
            />
        </div>

        <ClusterPerformanceTable 
          clusters={mobilisationData?.clusterPerformance || []} 
          isLoading={isLoading} 
        />

        {/* Section 5: Candidate Pipeline */}
        <CandidatePipelineFlow 
          pipeline={mobilisationData?.candidatePipeline} 
          isLoading={isLoading} 
        />

        {/* Section 6: Centre Health Summary */}
        <CentreHealthPanel 
          centreHealth={mobilisationData?.centreHealth} 
          isLoading={isLoading} 
        />

        {/* Dialogs */}
        <TargetAssignmentDialog open={targetDialogOpen} onOpenChange={setTargetDialogOpen} />
        <ReportScheduleDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen} />
        <ActivityDetailsDialog
          open={activityDialogOpen}
          onOpenChange={setActivityDialogOpen}
          activities={mobilisationData?.activities.recentActivities || []}
        />
      </div>
    </MainLayout>
  );
};

export default MobilisationMonitoring;
