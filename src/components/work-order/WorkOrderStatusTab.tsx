import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  MapPin,
  Ticket,
  IndianRupee,
  AlertCircle,
  Clock,
  FileText,
  Loader2,
} from "lucide-react";
import {
  useGetWorkOrderStatusQuery,
  useGetCentreStatusSummaryQuery,
  useGetTicketsQuery,
  useGetMonthlyTargetAchievementQuery,
  useGetDistrictOFRStatusQuery,
  useGetVacantPositionsQuery,
  useGetBudgetVarianceQuery,
} from "@/store/api/apiSlice";

interface WorkOrderStatusTabProps {
  workOrderId: string;
  role: 'director' | 'national-head';
  totalTarget: number;
}

// Mock data
const mockCentreStatus = [
  { id: "1", name: "Mumbai Training Centre", status: "operational", capacity: 200, enrolled: 185, trainer: "Available", infra: "Complete", tickets: 2 },
  { id: "2", name: "Pune Skill Centre", status: "operational", capacity: 150, enrolled: 142, trainer: "Available", infra: "Complete", tickets: 0 },
  { id: "3", name: "Nagpur Development Hub", status: "partial", capacity: 100, enrolled: 78, trainer: "Pending", infra: "In Progress", tickets: 3 },
  { id: "4", name: "Thane Training Institute", status: "issue", capacity: 120, enrolled: 45, trainer: "Vacant", infra: "Pending", tickets: 5 },
];

const mockTickets = [
  { id: "TKT-001", centre: "Mumbai Training Centre", issue: "Infrastructure repair needed", priority: "medium", status: "open", createdAt: "2024-01-10" },
  { id: "TKT-002", centre: "Mumbai Training Centre", issue: "Network connectivity issues", priority: "high", status: "in_progress", createdAt: "2024-01-12" },
  { id: "TKT-003", centre: "Nagpur Development Hub", issue: "Trainer attendance concern", priority: "high", status: "open", createdAt: "2024-01-08" },
  { id: "TKT-004", centre: "Nagpur Development Hub", issue: "Equipment malfunction", priority: "medium", status: "open", createdAt: "2024-01-11" },
  { id: "TKT-005", centre: "Nagpur Development Hub", issue: "AC not working", priority: "low", status: "resolved", createdAt: "2024-01-05" },
  { id: "TKT-006", centre: "Thane Training Institute", issue: "Trainer vacancy - urgent", priority: "critical", status: "open", createdAt: "2024-01-02" },
];

const mockMonthlyTargets = [
  { month: "Jan 2024", planned: 400, achieved: 380, variance: -20, status: "on_track" },
  { month: "Feb 2024", planned: 450, achieved: 420, variance: -30, status: "on_track" },
  { month: "Mar 2024", planned: 500, achieved: 485, variance: -15, status: "on_track" },
  { month: "Apr 2024", planned: 520, achieved: 490, variance: -30, status: "warning" },
  { month: "May 2024", planned: 550, achieved: 480, variance: -70, status: "critical" },
];

const mockDistrictOFR = [
  { district: "Mumbai Suburban", block: "Andheri", ofrReceived: 245, ofrTarget: 300, adoptionStatus: "good", lastUpdate: "2024-01-14" },
  { district: "Mumbai Suburban", block: "Borivali", ofrReceived: 180, ofrTarget: 200, adoptionStatus: "good", lastUpdate: "2024-01-13" },
  { district: "Pune", block: "Haveli", ofrReceived: 120, ofrTarget: 250, adoptionStatus: "poor", lastUpdate: "2024-01-10" },
  { district: "Pune", block: "Mulshi", ofrReceived: 95, ofrTarget: 150, adoptionStatus: "moderate", lastUpdate: "2024-01-12" },
];

const mockVacantPositions = [
  { id: "1", position: "State Head", location: "Nagpur", vacantSince: "2024-01-01", priority: "critical", candidates: 2 },
  { id: "2", position: "Trainer - IT", location: "Thane Training Institute", vacantSince: "2024-01-05", priority: "high", candidates: 5 },
  { id: "3", position: "Counsellor", location: "Pune Skill Centre", vacantSince: "2024-01-10", priority: "medium", candidates: 3 },
];

const mockBudgetVariance = {
  teamSalary: { planned: 2500000, actual: 2450000, variance: 50000, status: "under" },
  travelExpenses: { planned: 800000, actual: 920000, variance: -120000, status: "over" },
  activityCosts: { planned: 600000, actual: 580000, variance: 20000, status: "under" },
  migrationCosts: { planned: 1200000, actual: 1100000, variance: 100000, status: "under" },
  totalBudget: { planned: 5100000, actual: 5050000, variance: 50000, status: "under" },
};

