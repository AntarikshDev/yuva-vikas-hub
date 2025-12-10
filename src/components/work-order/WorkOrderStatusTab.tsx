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
} from "lucide-react";

interface WorkOrderStatusTabProps {
  workOrderId: string;
  role: 'director' | 'national-head';
  totalTarget: number;
}

// Mock data for centre status
const mockCentreStatus = [
  { id: "1", name: "Mumbai Training Centre", status: "operational", capacity: 200, enrolled: 185, trainer: "Available", infra: "Complete", tickets: 2 },
  { id: "2", name: "Pune Skill Centre", status: "operational", capacity: 150, enrolled: 142, trainer: "Available", infra: "Complete", tickets: 0 },
  { id: "3", name: "Nagpur Development Hub", status: "partial", capacity: 100, enrolled: 78, trainer: "Pending", infra: "In Progress", tickets: 3 },
  { id: "4", name: "Thane Training Institute", status: "issue", capacity: 120, enrolled: 45, trainer: "Vacant", infra: "Pending", tickets: 5 },
];

// Mock tickets data
const mockTickets = [
  { id: "TKT-001", centre: "Mumbai Training Centre", issue: "Infrastructure repair needed", priority: "medium", status: "open", createdAt: "2024-01-10" },
  { id: "TKT-002", centre: "Mumbai Training Centre", issue: "Network connectivity issues", priority: "high", status: "in_progress", createdAt: "2024-01-12" },
  { id: "TKT-003", centre: "Nagpur Development Hub", issue: "Trainer attendance concern", priority: "high", status: "open", createdAt: "2024-01-08" },
  { id: "TKT-004", centre: "Nagpur Development Hub", issue: "Equipment malfunction", priority: "medium", status: "open", createdAt: "2024-01-11" },
  { id: "TKT-005", centre: "Nagpur Development Hub", issue: "AC not working", priority: "low", status: "resolved", createdAt: "2024-01-05" },
  { id: "TKT-006", centre: "Thane Training Institute", issue: "Trainer vacancy - urgent", priority: "critical", status: "open", createdAt: "2024-01-02" },
  { id: "TKT-007", centre: "Thane Training Institute", issue: "Safety compliance issue", priority: "high", status: "open", createdAt: "2024-01-09" },
  { id: "TKT-008", centre: "Thane Training Institute", issue: "Classroom renovation needed", priority: "medium", status: "in_progress", createdAt: "2024-01-06" },
];

// Mock monthly target achievement
const mockMonthlyTargets = [
  { month: "Jan 2024", planned: 400, achieved: 380, variance: -20, status: "on_track" },
  { month: "Feb 2024", planned: 450, achieved: 420, variance: -30, status: "on_track" },
  { month: "Mar 2024", planned: 500, achieved: 485, variance: -15, status: "on_track" },
  { month: "Apr 2024", planned: 520, achieved: 490, variance: -30, status: "warning" },
  { month: "May 2024", planned: 550, achieved: 480, variance: -70, status: "critical" },
  { month: "Jun 2024", planned: 500, achieved: 0, variance: -500, status: "pending" },
];

// Mock district adoption OFR data
const mockDistrictOFR = [
  { district: "Mumbai Suburban", block: "Andheri", ofrReceived: 245, ofrTarget: 300, adoptionStatus: "good", lastUpdate: "2024-01-14" },
  { district: "Mumbai Suburban", block: "Borivali", ofrReceived: 180, ofrTarget: 200, adoptionStatus: "good", lastUpdate: "2024-01-13" },
  { district: "Pune", block: "Haveli", ofrReceived: 120, ofrTarget: 250, adoptionStatus: "poor", lastUpdate: "2024-01-10" },
  { district: "Pune", block: "Mulshi", ofrReceived: 95, ofrTarget: 150, adoptionStatus: "moderate", lastUpdate: "2024-01-12" },
  { district: "Nagpur", block: "Nagpur Urban", ofrReceived: 60, ofrTarget: 200, adoptionStatus: "critical", lastUpdate: "2024-01-08" },
];

