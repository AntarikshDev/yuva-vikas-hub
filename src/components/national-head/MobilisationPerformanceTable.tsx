import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparklines, SparklinesLine, SparklinesBars } from "react-sparklines";
import { EmployeePerformanceDialog } from "./EmployeePerformanceDialog";

export type KPIType = "mobilisation_team" | "enrolment_target" | "mobilisation_cost" | "training_completion" | "conversion_pe" | "conversion_rp";
type ViewMode = "monthly" | "quarterly" | "halfyearly" | "annual";

interface MobiliserData {
  name: string;
  target: number;
  achieved: Record<string, number>;
  ytd: number;
}

interface TeamBreakdown {
  mobilisers: MobiliserData[];
  mobiliserManagers: { count: number; target: number };
  centreManagers: { count: number; target: number };
  operationManagers: { count: number; target: number };
}

interface ProjectPerformance {
  projectId: string;
  projectName: string;
  program: string;
  workOrder: string;
  manpowerPercent: number;
  teamBreakdown: TeamBreakdown;
  totalTarget: number;
  totalAchieved: number;
  monthlyData: Record<string, { target: number; achieved: number; percent: number }>;
}

interface MobilisationPerformanceTableProps {
  projects: ProjectPerformance[];
  selectedKPI: KPIType;
  isLoading?: boolean;
}

