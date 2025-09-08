import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { EnhancedFilterBar } from '@/components/common/EnhancedFilterBar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DateRange } from 'react-day-picker';
import { Download, FileSpreadsheet, BarChart4 } from 'lucide-react';
import CurriculumProgressCard from '@/components/dashboard/CurriculumProgressCard';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const StateHeadDashboard: React.FC = () => {
  // Add state for date range
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  // Mock dashboard data
  const dashboardData = {
    totalCandidates: 4568,
    placedCandidates: 387,
    activeMobilizers: 42,
    placementPercentage: 85,
  };

  // Chart data
  const mobilizationPlacementData = [
    { month: 'Jan', mobilization: 450, placement: 380, target: 400 },
    { month: 'Feb', mobilization: 520, placement: 420, target: 450 },
    { month: 'Mar', mobilization: 380, placement: 320, target: 400 },
    { month: 'Apr', mobilization: 650, placement: 580, target: 500 },
    { month: 'May', mobilization: 720, placement: 640, target: 550 },
    { month: 'Jun', mobilization: 580, placement: 520, target: 500 },
    { month: 'Jul', mobilization: 680, placement: 600, target: 550 },
  ];

  const categoryData = [
    { name: 'Category A', value: 45, color: 'hsl(var(--primary))' },
    { name: 'Category B', value: 35, color: 'hsl(var(--secondary))' },
    { name: 'Category C', value: 20, color: 'hsl(var(--accent))' },
  ];

  const districtCompletionData = [
    { district: 'Mumbai', completion: 92, placement: 88 },
    { district: 'Pune', completion: 85, placement: 82 },
    { district: 'Nagpur', completion: 79, placement: 75 },
    { district: 'Aurangabad', completion: 81, placement: 78 },
    { district: 'Nashik', completion: 87, placement: 84 },
  ];

  const retentionData = [
    { role: 'Retail Sales', month1: 95, month3: 88, month6: 82, month12: 75 },
    { role: 'Customer Service', month1: 92, month3: 85, month6: 78, month12: 70 },
    { role: 'Banking & Finance', month1: 97, month3: 90, month6: 85, month12: 80 },
    { role: 'IT/ITES', month1: 93, month3: 87, month6: 81, month12: 76 },
    { role: 'Healthcare', month1: 96, month3: 89, month6: 83, month12: 78 },
  ];
  
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
      type: 'date-range' as const,
    },
  ];
  
  // Handle filter changes
  const handleFilterChange = (filterId: string, value: any) => {
    if (filterId === 'dateRange') {
      setDateRange(value);
    }
    // Handle other filter changes as needed
    console.log("Filter changed:", filterId, value);
  };
  
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
        
        <EnhancedFilterBar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          actions={
            <>
              <Button variant="outline" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Export CSV
              </Button>
              <Button className="flex items-center gap-2">
                <BarChart4 className="h-4 w-4" />
                Detailed Report
              </Button>
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
              className="min-h-[300px] hover:shadow-xl transition-all duration-300"
            >
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={mobilizationPlacementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="mobilizationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="placementGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
                    </linearGradient>
                    <filter id="dropshadow" height="130%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                      <feOffset dx="2" dy="2" result="offset" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.2"/>
                      </feComponentTransfer>
                      <feMerge> 
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/> 
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="mobilization"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#mobilizationGradient)"
                    strokeWidth={3}
                    filter="url(#dropshadow)"
                    name="Mobilization"
                  />
                  <Area
                    type="monotone"
                    dataKey="placement"
                    stroke="hsl(var(--secondary))"
                    fillOpacity={1}
                    fill="url(#placementGradient)"
                    strokeWidth={3}
                    filter="url(#dropshadow)"
                    name="Placement"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="Target"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            
            <ChartCard
              title="Category-wise Distribution"
              subtitle="A/B/C candidate categorization"
              className="min-h-[300px] hover:shadow-xl transition-all duration-300"
            >
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <defs>
                    <filter id="pieDropshadow" height="130%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                      <feOffset dx="3" dy="3" result="offset" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                      </feComponentTransfer>
                      <feMerge> 
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/> 
                      </feMerge>
                    </filter>
                  </defs>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    startAngle={90}
                    endAngle={450}
                    paddingAngle={3}
                    dataKey="value"
                    filter="url(#pieDropshadow)"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="hsl(var(--background))"
                        strokeWidth={3}
                        style={{
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => `${value}`}
                  />
                </PieChart>
              </ResponsiveContainer>
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
              className="min-h-[300px] hover:shadow-xl transition-all duration-300"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={districtCompletionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="placementBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.6}/>
                    </linearGradient>
                    <filter id="barDropshadow" height="130%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                      <feOffset dx="2" dy="3" result="offset" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.2"/>
                      </feComponentTransfer>
                      <feMerge> 
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/> 
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="district" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Rate']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="completion"
                    fill="url(#completionGradient)"
                    radius={[4, 4, 0, 0]}
                    filter="url(#barDropshadow)"
                    name="Completion Rate"
                  />
                  <Bar
                    dataKey="placement"
                    fill="url(#placementBarGradient)"
                    radius={[4, 4, 0, 0]}
                    filter="url(#barDropshadow)"
                    name="Placement Rate"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            
            <ChartCard
              title="Retention Rate by Job Role"
              className="min-h-[300px] hover:shadow-xl transition-all duration-300"
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={retentionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="month1Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="month3Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="month6Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="month12Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--muted))" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="hsl(var(--muted))" stopOpacity={0.7}/>
                    </linearGradient>
                    <filter id="stackedDropshadow" height="130%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                      <feOffset dx="1" dy="2" result="offset" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.2"/>
                      </feComponentTransfer>
                      <feMerge> 
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/> 
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="role" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Retention Rate']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="month1"
                    stackId="a"
                    fill="url(#month1Gradient)"
                    radius={[0, 0, 0, 0]}
                    filter="url(#stackedDropshadow)"
                    name="1 Month"
                  />
                  <Bar
                    dataKey="month3"
                    stackId="a"
                    fill="url(#month3Gradient)"
                    radius={[0, 0, 0, 0]}
                    filter="url(#stackedDropshadow)"
                    name="3 Months"
                  />
                  <Bar
                    dataKey="month6"
                    stackId="a"
                    fill="url(#month6Gradient)"
                    radius={[0, 0, 0, 0]}
                    filter="url(#stackedDropshadow)"
                    name="6 Months"
                  />
                  <Bar
                    dataKey="month12"
                    stackId="a"
                    fill="url(#month12Gradient)"
                    radius={[4, 4, 0, 0]}
                    filter="url(#stackedDropshadow)"
                    name="12 Months"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </DashboardGrid>
        </section>

        {/* Curriculum Progress Section */}
        <section className="space-y-6">
          <CurriculumProgressCard userRole="state-head" />
        </section>
      </div>
    </MainLayout>
  );
};

export default StateHeadDashboard;