export const WorkOrderStatusTab = ({ workOrderId, role, totalTarget }: WorkOrderStatusTabProps) => {
  const [activeSection, setActiveSection] = useState("overview");

  // RTK Query hooks
  const { data: statusData, isLoading } = useGetWorkOrderStatusQuery(workOrderId);
  const { data: centreStatusData } = useGetCentreStatusSummaryQuery(workOrderId);
  const { data: ticketsData } = useGetTicketsQuery({ workOrderId });
  const { data: monthlyTargetsData } = useGetMonthlyTargetAchievementQuery(workOrderId);
  const { data: districtOFRData } = useGetDistrictOFRStatusQuery(workOrderId);
  const { data: vacantPositionsData } = useGetVacantPositionsQuery(workOrderId);
  const { data: budgetVarianceData } = useGetBudgetVarianceQuery(workOrderId);

  // Mock fallback pattern
  let centreStatus;
  if (!centreStatusData) {
    centreStatus = mockCentreStatus;
  } else {
    centreStatus = centreStatusData;
  }

  let tickets;
  if (!ticketsData) {
    tickets = mockTickets;
  } else {
    tickets = ticketsData;
  }

  let monthlyTargets;
  if (!monthlyTargetsData) {
    monthlyTargets = mockMonthlyTargets;
  } else {
    monthlyTargets = monthlyTargetsData;
  }

  let districtOFR;
  if (!districtOFRData) {
    districtOFR = mockDistrictOFR;
  } else {
    districtOFR = districtOFRData;
  }

  let vacantPositions;
  if (!vacantPositionsData) {
    vacantPositions = mockVacantPositions;
  } else {
    vacantPositions = vacantPositionsData;
  }

  let budgetVariance;
  if (!budgetVarianceData) {
    budgetVariance = mockBudgetVariance;
  } else {
    budgetVariance = budgetVarianceData;
  }

  const getCentreStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      operational: { variant: "default", label: "Operational" },
      partial: { variant: "secondary", label: "Partial" },
      issue: { variant: "destructive", label: "Issues" },
    };
    return <Badge variant={config[status]?.variant || "outline"}>{config[status]?.label || status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      critical: { variant: "destructive", label: "Critical" },
      high: { variant: "destructive", label: "High" },
      medium: { variant: "secondary", label: "Medium" },
      low: { variant: "outline", label: "Low" },
    };
    return <Badge variant={config[priority]?.variant || "outline"}>{config[priority]?.label || priority}</Badge>;
  };

  const getAdoptionBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      good: { variant: "default", label: "Good" },
      moderate: { variant: "secondary", label: "Moderate" },
      poor: { variant: "outline", label: "Poor" },
      critical: { variant: "destructive", label: "Critical" },
    };
    return <Badge variant={config[status]?.variant || "outline"}>{config[status]?.label || status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalAchieved = monthlyTargets.reduce((sum: number, m: any) => sum + m.achieved, 0);
  const totalPlanned = monthlyTargets.filter((m: any) => m.status !== 'pending').reduce((sum: number, m: any) => sum + m.planned, 0);
  const openTickets = tickets.filter((t: any) => t.status !== 'resolved').length;
  const criticalIssues = tickets.filter((t: any) => t.priority === 'critical' && t.status !== 'resolved').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Centres Status</p>
                <p className="text-2xl font-bold">
                  {centreStatus.filter((c: any) => c.status === 'operational').length}/{centreStatus.length}
                </p>
                <p className="text-xs text-muted-foreground">Fully Operational</p>
              </div>
              <Building2 className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold text-destructive">{openTickets}</p>
                <p className="text-xs text-destructive">{criticalIssues} Critical</p>
              </div>
              <Ticket className="h-8 w-8 text-destructive opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Target Achievement</p>
                <p className="text-2xl font-bold">{totalPlanned > 0 ? Math.round((totalAchieved / totalPlanned) * 100) : 0}%</p>
                <p className="text-xs text-muted-foreground">{totalAchieved.toLocaleString()}/{totalPlanned.toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vacant Positions</p>
                <p className="text-2xl font-bold text-orange-500">{vacantPositions.length}</p>
                <p className="text-xs text-orange-500">
                  {vacantPositions.filter((p: any) => p.priority === 'critical').length} Critical
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(criticalIssues > 0 || budgetVariance.travelExpenses.status === 'over') && (
        <div className="space-y-2">
          {criticalIssues > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Critical Issues</AlertTitle>
              <AlertDescription>
                {criticalIssues} critical ticket(s) require immediate attention across centres.
              </AlertDescription>
            </Alert>
          )}
          {budgetVariance.travelExpenses.status === 'over' && (
            <Alert variant="destructive">
              <IndianRupee className="h-4 w-4" />
              <AlertTitle>Budget Overspending Alert</AlertTitle>
              <AlertDescription>
                Travel expenses are {formatCurrency(Math.abs(budgetVariance.travelExpenses.variance))} over budget.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Detailed Sections */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="targets">Targets</TabsTrigger>
          <TabsTrigger value="adoption">District Adoption</TabsTrigger>
          <TabsTrigger value="budget">Budget Variance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Centre Status Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Centre Status Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Centre</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Tickets</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {centreStatus.map((centre: any) => (
                      <TableRow key={centre.id}>
                        <TableCell className="font-medium">{centre.name}</TableCell>
                        <TableCell>{getCentreStatusBadge(centre.status)}</TableCell>
                        <TableCell>{centre.enrolled}/{centre.capacity}</TableCell>
                        <TableCell>
                          {centre.tickets > 0 ? (
                            <Badge variant="destructive">{centre.tickets}</Badge>
                          ) : (
                            <Badge variant="outline">0</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Vacant Positions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Vacant Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Candidates</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vacantPositions.map((position: any) => (
                      <TableRow key={position.id}>
                        <TableCell className="font-medium">{position.position}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{position.location}</TableCell>
                        <TableCell>{getPriorityBadge(position.priority)}</TableCell>
                        <TableCell>{position.candidates}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Centre Tickets
              </CardTitle>
              <CardDescription>All tickets raised for centres under this work order</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Centre</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket: any) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                      <TableCell>{ticket.centre}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{ticket.issue}</TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>
                        <Badge variant={ticket.status === 'resolved' ? 'default' : ticket.status === 'in_progress' ? 'secondary' : 'outline'}>
                          {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{ticket.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Targets Tab */}
        <TabsContent value="targets">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Month-by-Month Target Achievement
              </CardTitle>
              <CardDescription>Planned vs Achieved targets from Target Planning</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Planned</TableHead>
                    <TableHead>Achieved</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyTargets.map((month: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{month.month}</TableCell>
                      <TableCell>{month.planned.toLocaleString()}</TableCell>
                      <TableCell>{month.achieved.toLocaleString()}</TableCell>
                      <TableCell className={month.variance < 0 ? 'text-destructive' : 'text-green-600'}>
                        {month.variance >= 0 ? '+' : ''}{month.variance}
                      </TableCell>
                      <TableCell>
                        <Progress value={(month.achieved / month.planned) * 100} className="h-2 w-24" />
                      </TableCell>
                      <TableCell>
                        <Badge variant={month.status === 'on_track' ? 'default' : month.status === 'warning' ? 'secondary' : 'destructive'}>
                          {month.status === 'on_track' ? 'On Track' : month.status === 'warning' ? 'Warning' : 'Critical'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* District Adoption Tab */}
        <TabsContent value="adoption">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                District Adoption OFR Status
              </CardTitle>
              <CardDescription>OFR reception status by adopted districts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>District</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>OFR Received</TableHead>
                    <TableHead>OFR Target</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {districtOFR.map((item: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.district}</TableCell>
                      <TableCell>{item.block}</TableCell>
                      <TableCell>{item.ofrReceived}</TableCell>
                      <TableCell>{item.ofrTarget}</TableCell>
                      <TableCell>
                        <Progress value={(item.ofrReceived / item.ofrTarget) * 100} className="h-2 w-24" />
                      </TableCell>
                      <TableCell>{getAdoptionBadge(item.adoptionStatus)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Variance Tab */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Budget Variance Analysis
              </CardTitle>
              <CardDescription>Planned vs Actual budget breakdown</CardDescription>
            </CardHeader>
            <CardContent>
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
                  {Object.entries(budgetVariance).map(([key, value]: [string, any]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                      <TableCell className="text-right">{formatCurrency(value.planned)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(value.actual)}</TableCell>
                      <TableCell className={`text-right ${value.variance < 0 ? 'text-destructive' : 'text-green-600'}`}>
                        {value.variance >= 0 ? '+' : ''}{formatCurrency(value.variance)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={value.status === 'under' ? 'default' : 'destructive'}>
                          {value.status === 'under' ? 'Under Budget' : 'Over Budget'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkOrderStatusTab;