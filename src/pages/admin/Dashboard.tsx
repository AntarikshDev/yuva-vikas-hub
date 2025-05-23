
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { FilterBar } from '@/components/common/FilterBar';
import { Button } from '@/components/ui/button';

const SuperAdminDashboard: React.FC = () => {
  // This would come from API in a real application
  const dashboardData = {
    totalCandidates: 12458,
    activeBatches: 45,
    placedCandidatesThisMonth: 876,
    retentionRate: 82,
    mobilizeEngagement: 78,
    sosAlerts: 5,
  };
  
  const filterOptions = [
    {
      id: 'date',
      label: 'Date Range',
      type: 'date' as const,
    },
    {
      id: 'state',
      label: 'State',
      type: 'select' as const,
      options: [
        { value: 'maharashtra', label: 'Maharashtra' },
        { value: 'gujarat', label: 'Gujarat' },
        { value: 'karnataka', label: 'Karnataka' },
      ],
    },
    {
      id: 'jobRole',
      label: 'Job Role',
      type: 'select' as const,
      options: [
        { value: 'healthcare', label: 'Health Care' },
        { value: 'retail', label: 'Retail' },
        { value: 'hospitality', label: 'Hospitality' },
      ],
    },
  ];

  return (
    <MainLayout role="super_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of Skill Development platform metrics and performance.
          </p>
        </div>
        
        <FilterBar
          filters={filterOptions}
          actions={
            <>
              <Button variant="outline">Export Dashboard</Button>
              <Button>Set KPI Alerts</Button>
            </>
          }
        />

        <section className="space-y-6">
          {/* Stats Cards Row */}
          <DashboardGrid>
            <StatCard
              title="Total Candidates Registered"
              value={dashboardData.totalCandidates.toLocaleString()}
              icon={<span className="text-lg">👥</span>}
              trend={{ value: 12, isPositive: true }}
              intent="primary"
            />
            <StatCard
              title="Active Batches"
              value={dashboardData.activeBatches}
              icon={<span className="text-lg">📚</span>}
              trend={{ value: 5, isPositive: true }}
              intent="secondary"
            />
            <StatCard
              title="Placed Candidates This Month"
              value={dashboardData.placedCandidatesThisMonth}
              icon={<span className="text-lg">🎯</span>}
              trend={{ value: 8, isPositive: true }}
              intent="success"
            />
            <StatCard
              title="Retention Rate"
              value={`${dashboardData.retentionRate}%`}
              icon={<span className="text-lg">📈</span>}
              trend={{ value: 3, isPositive: false }}
              intent="info"
            />
            <StatCard
              title="Mobilizer Engagement"
              value={`${dashboardData.mobilizeEngagement}%`}
              icon={<span className="text-lg">📱</span>}
              trend={{ value: 7, isPositive: true }}
            />
            <StatCard
              title="SOS Alerts This Week"
              value={dashboardData.sosAlerts}
              icon={<span className="text-lg">🚨</span>}
              intent="error"
            />
          </DashboardGrid>

          {/* Charts Row */}
          <DashboardGrid columns={{ sm: 1, md: 1, lg: 2 }}>
            <ChartCard
              title="Mobilization vs Placement Trend"
              subtitle="Monthly comparison of mobilized vs placed candidates"
              filters={
                <Button variant="ghost" size="sm">
                  Filter
                </Button>
              }
              className="min-h-[300px]"
            >
              <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-neutral-500">
                  Area Chart: Monthly trend data visualization would appear here
                </div>
              </div>
            </ChartCard>
            
            <ChartCard
              title="Candidate Category Distribution"
              subtitle="Breakdown by A/B/C categories"
              className="min-h-[300px]"
            >
              <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-neutral-500">
                  Pie Chart: Category distribution data would appear here
                </div>
              </div>
            </ChartCard>
          </DashboardGrid>

          <DashboardGrid columns={{ sm: 1, md: 1, lg: 2 }}>
            <ChartCard
              title="Center-Wise Batch Status"
              className="min-h-[300px]"
            >
              <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-neutral-500">
                  Bar Graph: Center-wise batch status would appear here
                </div>
              </div>
            </ChartCard>
            
            <ChartCard
              title="District-Wise Dropout Intensity"
              className="min-h-[300px]"
            >
              <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-neutral-500">
                  Heatmap: District-wise dropout data would appear here
                </div>
              </div>
            </ChartCard>
          </DashboardGrid>
        </section>
      </div>
    </MainLayout>
  );
};

export default SuperAdminDashboard;
