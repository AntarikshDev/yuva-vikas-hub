import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, FileText, Download } from 'lucide-react';
import { CreateWorkOrderDialog } from '@/components/dialogs/CreateWorkOrderDialog';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface WorkOrdersProps {
  role: 'director' | 'national-head';
}

// Mock data for work orders
const mockWorkOrders = [
  {
    id: '1',
    workOrderNo: 'WO-2024-001',
    programId: 'prog-1',
    programName: 'DDU-GKY',
    programCode: 'DDU',
    assignedDate: '2024-01-15',
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    totalTarget: 5000,
    targetSc: 1500,
    targetSt: 1000,
    targetObc: 1500,
    targetGeneral: 700,
    targetMinority: 300,
    stateId: 'state-1',
    stateName: 'Maharashtra',
    districtId: 'dist-1',
    districtName: 'Pune',
    assignedNationalHeadId: 'nh-001',
    assignedNationalHeadName: 'Rajesh Kumar',
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    workOrderNo: 'WO-2024-002',
    programId: 'prog-2',
    programName: 'PMKVY',
    programCode: 'PMK',
    assignedDate: '2024-01-20',
    startDate: '2024-03-01',
    endDate: '2024-11-30',
    totalTarget: 3000,
    targetSc: 900,
    targetSt: 600,
    targetObc: 900,
    targetGeneral: 400,
    targetMinority: 200,
    stateId: 'state-2',
    stateName: 'Karnataka',
    districtId: 'dist-4',
    districtName: 'Bangalore',
    assignedNationalHeadId: 'nh-002',
    assignedNationalHeadName: 'Priya Sharma',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    workOrderNo: 'WO-2024-003',
    programId: 'prog-3',
    programName: 'NAPS',
    programCode: 'NAP',
    assignedDate: '2024-02-01',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    totalTarget: 2000,
    targetSc: 600,
    targetSt: 400,
    targetObc: 600,
    targetGeneral: 300,
    targetMinority: 100,
    stateId: 'state-3',
    stateName: 'Tamil Nadu',
    districtId: 'dist-6',
    districtName: 'Chennai',
    assignedNationalHeadId: 'nh-003',
    assignedNationalHeadName: 'Arun Patel',
    status: 'completed',
    createdAt: '2024-01-25',
  },
];

// Mock current user for national head filtering
const currentUserId = 'nh-001';

export const WorkOrders: React.FC<WorkOrdersProps> = ({ role }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState<typeof mockWorkOrders[0] | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workOrderToDelete, setWorkOrderToDelete] = useState<string | null>(null);
  const [workOrders, setWorkOrders] = useState(mockWorkOrders);

  const handleViewDetails = (workOrderId: string) => {
    const basePath = role === 'director' ? '/director' : '/national-head';
    navigate(`${basePath}/work-orders/${workOrderId}`);
  };

  // RBAC: Check permissions based on role
  const canCreate = role === 'director';
  const canEdit = role === 'director';
  const canDelete = role === 'director';

  // Filter work orders based on role
  const filteredWorkOrders = role === 'national-head'
    ? workOrders.filter(wo => wo.assignedNationalHeadId === currentUserId)
    : workOrders;

  // Apply search filter
  const displayedWorkOrders = filteredWorkOrders.filter(wo =>
    wo.workOrderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wo.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wo.assignedNationalHeadName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWorkOrder = (data: any) => {
    const newWorkOrder = {
      id: `wo-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    setWorkOrders([newWorkOrder, ...workOrders]);
    toast({
      title: 'Work Order Created',
      description: `Work order ${data.workOrderNo} has been created successfully.`,
    });
  };

  const handleEditWorkOrder = (data: any) => {
    setWorkOrders(workOrders.map(wo => 
      wo.id === editingWorkOrder?.id ? { ...wo, ...data } : wo
    ));
    setEditingWorkOrder(null);
    toast({
      title: 'Work Order Updated',
      description: `Work order ${data.workOrderNo} has been updated successfully.`,
    });
  };

  const handleDeleteWorkOrder = () => {
    if (workOrderToDelete) {
      setWorkOrders(workOrders.filter(wo => wo.id !== workOrderToDelete));
      setWorkOrderToDelete(null);
      setDeleteDialogOpen(false);
      toast({
        title: 'Work Order Deleted',
        description: 'Work order has been deleted successfully.',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const layoutRole = role === 'director' ? 'director' : 'national-head';

  return (
    <MainLayout role={layoutRole} title="Work Orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Work Orders</h2>
            <p className="text-muted-foreground">
              {role === 'director' 
                ? 'Manage and assign work orders to national heads'
                : 'View work orders assigned to you'}
            </p>
          </div>
          
          {canCreate && (
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Work Order
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayedWorkOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayedWorkOrders.filter(wo => wo.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayedWorkOrders.reduce((sum, wo) => sum + wo.totalTarget, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayedWorkOrders.filter(wo => wo.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Work Orders List</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search work orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Work Order No</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Total Target</TableHead>
                    <TableHead>State/District</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedWorkOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No work orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedWorkOrders.map((workOrder) => (
                      <TableRow key={workOrder.id}>
                        <TableCell className="font-medium">{workOrder.workOrderNo}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{workOrder.programName}</div>
                            <div className="text-xs text-muted-foreground">{workOrder.programCode}</div>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(workOrder.assignedDate), 'dd MMM yyyy')}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{format(new Date(workOrder.startDate), 'dd MMM yy')}</div>
                            <div className="text-muted-foreground">to {format(new Date(workOrder.endDate), 'dd MMM yy')}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{workOrder.totalTarget.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              SC: {workOrder.targetSc} | ST: {workOrder.targetSt}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{workOrder.stateName || '-'}</div>
                            <div className="text-xs text-muted-foreground">{workOrder.districtName || ''}</div>
                          </div>
                        </TableCell>
                        <TableCell>{workOrder.assignedNationalHeadName}</TableCell>
                        <TableCell>{getStatusBadge(workOrder.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuItem onClick={() => handleViewDetails(workOrder.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {canEdit && (
                                <DropdownMenuItem onClick={() => setEditingWorkOrder(workOrder)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Export
                              </DropdownMenuItem>
                              {canDelete && (
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => {
                                    setWorkOrderToDelete(workOrder.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Work Order Dialog */}
      <CreateWorkOrderDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateWorkOrder}
      />

      {/* Edit Work Order Dialog */}
      {editingWorkOrder && (
        <CreateWorkOrderDialog
          open={!!editingWorkOrder}
          onOpenChange={(open) => !open && setEditingWorkOrder(null)}
          onSubmit={handleEditWorkOrder}
          initialData={editingWorkOrder}
          isEditing
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the work order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWorkOrder} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default WorkOrders;
