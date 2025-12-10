import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, FileText, Download, Activity, Building2, Target, Users, AlertTriangle, TrendingUp, TrendingDown, CheckCircle2, XCircle, Clock } from 'lucide-react';
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

        {/* Tabs */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="list" className="gap-2">
              <FileText className="h-4 w-4" />
              Work Orders List
            </TabsTrigger>
            <TabsTrigger value="status" className="gap-2">
              <Activity className="h-4 w-4" />
              Work Order Status
            </TabsTrigger>
          </TabsList>

          {/* Work Orders List Tab */}
          <TabsContent value="list" className="space-y-6">
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
          </TabsContent>

          {/* Work Order Status Tab */}
          <TabsContent value="status" className="space-y-6">
            {/* Centre Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Centre Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Active Centres
                    </div>
                    <div className="mt-2 text-2xl font-bold">12</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-amber-500" />
                      Pending Setup
                    </div>
                    <div className="mt-2 text-2xl font-bold">3</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Open Tickets
                    </div>
                    <div className="mt-2 text-2xl font-bold text-red-600">5</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                      Inactive
                    </div>
                    <div className="mt-2 text-2xl font-bold">2</div>
                  </div>
                </div>
                
                {/* Recent Tickets */}
                <div className="mt-6">
                  <h4 className="mb-3 font-medium">Recent Centre Tickets</h4>
                  <div className="space-y-2">
                    {[
                      { centre: 'Pune Training Centre', issue: 'Infrastructure maintenance required', priority: 'high', date: '2024-01-08' },
                      { centre: 'Mumbai Skill Hub', issue: 'Internet connectivity issues', priority: 'medium', date: '2024-01-07' },
                      { centre: 'Nagpur Centre', issue: 'Equipment upgrade request', priority: 'low', date: '2024-01-06' },
                    ].map((ticket, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <div className="font-medium">{ticket.centre}</div>
                          <div className="text-sm text-muted-foreground">{ticket.issue}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'default' : 'secondary'}>
                            {ticket.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{format(new Date(ticket.date), 'dd MMM')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Target Achievement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Monthly Target Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: 'January 2024', target: 500, achieved: 420, status: 'on-track' },
                    { month: 'February 2024', target: 600, achieved: 580, status: 'on-track' },
                    { month: 'March 2024', target: 550, achieved: 380, status: 'behind' },
                    { month: 'April 2024', target: 650, achieved: 0, status: 'upcoming' },
                  ].map((item, i) => {
                    const percentage = item.target > 0 ? Math.round((item.achieved / item.target) * 100) : 0;
                    return (
                      <div key={i} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium">{item.month}</span>
                          <div className="flex items-center gap-2">
                            {item.status === 'on-track' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                            {item.status === 'behind' && <TrendingDown className="h-4 w-4 text-red-500" />}
                            <span className={item.status === 'behind' ? 'text-red-600' : item.status === 'on-track' ? 'text-emerald-600' : 'text-muted-foreground'}>
                              {item.achieved.toLocaleString()} / {item.target.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <div className="mt-1 text-right text-xs text-muted-foreground">{percentage}%</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* District Adoption & Vacant Positions */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    District Adoption Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { district: 'Pune', ofrsReceived: 45, target: 50, adoption: 90 },
                      { district: 'Nashik', ofrsReceived: 28, target: 40, adoption: 70 },
                      { district: 'Nagpur', ofrsReceived: 15, target: 35, adoption: 43 },
                      { district: 'Aurangabad', ofrsReceived: 32, target: 30, adoption: 100 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <div className="font-medium">{item.district}</div>
                          <div className="text-sm text-muted-foreground">
                            OFRs: {item.ofrsReceived} / {item.target}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={item.adoption} className="h-2 w-20" />
                          <span className={`text-sm font-medium ${item.adoption >= 80 ? 'text-emerald-600' : item.adoption >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                            {item.adoption}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Vacant Positions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Vacant Positions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { role: 'State Head', location: 'Maharashtra', vacancies: 1, priority: 'high' },
                      { role: 'Cluster Manager', location: 'Pune Region', vacancies: 2, priority: 'medium' },
                      { role: 'Mobiliser', location: 'Nashik District', vacancies: 3, priority: 'low' },
                      { role: 'Centre Manager', location: 'Nagpur', vacancies: 1, priority: 'high' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <div className="font-medium">{item.role}</div>
                          <div className="text-sm text-muted-foreground">{item.location}</div>
                        </div>
                        <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                          {item.vacancies} {item.vacancies === 1 ? 'vacancy' : 'vacancies'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                    <AlertTriangle className="mb-1 inline h-4 w-4" /> 7 total positions need to be filled.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Variance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Budget Variance Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Planned</TableHead>
                        <TableHead className="text-right">Actual</TableHead>
                        <TableHead className="text-right">Variance</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { category: 'Team Salary', planned: 850000, actual: 820000 },
                        { category: 'Travel Expenses', planned: 200000, actual: 245000 },
                        { category: 'Activity Costs', planned: 150000, actual: 142000 },
                        { category: 'Migration Costs', planned: 300000, actual: 310000 },
                      ].map((item, i) => {
                        const variance = item.actual - item.planned;
                        const variancePercent = Math.round((variance / item.planned) * 100);
                        const isOver = variance > 0;
                        return (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{item.category}</TableCell>
                            <TableCell className="text-right">₹{item.planned.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{item.actual.toLocaleString()}</TableCell>
                            <TableCell className={`text-right font-medium ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                              {isOver ? '+' : ''}₹{variance.toLocaleString()} ({variancePercent > 0 ? '+' : ''}{variancePercent}%)
                            </TableCell>
                            <TableCell>
                              {isOver ? (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Over
                                </Badge>
                              ) : (
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Under</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow className="bg-muted/50 font-bold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">₹15,00,000</TableCell>
                        <TableCell className="text-right">₹15,17,000</TableCell>
                        <TableCell className="text-right text-red-600">+₹17,000 (+1.1%)</TableCell>
                        <TableCell><Badge variant="outline">Slightly Over</Badge></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span><strong>Travel Expenses</strong> exceeded budget by 22.5%.</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                    <Clock className="h-4 w-4" />
                    <span><strong>Migration Costs</strong> at 103% utilization.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
