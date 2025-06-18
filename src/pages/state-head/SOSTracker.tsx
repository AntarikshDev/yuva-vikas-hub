
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { EnhancedFilterBar } from '@/components/common/EnhancedFilterBar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Download, AlertTriangle, Eye, Flag } from 'lucide-react';

const SOSTracker: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const filterOptions = [
    {
      id: 'priority',
      label: 'Priority',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'critical', label: 'Critical' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'open', label: 'Open' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
      ],
    },
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
      id: 'dateRange',
      label: 'Date Range',
      type: 'date-range' as const,
    },
  ];

  const sosData = [
    {
      ticketId: 'SOS-2024-001',
      candidateName: 'Rahul Sharma',
      candidateId: 'LNJ-MH-2024-001',
      center: 'Mumbai Central Training Hub',
      district: 'Mumbai',
      issueType: 'Training Quality',
      description: 'Trainer not covering syllabus properly, missing important topics',
      priority: 'High',
      status: 'Open',
      reportedBy: 'Candidate',
      dateReported: '2024-05-20',
      assignedTo: 'Center Manager',
      escalationLevel: 1,
    },
    {
      ticketId: 'SOS-2024-002',
      candidateName: 'Priya Patel',
      candidateId: 'LNJ-MH-2024-089',
      center: 'Andheri Skill Center',
      district: 'Mumbai',
      issueType: 'Infrastructure',
      description: 'No proper seating arrangement, AC not working, poor learning environment',
      priority: 'Critical',
      status: 'In Progress',
      reportedBy: 'Parent',
      dateReported: '2024-05-19',
      assignedTo: 'State Head',
      escalationLevel: 2,
    },
    {
      ticketId: 'SOS-2024-003',
      candidateName: 'Amit Kumar',
      candidateId: 'LNJ-PU-2024-045',
      center: 'Pune East Center',
      district: 'Pune',
      issueType: 'Placement Support',
      description: 'No job opportunities provided after course completion',
      priority: 'Medium',
      status: 'Resolved',
      reportedBy: 'Candidate',
      dateReported: '2024-05-15',
      assignedTo: 'Placement Team',
      escalationLevel: 1,
    },
  ];

  const columns = [
    {
      id: 'ticket',
      header: 'Ticket Details',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.ticketId}</div>
          <div className="text-xs text-gray-500">{row.dateReported} • {row.reportedBy}</div>
        </div>
      ),
    },
    {
      id: 'candidate',
      header: 'Candidate',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.candidateName}</div>
          <div className="text-xs text-gray-500">{row.candidateId}</div>
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
      id: 'issue',
      header: 'Issue Type',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.issueType}</div>
          <div className="text-xs text-gray-500 line-clamp-2">{row.description}</div>
        </div>
      ),
    },
    {
      id: 'priority',
      header: 'Priority',
      cell: (row: any) => (
        <StatusBadge
          variant={
            row.priority === 'Critical' ? 'error' : 
            row.priority === 'High' ? 'warning' : 
            row.priority === 'Medium' ? 'info' : 'secondary'
          }
          label={row.priority}
        />
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row: any) => (
        <StatusBadge
          variant={
            row.status === 'Resolved' ? 'success' : 
            row.status === 'In Progress' ? 'info' : 'warning'
          }
          label={row.status}
        />
      ),
    },
    {
      id: 'escalation',
      header: 'Escalation',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">Level {row.escalationLevel}</div>
          <div className="text-xs text-gray-500">{row.assignedTo}</div>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row: any) => (
        <div className="flex space-x-1">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Escalate
          </Button>
          <Button variant="destructive" size="sm">
            <Flag className="h-4 w-4 mr-1" />
            Critical
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
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <AlertTriangle className="h-8 w-8 mr-3 text-red-600" />
            SOS Tracker
          </h1>
          <p className="text-muted-foreground">
            Track and manage escalated issues and complaints from candidates
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical Issues</p>
                <p className="text-2xl font-bold text-red-700">3</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">High Priority</p>
                <p className="text-2xl font-bold text-orange-700">8</p>
              </div>
              <Flag className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-700">15</p>
              </div>
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Resolved Today</p>
                <p className="text-2xl font-bold text-green-700">12</p>
              </div>
              <Download className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <EnhancedFilterBar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          actions={
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download All SOS Logs
            </Button>
          }
        />

        <div className="rounded-md border bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">SOS Issues Overview</h2>
          </div>
          <DataTable
            columns={columns}
            data={sosData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default SOSTracker;
