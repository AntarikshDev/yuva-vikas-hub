
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { FilterBar } from '@/components/common/FilterBar';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowUpRight, Book, Building, Calendar, ChevronRight, LineChart, Percent, Target, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { KpiAlertForm } from '@/components/forms/KpiAlertForm';

const SuperAdminDashboard: React.FC = () => {
  const [kpiAlertOpen, setKpiAlertOpen] = useState(false);
  
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
      },
      { 
        title: 'Candidate batch completed training',
        time: '4 hours ago',
        actor: 'Training Manager'
      },
      { 
        title: 'Placement drive scheduled',
        time: '8 hours ago',
        actor: 'Placement Officer'
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

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <MainLayout role="admin">
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of skills development platform metrics.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <FilterBar
            filters={filterOptions}
            actions={
              <>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Export Dashboard
                </Button>
                <Button className="gap-2" onClick={() => setKpiAlertOpen(true)}>
                  <Target className="h-4 w-4" />
                  Set KPI Alerts
                </Button>
              </>
            }
          />
        </motion.div>

        <section className="space-y-6">
          {/* Stats Cards Row */}
          <DashboardGrid>
            <StatCard
              title="Total Students Registered"
              value={dashboardData.totalStudents.toLocaleString()}
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 12, isPositive: true }}
              intent="primary"
              footer="Across all states"
            />
            <StatCard
              title="Active Centers"
              value={dashboardData.activeCenters}
              icon={<Building className="h-5 w-5" />}
              intent="secondary"
              footer="In 22 states"
            />
            <StatCard
              title="Placement Rate"
              value={`${dashboardData.placementRate}%`}
              icon={<Target className="h-5 w-5" />}
              trend={{ value: 5, isPositive: true }}
              intent="success"
              footer="Last 6 months"
            />
            <StatCard
              title="Retention Rate"
              value={`${dashboardData.retentionRate}%`}
              icon={<Percent className="h-5 w-5" />}
              intent="info"
              footer="After 6 months"
            />
          </DashboardGrid>

          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold mt-8 mb-4">Program Performance</h2>
          </motion.div>
          
          {/* Program Performance Cards */}
          <DashboardGrid>
            {dashboardData.programData.map((program, index) => (
              <motion.div 
                key={program.name}
                variants={itemVariants}
                custom={index}
                className="bg-white rounded-lg shadow-sm border border-neutral-100 p-5 hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-3">
                  <div className="text-sm text-gray-600 font-medium">{program.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-2xl font-bold">{program.value}</div>
                    <div className="text-sm font-medium text-gray-500 bg-neutral-50 px-2 py-1 rounded-md">Target: {program.target}</div>
                  </div>
                </div>
                <div className="relative w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div 
                    className="h-full bg-purple-600 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${(program.value / program.target) * 100}%` }}
                    transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                  ></motion.div>
                </div>
                <div className="mt-2 text-xs text-right text-gray-500">
                  {Math.round((program.value / program.target) * 100)}% completed
                </div>
              </motion.div>
            ))}
          </DashboardGrid>

          {/* Activity and Placement Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <motion.div variants={itemVariants}>
              <ChartCard
                title="Recent Activities"
                subtitle="Latest system activities across states"
                className="min-h-[300px] shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mt-4">
                  {dashboardData.recentActivities.map((activity, index) => (
                    <motion.div 
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start py-3 border-b border-gray-100 hover:bg-gray-50 rounded-md px-2 transition-colors duration-200"
                    >
                      <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center mr-3 shadow-sm">
                        <span className="text-purple-700">
                          <Book className="h-4 w-4" />
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.title}</div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span>{activity.time}</span>
                          <span className="mx-2">•</span>
                          <span>{activity.actor}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ChartCard>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ChartCard
                title="Placement Overview"
                subtitle="Last 30 days placement statistics"
                className="min-h-[300px] shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mt-4 space-y-3">
                  {dashboardData.placementCompanies.map((company, index) => (
                    <motion.div 
                      key={company.name} 
                      className="space-y-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex justify-between">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
                          {company.name}
                        </span>
                        <span className="text-sm">{company.count} placements</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <motion.div 
                          className="bg-purple-600 h-2 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${(company.count / 120) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + (0.1 * index) }}
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}

                  <Card className="mt-6 border-none bg-gradient-to-r from-green-50 to-green-100 shadow-sm">
                    <CardContent className="p-4 flex gap-3">
                      <div className="rounded-full bg-green-200 h-10 w-10 flex items-center justify-center flex-shrink-0">
                        <LineChart className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <div className="text-green-800 font-medium">Placement target exceeded</div>
                        <div className="text-green-700 text-sm">We've achieved 105% of this month's target</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ChartCard>
            </motion.div>
          </div>
        </section>
      </motion.div>

      {/* KPI Alert Form Dialog */}
      <KpiAlertForm open={kpiAlertOpen} onOpenChange={setKpiAlertOpen} />
    </MainLayout>
  );
};

export default SuperAdminDashboard;
