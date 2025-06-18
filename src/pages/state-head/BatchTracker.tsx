
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { EnhancedFilterBar } from '@/components/common/EnhancedFilterBar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Download, Eye, Users, Video } from 'lucide-react';

const BatchTracker: React.FC = () => {
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
      id: 'status',
      label: 'Batch Status',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'completed', label: 'Completed' },
      ],
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'date-range' as const,
    },
  ];

  const batchData = [
    {
      batchId: 'BT-MUM-001',
      batchName: 'Healthcare Assistant Batch 08',
      center: 'Mumbai Central Training Hub',
      district: 'Mumbai',
      trainer: 'Anjali Singh',
      totalStudents: 32,
      currentStudents: 30,
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      progress: 75,
      status: 'Ongoing',
      placementRate: 88,
      videoLogStatus: 85,
    },
    {
      batchId: 'BT-PUN-003',
      batchName: 'Retail Sales Batch 12',
      center: 'Pune East Center',
      district: 'Pune',
      trainer: 'Vikram Mehta',
      totalStudents: 28,
      currentStudents: 26,
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      progress: 60,
      status: 'Ongoing',
      placementRate: 82,
      videoLogStatus: 92,
    },
    {
      batchId: 'BT-NAG-002',
      batchName: 'Logistics Operations Batch 05',
      center: 'Nagpur Training Academy',
      district: 'Nagpur',
      trainer: 'Sunil Khanna',
      totalStudents: 24,
      currentStudents: 24,
      startDate: '2024-01-01',
      endDate: '2024-04-01',
      progress: 100,
      status: 'Completed',
      placementRate: 75,
      videoLogStatus: 67,
    },
  ];

  const columns = [
    {
      id: 'batch',
      header: 'Batch Details',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.batchName}</div>
          <div className="text-xs text-gray-500">{row.batchId} • {row.trainer}</div>
        </div>
      ),
    },
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
      id: 'students',
      header: 'Students',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.currentStudents}/{row.totalStudents}</div>
          <div className="text-xs text-gray-500">current/enrolled</div>
        </div>
      ),
    },
    {
      id: 'progress',
      header: 'Progress',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.progress}%</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full ${
                row.progress === 100 ? 'bg-green-500' : 
                row.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row: any) => (
        <StatusBadge
          variant={
            row.status === 'Completed' ? 'success' : 
            row.status === 'Ongoing' ? 'info' : 'secondary'
          }
          label={row.status}
        />
      ),
    },
    {
      id: 'placement',
      header: 'Placement Rate',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.placementRate}%</div>
          <StatusBadge
            variant={row.placementRate >= 85 ? 'success' : row.placementRate >= 75 ? 'warning' : 'error'}
            label={row.placementRate >= 85 ? 'High' : row.placementRate >= 75 ? 'Medium' : 'Low'}
            size="sm"
          />
        </div>
      ),
    },
    {
      id: 'videoLogs',
      header: 'Video Compliance',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.videoLogStatus}%</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full ${
                row.videoLogStatus >= 80 ? 'bg-green-500' : 
                row.videoLogStatus >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${row.videoLogStatus}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row: any) => (
        <div className="flex space-x-1">
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Sheet
          </Button>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4 mr-1" />
            Logs
          </Button>
        </div>
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
          <h1 className="text-2xl font-bold tracking-tight">Batch Tracker</h1>
          <p className="text-muted-foreground">
            Monitor and track all training batches across the state
          </p>
        </div>
        
        <EnhancedFilterBar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          actions={
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Batch Data
            </Button>
          }
        />

        <div className="rounded-md border bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Batch Overview</h2>
          </div>
          <DataTable
            columns={columns}
            data={batchData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default BatchTracker;
