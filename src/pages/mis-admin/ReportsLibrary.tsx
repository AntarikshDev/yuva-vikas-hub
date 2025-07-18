import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { BarChart, FileText, Calendar, Play, Download, Settings, Plus } from 'lucide-react';
import { DateRange } from 'react-day-picker';

const ReportsLibrary = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Mock data for reports
  const reportsLibrary = [
    {
      id: 1,
      name: 'Mobilisation Summary',
      category: 'Mobilisation',
      description: 'Complete summary of candidate mobilisation activities',
      lastRun: '2025-07-18 09:30',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Attendance Overview',
      category: 'Training',
      description: 'Detailed attendance report for all batches',
      lastRun: '2025-07-17 16:45',
      status: 'Available'
    },
    {
      id: 3,
      name: 'Counselling Completion',
      category: 'Counselling',
      description: 'Progress tracking of counselling sessions',
      lastRun: '2025-07-18 08:15',
      status: 'Available'
    },
    {
      id: 4,
      name: 'Placement Report',
      category: 'Placement',
      description: 'Comprehensive placement and job role analysis',
      lastRun: '2025-07-16 14:20',
      status: 'Available'
    },
    {
      id: 5,
      name: 'Post-Placement Tracking',
      category: 'Post-Placement',
      description: 'Retention and post-placement follow-up status',
      lastRun: '2025-07-15 11:30',
      status: 'Available'
    }
  ];

  // Mock scheduled reports
  const scheduledReports = [
    {
      id: 1,
      name: 'Weekly Mobilisation Report',
      frequency: 'Weekly',
      recipients: ['admin@example.com', 'state@example.com'],
      nextRun: '2025-07-21 09:00',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Monthly Placement Summary',
      frequency: 'Monthly',
      recipients: ['placement@example.com'],
      nextRun: '2025-08-01 10:00',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Daily Attendance Report',
      frequency: 'Daily',
      recipients: ['attendance@example.com', 'centers@example.com'],
      nextRun: '2025-07-19 08:00',
      status: 'Paused'
    }
  ];

  // Mock preview data
  const mockPreviewData = [
    {
      candidateName: 'Ravi Kumar',
      mobilisationId: 'MOB-001',
      center: 'Delhi-001',
      course: 'Retail Sales',
      status: 'Enrolled',
      enrollmentDate: '2025-07-15'
    },
    {
      candidateName: 'Priya Sharma',
      mobilisationId: 'MOB-002',
      center: 'Mumbai-001',
      course: 'Customer Service',
      status: 'Enrolled',
      enrollmentDate: '2025-07-16'
    },
    {
      candidateName: 'Rajesh Singh',
      mobilisationId: 'MOB-003',
      center: 'Bangalore-001',
      course: 'Data Entry',
      status: 'Completed',
      enrollmentDate: '2025-07-10'
    }
  ];

  const categories = ['All Categories', 'Mobilisation', 'Training', 'Counselling', 'Placement', 'Post-Placement'];
  const regions = ['All Regions', 'North', 'South', 'East', 'West'];
  const centers = ['All Centers', 'Delhi-001', 'Mumbai-001', 'Bangalore-001'];

  const handleRunReport = (reportId: number) => {
    setPreviewData(mockPreviewData);
    setShowPreview(true);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Available': 'bg-green-100 text-green-800',
      'Active': 'bg-green-100 text-green-800',
      'Paused': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800'
    };
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart className="h-8 w-8" />
          Reports & MIS
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library">Reports Library</TabsTrigger>
          <TabsTrigger value="builder">Custom Report Builder</TabsTrigger>
          <TabsTrigger value="scheduled">Report Scheduling</TabsTrigger>
        </TabsList>

        {/* Reports Library Tab */}
        <TabsContent value="library" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Report Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region.toLowerCase().replace(' ', '-')}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCenter} onValueChange={setSelectedCenter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Center" />
                  </SelectTrigger>
                  <SelectContent>
                    {centers.map((center) => (
                      <SelectItem key={center} value={center.toLowerCase().replace(' ', '-')}>
                        {center}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  className="w-64"
                  placeholder="Select Date Range"
                />
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsLibrary.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.category}</TableCell>
                      <TableCell className="max-w-xs text-sm text-muted-foreground">
                        {report.description}
                      </TableCell>
                      <TableCell>{report.lastRun}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRunReport(report.id)}
                            className="flex items-center gap-1"
                          >
                            <Play className="h-4 w-4" />
                            Run Report
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Report Preview</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Excel
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate Name</TableHead>
                      <TableHead>Mobilisation ID</TableHead>
                      <TableHead>Center</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.candidateName}</TableCell>
                        <TableCell>{row.mobilisationId}</TableCell>
                        <TableCell>{row.center}</TableCell>
                        <TableCell>{row.course}</TableCell>
                        <TableCell>{getStatusBadge(row.status)}</TableCell>
                        <TableCell>{row.enrollmentDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Custom Report Builder Tab */}
        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Fields */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Available Fields</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Candidates</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Name', 'ID', 'Phone', 'Email', 'Address', 'Age'].map((field) => (
                          <div
                            key={field}
                            className="p-2 border border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                          >
                            {field}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Placements</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Company', 'Job Role', 'Salary', 'Joining Date', 'Status'].map((field) => (
                          <div
                            key={field}
                            className="p-2 border border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                          >
                            {field}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Attendance</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Present Days', 'Total Days', 'Percentage', 'Last Attendance'].map((field) => (
                          <div
                            key={field}
                            className="p-2 border border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                          >
                            {field}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Builder */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Report Builder</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Report Name</Label>
                      <Input placeholder="Enter report name" />
                    </div>
                    <div>
                      <Label>Selected Fields</Label>
                      <div className="min-h-32 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-muted-foreground text-center">
                          Drag fields here to build your report
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label>Group By</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grouping field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="batch">Batch</SelectItem>
                          <SelectItem value="course">Course</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button>Save Report Template</Button>
                      <Button variant="outline">Preview Report</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report Scheduling Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Scheduled Reports</span>
                <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Report</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Select Report</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose report to schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            {reportsLibrary.map((report) => (
                              <SelectItem key={report.id} value={report.id.toString()}>
                                {report.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Frequency</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Recipients (comma separated)</Label>
                        <Input placeholder="email1@example.com, email2@example.com" />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => setIsScheduleModalOpen(false)}>Schedule Report</Button>
                        <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledReports.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.name}</TableCell>
                      <TableCell>{schedule.frequency}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {schedule.recipients.slice(0, 2).join(', ')}
                          {schedule.recipients.length > 2 && (
                            <span className="text-muted-foreground">
                              {' '}+{schedule.recipients.length - 2} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{schedule.nextRun}</TableCell>
                      <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsLibrary;