import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Calendar, Users, BarChart, Printer, Mail, Briefcase } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';

const ReportsExports = () => {
  const [selectedReport, setSelectedReport] = useState('enrollment');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['name', 'batch', 'status']);
  const { toast } = useToast();

  // Mock data for scheduled reports
  const scheduledReports = [
    {
      id: 'SR-001',
      name: 'Weekly Enrollment Report',
      type: 'enrollment',
      schedule: 'Weekly - Monday',
      lastGenerated: '2024-01-22',
      status: 'active',
      recipients: ['manager@center.com', 'admin@headquarters.com']
    },
    {
      id: 'SR-002',
      name: 'Monthly Placement Report',
      type: 'placement',
      schedule: 'Monthly - 1st',
      lastGenerated: '2024-01-01',
      status: 'active',
      recipients: ['placement@center.com']
    },
    {
      id: 'SR-003',
      name: 'Daily Attendance Summary',
      type: 'attendance',
      schedule: 'Daily - 6:00 PM',
      lastGenerated: '2024-01-23',
      status: 'paused',
      recipients: ['attendance@center.com']
    }
  ];

  const reportTypes = [
    { id: 'enrollment', name: 'Enrollment & Batch Reports', icon: Users },
    { id: 'attendance', name: 'Attendance Reports', icon: Calendar },
    { id: 'placement', name: 'Placement Reports', icon: Briefcase },
    { id: 'counselling', name: 'Counselling Reports', icon: FileText },
    { id: 'compliance', name: 'Document Compliance', icon: FileText },
    { id: 'financial', name: 'Financial Reports', icon: BarChart }
  ];

  const batches = [
    { id: 'all', name: 'All Batches' },
    { id: 'DDU-GKY-B5', name: 'DDU-GKY Batch 5' },
    { id: 'DDU-GKY-B6', name: 'DDU-GKY Batch 6' },
    { id: 'DDU-GKY-B7', name: 'DDU-GKY Batch 7' },
  ];

  const availableColumns = [
    { id: 'name', label: 'Candidate Name' },
    { id: 'batch', label: 'Batch' },
    { id: 'status', label: 'Status' },
    { id: 'course', label: 'Course' },
    { id: 'joinDate', label: 'Join Date' },
    { id: 'attendance', label: 'Attendance %' },
    { id: 'placement', label: 'Placement Status' },
    { id: 'company', label: 'Company' },
    { id: 'salary', label: 'Salary' }
  ];

  const exportFormats = [
    { id: 'excel', name: 'Excel (.xlsx)', icon: '📊' },
    { id: 'pdf', name: 'PDF Report', icon: '📄' },
    { id: 'csv', name: 'CSV Data', icon: '📈' }
  ];

  const handleColumnToggle = (columnId: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns(prev => [...prev, columnId]);
    } else {
      setSelectedColumns(prev => prev.filter(id => id !== columnId));
    }
  };

  const handleExportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `${selectedReport} report is being generated in ${format} format.`,
    });
  };

  const handleScheduleReport = () => {
    toast({
      title: "Report Scheduled",
      description: "Report has been scheduled successfully.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Exports</h1>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Preview
          </Button>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
        </TabsList>

        {/* Generate Reports Tab */}
        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Configuration */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Type</label>
                    <Select value={selectedReport} onValueChange={setSelectedReport}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Batch Filter</label>
                    <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date Range</label>
                    <DateRangePicker
                      dateRange={dateRange}
                      onDateRangeChange={setDateRange}
                      placeholder="Select date range"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Include Columns</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {availableColumns.map((column) => (
                        <div key={column.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={column.id}
                            checked={selectedColumns.includes(column.id)}
                            onCheckedChange={(checked) => 
                              handleColumnToggle(column.id, checked as boolean)
                            }
                          />
                          <label htmlFor={column.id} className="text-sm">
                            {column.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exportFormats.map((format) => (
                      <Button
                        key={format.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleExportReport(format.name)}
                      >
                        <span className="mr-2">{format.icon}</span>
                        <Download className="h-4 w-4 mr-2" />
                        {format.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Preview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Report Preview - {reportTypes.find(t => t.id === selectedReport)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-gray-50 min-h-96">
                    <div className="text-center text-gray-500 mt-20">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Report Preview</p>
                      <p className="text-sm">Configure your report settings and click preview to see the report structure</p>
                      <Button className="mt-4">
                        Generate Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduled Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={handleScheduleReport}>
                    <Calendar className="h-4 w-4 mr-2" />
                    New Scheduled Report
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Last Generated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{reportTypes.find(t => t.id === report.type)?.name}</TableCell>
                        <TableCell>{report.schedule}</TableCell>
                        <TableCell>{report.lastGenerated}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            {report.recipients.slice(0, 2).join(', ')}
                            {report.recipients.length > 2 && ` +${report.recipients.length - 2} more`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-12">
                <Download className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No Export History</p>
                <p className="text-sm">Your export history will appear here once you start generating reports</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsExports;