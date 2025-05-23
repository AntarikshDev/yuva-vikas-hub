
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { FilterBar } from '@/components/common/FilterBar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';

const StateHeadDashboard: React.FC = () => {
  // Mock dashboard data
  const dashboardData = {
    totalCandidates: 4568,
    placedCandidates: 387,
    activeMobilizers: 42,
    placementPercentage: 85,
  };
  
  const filterOptions = [
    {
      id: 'district',
      label: 'District',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Districts' },
        { value: 'mumbai', label: 'Mumbai' },
        { value: 'pune', label: 'Pune' },
        { value: 'nagpur', label: 'Nagpur' },
      ],
    },
    {
      id: 'center',
      label: 'Center',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Centers' },
        { value: 'mumbai-central', label: 'Mumbai Central' },
        { value: 'pune-east', label: 'Pune East' },
        { value: 'nagpur-south', label: 'Nagpur South' },
      ],
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'date' as const,
    },
  ];
  
  // Performance metrics for districts
  const districtPerformance = [
    {
      name: 'Mumbai',
      candidates: 1842,
      batches: 15,
      completionRate: 92,
      placementRate: 88,
      trend: 'up',
    },
    {
      name: 'Pune',
      candidates: 1254,
      batches: 12,
      completionRate: 85,
      placementRate: 82,
      trend: 'up',
    },
    {
      name: 'Nagpur',
      candidates: 953,
      batches: 8,
      completionRate: 79,
      placementRate: 75,
      trend: 'down',
    },
    {
      name: 'Aurangabad',
      candidates: 519,
      batches: 6,
      completionRate: 81,
      placementRate: 78,
      trend: 'up',
    },
  ];

  return (
    <MainLayout role="state_head">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">State Dashboard</h1>
          <p className="text-muted-foreground">
            Maharashtra state overview and performance metrics
          </p>
        </div>
        
        <FilterBar
          filters={filterOptions}
          actions={
            <>
              <Button variant="outline">Export Dashboard</Button>
              <Button>Detailed Report</Button>
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
              trend={{ value: 8, isPositive: true }}
              intent="primary"
            />
            <StatCard
              title="Placed Candidates (This Month)"
              value={dashboardData.placedCandidates}
              icon={<span className="text-lg">🎯</span>}
              trend={{ value: 12, isPositive: true }}
              intent="success"
            />
            <StatCard
              title="Active Mobilizers"
              value={dashboardData.activeMobilizers}
              icon={<span className="text-lg">📱</span>}
              trend={{ value: 3, isPositive: false }}
              intent="secondary"
            />
            <StatCard
              title="Placement % (Batch-wise)"
              value={`${dashboardData.placementPercentage}%`}
              icon={<span className="text-lg">📈</span>}
              trend={{ value: 5, isPositive: true }}
              intent="info"
            />
          </DashboardGrid>

          {/* Charts Row */}
          <DashboardGrid columns={{ sm: 1, md: 1, lg: 2 }}>
            <ChartCard
              title="Monthly Mobilization vs Placement Trend"
              className="min-h-[300px]"
            >
              <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-neutral-500">
                  Line Chart: Monthly trend data visualization would appear here
                </div>
              </div>
            </ChartCard>
            
            <ChartCard
              title="Category-wise Distribution"
              subtitle="A/B/C candidate categorization"
              className="min-h-[300px]"
            >
              <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-neutral-500">
                  Donut Chart: Category distribution visualization would appear here
                </div>
              </div>
            </ChartCard>
          </DashboardGrid>

          {/* District Performance Table */}
          <div className="rounded-md border">
            <div className="border-b bg-neutral-50 px-4 py-3">
              <h3 className="font-semibold">District Performance Overview</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-neutral-50 text-sm text-neutral-600">
                    <th className="p-3 text-left">District</th>
                    <th className="p-3 text-left">Candidates</th>
                    <th className="p-3 text-left">Batches</th>
                    <th className="p-3 text-left">Completion Rate</th>
                    <th className="p-3 text-left">Placement Rate</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {districtPerformance.map((district) => (
                    <tr key={district.name} className="border-b hover:bg-neutral-50">
                      <td className="p-3">
                        <div className="font-medium">{district.name}</div>
                      </td>
                      <td className="p-3">{district.candidates}</td>
                      <td className="p-3">{district.batches}</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <span className="mr-2">{district.completionRate}%</span>
                          <StatusBadge
                            variant={district.completionRate >= 85 ? 'success' : district.completionRate >= 75 ? 'warning' : 'error'}
                            label={district.trend === 'up' ? '↑' : '↓'}
                            size="sm"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <span className="mr-2">{district.placementRate}%</span>
                          <StatusBadge
                            variant={district.placementRate >= 85 ? 'success' : district.placementRate >= 75 ? 'warning' : 'error'}
                            label={district.trend === 'up' ? '↑' : '↓'}
                            size="sm"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Charts Row */}
          <DashboardGrid columns={{ sm: 1, md: 1, lg: 2 }}>
            <ChartCard
              title="Batch Completion Rate by District"
              className="min-h-[300px]"
            >
              <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-neutral-500">
                  Bar Graph: Batch completion rate visualization would appear here
                </div>
              </div>
            </ChartCard>
            
            <ChartCard
              title="Retention Rate by Job Role"
              className="min-h-[300px]"
            >
              <div className="flex h-64 items-center justify-center">
                <div className="text-sm text-neutral-500">
                  Stacked Column Chart: Retention rate by job role would appear here
                </div>
              </div>
            </ChartCard>
          </DashboardGrid>
        </section>
      </div>
    </MainLayout>
  );
};

export default StateHeadDashboard;
