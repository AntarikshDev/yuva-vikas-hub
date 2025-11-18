import React, { useState, useMemo } from 'react';
import { DataTable, Column } from '@/components/common/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, ArrowUpDown, Eye, Download, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { WorkOrder } from '@/store/slices/directorSlice';
import { PaymentTrackingDialog } from './PaymentTrackingDialog';
import { WorkOrderDetailsDialog } from './WorkOrderDetailsDialog';

interface ProgramWorkOrdersTableProps {
  programName: string;
  workOrders: WorkOrder[];
  onViewDetails?: (workOrder: WorkOrder) => void;
}

type SortField = 'workOrderNo' | 'workOrderDate' | 'districtProgress' | 'enrolmentProgress' | 'costProgress';
type SortDirection = 'asc' | 'desc';

export const ProgramWorkOrdersTable: React.FC<ProgramWorkOrdersTableProps> = ({
  programName,
  workOrders,
  onViewDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('workOrderDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getProgressPercentage = (actual: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((actual / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredAndSortedWorkOrders = useMemo(() => {
    let filtered = workOrders.filter(
      (wo) =>
        wo.workOrderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.districts.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'workOrderNo':
          aValue = a.workOrderNo;
          bValue = b.workOrderNo;
          break;
        case 'workOrderDate':
          aValue = new Date(a.workOrderDate).getTime();
          bValue = new Date(b.workOrderDate).getTime();
          break;
        case 'districtProgress':
          aValue = getProgressPercentage(a.districtsActive, a.districtsAssigned);
          bValue = getProgressPercentage(b.districtsActive, b.districtsAssigned);
          break;
        case 'enrolmentProgress':
          aValue = getProgressPercentage(a.enrolmentAchieved, a.enrolmentTarget);
          bValue = getProgressPercentage(b.enrolmentAchieved, b.enrolmentTarget);
          break;
        case 'costProgress':
          aValue = getProgressPercentage(a.costIncurred, a.totalBudget);
          bValue = getProgressPercentage(b.costIncurred, b.totalBudget);
          break;
        default:
          aValue = a.workOrderNo;
          bValue = b.workOrderNo;
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [workOrders, searchTerm, sortField, sortDirection]);

  const columns: Column<WorkOrder>[] = [
    {
      id: 'workOrderNo',
      header: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('workOrderNo')}
          className="gap-2 hover:bg-muted"
        >
          Work Order No.
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      ),
      cell: (wo) => (
        <div className="font-medium">
          {wo.workOrderNo}
          <Badge variant="outline" className="ml-2">
            {wo.status}
          </Badge>
        </div>
      ),
    },
    {
      id: 'dates',
      header: 'Key Dates',
      cell: (wo) => (
        <div className="space-y-1 text-xs">
          <div><span className="text-muted-foreground">WO Date:</span> {format(new Date(wo.workOrderDate), 'dd MMM yyyy')}</div>
          <div><span className="text-muted-foreground">Setup:</span> {format(new Date(wo.centreSetupDate), 'dd MMM yyyy')}</div>
          <div><span className="text-muted-foreground">Mob. Start:</span> {format(new Date(wo.mobilisationStartDate), 'dd MMM yyyy')}</div>
          <div><span className="text-muted-foreground">Batch Inc:</span> {format(new Date(wo.batchIncorporationDate), 'dd MMM yyyy')}</div>
        </div>
      ),
    },
    {
      id: 'districts',
      header: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('districtProgress')}
          className="gap-2 hover:bg-muted"
        >
          Districts (Actual vs Target)
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      ),
      cell: (wo) => {
        const percentage = getProgressPercentage(wo.districtsActive, wo.districtsAssigned);
        return (
          <div className="space-y-2 min-w-[180px]">
            <div className="flex items-center justify-between text-sm">
              <span className={getProgressColor(percentage)}>
                {wo.districtsActive} / {wo.districtsAssigned}
              </span>
              <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {wo.districts.slice(0, 2).join(', ')}
              {wo.districts.length > 2 && ` +${wo.districts.length - 2}`}
            </div>
          </div>
        );
      },
    },
    {
      id: 'manpower',
      header: 'Manpower',
      cell: (wo) => {
        const percentage = getProgressPercentage(wo.manpowerCurrent, wo.manpowerRequired);
        return (
          <div className="space-y-2 min-w-[140px]">
            <div className="flex items-center justify-between text-sm">
              <span className={getProgressColor(percentage)}>
                {wo.manpowerCurrent} / {wo.manpowerRequired}
              </span>
              <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      },
    },
    {
      id: 'enrolment',
      header: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('enrolmentProgress')}
          className="gap-2 hover:bg-muted"
        >
          Enrolment (Actual vs Target)
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      ),
      cell: (wo) => {
        const percentage = getProgressPercentage(wo.enrolmentAchieved, wo.enrolmentTarget);
        return (
          <div className="space-y-2 min-w-[160px]">
            <div className="flex items-center justify-between text-sm">
              <span className={getProgressColor(percentage)}>
                {wo.enrolmentAchieved} / {wo.enrolmentTarget}
              </span>
              <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      },
    },
    {
      id: 'cost',
      header: (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('costProgress')}
          className="gap-2 hover:bg-muted"
        >
          Cost Analysis
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      ),
      cell: (wo) => {
        const percentage = getProgressPercentage(wo.costIncurred, wo.totalBudget);
        return (
          <div className="space-y-2 min-w-[180px]">
            <div className="flex items-center justify-between text-sm">
              <span>₹{(wo.costIncurred / 100000).toFixed(2)}L / ₹{(wo.totalBudget / 100000).toFixed(2)}L</span>
            </div>
            <Progress value={percentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Fixed: ₹{(wo.fixedBudget / 100000).toFixed(2)}L | Variable: ₹{(wo.variableBudget / 100000).toFixed(2)}L
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (wo) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedWorkOrder(wo);
              setPaymentDialogOpen(true);
            }}
            className="gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Payments
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedWorkOrder(wo);
              setDetailsDialogOpen(true);
            }}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-xl">{programName} - Work Orders</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredAndSortedWorkOrders.length} work order(s) found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search work orders or districts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[300px]"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={filteredAndSortedWorkOrders}
          emptyState={
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-4xl">📊</div>
              <h3 className="mt-2 text-lg font-medium">No work orders found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm
                  ? 'Try adjusting your search filters'
                  : 'Work orders will appear here once assigned'}
              </p>
            </div>
          }
        />

        <PaymentTrackingDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          workOrder={selectedWorkOrder}
        />

        <WorkOrderDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          workOrder={selectedWorkOrder}
        />
      </CardContent>
    </Card>
  );
};
