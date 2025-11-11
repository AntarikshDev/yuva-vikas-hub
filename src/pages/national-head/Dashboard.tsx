import React, { useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  fetchNHSummary,
  fetchNHStates,
  fetchNHProgramHealth,
  fetchNHCentreHealth,
  fetchNHAlerts,
  setFilters
} from '@/store/slices/nationalHeadSlice';
import { NHSummaryKPIs } from '@/components/national-head/NHSummaryKPIs';
import { NHStateHeatmap } from '@/components/national-head/NHStateHeatmap';
import { NHStateLeaderboard } from '@/components/national-head/NHStateLeaderboard';
import { NHProgramHealthCards } from '@/components/national-head/NHProgramHealthCards';
import { NHCentreHealthSnapshot } from '@/components/national-head/NHCentreHealthSnapshot';
import { NHAlertsPanel } from '@/components/national-head/NHAlertsPanel';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Download, Bell, Target } from 'lucide-react';

const NationalHeadDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { summary, statePerformance, programHealth, centreHealth, alerts, filters, isLoading } = useAppSelector(
    (state) => state.nationalHead
  );

  useEffect(() => {
    dispatch(fetchNHSummary(filters));
    dispatch(fetchNHStates(filters));
    dispatch(fetchNHProgramHealth());
    dispatch(fetchNHCentreHealth());
    dispatch(fetchNHAlerts());
  }, [dispatch, filters]);

  return (
    <MainLayout role="national-head">
      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">National Head Dashboard</h1>
            <p className="text-muted-foreground">Overview and performance metrics for assigned states</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <DateRangePicker
              dateRange={filters.dateRange[0] && filters.dateRange[1] ? { from: new Date(filters.dateRange[0]), to: new Date(filters.dateRange[1]) } : undefined}
              onDateRangeChange={(range) => dispatch(setFilters({ dateRange: [range?.from?.toISOString() || null, range?.to?.toISOString() || null] }))}
            />
            
            <Button variant="outline">
              <Target className="mr-2 h-4 w-4" />
              Assign Targets
            </Button>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Set Alerts
            </Button>
          </div>
        </div>

        {/* Section 1: Summary KPIs */}
        <NHSummaryKPIs summary={summary} isLoading={isLoading} />

        {/* Section 2: State Performance */}
        <div className="grid gap-6 lg:grid-cols-2">
          <NHStateHeatmap states={statePerformance} isLoading={isLoading} />
          <NHStateLeaderboard states={statePerformance} isLoading={isLoading} />
        </div>

        {/* Section 3: Program Health */}
        <NHProgramHealthCards programHealth={programHealth} isLoading={isLoading} />

        {/* Section 4: Centre Health Snapshot */}
        <NHCentreHealthSnapshot centreHealth={centreHealth} isLoading={isLoading} />

        {/* Section 5: Alerts & Tasks */}
        <NHAlertsPanel alerts={alerts} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
};

export default NationalHeadDashboard;
