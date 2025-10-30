import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  fetchStateKPIs,
  fetchClusters,
  fetchAlerts,
  setFilters,
  setSelectedCluster,
} from '@/store/slices/mobilisationSlice';
import { KPIRow } from '@/components/mobilisation/KPIRow';
import { DistrictTable } from '@/components/mobilisation/DistrictTable';
import { DetailPanel } from '@/components/mobilisation/DetailPanel';
import { ChartsSection } from '@/components/mobilisation/ChartsSection';
import { FilterBar } from '@/components/mobilisation/FilterBar';
import { TargetAssignmentDialog } from '@/components/mobilisation/TargetAssignmentDialog';
import { ReportScheduleDialog } from '@/components/mobilisation/ReportScheduleDialog';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Target, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MobilisationMonitoring() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    stateKPIs,
    clusters,
    selectedCluster,
    filters,
    isLoading,
  } = useAppSelector((state) => state.mobilisation);

  const [targetDialogOpen, setTargetDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchStateKPIs(filters));
    dispatch(fetchClusters(filters));
    dispatch(fetchAlerts());
  }, [dispatch, filters]);

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // Integration point for export API
    console.log('Export as:', format);
    // Call: POST /api/mobilisation/export { format, filters }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header & Toolbar */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Mobilisation Monitoring — State Level
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterDrawerOpen(true)}
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setReportDialogOpen(true)}
              >
                <Calendar className="w-4 h-4" />
                Schedule Report
              </Button>

              <Button
                size="sm"
                onClick={() => setTargetDialogOpen(true)}
              >
                <Target className="w-4 h-4" />
                Assign Targets
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* KPI Row */}
        <KPIRow kpis={stateKPIs} isLoading={isLoading} />

        {/* Charts Section */}
        <ChartsSection className="mt-6" />

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left: Cluster Table */}
          <div className="lg:col-span-2">
            <DistrictTable
              clusters={clusters}
              isLoading={isLoading}
              onClusterSelect={(cluster) => dispatch(setSelectedCluster(cluster))}
              selectedClusterId={selectedCluster?.id}
            />
          </div>

          {/* Right: Detail Panel */}
          <div className="lg:col-span-1">
            <DetailPanel cluster={selectedCluster} />
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <TargetAssignmentDialog
        open={targetDialogOpen}
        onOpenChange={setTargetDialogOpen}
      />

      <ReportScheduleDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
      />

      <FilterBar
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        filters={filters}
        onFiltersChange={(newFilters) => dispatch(setFilters(newFilters))}
      />
    </div>
  );
}
