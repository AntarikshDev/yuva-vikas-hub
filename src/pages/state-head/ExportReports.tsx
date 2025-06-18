
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedFilterBar } from '@/components/common/EnhancedFilterBar';
import { Download, FileSpreadsheet, Mail, Calendar, FileText } from 'lucide-react';

const ExportReports: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<string>('excel');
  const [autoMail, setAutoMail] = useState<boolean>(false);
  
  const filterOptions = [
    {
      id: 'timePeriod',
      label: 'Time Period',
      type: 'select' as const,
      options: [
        { value: 'current-month', label: 'Current Month' },
        { value: 'last-month', label: 'Last Month' },
        { value: 'last-quarter', label: 'Last Quarter' },
        { value: 'custom', label: 'Custom Range' },
      ],
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'date-range' as const,
    },
  ];

  const reportFormats = [
    {
      title: 'All Candidates Report',
      description: 'Comprehensive report with batch details, category, and placement status',
      icon: '👥',
      type: 'candidates',
      includes: ['Candidate details', 'Batch information', 'Category (A/B/C)', 'Placement status', 'Salary details']
    },
    {
      title: 'State Performance Report',
      description: 'Overall state performance with graphs and metrics',
      icon: '📊',
      type: 'performance',
      includes: ['District-wise metrics', 'Placement rates', 'Performance graphs', 'Trend analysis', 'KPI dashboard']
    },
    {
      title: 'Mobilizer-Wise Activity Report',
      description: 'Detailed activity and performance report for each mobilizer',
      icon: '📱',
      type: 'mobilizer',
      includes: ['Mobilizer performance', 'Candidate enrollment', 'Activity logs', 'Target vs achievement', 'Regional breakdown']
    },
    {
      title: 'Center Performance Report',
      description: 'Center-wise detailed performance and compliance metrics',
      icon: '🏫',
      type: 'center',
      includes: ['Center metrics', 'Trainer performance', 'Video compliance', 'Batch completion rates', 'Infrastructure status']
    },
    {
      title: 'Placement Analytics Report',
      description: 'Detailed placement statistics and company-wise breakdown',
      icon: '🎯',
      type: 'placement',
      includes: ['Placement rates', 'Company-wise data', 'Salary analysis', 'Job role distribution', 'Retention rates']
    },
    {
      title: 'Training Quality Report',
      description: 'Training effectiveness and quality assurance metrics',
      icon: '🎓',
      type: 'quality',
      includes: ['Training quality scores', 'Feedback analysis', 'Course completion', 'Trainer ratings', 'Learning outcomes']
    },
  ];

  const handleFilterChange = (filterId: string, value: any) => {
    console.log("Filter changed:", filterId, value);
  };

  const handleExport = (reportType: string) => {
    console.log(`Exporting ${reportType} report in ${selectedFormat} format`);
    if (autoMail) {
      console.log("Auto-mailing report");
    }
  };

  const handleScheduleReport = (reportType: string) => {
    console.log(`Scheduling ${reportType} report`);
  };

  return (
    <MainLayout role="state_head">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Export Reports</h1>
          <p className="text-muted-foreground">
            Generate and export comprehensive state-level reports in various formats
          </p>
        </div>
        
        <EnhancedFilterBar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Format</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="excel" 
                      name="format" 
                      value="excel" 
                      checked={selectedFormat === 'excel'}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                    />
                    <label htmlFor="excel" className="text-sm flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-1 text-green-600" />
                      Excel (.xlsx)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="pdf" 
                      name="format" 
                      value="pdf" 
                      checked={selectedFormat === 'pdf'}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                    />
                    <label htmlFor="pdf" className="text-sm flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-red-600" />
                      PDF (.pdf)
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="autoMail" 
                    checked={autoMail}
                    onChange={(e) => setAutoMail(e.target.checked)}
                  />
                  <label htmlFor="autoMail" className="text-sm flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-blue-600" />
                    Auto-Mail Report
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Send report to your email and manager
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportFormats.map((report) => (
                <Card key={report.type} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <span className="text-2xl mr-3">{report.icon}</span>
                      {report.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Includes:</p>
                      <ul className="text-xs space-y-1">
                        {report.includes.map((item, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleExport(report.type)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export Now
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleScheduleReport(report.type)}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">All Candidates Report - May 2024</p>
                    <p className="text-xs text-muted-foreground">Exported on May 22, 2024 at 10:30 AM</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium">State Performance Report - Q1 2024</p>
                    <p className="text-xs text-muted-foreground">Exported on May 20, 2024 at 2:15 PM</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ExportReports;
