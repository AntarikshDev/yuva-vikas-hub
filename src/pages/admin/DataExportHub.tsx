import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileSpreadsheet, FileIcon, File, Mail, Calendar, Clock, RefreshCw } from 'lucide-react';

const DataExportHub = () => {
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [scheduleEmail, setScheduleEmail] = useState(false);

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

  return (
    <MainLayout role="super_admin">
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
                        <Button className="w-full gap-2">
                          <Download className="h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox id={`schedule-${template.id}`} />
                      <label
                        htmlFor={`schedule-${template.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Schedule Email Delivery
                      </label>
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
                          <Button variant="outline" size="sm" className="h-8 gap-1">
                            <RefreshCw className="h-3.5 w-3.5" />
                            Run Now
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
              <CardContent>
                <p className="text-center text-muted-foreground py-16">Custom export builder interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default DataExportHub;