// Mock vacant positions
const mockVacantPositions = [
  { id: "1", position: "State Head", location: "Nagpur", vacantSince: "2024-01-01", priority: "critical", candidates: 2 },
  { id: "2", position: "Trainer - IT", location: "Thane Training Institute", vacantSince: "2024-01-05", priority: "high", candidates: 5 },
  { id: "3", position: "Counsellor", location: "Pune Skill Centre", vacantSince: "2024-01-10", priority: "medium", candidates: 3 },
  { id: "4", position: "Mobilizer", location: "Mumbai Suburban", vacantSince: "2024-01-12", priority: "low", candidates: 8 },
];

// Mock budget variance data
const mockBudgetVariance = {
  teamSalary: { planned: 2500000, actual: 2450000, variance: 50000, status: "under" },
  travelExpenses: { planned: 800000, actual: 920000, variance: -120000, status: "over" },
  activityCosts: { planned: 600000, actual: 580000, variance: 20000, status: "under" },
  migrationCosts: { planned: 1200000, actual: 1100000, variance: 100000, status: "under" },
  totalBudget: { planned: 5100000, actual: 5050000, variance: 50000, status: "under" },
};

export const WorkOrderStatusTab = ({ workOrderId, role, totalTarget }: WorkOrderStatusTabProps) => {
  const [activeSection, setActiveSection] = useState("overview");

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

  const totalAchieved = mockMonthlyTargets.reduce((sum, m) => sum + m.achieved, 0);
  const totalPlanned = mockMonthlyTargets.filter(m => m.status !== 'pending').reduce((sum, m) => sum + m.planned, 0);
  const openTickets = mockTickets.filter(t => t.status !== 'resolved').length;
  const criticalIssues = mockTickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length;

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
                  {mockCentreStatus.filter(c => c.status === 'operational').length}/{mockCentreStatus.length}
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
                <p className="text-2xl font-bold">{Math.round((totalAchieved / totalPlanned) * 100)}%</p>
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
                <p className="text-2xl font-bold text-orange-500">{mockVacantPositions.length}</p>
                <p className="text-xs text-orange-500">
                  {mockVacantPositions.filter(p => p.priority === 'critical').length} Critical
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(criticalIssues > 0 || mockBudgetVariance.travelExpenses.status === 'over') && (
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
          {mockBudgetVariance.travelExpenses.status === 'over' && (
            <Alert variant="destructive">
              <IndianRupee className="h-4 w-4" />
              <AlertTitle>Budget Overspending Alert</AlertTitle>
              <AlertDescription>
                Travel expenses are {formatCurrency(Math.abs(mockBudgetVariance.travelExpenses.variance))} over budget.
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
                    {mockCentreStatus.map((centre) => (
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
                    {mockVacantPositions.map((position) => (
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
                  {mockTickets.map((ticket) => (
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
                  {mockMonthlyTargets.map((month, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{month.month}</TableCell>
                      <TableCell>{month.planned.toLocaleString()}</TableCell>
                      <TableCell>{month.achieved.toLocaleString()}</TableCell>
                      <TableCell className={month.variance < 0 ? 'text-destructive' : 'text-green-600'}>
                        <span className="flex items-center gap-1">
                          {month.variance < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                          {month.variance}
                        </span>
                      </TableCell>
                      <TableCell className="w-[150px]">
                        {month.status !== 'pending' ? (
                          <Progress value={(month.achieved / month.planned) * 100} className="h-2" />
                        ) : (
                          <span className="text-muted-foreground text-sm">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            month.status === 'on_track' ? 'default' :
                            month.status === 'warning' ? 'secondary' :
                            month.status === 'critical' ? 'destructive' : 'outline'
                          }
                        >
                          {month.status === 'on_track' ? 'On Track' :
                           month.status === 'warning' ? 'Warning' :
                           month.status === 'critical' ? 'Critical' : 'Pending'}
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
                District Adoption Status
              </CardTitle>
              <CardDescription>OFR received from Blocks and Districts as per adoption plan</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>District</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>OFR Target</TableHead>
                    <TableHead>OFR Received</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDistrictOFR.map((district, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{district.district}</TableCell>
                      <TableCell>{district.block}</TableCell>
                      <TableCell>{district.ofrTarget}</TableCell>
                      <TableCell>{district.ofrReceived}</TableCell>
                      <TableCell className="w-[150px]">
                        <div className="flex items-center gap-2">
                          <Progress value={(district.ofrReceived / district.ofrTarget) * 100} className="h-2 flex-1" />
                          <span className="text-xs text-muted-foreground">
                            {Math.round((district.ofrReceived / district.ofrTarget) * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getAdoptionBadge(district.adoptionStatus)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{district.lastUpdate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Variance Tab */}
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Budget Variance Report
              </CardTitle>
              <CardDescription>Planned vs Actual expenses with variance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Planned</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead className="text-right">%</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Team Salary</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBudgetVariance.teamSalary.planned)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBudgetVariance.teamSalary.actual)}</TableCell>
                    <TableCell className={`text-right ${mockBudgetVariance.teamSalary.variance >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                      {formatCurrency(mockBudgetVariance.teamSalary.variance)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Math.round((mockBudgetVariance.teamSalary.actual / mockBudgetVariance.teamSalary.planned) * 100)}%
                    </TableCell>
                    <TableCell>
                      {mockBudgetVariance.teamSalary.status === 'under' ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Under Budget
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" /> Over Budget
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-destructive/5">
                    <TableCell className="font-medium">Travel Expenses</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBudgetVariance.travelExpenses.planned)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBudgetVariance.travelExpenses.actual)}</TableCell>
                    <TableCell className="text-right text-destructive">
                      {formatCurrency(mockBudgetVariance.travelExpenses.variance)}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      {Math.round((mockBudgetVariance.travelExpenses.actual / mockBudgetVariance.travelExpenses.planned) * 100)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" /> Over Budget
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Activity Costs</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBudgetVariance.activityCosts.planned)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBudgetVariance.activityCosts.actual)}</TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(mockBudgetVariance.activityCosts.variance)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Math.round((mockBudgetVariance.activityCosts.actual / mockBudgetVariance.activityCosts.planned) * 100)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Under Budget
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Migration Costs</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBudgetVariance.migrationCosts.planned)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBudgetVariance.migrationCosts.actual)}</TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(mockBudgetVariance.migrationCosts.variance)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Math.round((mockBudgetVariance.migrationCosts.actual / mockBudgetVariance.migrationCosts.planned) * 100)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Under Budget
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-semibold border-t-2">
                    <TableCell>Total Budget</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBudgetVariance.totalBudget.planned)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBudgetVariance.totalBudget.actual)}</TableCell>
                    <TableCell className={`text-right ${mockBudgetVariance.totalBudget.variance >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                      {formatCurrency(mockBudgetVariance.totalBudget.variance)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Math.round((mockBudgetVariance.totalBudget.actual / mockBudgetVariance.totalBudget.planned) * 100)}%
                    </TableCell>
                    <TableCell>
                      {mockBudgetVariance.totalBudget.status === 'under' ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Under Budget
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" /> Over Budget
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Budget Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Budget Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Travel Expenses Overspending</AlertTitle>
                <AlertDescription>
                  Travel expenses have exceeded budget by {formatCurrency(Math.abs(mockBudgetVariance.travelExpenses.variance))} (115% of planned).
                  Review and approve pending expense claims to control costs.
                </AlertDescription>
              </Alert>
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Remaining Budget</AlertTitle>
                <AlertDescription>
                  {formatCurrency(mockBudgetVariance.totalBudget.variance)} remaining from total planned budget.
                  Current cost per candidate: {formatCurrency(mockBudgetVariance.totalBudget.actual / totalAchieved)}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkOrderStatusTab;
