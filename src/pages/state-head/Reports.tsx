
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedFilterBar } from '@/components/common/EnhancedFilterBar';
import { Download, FileSpreadsheet, Calendar, Mail } from 'lucide-react';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('');
  
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
        { value: 'andheri', label: 'Andheri' },
        { value: 'pune-east', label: 'Pune East' },
      ],
    },
    {
      id: 'jobRole',
      label: 'Job Role',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Job Roles' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'retail', label: 'Retail' },
        { value: 'logistics', label: 'Logistics' },
      ],
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'date-range' as const,
    },
  ];

  const reportCategories = [
    {
      title: 'Mobilization Report',
      description: 'Candidate enrollment and mobilization metrics',
      icon: '📱',
      type: 'mobilization'
    },
    {
      title: 'Batch Summary Report',
      description: 'Comprehensive batch performance and completion rates',
      icon: '📚',
      type: 'batch'
    },
    {
      title: 'Placement Conversion Report',
      description: 'Placement rates and salary analytics',
      icon: '🎯',
      type: 'placement'
    },
    {
      title: 'Counselling Coverage Report',
      description: 'Parent counselling sessions and video compliance',
      icon: '💬',
      type: 'counselling'
    },
    {
      title: 'Category Segregation Report',
      description: 'A/B/C candidate categorization analysis',
      icon: '📊',
      type: 'category'
    },
    {
      title: 'Video View Completion Report',
      description: 'Video log compliance and completion tracking',
      icon: '🎥',
      type: 'video'
    },
  ];

  const handleFilterChange = (filterId: string, value: any) => {
    console.log("Filter changed:", filterId, value);
  };

  const handleGenerateReport = () => {
    console.log("Generating report:", selectedReport);
  };

  const handleScheduleReport = () => {
    console.log("Scheduling auto-send report");
  };

  return (
    <MainLayout role="state_head">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and export comprehensive state-level reports
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCategories.map((report) => (
            <Card 
              key={report.type} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedReport === report.type ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedReport(report.type)}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <span className="text-2xl mr-3">{report.icon}</span>
                  {report.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedReport && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Generate Report</h2>
            
            <EnhancedFilterBar
              filters={filterOptions}
              onFilterChange={handleFilterChange}
              actions={
                <div className="flex space-x-2">
                  <Button onClick={handleGenerateReport} className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" onClick={handleScheduleReport} className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Auto-Send
                  </Button>
                </div>
              }
            />

            <div className="rounded-md border bg-white p-6">
              <div className="text-center py-12 text-muted-foreground">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select filters and click "Generate Report" to view data</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Reports;
