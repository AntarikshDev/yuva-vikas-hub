
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Mail, Calendar, Filter, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 9, 1),
    to: new Date(2023, 11, 31)
  });

  // Dummy data for mobilization vs placement
  const mobilizationData = [
    { month: 'Jan', mobilized: 320, placed: 240 },
    { month: 'Feb', mobilized: 300, placed: 220 },
    { month: 'Mar', mobilized: 340, placed: 280 },
    { month: 'Apr', mobilized: 280, placed: 250 },
    { month: 'May', mobilized: 320, placed: 260 },
    { month: 'Jun', mobilized: 360, placed: 300 },
  ];

  // Dummy data for candidate categories
  const categoryData = [
    { name: 'Category A', value: 60 },
    { name: 'Category B', value: 30 },
    { name: 'Category C', value: 10 },
  ];

  // Colors for the pie chart
  const COLORS = ['#4f46e5', '#8b5cf6', '#a855f7'];

  // Dummy data for report types
  const reportTypes = [
    { id: 'mobilization', name: 'Mobilization Tracker' },
    { id: 'placement', name: 'Placement Performance' },
    { id: 'batch', name: 'Batch Health' },
    { id: 'category', name: 'Category Change Logs' },
    { id: 'video', name: 'Video Viewing Completion' },
    { id: 'followup', name: 'PPC Follow-Up Report' },
    { id: 'target', name: 'Monthly Target Achievement' },
  ];

  return (
    <MainLayout role="super_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Generate insights and reports for program performance.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              Schedule Report
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 bg-white p-4 rounded-lg border">
          <div className="flex-grow">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              className="w-full max-w-md"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
          <Button>
            Generate Report
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3">
            <TabsTrigger value="dashboard" className="flex gap-2 items-center">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex gap-2 items-center">
              <PieChartIcon className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex gap-2 items-center">
              <Calendar className="h-4 w-4" />
              Scheduled
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mobilization vs Placement Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mobilizationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="mobilized" name="Mobilized Candidates" fill="#4f46e5" />
                      <Bar dataKey="placed" name="Placed Candidates" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Candidate Category Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Additional charts would go here */}
            <Card>
              <CardHeader>
                <CardTitle>Center-Wise Batch Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Center-wise batch status chart will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Report Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportTypes.map(report => (
                    <Card key={report.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-2">
                          <div className="font-medium">{report.name}</div>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" className="w-full gap-1">
                              <Download className="h-3.5 w-3.5" />
                              Generate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scheduled" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
              </CardHeader>
              <CardContent className="min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Scheduled reports will be listed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ReportsAnalytics;
