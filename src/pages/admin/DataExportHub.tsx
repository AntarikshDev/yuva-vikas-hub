
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileSpreadsheet, FileIcon, File, Mail, Calendar, Clock, RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const DataExportHub = () => {
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [scheduleEmail, setScheduleEmail] = useState(false);
  const [scheduleEmailMap, setScheduleEmailMap] = useState<Record<string, boolean>>({});
  const [isRunningExport, setIsRunningExport] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Custom export state
  const [customExportData, setCustomExportData] = useState({
    name: '',
    dataType: 'candidates',
    format: 'excel',
    dateRange: 'all',
    filters: [] as string[],
    columns: [] as string[]
  });

  // Dummy data for export templates
  const exportTemplates = [
    {
      id: 'template1',
      name: 'All Candidates With Status',
      description: 'Complete list of all candidates with their current status and details',
      lastGenerated: '2023-11-05',
      icon: <FileSpreadsheet className="h-5 w-5 text-green-600" />
    },
    {
      id: 'template2',
      name: 'Placement + Retention Sheet',
      description: 'Candidates placed with retention tracking for 6 months',
      lastGenerated: '2023-11-02',
      icon: <FileSpreadsheet className="h-5 w-5 text-green-600" />
    },
    {
      id: 'template3',
      name: 'District-Wise Batch Summary',
      description: 'Batches grouped by district with completion statistics',
      lastGenerated: '2023-10-28',
      icon: <File className="h-5 w-5 text-red-600" />
    },
    {
      id: 'template4',
      name: 'Mobilizer Report',
      description: 'Mobilizer performance report with conversion metrics',
      lastGenerated: '2023-10-25',
      icon: <FileSpreadsheet className="h-5 w-5 text-green-600" />
    },
    {
      id: 'template5',
      name: 'Candidate Documents Package',
      description: 'ZIP archive of all documents for selected candidates',
      lastGenerated: '2023-10-20',
      icon: <FileIcon className="h-5 w-5 text-blue-600" />
    },
  ];

  // Dummy data for scheduled exports
  const scheduledExports = [
    {
      id: 'schedule1',
      name: 'Weekly Candidate Summary',
      frequency: 'Weekly (Monday)',
      recipients: 'admin@example.com, reports@example.com',
      nextSchedule: '2023-11-14'
    },
    {
      id: 'schedule2',
      name: 'Monthly Placement Report',
      frequency: 'Monthly (1st)',
      recipients: 'admin@example.com, director@example.com',
      nextSchedule: '2023-12-01'
    },
    {
      id: 'schedule3',
      name: 'Daily Attendance Summary',
      frequency: 'Daily',
      recipients: 'centers@example.com',
      nextSchedule: '2023-11-09'
    },
  ];

  // Available data types and their columns for custom export
  const dataTypes = [
    { value: 'candidates', label: 'Candidates' },
    { value: 'batches', label: 'Batches' },
    { value: 'centers', label: 'Centers' },
    { value: 'mobilizers', label: 'Mobilizers' },
    { value: 'placements', label: 'Placements' }
  ];

  // Available columns for each data type
  const availableColumns = {
    candidates: [
      { value: 'id', label: 'Candidate ID' },
      { value: 'name', label: 'Full Name' },
      { value: 'contact', label: 'Contact Number' },
      { value: 'email', label: 'Email' },
      { value: 'district', label: 'District' },
      { value: 'status', label: 'Status' },
      { value: 'education', label: 'Education' },
      { value: 'batch', label: 'Batch' },
      { value: 'registration_date', label: 'Registration Date' }
    ],
    batches: [
      { value: 'id', label: 'Batch ID' },
      { value: 'name', label: 'Batch Name' },
      { value: 'center', label: 'Center' },
      { value: 'start_date', label: 'Start Date' },
      { value: 'end_date', label: 'End Date' },
      { value: 'course', label: 'Course' },
      { value: 'trainer', label: 'Trainer' },
      { value: 'capacity', label: 'Capacity' },
      { value: 'enrolled', label: 'Enrolled' }
    ],
    centers: [
      { value: 'id', label: 'Center ID' },
      { value: 'name', label: 'Center Name' },
      { value: 'address', label: 'Address' },
      { value: 'district', label: 'District' },
      { value: 'manager', label: 'Manager' },
      { value: 'capacity', label: 'Capacity' }
    ],
    mobilizers: [
      { value: 'id', label: 'Mobilizer ID' },
      { value: 'name', label: 'Name' },
      { value: 'district', label: 'District' },
      { value: 'targets', label: 'Targets' },
      { value: 'achievements', label: 'Achievements' },
      { value: 'conversion_rate', label: 'Conversion Rate' }
    ],
    placements: [
      { value: 'candidate_id', label: 'Candidate ID' },
      { value: 'candidate_name', label: 'Candidate Name' },
      { value: 'company', label: 'Company' },
      { value: 'role', label: 'Role' },
      { value: 'salary', label: 'Salary' },
      { value: 'placement_date', label: 'Placement Date' },
      { value: 'status', label: 'Status' }
    ]
  };

  const handleRunExport = (scheduleId: string) => {
    setIsRunningExport(prev => ({ ...prev, [scheduleId]: true }));
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsRunningExport(prev => ({ ...prev, [scheduleId]: false }));
      toast({
        title: "Export Complete",
        description: "Your scheduled export has been generated successfully."
      });
    }, 2000);
  };

  const toggleScheduleEmail = (templateId: string, checked: boolean) => {
    setScheduleEmailMap(prev => ({ ...prev, [templateId]: checked }));
    
    if (checked) {
      toast({
        title: "Email Scheduling Enabled",
        description: "This report will be delivered to your email when generated."
      });
    }
  };

  const handleExport = (templateId: string) => {
    toast({
      title: "Export Started",
      description: "Your report is being generated and will be available for download shortly."
    });
  };

  const handleCustomExport = () => {
    if (!customExportData.dataType) {
      toast({
        title: "Missing Information",
        description: "Please select a data type for your export.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Custom Export Started",
      description: "Your custom export is being generated and will be available for download shortly."
    });
  };

  const getAvailableColumnsForSelectedType = () => {
    return availableColumns[customExportData.dataType as keyof typeof availableColumns] || [];
  };

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Export Hub</h1>
            <p className="text-muted-foreground">
              Generate and download reports and data exports.
            </p>
          </div>
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList>
            <TabsTrigger value="templates">Export Templates</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Exports</TabsTrigger>
            <TabsTrigger value="custom">Custom Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exportTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {template.icon}
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Last generated: {template.lastGenerated}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor={`format-${template.id}`}>Format</Label>
                        <Select defaultValue="excel">
                          <SelectTrigger id={`format-${template.id}`}>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-end">
                        <Button 
                          className="w-full gap-2"
                          onClick={() => handleExport(template.id)}
                        >
                          <Download className="h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox 
                        id={`schedule-${template.id}`}
                        checked={scheduleEmailMap[template.id] || false}
                        onCheckedChange={(checked) => 
                          toggleScheduleEmail(template.id, checked === true)
                        }
                      />
                      <div className="flex flex-col">
                        <label
                          htmlFor={`schedule-${template.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Schedule Email Delivery
                        </label>
                        {scheduleEmailMap[template.id] && (
                          <p className="text-xs text-muted-foreground mt-1">
                            You'll receive this report by email when generated
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Export Jobs</CardTitle>
                <CardDescription>
                  Automated exports that are scheduled to be generated and delivered.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduledExports.map((job) => (
                    <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="space-y-1">
                        <div className="font-medium">{job.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{job.frequency}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{job.recipients}</span>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 flex flex-col sm:items-end gap-2">
                        <div className="text-sm font-medium text-green-600">Next: {job.nextSchedule}</div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-1" 
                            onClick={() => handleRunExport(job.id)}
                            disabled={isRunningExport[job.id]}
                          >
                            <RefreshCw 
                              className={`h-3.5 w-3.5 ${isRunningExport[job.id] ? 'animate-spin' : ''}`} 
                            />
                            {isRunningExport[job.id] ? 'Running...' : 'Run Now'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="custom" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Export Builder</CardTitle>
                <CardDescription>
                  Create a custom export by selecting the data and filters you need.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Data Type Selection */}
                  <div className="space-y-1.5">
                    <Label htmlFor="dataType">Data Type</Label>
                    <Select 
                      value={customExportData.dataType}
                      onValueChange={(value) => setCustomExportData({...customExportData, dataType: value})}
                    >
                      <SelectTrigger id="dataType">
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Date Range Selection */}
                  <div className="space-y-1.5">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Select 
                      value={customExportData.dateRange}
                      onValueChange={(value) => setCustomExportData({...customExportData, dateRange: value})}
                    >
                      <SelectTrigger id="dateRange">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="this_week">This Week</SelectItem>
                        <SelectItem value="this_month">This Month</SelectItem>
                        <SelectItem value="last_month">Last Month</SelectItem>
                        <SelectItem value="this_year">This Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Format Selection */}
                  <div className="space-y-1.5">
                    <Label htmlFor="exportFormat">Export Format</Label>
                    <Select 
                      value={customExportData.format}
                      onValueChange={(value) => setCustomExportData({...customExportData, format: value})}
                    >
                      <SelectTrigger id="exportFormat">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Column Selection */}
                  <div className="space-y-1.5">
                    <Label>Select Columns</Label>
                    <div className="border rounded-md p-4 max-h-64 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Column Name</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getAvailableColumnsForSelectedType().map((column) => (
                            <TableRow key={column.value}>
                              <TableCell>
                                <Checkbox 
                                  id={`column-${column.value}`}
                                  checked={customExportData.columns.includes(column.value)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setCustomExportData({
                                        ...customExportData, 
                                        columns: [...customExportData.columns, column.value]
                                      });
                                    } else {
                                      setCustomExportData({
                                        ...customExportData, 
                                        columns: customExportData.columns.filter(c => c !== column.value)
                                      });
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <label 
                                  htmlFor={`column-${column.value}`}
                                  className="font-medium text-sm cursor-pointer"
                                >
                                  {column.label}
                                </label>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 items-center pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="schedule-export"
                      checked={scheduleEmail}
                      onCheckedChange={setScheduleEmail}
                    />
                    <Label htmlFor="schedule-export" className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      Email when ready
                    </Label>
                  </div>
                  <Button 
                    onClick={handleCustomExport}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Generate Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default DataExportHub;
