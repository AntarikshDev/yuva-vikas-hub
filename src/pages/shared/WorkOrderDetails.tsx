import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Calendar, Target, Building2, FileText, MapPin, IndianRupee, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import CentreStatusTab from "@/components/work-order/CentreStatusTab";
import TargetPlanningTab from "@/components/work-order/TargetPlanningTab";
import DistrictAdoptionTab from "@/components/work-order/DistrictAdoptionTab";
import WorkOrderAssignmentTab from "@/components/work-order/WorkOrderAssignmentTab";
import { WorkOrderBudgetTab } from "@/components/work-order/WorkOrderBudgetTab";
import WorkOrderStatusTab from "@/components/work-order/WorkOrderStatusTab";
interface WorkOrderDetailsProps {
  role: 'director' | 'national-head';
}

type WorkOrderStatus = 'active' | 'started' | 'in_progress' | 'completed' | 'pending';

interface WorkOrder {
  id: string;
  workOrderNo: string;
  programName: string;
  assignedDate: string;
  startDate: string;
  endDate: string;
  totalTarget: number;
  targetSc: number;
  targetSt: number;
  targetObc: number;
  targetGeneral: number;
  targetMinority: number;
  stateName: string;
  districtName: string;
  assignedNationalHead: string;
  status: WorkOrderStatus;
}

// Mock work order data
const mockWorkOrder: WorkOrder = {
  id: "1",
  workOrderNo: "WO-2024-001",
  programName: "DDU-GKY Phase II",
  assignedDate: "2024-01-15",
  startDate: "2024-02-01",
  endDate: "2024-12-31",
  totalTarget: 5000,
  targetSc: 1500,
  targetSt: 1000,
  targetObc: 1500,
  targetGeneral: 500,
  targetMinority: 500,
  stateName: "Maharashtra",
  districtName: "Mumbai",
  assignedNationalHead: "Rahul Sharma",
  status: "active",
};

const WorkOrderDetails = ({ role }: WorkOrderDetailsProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workOrder, setWorkOrder] = useState(mockWorkOrder);
  const [activeTab, setActiveTab] = useState("centre-status");

  const canStartWorkOrder = role === 'national-head' && workOrder.status === 'active';

  const handleStartWorkOrder = () => {
    setWorkOrder(prev => ({ ...prev, status: 'started' as const }));
    toast({
      title: "Work Order Started",
      description: "You can now configure centre status and plan targets.",
    });
  };

  const handleBack = () => {
    navigate(role === 'director' ? '/director/work-orders' : '/national-head/work-orders');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      active: { variant: "default", label: "Active" },
      started: { variant: "secondary", label: "Started" },
      in_progress: { variant: "outline", label: "In Progress" },
      completed: { variant: "default", label: "Completed" },
      pending: { variant: "destructive", label: "Pending" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Work Order Details</h1>
            <p className="text-muted-foreground">
              {workOrder.workOrderNo} - {workOrder.programName}
            </p>
          </div>
        </div>
        {canStartWorkOrder && (
          <Button onClick={handleStartWorkOrder} className="gap-2">
            <Play className="h-4 w-4" />
            Start Work Order
          </Button>
        )}
      </div>

      {/* Work Order Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Work Order Summary</CardTitle>
            {getStatusBadge(workOrder.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Work Order No</p>
              <p className="font-medium">{workOrder.workOrderNo}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Program</p>
              <p className="font-medium">{workOrder.programName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Assigned Date</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {workOrder.assignedDate}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">
                {workOrder.startDate} to {workOrder.endDate}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Target</p>
              <p className="font-medium flex items-center gap-1">
                <Target className="h-3 w-3" />
                {workOrder.totalTarget.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{workOrder.stateName}, {workOrder.districtName}</p>
            </div>
          </div>

          {/* Category Targets */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Category-wise Targets</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">SC: {workOrder.targetSc}</Badge>
              <Badge variant="outline">ST: {workOrder.targetSt}</Badge>
              <Badge variant="outline">OBC: {workOrder.targetObc}</Badge>
              <Badge variant="outline">General: {workOrder.targetGeneral}</Badge>
              <Badge variant="outline">Minority: {workOrder.targetMinority}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="centre-status" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Centre Status</span>
          </TabsTrigger>
          <TabsTrigger value="target-planning" className="gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Target Planning</span>
          </TabsTrigger>
          <TabsTrigger value="district-adoption" className="gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">District Adoption</span>
          </TabsTrigger>
          <TabsTrigger value="assignment" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Assignment</span>
          </TabsTrigger>
          <TabsTrigger value="budget" className="gap-2">
            <IndianRupee className="h-4 w-4" />
            <span className="hidden sm:inline">Budget</span>
          </TabsTrigger>
          <TabsTrigger value="status" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">WO Status</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="centre-status">
          <CentreStatusTab 
            workOrderId={id || ""} 
            role={role}
            isStarted={workOrder.status !== 'active'}
          />
        </TabsContent>

        <TabsContent value="target-planning">
          <TargetPlanningTab 
            workOrderId={id || ""} 
            totalTarget={workOrder.totalTarget}
            role={role}
            isStarted={workOrder.status !== 'active'}
          />
        </TabsContent>

        <TabsContent value="district-adoption">
          <DistrictAdoptionTab 
            workOrderId={id || ""} 
            role={role}
            isStarted={workOrder.status !== 'active'}
          />
        </TabsContent>

        <TabsContent value="assignment">
          <WorkOrderAssignmentTab 
            workOrderId={id || ""} 
            role={role}
            isStarted={workOrder.status !== 'active'}
          />
        </TabsContent>

        <TabsContent value="budget">
          <WorkOrderBudgetTab 
            workOrderId={id || ""} 
            workOrderTarget={workOrder.totalTarget}
          />
        </TabsContent>

        <TabsContent value="status">
          <WorkOrderStatusTab 
            workOrderId={id || ""} 
            role={role}
            totalTarget={workOrder.totalTarget}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkOrderDetails;