// Period definitions
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const QUARTERS = [
  { key: "q1", label: "Q1", months: ["Apr", "May", "Jun"] },
  { key: "q2", label: "Q2", months: ["Jul", "Aug", "Sep"] },
  { key: "q3", label: "Q3", months: ["Oct", "Nov", "Dec"] },
  { key: "q4", label: "Q4", months: ["Jan", "Feb", "Mar"] },
];
const HALF_YEARS = [
  { key: "h1", label: "H1", months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"] },
  { key: "h2", label: "H2", months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"] },
];

// Generate mock monthly data
const generateMonthlyData = (yearlyTotal: number): number[] => {
  const weights = [0.06, 0.07, 0.08, 0.08, 0.09, 0.09, 0.09, 0.10, 0.09, 0.08, 0.09, 0.08];
  return weights.map(w => Math.round(yearlyTotal * w));
};

// Mini chart component
const MiniChart: React.FC<{ data: number[]; color?: string }> = ({ data, color = "#3b82f6" }) => (
  <div className="w-20 h-6">
    <Sparklines data={data} height={24} width={80}>
      <SparklinesLine color={color} style={{ strokeWidth: 1.5, fill: "none" }} />
    </Sparklines>
  </div>
);

// Mini bar chart component
const MiniBarChart: React.FC<{ data: number[]; color?: string }> = ({ data, color = "#3b82f6" }) => (
  <div className="w-20 h-6">
    <Sparklines data={data} height={24} width={80}>
      <SparklinesBars style={{ fill: color, fillOpacity: 0.6 }} />
    </Sparklines>
  </div>
);

export const MobilisationPerformanceTable: React.FC<MobilisationPerformanceTableProps> = ({
  projects,
  selectedKPI,
  isLoading
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set(["mobiliser"]));
  const [viewMode, setViewMode] = useState<ViewMode>("quarterly");
  const [selectedEmployee, setSelectedEmployee] = useState<{
    name: string;
    target: number;
    achieved: Record<string, number>;
    ytd?: number;
  } | null>(null);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);

  const handleEmployeeClick = (employee: { name: string; target: number; achieved: Record<string, number>; ytd?: number }) => {
    setSelectedEmployee(employee);
    setShowEmployeeDialog(true);
  };

  const toggleRow = (projectId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleRole = (projectId: string, role: string) => {
    const roleKey = `${projectId}-${role}`;
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(roleKey)) {
      newExpanded.delete(roleKey);
    } else {
      newExpanded.add(roleKey);
    }
    setExpandedRoles(newExpanded);
  };

  const isRoleExpanded = (projectId: string, role: string) => {
    return expandedRoles.has(`${projectId}-${role}`);
  };

  const isManpowerKPI = selectedKPI === "mobilisation_team";
  const showPeriods = ["mobilisation_team", "enrolment_target", "training_completion"].includes(selectedKPI);
  const showCostPeriods = ["mobilisation_cost", "conversion_pe", "conversion_rp"].includes(selectedKPI);

  // Get period columns based on view mode
  const getPeriodColumns = () => {
    switch (viewMode) {
      case "monthly":
        return MONTHS.map(m => ({ key: m.toLowerCase(), label: m }));
      case "quarterly":
        return QUARTERS.map(q => ({ key: q.key, label: `${q.label} (${q.months[0]}-${q.months[2]})` }));
      case "halfyearly":
        return HALF_YEARS.map(h => ({ key: h.key, label: `${h.label} (${h.months[0]}-${h.months[5]})` }));
      case "annual":
        return [{ key: "annual", label: "FY 2024-25" }];
      default:
        return [];
    }
  };

  // Calculate period value from monthly data
  const getPeriodValue = (monthlyData: number[], periodKey: string): number => {
    switch (viewMode) {
      case "monthly":
        const monthIndex = MONTHS.findIndex(m => m.toLowerCase() === periodKey);
        return monthlyData[monthIndex] || 0;
      case "quarterly":
        const quarterDef = QUARTERS.find(q => q.key === periodKey);
        if (!quarterDef) return 0;
        return quarterDef.months.reduce((sum, month) => {
          const idx = MONTHS.indexOf(month);
          return sum + (monthlyData[idx] || 0);
        }, 0);
      case "halfyearly":
        const halfDef = HALF_YEARS.find(h => h.key === periodKey);
        if (!halfDef) return 0;
        return halfDef.months.reduce((sum, month) => {
          const idx = MONTHS.indexOf(month);
          return sum + (monthlyData[idx] || 0);
        }, 0);
      case "annual":
        return monthlyData.reduce((a, b) => a + b, 0);
      default:
        return 0;
    }
  };

  const periodColumns = getPeriodColumns();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render period cells for a row with target comparison (green/red coloring)
  // For non-manpower KPIs: quarterly = monthly * 3, halfyearly = monthly * 6, annual = monthly * 12
  const renderPeriodCells = (ytdValue: number, targetValue: number, showData: boolean, showChart: boolean = false) => {
    // Generate monthly data with varying values around target
    const generateMonthlyDataWithVariation = (baseTarget: number): { actual: number[]; target: number[] } => {
      const monthlyTarget = Math.round(baseTarget / 12);
      const patterns = [
        monthlyTarget,           // Apr - at target (green)
        monthlyTarget - Math.ceil(monthlyTarget * 0.1),  // May - below target (red)
        monthlyTarget,           // Jun - at target (green)
        monthlyTarget - Math.ceil(monthlyTarget * 0.15), // Jul - below target (red)
        monthlyTarget + Math.ceil(monthlyTarget * 0.05), // Aug - above target (green)
        monthlyTarget - Math.ceil(monthlyTarget * 0.1),  // Sep - below target (red)
        monthlyTarget,           // Oct - at target (green)
        monthlyTarget + Math.ceil(monthlyTarget * 0.1),  // Nov - above target (green)
        monthlyTarget,           // Dec - at target (green)
        monthlyTarget - Math.ceil(monthlyTarget * 0.2),  // Jan - below target (red)
        monthlyTarget,           // Feb - at target (green)
        monthlyTarget + Math.ceil(monthlyTarget * 0.05), // Mar - above target (green)
      ];
      return {
        actual: patterns.map(v => Math.max(0, v)),
        target: Array(12).fill(monthlyTarget)
      };
    };
    
    if (!showData) {
      return periodColumns.map(col => (
        <TableCell key={col.key} className="text-center text-muted-foreground">-</TableCell>
      ));
    }

    const { actual: monthlyActual, target: monthlyTargetArr } = generateMonthlyDataWithVariation(targetValue);

    // Get period value with proper target multiplier for non-manpower KPIs
    const getPeriodValueWithTarget = (monthlyData: number[], monthlyTargets: number[], periodKey: string): { actual: number; target: number } => {
      switch (viewMode) {
        case "monthly":
          const monthIndex = MONTHS.findIndex(m => m.toLowerCase() === periodKey);
          return { 
            actual: monthlyData[monthIndex] || 0, 
            target: monthlyTargets[monthIndex] || 0 
          };
        case "quarterly":
          const quarterDef = QUARTERS.find(q => q.key === periodKey);
          if (!quarterDef) return { actual: 0, target: 0 };
          const qActual = quarterDef.months.reduce((sum, month) => {
            const idx = MONTHS.indexOf(month);
            return sum + (monthlyData[idx] || 0);
          }, 0);
          const qTarget = monthlyTargets[0] * 3; // Monthly target * 3
          return { actual: qActual, target: qTarget };
        case "halfyearly":
          const halfDef = HALF_YEARS.find(h => h.key === periodKey);
          if (!halfDef) return { actual: 0, target: 0 };
          const hActual = halfDef.months.reduce((sum, month) => {
            const idx = MONTHS.indexOf(month);
            return sum + (monthlyData[idx] || 0);
          }, 0);
          const hTarget = monthlyTargets[0] * 6; // Monthly target * 6
          return { actual: hActual, target: hTarget };
        case "annual":
          const annualActual = monthlyData.reduce((a, b) => a + b, 0);
          const annualTarget = monthlyTargets[0] * 12; // Monthly target * 12
          return { actual: annualActual, target: annualTarget };
        default:
          return { actual: 0, target: 0 };
      }
    };

    return periodColumns.map(col => {
      const { actual, target } = getPeriodValueWithTarget(monthlyActual, monthlyTargetArr, col.key);
      const meetsTarget = actual >= target;
      
      return (
        <TableCell key={col.key} className="text-center">
          <div className="flex flex-col items-center gap-1">
            <span className={cn(
              "font-medium text-xs px-2 py-0.5 rounded",
              meetsTarget ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {actual}
            </span>
            {showChart && viewMode !== "annual" && (
              <MiniChart 
                data={viewMode === "monthly" ? monthlyActual : 
                      viewMode === "quarterly" ? [monthlyActual.slice(0,3).reduce((a,b)=>a+b,0), monthlyActual.slice(3,6).reduce((a,b)=>a+b,0), monthlyActual.slice(6,9).reduce((a,b)=>a+b,0), monthlyActual.slice(9,12).reduce((a,b)=>a+b,0)] :
                      [monthlyActual.slice(0,6).reduce((a,b)=>a+b,0), monthlyActual.slice(6,12).reduce((a,b)=>a+b,0)]}
                color={meetsTarget ? "#22c55e" : "#ef4444"}
              />
            )}
          </div>
        </TableCell>
      );
    });
  };

  // Render role period cells (for manpower KPI showing count only)
  // Green if count equals target, Red if count < target
  // For quarterly/half-yearly/annual: show average of months
  const renderRolePeriodCells = (actual: number, target: number) => {
    // Generate monthly data with varying values
    // Some months meet target (green), some are below (red)
    const generateRoleMonthlyData = (targetValue: number): number[] => {
      // Create a pattern where different months have different values
      const patterns = [
        targetValue,           // Apr - at target (green)
        targetValue - 1,       // May - below target (red)
        targetValue,           // Jun - at target (green)
        targetValue - 1,       // Jul - below target (red)
        targetValue,           // Aug - at target (green)
        targetValue - 1,       // Sep - below target (red)
        targetValue,           // Oct - at target (green)
        targetValue,           // Nov - at target (green)
        targetValue,           // Dec - at target (green)
        targetValue - 1,       // Jan - below target (red)
        targetValue,           // Feb - at target (green)
        targetValue,           // Mar - at target (green)
      ];
      return patterns.map(v => Math.max(0, v));
    };

    // Calculate average value for role cells (not sum)
    const getRolePeriodValue = (monthlyData: number[], periodKey: string): number => {
      switch (viewMode) {
        case "monthly":
          const monthIndex = MONTHS.findIndex(m => m.toLowerCase() === periodKey);
          return monthlyData[monthIndex] || 0;
        case "quarterly":
          const quarterDef = QUARTERS.find(q => q.key === periodKey);
          if (!quarterDef) return 0;
          const qSum = quarterDef.months.reduce((sum, month) => {
            const idx = MONTHS.indexOf(month);
            return sum + (monthlyData[idx] || 0);
          }, 0);
          return Math.round(qSum / 3); // Average of 3 months
        case "halfyearly":
          const halfDef = HALF_YEARS.find(h => h.key === periodKey);
          if (!halfDef) return 0;
          const hSum = halfDef.months.reduce((sum, month) => {
            const idx = MONTHS.indexOf(month);
            return sum + (monthlyData[idx] || 0);
          }, 0);
          return Math.round(hSum / 6); // Average of 6 months
        case "annual":
          const annualSum = monthlyData.reduce((a, b) => a + b, 0);
          return Math.round(annualSum / 12); // Average of 12 months
        default:
          return 0;
      }
    };

    // Target is already the monthly target (not annual)
    const monthlyActual = generateRoleMonthlyData(target);
    const monthlyTarget = Array(12).fill(target);

    return periodColumns.map(col => {
      const actualVal = getRolePeriodValue(monthlyActual, col.key);
      const targetVal = getRolePeriodValue(monthlyTarget, col.key);
      const meetsTarget = actualVal >= targetVal;
      
      return (
        <TableCell key={col.key} className="text-center">
          <div className="flex flex-col items-center gap-1">
            <span className={cn(
              "font-medium text-xs px-2 py-0.5 rounded",
              meetsTarget ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {actualVal}
            </span>
          </div>
        </TableCell>
      );
    });
  };

  // Get table title based on selected KPI
  const getTableTitle = () => {
    switch (selectedKPI) {
      case 'mobilisation_team':
        return 'Mobilisation Manpower Analysis';
      case 'enrolment_target':
        return 'Enrolment Performance Analysis';
      case 'mobilisation_cost':
        return 'Mobilisation Cost Analysis';
      case 'training_completion':
        return 'Dropout Analysis (Training)';
      case 'conversion_pe':
        return 'Dropout Analysis (Placement)';
      case 'conversion_rp':
        return 'Dropout Analysis (Job)';
      default:
        return 'Performance Analysis';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>
            {getTableTitle()}
          </CardTitle>
          {(showPeriods || showCostPeriods) && (
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                <TabsTrigger value="quarterly" className="text-xs">Quarterly</TabsTrigger>
                <TabsTrigger value="halfyearly" className="text-xs">Half-Yearly</TabsTrigger>
                <TabsTrigger value="annual" className="text-xs">Annual</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="min-w-[180px]">Name</TableHead>
                <TableHead className="text-center">Actual</TableHead>
                <TableHead className="text-center">Target</TableHead>
                {(showPeriods || showCostPeriods) && periodColumns.map(col => (
                  <TableHead key={col.key} className="text-center min-w-[80px] text-xs">
                    {col.label}
                  </TableHead>
                ))}
                {(showPeriods || showCostPeriods) && <TableHead className="text-center font-semibold">YTD</TableHead>}
                <TableHead className="text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(project => {
                const isExpanded = expandedRows.has(project.projectId);
                const ytdValue = project.totalAchieved;
                const monthlyData = generateMonthlyData(ytdValue);
                
                // Calculate cost/conversion values based on viewMode
                const getCostValue = (baseValue: number) => {
                  switch(viewMode) {
                    case 'monthly': return baseValue;
                    case 'quarterly': return baseValue * 3;
                    case 'halfyearly': return baseValue * 6;
                    case 'annual': return baseValue * 12;
                    default: return baseValue;
                  }
                };

                const isCostKPI = selectedKPI === 'mobilisation_cost';
                const displayValue = showCostPeriods ? getCostValue(ytdValue) : ytdValue;
                const displayTarget = showCostPeriods ? getCostValue(project.totalTarget) : project.totalTarget;
                
                return (
                  <React.Fragment key={project.projectId}>
                    {/* Main Project Row */}
                    <TableRow 
                      className="cursor-pointer hover:bg-muted/50" 
                      onClick={() => toggleRow(project.projectId)}
                    >
                      <TableCell>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </TableCell>
                      <TableCell className="font-medium">{project.projectName}</TableCell>
                      <TableCell className="text-center">
                        {isCostKPI ? `₹${displayValue.toLocaleString()}` : displayValue}
                      </TableCell>
                      <TableCell className="text-center">
                        {isCostKPI ? `₹${displayTarget.toLocaleString()}` : displayTarget}
                      </TableCell>
                      {showPeriods && renderPeriodCells(ytdValue, project.totalTarget, true)}
                      {showCostPeriods && periodColumns.map(col => {
                        const colValue = getPeriodValue(monthlyData, col.key);
                        return (
                          <TableCell key={col.key} className="text-center">
                            {isCostKPI ? `₹${colValue.toLocaleString()}` : colValue}
                          </TableCell>
                        );
                      })}
                      {(showPeriods || showCostPeriods) && (
                        <TableCell className="text-center font-semibold bg-muted/30">
                          {isCostKPI ? `₹${displayValue.toLocaleString()}` : displayValue}
                        </TableCell>
                      )}
                      <TableCell>
                        <MiniBarChart data={monthlyData} color="#6366f1" />
                      </TableCell>
                    </TableRow>

                    {/* Progress Row */}
                    {isExpanded && (
                      <TableRow className="bg-muted/30">
                        <TableCell></TableCell>
                        <TableCell colSpan={(showPeriods || showCostPeriods) ? periodColumns.length + 5 : 4} className="py-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {isManpowerKPI ? "Manpower %" : "Achievement %"}
                              </span>
                              <span className="font-semibold">{project.manpowerPercent}%</span>
                            </div>
                            <Progress value={project.manpowerPercent} className="h-2" />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {/* Mobiliser Role */}
                    {isExpanded && (
                      <TableRow 
                        className="cursor-pointer hover:bg-muted/30 bg-muted/20" 
                        onClick={e => { e.stopPropagation(); toggleRole(project.projectId, "mobiliser"); }}
                      >
                        <TableCell></TableCell>
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-2">
                            {isRoleExpanded(project.projectId, "mobiliser") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            Mobiliser ({project.teamBreakdown.mobilisers.length}/10)
                          </div>
                        </TableCell>
                        {isManpowerKPI ? (
                          <>
                            <TableCell className="text-center">{project.teamBreakdown.mobilisers.length}</TableCell>
                            <TableCell className="text-center">10</TableCell>
                            {showPeriods && renderRolePeriodCells(project.teamBreakdown.mobilisers.length, 10)}
                            {showPeriods && <TableCell className="text-center font-semibold bg-muted/30">{project.teamBreakdown.mobilisers.length}</TableCell>}
                            <TableCell><MiniChart data={generateMonthlyData(project.teamBreakdown.mobilisers.length)} color="#22c55e" /></TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-center">-</TableCell>
                            <TableCell className="text-center">-</TableCell>
                            {(showPeriods || showCostPeriods) && periodColumns.map(col => <TableCell key={col.key} className="text-center">-</TableCell>)}
                            {(showPeriods || showCostPeriods) && <TableCell>-</TableCell>}
                            <TableCell>-</TableCell>
                          </>
                        )}
                      </TableRow>
                    )}

                    {/* Mobiliser Employees */}
                    {isExpanded && isRoleExpanded(project.projectId, "mobiliser") && 
                      project.teamBreakdown.mobilisers.map(mobiliser => {
                        const empMonthly = generateMonthlyData(mobiliser.achieved.total || 45);
                        return (
                          <TableRow key={mobiliser.name} className="bg-muted/10">
                            <TableCell></TableCell>
                            <TableCell className="pl-10">
                              <button 
                                className="text-primary hover:underline font-medium cursor-pointer transition-colors hover:text-primary/80"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleEmployeeClick({ 
                                    name: mobiliser.name, 
                                    target: mobiliser.target, 
                                    achieved: mobiliser.achieved,
                                    ytd: mobiliser.achieved.total || 45
                                  }); 
                                }}
                              >
                                {mobiliser.name}
                              </button>
                            </TableCell>
                            {isManpowerKPI ? (
                              <>
                                <TableCell className="text-center">-</TableCell>
                                <TableCell className="text-center">-</TableCell>
                                {(showPeriods || showCostPeriods) && periodColumns.map(col => <TableCell key={col.key} className="text-center">-</TableCell>)}
                                {(showPeriods || showCostPeriods) && <TableCell>-</TableCell>}
                                <TableCell>-</TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className="text-center">{mobiliser.achieved.total || 45}</TableCell>
                                <TableCell className="text-center">{mobiliser.target}</TableCell>
                                {showPeriods && renderPeriodCells(mobiliser.achieved.total || 45, mobiliser.target, true)}
                                {showCostPeriods && periodColumns.map(col => {
                                  const colValue = getPeriodValue(empMonthly, col.key);
                                  return <TableCell key={col.key} className="text-center">{colValue}</TableCell>;
                                })}
                                {(showPeriods || showCostPeriods) && <TableCell className="text-center font-semibold bg-muted/30">{mobiliser.achieved.total || 45}</TableCell>}
                                <TableCell><MiniChart data={empMonthly} color="#f59e0b" /></TableCell>
                              </>
                            )}
                          </TableRow>
                        );
                      })
                    }

                    {/* Mobiliser Manager Role */}
                    {isExpanded && (
                      <TableRow 
                        className="cursor-pointer hover:bg-muted/30 bg-muted/20" 
                        onClick={e => { e.stopPropagation(); toggleRole(project.projectId, "mobiliser-manager"); }}
                      >
                        <TableCell></TableCell>
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-2">
                            {isRoleExpanded(project.projectId, "mobiliser-manager") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            Mobiliser Manager ({project.teamBreakdown.mobiliserManagers.count}/{project.teamBreakdown.mobiliserManagers.target})
                          </div>
                        </TableCell>
                        {isManpowerKPI ? (
                          <>
                            <TableCell className="text-center">{project.teamBreakdown.mobiliserManagers.count}</TableCell>
                            <TableCell className="text-center">{project.teamBreakdown.mobiliserManagers.target}</TableCell>
                            {showPeriods && renderRolePeriodCells(project.teamBreakdown.mobiliserManagers.count, project.teamBreakdown.mobiliserManagers.target)}
                            {showPeriods && <TableCell className="text-center font-semibold bg-muted/30">{project.teamBreakdown.mobiliserManagers.count}</TableCell>}
                            <TableCell><MiniChart data={generateMonthlyData(project.teamBreakdown.mobiliserManagers.count)} color="#22c55e" /></TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-center">-</TableCell>
                            <TableCell className="text-center">-</TableCell>
                            {(showPeriods || showCostPeriods) && periodColumns.map(col => <TableCell key={col.key} className="text-center">-</TableCell>)}
                            {(showPeriods || showCostPeriods) && <TableCell>-</TableCell>}
                            <TableCell>-</TableCell>
                          </>
                        )}
                      </TableRow>
                    )}

                    {/* Mobiliser Manager Employees */}
                    {isExpanded && isRoleExpanded(project.projectId, "mobiliser-manager") && (
                      <>
                        {[
                          { name: "Rajesh Kumar", achieved: 45, target: 50 },
                          { name: "Priya Sharma", achieved: 38, target: 50 },
                          { name: "Amit Verma", achieved: 52, target: 50 }
                        ].map(emp => {
                          const empMonthly = generateMonthlyData(emp.achieved);
                          return (
                            <TableRow key={emp.name} className="bg-muted/10">
                              <TableCell></TableCell>
                              <TableCell className="pl-10">
                                <button 
                                  className="text-primary hover:underline font-medium cursor-pointer transition-colors hover:text-primary/80"
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleEmployeeClick({ 
                                      name: emp.name, 
                                      target: emp.target, 
                                      achieved: { total: emp.achieved },
                                      ytd: emp.achieved
                                    }); 
                                  }}
                                >
                                  {emp.name}
                                </button>
                              </TableCell>
                              {isManpowerKPI ? (
                                <>
                                  <TableCell className="text-center">-</TableCell>
                                  <TableCell className="text-center">-</TableCell>
                                  {(showPeriods || showCostPeriods) && periodColumns.map(col => <TableCell key={col.key} className="text-center">-</TableCell>)}
                                  {(showPeriods || showCostPeriods) && <TableCell>-</TableCell>}
                                  <TableCell>-</TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell className="text-center">{emp.achieved}</TableCell>
                                  <TableCell className="text-center">{emp.target}</TableCell>
                                  {showPeriods && renderPeriodCells(emp.achieved, emp.target, true)}
                                  {showCostPeriods && periodColumns.map(col => {
                                    const colValue = getPeriodValue(empMonthly, col.key);
                                    return <TableCell key={col.key} className="text-center">{colValue}</TableCell>;
                                  })}
                                  {(showPeriods || showCostPeriods) && <TableCell className="text-center font-semibold bg-muted/30">{emp.achieved}</TableCell>}
                                  <TableCell><MiniChart data={empMonthly} color="#f59e0b" /></TableCell>
                                </>
                              )}
                            </TableRow>
                          );
                        })}
                      </>
                    )}

                    {/* Centre Manager Role */}
                    {isExpanded && (
                      <TableRow 
                        className="cursor-pointer hover:bg-muted/30 bg-muted/20" 
                        onClick={e => { e.stopPropagation(); toggleRole(project.projectId, "centre-manager"); }}
                      >
                        <TableCell></TableCell>
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-2">
                            {isRoleExpanded(project.projectId, "centre-manager") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            Centre Manager ({project.teamBreakdown.centreManagers.count}/{project.teamBreakdown.centreManagers.target})
                          </div>
                        </TableCell>
                        {isManpowerKPI ? (
                          <>
                            <TableCell className="text-center">{project.teamBreakdown.centreManagers.count}</TableCell>
                            <TableCell className="text-center">{project.teamBreakdown.centreManagers.target}</TableCell>
                            {showPeriods && renderRolePeriodCells(project.teamBreakdown.centreManagers.count, project.teamBreakdown.centreManagers.target)}
                            {showPeriods && <TableCell className="text-center font-semibold bg-muted/30">{project.teamBreakdown.centreManagers.count}</TableCell>}
                            <TableCell><MiniChart data={generateMonthlyData(project.teamBreakdown.centreManagers.count)} color="#22c55e" /></TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-center">-</TableCell>
                            <TableCell className="text-center">-</TableCell>
                            {(showPeriods || showCostPeriods) && periodColumns.map(col => <TableCell key={col.key} className="text-center">-</TableCell>)}
                            {(showPeriods || showCostPeriods) && <TableCell>-</TableCell>}
                            <TableCell>-</TableCell>
                          </>
                        )}
                      </TableRow>
                    )}

                    {/* Centre Manager Employee */}
                    {isExpanded && isRoleExpanded(project.projectId, "centre-manager") && (
                      <TableRow className="bg-muted/10">
                        <TableCell></TableCell>
                        <TableCell className="pl-10">
                          <button 
                            className="text-primary hover:underline font-medium cursor-pointer transition-colors hover:text-primary/80"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleEmployeeClick({ 
                                name: "Deepak Singh", 
                                target: 100, 
                                achieved: { total: 85 },
                                ytd: 85
                              }); 
                            }}
                          >
                            Deepak Singh
                          </button>
                        </TableCell>
                        {isManpowerKPI ? (
                          <>
                            <TableCell className="text-center">-</TableCell>
                            <TableCell className="text-center">-</TableCell>
                            {(showPeriods || showCostPeriods) && periodColumns.map(col => <TableCell key={col.key} className="text-center">-</TableCell>)}
                            {(showPeriods || showCostPeriods) && <TableCell>-</TableCell>}
                            <TableCell>-</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-center">85</TableCell>
                            <TableCell className="text-center">100</TableCell>
                            {showPeriods && renderPeriodCells(85, 100, true)}
                            {showCostPeriods && periodColumns.map(col => {
                              const colValue = getPeriodValue(generateMonthlyData(85), col.key);
                              return <TableCell key={col.key} className="text-center">{colValue}</TableCell>;
                            })}
                            {(showPeriods || showCostPeriods) && <TableCell className="text-center font-semibold bg-muted/30">85</TableCell>}
                            <TableCell><MiniChart data={generateMonthlyData(85)} color="#f59e0b" /></TableCell>
                          </>
                        )}
                      </TableRow>
                    )}

                    {/* Operation Manager Role */}
                    {isExpanded && (
                      <TableRow 
                        className="cursor-pointer hover:bg-muted/30 bg-muted/20" 
                        onClick={e => { e.stopPropagation(); toggleRole(project.projectId, "operation-manager"); }}
                      >
                        <TableCell></TableCell>
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-2">
                            {isRoleExpanded(project.projectId, "operation-manager") ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            Operation Manager ({project.teamBreakdown.operationManagers.count}/{project.teamBreakdown.operationManagers.target})
                          </div>
                        </TableCell>
                        {isManpowerKPI ? (
                          <>
                            <TableCell className="text-center">{project.teamBreakdown.operationManagers.count}</TableCell>
                            <TableCell className="text-center">{project.teamBreakdown.operationManagers.target}</TableCell>
                            {showPeriods && renderRolePeriodCells(project.teamBreakdown.operationManagers.count, project.teamBreakdown.operationManagers.target)}
                            {showPeriods && <TableCell className="text-center font-semibold bg-muted/30">{project.teamBreakdown.operationManagers.count}</TableCell>}
                            <TableCell><MiniChart data={generateMonthlyData(project.teamBreakdown.operationManagers.count)} color="#22c55e" /></TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-center">-</TableCell>
                            <TableCell className="text-center">-</TableCell>
                            {(showPeriods || showCostPeriods) && periodColumns.map(col => <TableCell key={col.key} className="text-center">-</TableCell>)}
                            {(showPeriods || showCostPeriods) && <TableCell>-</TableCell>}
                            <TableCell>-</TableCell>
                          </>
                        )}
                      </TableRow>
                    )}

                    {/* Operation Manager Employee */}
                    {isExpanded && isRoleExpanded(project.projectId, "operation-manager") && (
                      <TableRow className="bg-muted/10">
                        <TableCell></TableCell>
                        <TableCell className="pl-10">
                          <button 
                            className="text-primary hover:underline font-medium cursor-pointer transition-colors hover:text-primary/80"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleEmployeeClick({ 
                                name: "Vikram Malhotra", 
                                target: 250, 
                                achieved: { total: 170 },
                                ytd: 170
                              }); 
                            }}
                          >
                            Vikram Malhotra
                          </button>
                        </TableCell>
                        {isManpowerKPI ? (
                          <>
                            <TableCell className="text-center">-</TableCell>
                            <TableCell className="text-center">-</TableCell>
                            {(showPeriods || showCostPeriods) && periodColumns.map(col => <TableCell key={col.key} className="text-center">-</TableCell>)}
                            {(showPeriods || showCostPeriods) && <TableCell>-</TableCell>}
                            <TableCell>-</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-center">170</TableCell>
                            <TableCell className="text-center">250</TableCell>
                            {showPeriods && renderPeriodCells(170, 250, true)}
                            {showCostPeriods && periodColumns.map(col => {
                              const colValue = getPeriodValue(generateMonthlyData(170), col.key);
                              return <TableCell key={col.key} className="text-center">{colValue}</TableCell>;
                            })}
                            {(showPeriods || showCostPeriods) && <TableCell className="text-center font-semibold bg-muted/30">170</TableCell>}
                            <TableCell><MiniChart data={generateMonthlyData(170)} color="#f59e0b" /></TableCell>
                          </>
                        )}
                      </TableRow>
                    )}

                    {/* Total Row */}
                    {isExpanded && (
                      <TableRow className="font-bold bg-muted/50">
                        <TableCell></TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell className="text-center">{isCostKPI ? `₹${displayValue.toLocaleString()}` : project.totalAchieved}</TableCell>
                        <TableCell className="text-center">{isCostKPI ? `₹${displayTarget.toLocaleString()}` : project.totalTarget}</TableCell>
                        {showPeriods && renderPeriodCells(project.totalAchieved, project.totalTarget, true)}
                        {showCostPeriods && periodColumns.map(col => {
                          const colValue = getPeriodValue(monthlyData, col.key);
                          return <TableCell key={col.key} className="text-center">{isCostKPI ? `₹${colValue.toLocaleString()}` : colValue}</TableCell>;
                        })}
                        {(showPeriods || showCostPeriods) && <TableCell className="text-center bg-primary/10">{isCostKPI ? `₹${displayValue.toLocaleString()}` : project.totalAchieved}</TableCell>}
                        <TableCell><MiniBarChart data={monthlyData} color="#6366f1" /></TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <EmployeePerformanceDialog
          open={showEmployeeDialog}
          onOpenChange={setShowEmployeeDialog}
          employee={selectedEmployee}
        />
      </CardContent>
    </Card>
  );
};
