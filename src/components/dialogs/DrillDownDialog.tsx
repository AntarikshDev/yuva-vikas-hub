
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface DrillDownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  district: string;
}

export function DrillDownDialog({ open, onOpenChange, district }: DrillDownDialogProps) {
  const centerData = [
    {
      id: 1,
      centerName: `${district} Central Hub`,
      candidates: 234,
      placed: 198,
      placementRate: 85,
      activeBatches: 6,
      avgSalary: 18500,
    },
    {
      id: 2,
      centerName: `${district} East Center`,
      candidates: 156,
      placed: 142,
      placementRate: 91,
      activeBatches: 4,
      avgSalary: 19200,
    },
    {
      id: 3,
      centerName: `${district} West Center`,
      candidates: 189,
      placed: 145,
      placementRate: 77,
      activeBatches: 5,
      avgSalary: 17800,
    },
  ];

  const columns = [
    {
      id: 'center',
      header: 'Center Name',
      cell: (row: any) => <div className="font-medium">{row.centerName}</div>,
    },
    {
      id: 'candidates',
      header: 'Candidates',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.candidates}</div>
          <div className="text-xs text-gray-500">{row.placed} placed</div>
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
      id: 'batches',
      header: 'Active Batches',
      cell: (row: any) => <div className="text-center font-medium">{row.activeBatches}</div>,
    },
    {
      id: 'salary',
      header: 'Avg Salary',
      cell: (row: any) => <div className="text-center font-medium">₹{row.avgSalary.toLocaleString()}</div>,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{district} District - Center Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={centerData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
