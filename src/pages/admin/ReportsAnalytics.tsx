
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Mail, Calendar, Filter, BarChart3, PieChart as PieChartIcon, FileText } from 'lucide-react';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { ScheduleReportForm } from '@/components/forms/ScheduleReportForm';

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 9, 1),
    to: new Date(2023, 11, 31)
  });
  const [scheduleReportOpen, setScheduleReportOpen] = useState(false);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    center: 'all',
    program: 'all',
    state: 'all'
  });
  const { toast } = useToast();

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

  // Dummy data for center-wise batch status
  const batchStatusData = [
    { center: 'Bengaluru', ongoing: 5, completed: 3, upcoming: 2 },
    { center: 'Mumbai', ongoing: 4, completed: 2, upcoming: 1 },
    { center: 'Delhi', ongoing: 3, completed: 4, upcoming: 2 },
    { center: 'Chennai', ongoing: 2, completed: 5, upcoming: 3 },
    { center: 'Hyderabad', ongoing: 3, completed: 3, upcoming: 2 },
  ];

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated and will be available for download shortly."
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Your report has been generated based on the selected filters and date range."
    });
  };

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Generate insights and reports for program performance.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setScheduleReportOpen(true)}>
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
          <Popover open={moreFiltersOpen} onOpenChange={setMoreFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4 p-2">
                <h4 className="font-medium">Additional Filters</h4>
                <div className="space-y-2">
                  <Label htmlFor="center">Training Center</Label>
                  <Select 
                    value={filterData.center} 
                    onValueChange={(value) => setFilterData({...filterData, center: value})}
                  >
                    <SelectTrigger id="center">
                      <SelectValue placeholder="Select center" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Centers</SelectItem>
                      <SelectItem value="bengaluru">Bengaluru</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="program">Program Type</Label>
                  <Select 
                    value={filterData.program} 
                    onValueChange={(value) => setFilterData({...filterData, program: value})}
                  >
                    <SelectTrigger id="program">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      <SelectItem value="mernstack">MERN Stack</SelectItem>
                      <SelectItem value="data">Data Science</SelectItem>
                      <SelectItem value="frontend">Frontend Dev</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select 
                    value={filterData.state} 
                    onValueChange={(value) => setFilterData({...filterData, state: value})}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                      <SelectItem value="telangana">Telangana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setFilterData({center: 'all', program: 'all', state: 'all'});
                    }}
                  >
                    Reset
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      setMoreFiltersOpen(false);
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={handleGenerateReport}>
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
              <ChartCard title="Mobilization vs Placement Trend">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
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
                </div>
              </ChartCard>

              <ChartCard title="Candidate Category Distribution">
                <div className="h-[300px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
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
                </div>
              </ChartCard>
            </div>
            
            {/* Center-Wise Batch Status Chart */}
            <ChartCard title="Center-Wise Batch Status">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={batchStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="center" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ongoing" name="Ongoing Batches" fill="#4f46e5" />
                    <Bar dataKey="completed" name="Completed Batches" fill="#10b981" />
                    <Bar dataKey="upcoming" name="Upcoming Batches" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
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
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full gap-1"
                              onClick={() => {
                                toast({
                                  title: `${report.name} Generated`,
                                  description: "Your report has been generated and is ready for download."
                                });
                              }}
                            >
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Scheduled Reports</CardTitle>
                <Button size="sm" onClick={() => setScheduleReportOpen(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  New Schedule
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Dummy scheduled reports */}
                  <div className="border rounded-md p-4 hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-medium">Monthly Placement Report</h4>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Monthly on 1st</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Sent to: admin@example.com, reports@example.com</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Delete</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-medium">Weekly Candidate Status</h4>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Every Monday at 9:00 AM</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Sent to: manager@example.com</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Delete</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Schedule Report Form */}
      <ScheduleReportForm
        open={scheduleReportOpen}
        onOpenChange={setScheduleReportOpen}
      />
    </MainLayout>
  );
};

export default ReportsAnalytics;
