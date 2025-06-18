
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { EnhancedFilterBar } from '@/components/common/EnhancedFilterBar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DrillDownDialog } from '@/components/dialogs/DrillDownDialog';
import { Download, Eye, TrendingUp, TrendingDown } from 'lucide-react';

const StateOverview: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
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
        { value: 'nashik', label: 'Nashik' },
      ],
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'date-range' as const,
    },
  ];

  const stateData = [
    {
      district: 'Mumbai',
      totalCandidates: 1842,
      placedCandidates: 1620,
      activeCenters: 8,
      activeBatches: 15,
      placementRate: 88,
      avgSalary: 18500,
      trend: 'up',
    },
    {
      district: 'Pune',
      totalCandidates: 1254,
      placedCandidates: 1028,
      activeCenters: 6,
      activeBatches: 12,
      placementRate: 82,
      avgSalary: 17200,
      trend: 'up',
    },
    {
      district: 'Nagpur',
      totalCandidates: 953,
      placedCandidates: 715,
      activeCenters: 4,
      activeBatches: 8,
      placementRate: 75,
      avgSalary: 16800,
      trend: 'down',
    },
    {
      district: 'Nashik',
      totalCandidates: 519,
      placedCandidates: 405,
      activeCenters: 3,
      activeBatches: 6,
      placementRate: 78,
      avgSalary: 16200,
      trend: 'up',
    },
  ];

  const columns = [
    {
      id: 'district',
      header: 'District',
      cell: (row: any) => (
        <div className="font-medium">{row.district}</div>
      ),
    },
    {
      id: 'candidates',
      header: 'Total Candidates',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.totalCandidates.toLocaleString()}</div>
          <div className="text-xs text-gray-500">{row.placedCandidates} placed</div>
        </div>
      ),
    },
    {
      id: 'centers',
      header: 'Active Centers',
      cell: (row: any) => (
        <div className="text-center font-medium">{row.activeCenters}</div>
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
      id: 'placement',
      header: 'Placement Rate',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.placementRate}%</div>
          <div className="flex items-center justify-center mt-1">
            {row.trend === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
          </div>
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
      id: 'actions',
      header: '',
      cell: (row: any) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setSelectedDistrict(row.district);
            setDrillDownOpen(true);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          Drill Down
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
          <h1 className="text-2xl font-bold tracking-tight">State Overview</h1>
          <p className="text-muted-foreground">
            District-wise performance and metrics overview
          </p>
        </div>
        
        <EnhancedFilterBar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          actions={
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export State Summary
            </Button>
          }
        />

        <div className="rounded-md border bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">District Performance Summary</h2>
          </div>
          <DataTable
            columns={columns}
            data={stateData}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      <DrillDownDialog
        open={drillDownOpen}
        onOpenChange={setDrillDownOpen}
        district={selectedDistrict}
      />
    </MainLayout>
  );
};

export default StateOverview;
