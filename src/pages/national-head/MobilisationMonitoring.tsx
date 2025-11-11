import React, { useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchNHMobilisation, fetchMobiliserLeaderboard, fetchNHFunnel, setFilters } from '@/store/slices/nationalHeadSlice';
import { Button } from '@/components/ui/button';
import { Download, Bell, Target } from 'lucide-react';
import { NHClusterPerformanceTable } from '@/components/national-head/NHClusterPerformanceTable';
import { NHMobiliserLeaderboard } from '@/components/national-head/NHMobiliserLeaderboard';
import { NHMobilisationFunnel } from '@/components/national-head/NHMobilisationFunnel';
import { NHTargetVsAchieved } from '@/components/national-head/NHTargetVsAchieved';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Target as TargetIcon, TrendingUp, Users, Filter } from 'lucide-react';

const NationalHeadMobilisationMonitoring = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mobilisation, funnel, statePerformance, filters, isLoading } = useAppSelector((state) => state.nationalHead);

  useEffect(() => {
    dispatch(fetchNHMobilisation(filters));
    dispatch(fetchMobiliserLeaderboard(filters));
    dispatch(fetchNHFunnel(filters));
  }, [dispatch, filters]);

  const handleClusterDrillDown = (clusterId: string) => {
    navigate(`/cluster/${clusterId}/dashboard`);
  };

  const handleClusterExport = (clusterId: string) => {
    toast({
      title: 'Export Started',
      description: `Exporting data for cluster ${clusterId}...`,
    });
  };

  const handleSendMessage = (id: string) => {
    toast({
      title: 'Message Dialog',
      description: 'Message functionality will open here',
    });
  };

  const handleMobiliserProfile = (mobiliserId: string) => {
    navigate(`/mobiliser/${mobiliserId}/profile`);
  };

  const handleCall = (mobiliserId: string) => {
    toast({
      title: 'Call Initiated',
      description: `Calling mobiliser ${mobiliserId}...`,
    });
  };

  const kpiData = mobilisation?.topKPIs;
  const conversionRate = kpiData ? ((kpiData.achieved / kpiData.assignedTarget) * 100).toFixed(2) : '0';

  return (
    <MainLayout role="national-head">
      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mobilisation Monitoring</h1>
            <p className="text-muted-foreground">Track mobilisation performance across states and clusters</p>
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
              Send Notification
            </Button>
          </div>
        </div>

        {/* KPIs Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="State Target"
            value={kpiData?.assignedTarget.toLocaleString() || '0'}
            icon={<TargetIcon className="h-5 w-5" />}
            trend={{ value: 100, isPositive: true }}
          />
          <EnhancedStatCard
            title="Achieved"
            value={kpiData?.achieved.toLocaleString() || '0'}
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: Number(conversionRate), isPositive: true }}
          />
          <EnhancedStatCard
            title="Active Clusters"
            value={kpiData?.activeClusters.toString() || '0'}
            icon={<Users className="h-5 w-5" />}
          />
          <EnhancedStatCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            icon={<Filter className="h-5 w-5" />}
            trend={{ value: Number(conversionRate), isPositive: Number(conversionRate) > 70 }}
          />
        </div>

        {/* Mobilisation Funnel */}
        <NHMobilisationFunnel funnel={funnel} isLoading={isLoading} />

        {/* Target vs Achieved */}
        <NHTargetVsAchieved 
          weeklyTrend={[
            { week: 'W1', target: 3000, achieved: kpiData?.achieved ? Math.floor(kpiData.achieved * 0.2) : 0 },
            { week: 'W2', target: 3000, achieved: kpiData?.achieved ? Math.floor(kpiData.achieved * 0.22) : 0 },
            { week: 'W3', target: 3000, achieved: kpiData?.achieved ? Math.floor(kpiData.achieved * 0.28) : 0 },
            { week: 'W4', target: 3000, achieved: kpiData?.achieved ? Math.floor(kpiData.achieved * 0.3) : 0 },
          ]} 
          topStates={statePerformance} 
          isLoading={isLoading} 
        />

        {/* Cluster Performance Table */}
        <NHClusterPerformanceTable
          clusters={mobilisation?.clusters || []}
          isLoading={isLoading}
          onDrillDown={handleClusterDrillDown}
          onExport={handleClusterExport}
          onSendMessage={handleSendMessage}
        />

        {/* Mobiliser Leaderboard */}
        <NHMobiliserLeaderboard
          mobilisers={mobilisation?.mobiliserLeaderboard || []}
          isLoading={isLoading}
          onViewProfile={handleMobiliserProfile}
          onSendMessage={handleSendMessage}
          onCall={handleCall}
        />
      </div>
    </MainLayout>
  );
};

export default NationalHeadMobilisationMonitoring;
