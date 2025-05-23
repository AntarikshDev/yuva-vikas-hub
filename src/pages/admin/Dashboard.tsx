
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
    totalStudents: 12846,
    activeCenters: 148,
    placementRate: 78,
    retentionRate: 82,
    
    // Program data
    programData: [
      { name: 'UPSDM Program', value: 4862, target: 5000 },
      { name: 'DDUGKY Program', value: 3215, target: 4000 },
      { name: 'BSDM Program', value: 2890, target: 3000 },
      { name: 'PMKVY Program', value: 1879, target: 2500 },
    ],
    
    // Recent activities
    recentActivities: [
      { 
        title: 'New center approved in Bihar',
        time: '2 hours ago',
        actor: 'State Manager'
      }
    ],
    
    // Placement data
    placementCompanies: [
      { name: 'TCS', count: 120 },
      { name: 'Wipro', count: 85 },
      { name: 'Infosys', count: 65 },
      { name: 'HCL', count: 52 },
    ]
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
            Overview of skills development platform metrics.
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
              title="Total Students Registered"
              value={dashboardData.totalStudents.toLocaleString()}
              icon={<span className="text-lg">👥</span>}
              trend={{ value: 12, isPositive: true }}
              intent="primary"
              footer="Across all states"
            />
            <StatCard
              title="Active Centers"
              value={dashboardData.activeCenters}
              icon={<span className="text-lg">🏢</span>}
              intent="secondary"
              footer="In 22 states"
            />
            <StatCard
              title="Placement Rate"
              value={`${dashboardData.placementRate}%`}
              icon={<span className="text-lg">🎯</span>}
              trend={{ value: 5, isPositive: true }}
              intent="success"
              footer="Last 6 months"
            />
            <StatCard
              title="Retention Rate"
              value={`${dashboardData.retentionRate}%`}
              icon={<span className="text-lg">📈</span>}
              intent="info"
              footer="After 6 months"
            />
          </DashboardGrid>

          <h2 className="text-xl font-semibold mt-8 mb-4">Program Performance</h2>
          
          {/* Program Performance Cards */}
          <DashboardGrid>
            {dashboardData.programData.map((program) => (
              <div key={program.name} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="mb-2">
                  <div className="text-sm text-gray-600">{program.name}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{program.value}</div>
                    <div className="text-sm text-gray-500">Target: {program.target}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(program.value / program.target) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </DashboardGrid>

          {/* Activity and Placement Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChartCard
              title="Recent Activities"
              subtitle="Latest system activities across states"
              className="min-h-[300px]"
            >
              <div className="mt-4">
                {dashboardData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start py-3 border-b border-gray-100">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <span className="text-purple-700">⏱️</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.title}</div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>{activity.time}</span>
                        <span className="mx-2">•</span>
                        <span>{activity.actor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
            
            <ChartCard
              title="Placement Overview"
              subtitle="Last 30 days placement statistics"
              className="min-h-[300px]"
            >
              <div className="mt-4 space-y-3">
                {dashboardData.placementCompanies.map((company) => (
                  <div key={company.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{company.name}</span>
                      <span className="text-sm">{company.count} placements</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(company.count / 120) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-green-50 mt-4 rounded-md">
                  <div className="text-green-800 font-medium">Login successful</div>
                  <div className="text-green-600 text-sm">Welcome back to LNJ Skills platform</div>
                </div>
              </div>
            </ChartCard>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default SuperAdminDashboard;
