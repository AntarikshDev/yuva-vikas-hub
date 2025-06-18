
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { EnhancedFilterBar } from '@/components/common/EnhancedFilterBar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Eye, Users, User } from 'lucide-react';

const Attendance: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
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
      id: 'dateRange',
      label: 'Date Range',
      type: 'date-range' as const,
    },
  ];

  // Sample candidate attendance data
  const candidateAttendanceData = [
    {
      id: 1,
      name: 'John Doe',
      batch: 'WD001',
      center: 'Mumbai Central',
      totalDays: 20,
      presentDays: 18,
      absentDays: 2,
      attendancePercentage: 90,
      lastAttended: '2024-06-17',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      batch: 'GD002',
      center: 'Andheri',
      totalDays: 20,
      presentDays: 16,
      absentDays: 4,
      attendancePercentage: 80,
      lastAttended: '2024-06-16',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Alice Johnson',
      batch: 'DM003',
      center: 'Pune East',
      totalDays: 20,
      presentDays: 12,
      absentDays: 8,
      attendancePercentage: 60,
      lastAttended: '2024-06-10',
      status: 'At Risk',
    },
  ];

  // Sample trainer attendance data
  const trainerAttendanceData = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      center: 'Mumbai Central',
      batches: ['WD001', 'GD002'],
      totalDays: 22,
      presentDays: 22,
      absentDays: 0,
      attendancePercentage: 100,
      lastAttended: '2024-06-17',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      center: 'Andheri',
      batches: ['DM003'],
      totalDays: 22,
      presentDays: 20,
      absentDays: 2,
      attendancePercentage: 91,
      lastAttended: '2024-06-17',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Amit Patil',
      center: 'Pune East',
      batches: ['MD004', 'DS005'],
      totalDays: 22,
      presentDays: 19,
      absentDays: 3,
      attendancePercentage: 86,
      lastAttended: '2024-06-15',
      status: 'Active',
    },
  ];

  const candidateColumns = [
    {
      id: 'candidate',
      header: 'Candidate',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.batch} • {row.center}</div>
        </div>
      ),
    },
    {
      id: 'attendance',
      header: 'Attendance',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.presentDays}/{row.totalDays}</div>
          <div className="text-xs text-gray-500">Present/Total</div>
        </div>
      ),
    },
    {
      id: 'percentage',
      header: 'Attendance %',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.attendancePercentage}%</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full ${
                row.attendancePercentage >= 85 ? 'bg-green-500' : 
                row.attendancePercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${row.attendancePercentage}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'lastAttended',
      header: 'Last Attended',
      cell: (row: any) => (
        <div className="text-center text-sm">{row.lastAttended}</div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row: any) => (
        <StatusBadge
          variant={
            row.status === 'Active' ? 'success' : 
            row.status === 'At Risk' ? 'warning' : 'error'
          }
          label={row.status}
        />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row: any) => (
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      ),
    },
  ];

  const trainerColumns = [
    {
      id: 'trainer',
      header: 'Trainer',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.center}</div>
        </div>
      ),
    },
    {
      id: 'batches',
      header: 'Batches',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.batches.length}</div>
          <div className="text-xs text-gray-500">{row.batches.join(', ')}</div>
        </div>
      ),
    },
    {
      id: 'attendance',
      header: 'Attendance',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.presentDays}/{row.totalDays}</div>
          <div className="text-xs text-gray-500">Present/Total</div>
        </div>
      ),
    },
    {
      id: 'percentage',
      header: 'Attendance %',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.attendancePercentage}%</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full ${
                row.attendancePercentage >= 95 ? 'bg-green-500' : 
                row.attendancePercentage >= 85 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${row.attendancePercentage}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'lastAttended',
      header: 'Last Attended',
      cell: (row: any) => (
        <div className="text-center text-sm">{row.lastAttended}</div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row: any) => (
        <StatusBadge
          variant={row.status === 'Active' ? 'success' : 'error'}
          label={row.status}
        />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row: any) => (
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View Schedule
        </Button>
      ),
    },
  ];

  const handleFilterChange = (filterId: string, value: any) => {
    console.log("Filter changed:", filterId, value);
  };

  return (
    <MainLayout role="state_head">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track attendance for candidates and trainers across all centers
          </p>
        </div>
        
        <EnhancedFilterBar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          actions={
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Attendance Report
            </Button>
          }
        />

        <Tabs defaultValue="candidates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="candidates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="trainers" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Trainers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="candidates">
            <div className="rounded-md border bg-white">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Candidate Attendance</h2>
                <p className="text-sm text-muted-foreground">
                  Attendance tracking for all candidates across batches
                </p>
              </div>
              <DataTable
                columns={candidateColumns}
                data={candidateAttendanceData}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="trainers">
            <div className="rounded-md border bg-white">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Trainer Attendance</h2>
                <p className="text-sm text-muted-foreground">
                  Attendance tracking for all trainers and their assigned batches
                </p>
              </div>
              <DataTable
                columns={trainerColumns}
                data={trainerAttendanceData}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Attendance;
