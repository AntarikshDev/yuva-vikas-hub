
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { EnhancedFilterBar } from '@/components/common/EnhancedFilterBar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { CenterReportDialog } from '@/components/dialogs/CenterReportDialog';
import { CenterContactDialog } from '@/components/dialogs/CenterContactDialog';
import { Download, Eye, Phone, Mail } from 'lucide-react';

const CenterPerformance: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<any>(null);
  
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

  const centerData = [
    {
      centerName: 'Mumbai Central Training Hub',
      district: 'Mumbai',
      manager: 'Rajesh Kumar',
      activeBatches: 5,
      totalCandidates: 156,
      placedCandidates: 142,
      placementRate: 91,
      avgSalary: 19200,
      videoCompliance: 89,
      counsellingRate: 95,
      status: 'Active',
      contact: { phone: '+91 9876543210', email: 'rajesh.mumbai@lnjskills.com' }
    },
    {
      centerName: 'Andheri Skill Center',
      district: 'Mumbai',
      manager: 'Priya Sharma',
      activeBatches: 3,
      totalCandidates: 98,
      placedCandidates: 84,
      placementRate: 86,
      avgSalary: 18500,
      videoCompliance: 92,
      counsellingRate: 88,
      status: 'Active',
      contact: { phone: '+91 9876543211', email: 'priya.andheri@lnjskills.com' }
    },
    {
      centerName: 'Pune East Center',
      district: 'Pune',
      manager: 'Amit Patil',
      activeBatches: 4,
      totalCandidates: 124,
      placedCandidates: 98,
      placementRate: 79,
      avgSalary: 17800,
      videoCompliance: 76,
      counsellingRate: 82,
      status: 'Active',
      contact: { phone: '+91 9876543212', email: 'amit.pune@lnjskills.com' }
    },
  ];

  const columns = [
    {
      id: 'center',
      header: 'Center Name',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.centerName}</div>
          <div className="text-xs text-gray-500">{row.district} • {row.manager}</div>
        </div>
      ),
    },
    {
      id: 'batches',
      header: 'Active Batches',
      cell: (row: any) => (
        <div className="text-center font-medium">{row.activeBatches}</div>
      ),
    },
    {
      id: 'candidates',
      header: 'Candidates',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.totalCandidates}</div>
          <div className="text-xs text-gray-500">{row.placedCandidates} placed</div>
        </div>
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
            label={row.placementRate >= 85 ? 'Excellent' : row.placementRate >= 75 ? 'Good' : 'Poor'}
            size="sm"
          />
        </div>
      ),
    },
    {
      id: 'salary',
      header: 'Avg Salary',
      cell: (row: any) => (
        <div className="text-center font-medium">₹{row.avgSalary.toLocaleString()}</div>
      ),
    },
    {
      id: 'compliance',
      header: 'Video Compliance',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.videoCompliance}%</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full ${
                row.videoCompliance >= 80 ? 'bg-green-500' : 
                row.videoCompliance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${row.videoCompliance}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: (row: any) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedCenter(row);
              setReportDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            Report
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedCenter(row);
              setContactDialogOpen(true);
            }}
          >
            <Phone className="h-4 w-4 mr-1" />
            Contact
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
          <h1 className="text-2xl font-bold tracking-tight">Center Performance</h1>
          <p className="text-muted-foreground">
            Detailed performance metrics for all training centers
          </p>
        </div>
        
        <EnhancedFilterBar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          actions={
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Center Report
            </Button>
          }
        />

        <div className="rounded-md border bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Center Performance Overview</h2>
          </div>
          <DataTable
            columns={columns}
            data={centerData}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      {selectedCenter && (
        <>
          <CenterReportDialog
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
            centerName={selectedCenter.centerName}
          />
          
          <CenterContactDialog
            open={contactDialogOpen}
            onOpenChange={setContactDialogOpen}
            centerData={selectedCenter}
          />
        </>
      )}
    </MainLayout>
  );
};

export default CenterPerformance;
