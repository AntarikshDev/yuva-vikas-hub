
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { EnhancedFilterBar } from '@/components/common/EnhancedFilterBar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon, Send, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PPCScheduleMonitor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Filter options
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
        { value: 'pune-central', label: 'Pune Central' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Report Pending' },
      ],
    },
  ];
  
  // Handle filter changes
  const handleFilterChange = (filterId: string, value: any) => {
    console.log("Filter changed:", filterId, value);
    // In a real app, you'd update state and fetch filtered data
  };
  
  // Mock data for PPC visits
  const ppcVisitsData = [
    {
      id: 1,
      center: "Mumbai Central Training Hub",
      district: "Mumbai",
      visitDate: "2023-05-25",
      purpose: "Monthly Batch Review",
      ppcTeam: "Rajiv Sharma, Meera Patel",
      status: "Scheduled",
      reportSubmitted: false,
      batchesReviewed: [],
      notes: "Focus on Healthcare batch performance metrics"
    },
    {
      id: 2,
      center: "Andheri Skill Center",
      district: "Mumbai",
      visitDate: "2023-05-22",
      purpose: "Quarterly Audit",
      ppcTeam: "Vikram Mehta, Sunita Desai",
      status: "Completed",
      reportSubmitted: true,
      batchesReviewed: ["RT-MUM-08", "HS-MUM-03"],
      notes: "Reviewed placement readiness for upcoming batch completion"
    },
    {
      id: 3,
      center: "Pune Central Institute",
      district: "Pune",
      visitDate: "2023-05-20",
      purpose: "Infrastructure Assessment",
      ppcTeam: "Anjali Singh, Deepak Kumar",
      status: "Completed",
      reportSubmitted: false,
      batchesReviewed: ["RT-PUN-04"],
      notes: "Report pending, follow-up required"
    },
    {
      id: 4,
      center: "Nagpur Training Academy",
      district: "Nagpur",
      visitDate: "2023-05-29",
      purpose: "New Batch Launch",
      ppcTeam: "Sunil Khanna, Priya Joshi",
      status: "Scheduled",
      reportSubmitted: false,
      batchesReviewed: [],
      notes: "Preparation for Logistics batch launch"
    },
    {
      id: 5,
      center: "Nashik Vocational Center",
      district: "Nashik",
      visitDate: "2023-05-18",
      purpose: "Trainer Evaluation",
      ppcTeam: "Aditya Patil, Neha Sharma",
      status: "Completed",
      reportSubmitted: true,
      batchesReviewed: ["HS-NSK-01"],
      notes: "Trainer performance review completed"
    }
  ];

  // Define columns for DataTable
  const columns = [
    {
      id: 'center',
      header: 'Center',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.center}</div>
          <div className="text-xs text-gray-500">{row.district}</div>
        </div>
      ),
    },
    {
      id: 'date',
      header: 'Visit Date',
      cell: (row: any) => (
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
          {row.visitDate}
        </div>
      ),
    },
    {
      id: 'purpose',
      header: 'Purpose',
      cell: (row: any) => row.purpose,
    },
    {
      id: 'team',
      header: 'PPC Team',
      cell: (row: any) => row.ppcTeam,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row: any) => (
        <StatusBadge
          variant={
            row.status === 'Scheduled' ? 'info' : 
            row.status === 'Completed' ? 'success' : 'warning'
          }
          label={row.status}
        />
      ),
    },
    {
      id: 'report',
      header: 'Report',
      cell: (row: any) => (
        <div>
          {row.reportSubmitted ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="mr-1 h-4 w-4" />
              <span>Submitted</span>
            </div>
          ) : (
            <div className="text-amber-600">
              {row.status === 'Completed' ? 'Pending' : '-'}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (row: any) => (
        <div className="flex justify-end space-x-2">
          {row.status === 'Completed' && !row.reportSubmitted && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Reminder Sent",
                  description: `Reminder sent to PPC team for ${row.center} visit report.`,
                });
              }}
            >
              <Send className="h-4 w-4 mr-1" />
              Send Reminder
            </Button>
          )}
          {row.reportSubmitted && (
            <Button 
              variant="outline" 
              size="sm"
            >
              <FileText className="h-4 w-4 mr-1" />
              View Report
            </Button>
          )}
          <Button 
            variant="default" 
            size="sm"
          >
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout role="state_head">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PPC Schedule Monitor</h1>
            <p className="text-muted-foreground">
              Track Pre-Placement Cell visits and activities across centers
            </p>
          </div>
          
          <div className="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1 text-sm text-indigo-800 border border-indigo-200">
            <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
            Phase 2 Feature
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 font-medium">Scheduled Visits</div>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold">12</span>
                <span className="ml-1 text-sm text-gray-500">this month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 font-medium">Completed Visits</div>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold">8</span>
                <span className="ml-1 text-sm text-gray-500">this month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 font-medium">Pending Reports</div>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-bold text-amber-600">3</span>
                <span className="ml-1 text-sm text-gray-500">follow-up required</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <EnhancedFilterBar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
        />
        
        <div className="rounded-md border bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">PPC Visit Schedule</h2>
          </div>
          <DataTable
            columns={columns}
            data={ppcVisitsData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default PPCScheduleMonitor;
