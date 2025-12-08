import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export type KPIType = "mobilisation_team" | "enrolment_target" | "mobilisation_cost" | "training_completion" | "conversion_pe" | "conversion_rp";

interface MobiliserData {
  name: string;
  target: number;
  achieved: Record<string, number>;
  ytd: number;
  cost?: number;
  costPerCandidate?: number;
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

// Quarter definitions (April to March financial year)
const QUARTERS = [
  { key: "q1", label: "Q1", months: ["Apr", "May", "Jun"] },
  { key: "q2", label: "Q2", months: ["Jul", "Aug", "Sep"] },
  { key: "q3", label: "Q3", months: ["Oct", "Nov", "Dec"] },
  { key: "q4", label: "Q4", months: ["Jan", "Feb", "Mar"] },
];

const MONTH_KEYS: Record<string, string> = {
  "Apr": "april", "May": "may", "Jun": "june",
  "Jul": "july", "Aug": "august", "Sep": "september",
  "Oct": "october", "Nov": "november", "Dec": "december",
  "Jan": "january", "Feb": "february", "Mar": "march"
};

// Mock quarterly data for employees
const getQuarterlyData = (baseValue: number, quarterKey: string) => {
  const multipliers: Record<string, number[]> = {
    q1: [0.28, 0.32, 0.40],
    q2: [0.30, 0.35, 0.35],
    q3: [0.33, 0.33, 0.34],
    q4: [0.25, 0.35, 0.40],
  };
  const m = multipliers[quarterKey] || [0.33, 0.33, 0.34];
  const quarter = QUARTERS.find(q => q.key === quarterKey);
  if (!quarter) return { months: [], total: 0 };
  
  const values = m.map(mult => Math.round(baseValue * mult));
  return {
    months: quarter.months.map((name, i) => ({ name, value: values[i] })),
    total: values.reduce((a, b) => a + b, 0)
  };
};

// Quarter cell component with expandable months
const QuarterCell: React.FC<{ 
  quarterKey: string; 
  baseValue: number; 
  showData: boolean;
  expandedQuarters: Set<string>;
  toggleQuarter: (key: string) => void;
}> = ({ quarterKey, baseValue, showData, expandedQuarters, toggleQuarter }) => {
  if (!showData) {
    return <TableCell className="text-center text-muted-foreground">-</TableCell>;
  }

  const data = getQuarterlyData(baseValue, quarterKey);
  const isExpanded = expandedQuarters.has(quarterKey);

  return (
    <TableCell className="align-top min-w-[100px]">
      <div className="space-y-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleQuarter(quarterKey);
          }}
          className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md w-full justify-center",
            "bg-primary/10 hover:bg-primary/20 transition-colors"
          )}
        >
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <span>{data.total}</span>
        </button>
        {isExpanded && (
          <div className="text-xs space-y-0.5 pl-2 border-l-2 border-primary/20 ml-2">
            {data.months.map((month) => (
              <div key={month.name} className="flex justify-between text-muted-foreground">
                <span>{month.name}</span>
                <span className="font-medium text-foreground">{month.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </TableCell>
  );
};

// Role-level quarter cell (for manpower KPI)
const RoleQuarterCell: React.FC<{ 
  quarterKey: string; 
  actual: number;
  target: number;
  expandedQuarters: Set<string>;
  toggleQuarter: (key: string) => void;
}> = ({ quarterKey, actual, target, expandedQuarters, toggleQuarter }) => {
  const quarter = QUARTERS.find(q => q.key === quarterKey);
  if (!quarter) return <TableCell>-</TableCell>;
  
  const isExpanded = expandedQuarters.has(quarterKey);
  const monthValues = [
    Math.round(actual * 0.9),
    Math.round(actual * 0.95),
    actual
  ];

  return (
    <TableCell className="align-top min-w-[100px]">
      <div className="space-y-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleQuarter(quarterKey);
          }}
          className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md w-full justify-center",
            "bg-accent/50 hover:bg-accent transition-colors"
          )}
        >
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <span>{actual}/{target}</span>
        </button>
        {isExpanded && (
          <div className="text-xs space-y-0.5 pl-2 border-l-2 border-accent ml-2">
            {quarter.months.map((month, i) => (
              <div key={month} className="flex justify-between text-muted-foreground">
                <span>{month}</span>
                <span className="font-medium text-foreground">{monthValues[i]}/{target}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </TableCell>
  );
};

export const MobilisationPerformanceTable: React.FC<MobilisationPerformanceTableProps> = ({
  projects,
  selectedKPI,
  isLoading
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set(["mobiliser"]));
  const [expandedQuarters, setExpandedQuarters] = useState<Set<string>>(new Set());

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

  const toggleQuarter = (quarterKey: string) => {
    const newExpanded = new Set(expandedQuarters);
    if (newExpanded.has(quarterKey)) {
      newExpanded.delete(quarterKey);
    } else {
      newExpanded.add(quarterKey);
    }
    setExpandedQuarters(newExpanded);
  };

  const isRoleExpanded = (projectId: string, role: string) => {
    return expandedRoles.has(`${projectId}-${role}`);
  };

  const isManpowerKPI = selectedKPI === "mobilisation_team";
  const showQuarters = ["mobilisation_team", "enrolment_target", "training_completion"].includes(selectedKPI);

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

  const renderCostColumns = (project: ProjectPerformance) => (
    <>
      <TableCell>₹5,000</TableCell>
      <TableCell>₹4,800</TableCell>
      <TableCell>₹{(project.totalTarget * 5000).toLocaleString()}</TableCell>
      <TableCell>₹{(project.totalAchieved * 4800).toLocaleString()}</TableCell>
    </>
  );

  const renderConversionColumns = (project: ProjectPerformance) => (
    <>
      <TableCell>{project.totalTarget}</TableCell>
      <TableCell>{project.monthlyData.june?.achieved || 0}</TableCell>
      <TableCell>{project.totalAchieved}</TableCell>
      <TableCell>Apr - Mar</TableCell>
    </>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isManpowerKPI ? "Mobilisation Manpower Analysis (Approved Vs Actual)" : "Performance Analysis"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="min-w-[200px]">Project Name</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Target</TableHead>
                {showQuarters && QUARTERS.map(q => (
                  <TableHead key={q.key} className="text-center min-w-[100px]">
                    {q.label}
                    <span className="block text-xs text-muted-foreground font-normal">
                      {q.months[0]}-{q.months[2]}
                    </span>
                  </TableHead>
                ))}
                {showQuarters && <TableHead className="text-center font-semibold">YTD</TableHead>}
                {selectedKPI === "mobilisation_cost" && (
                  <>
                    <TableHead>Target Cost/Candidate</TableHead>
                    <TableHead>Actual Cost/Candidate</TableHead>
                    <TableHead>Budget Allotted</TableHead>
                    <TableHead>Budget Consumed</TableHead>
                  </>
                )}
                {selectedKPI === "conversion_pe" && (
                  <>
                    <TableHead>Team Targeted</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>YTD</TableHead>
                    <TableHead>Date Range</TableHead>
                  </>
                )}
                {selectedKPI === "conversion_rp" && (
                  <>
                    <TableHead>Team Targeted</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Cost/Candidate</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(project => {
                const isExpanded = expandedRows.has(project.projectId);
                const ytdValue = project.totalAchieved;
                
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
                      <TableCell>{project.totalAchieved}</TableCell>
                      <TableCell>{project.totalTarget}</TableCell>
                      {showQuarters && QUARTERS.map(q => (
                        <QuarterCell
                          key={q.key}
                          quarterKey={q.key}
                          baseValue={Math.round(ytdValue / 4)}
                          showData={true}
                          expandedQuarters={expandedQuarters}
                          toggleQuarter={toggleQuarter}
                        />
                      ))}
                      {showQuarters && (
                        <TableCell className="text-center font-semibold bg-muted/30">
                          {ytdValue}
                        </TableCell>
                      )}
                      {selectedKPI === "mobilisation_cost" && renderCostColumns(project)}
                      {selectedKPI === "conversion_pe" && renderConversionColumns(project)}
                      {selectedKPI === "conversion_rp" && (
                        <>
                          <TableCell>{project.totalTarget}</TableCell>
                          <TableCell>₹{(project.totalAchieved * 4800).toLocaleString()}</TableCell>
                          <TableCell>₹4,800</TableCell>
                        </>
                      )}
                    </TableRow>

                    {/* Progress Row */}
                    {isExpanded && (
                      <TableRow className="bg-muted/30">
                        <TableCell></TableCell>
                        <TableCell colSpan={showQuarters ? 7 : 4} className="py-3">
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
                            <TableCell>{project.teamBreakdown.mobilisers.length}</TableCell>
                            <TableCell>10</TableCell>
                            {QUARTERS.map(q => (
                              <RoleQuarterCell
                                key={q.key}
                                quarterKey={q.key}
                                actual={project.teamBreakdown.mobilisers.length}
                                target={10}
                                expandedQuarters={expandedQuarters}
                                toggleQuarter={toggleQuarter}
                              />
                            ))}
                            <TableCell className="text-center font-semibold bg-muted/30">
                              {project.teamBreakdown.mobilisers.length}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            {showQuarters && QUARTERS.map(q => <TableCell key={q.key}></TableCell>)}
                            {showQuarters && <TableCell></TableCell>}
                          </>
                        )}
                      </TableRow>
                    )}

                    {/* Mobiliser Employees */}
                    {isExpanded && isRoleExpanded(project.projectId, "mobiliser") && 
                      project.teamBreakdown.mobilisers.map(mobiliser => (
                        <TableRow key={mobiliser.name} className="bg-muted/10">
                          <TableCell></TableCell>
                          <TableCell className="pl-10">{mobiliser.name}</TableCell>
                          {isManpowerKPI ? (
                            <>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              {QUARTERS.map(q => <TableCell key={q.key}></TableCell>)}
                              <TableCell></TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>{mobiliser.achieved.total || 45}</TableCell>
                              <TableCell>{mobiliser.target}</TableCell>
                              {showQuarters && QUARTERS.map(q => (
                                <QuarterCell
                                  key={q.key}
                                  quarterKey={q.key}
                                  baseValue={Math.round((mobiliser.achieved.total || 45) / 4)}
                                  showData={true}
                                  expandedQuarters={expandedQuarters}
                                  toggleQuarter={toggleQuarter}
                                />
                              ))}
                              {showQuarters && (
                                <TableCell className="text-center font-semibold bg-muted/30">
                                  {mobiliser.achieved.total || 45}
                                </TableCell>
                              )}
                            </>
                          )}
                        </TableRow>
                      ))
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
                            <TableCell>{project.teamBreakdown.mobiliserManagers.count}</TableCell>
                            <TableCell>{project.teamBreakdown.mobiliserManagers.target}</TableCell>
                            {QUARTERS.map(q => (
                              <RoleQuarterCell
                                key={q.key}
                                quarterKey={q.key}
                                actual={project.teamBreakdown.mobiliserManagers.count}
                                target={project.teamBreakdown.mobiliserManagers.target}
                                expandedQuarters={expandedQuarters}
                                toggleQuarter={toggleQuarter}
                              />
                            ))}
                            <TableCell className="text-center font-semibold bg-muted/30">
                              {project.teamBreakdown.mobiliserManagers.count}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            {showQuarters && QUARTERS.map(q => <TableCell key={q.key}></TableCell>)}
                            {showQuarters && <TableCell></TableCell>}
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
                        ].map(emp => (
                          <TableRow key={emp.name} className="bg-muted/10">
                            <TableCell></TableCell>
                            <TableCell className="pl-10">{emp.name}</TableCell>
                            {isManpowerKPI ? (
                              <>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                {QUARTERS.map(q => <TableCell key={q.key}></TableCell>)}
                                <TableCell></TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>{emp.achieved}</TableCell>
                                <TableCell>{emp.target}</TableCell>
                                {showQuarters && QUARTERS.map(q => (
                                  <QuarterCell
                                    key={q.key}
                                    quarterKey={q.key}
                                    baseValue={Math.round(emp.achieved / 4)}
                                    showData={true}
                                    expandedQuarters={expandedQuarters}
                                    toggleQuarter={toggleQuarter}
                                  />
                                ))}
                                {showQuarters && (
                                  <TableCell className="text-center font-semibold bg-muted/30">
                                    {emp.achieved}
                                  </TableCell>
                                )}
                              </>
                            )}
                          </TableRow>
                        ))}
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
                            <TableCell>{project.teamBreakdown.centreManagers.count}</TableCell>
                            <TableCell>{project.teamBreakdown.centreManagers.target}</TableCell>
                            {QUARTERS.map(q => (
                              <RoleQuarterCell
                                key={q.key}
                                quarterKey={q.key}
                                actual={project.teamBreakdown.centreManagers.count}
                                target={project.teamBreakdown.centreManagers.target}
                                expandedQuarters={expandedQuarters}
                                toggleQuarter={toggleQuarter}
                              />
                            ))}
                            <TableCell className="text-center font-semibold bg-muted/30">
                              {project.teamBreakdown.centreManagers.count}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            {showQuarters && QUARTERS.map(q => <TableCell key={q.key}></TableCell>)}
                            {showQuarters && <TableCell></TableCell>}
                          </>
                        )}
                      </TableRow>
                    )}

                    {/* Centre Manager Employee */}
                    {isExpanded && isRoleExpanded(project.projectId, "centre-manager") && (
                      <TableRow className="bg-muted/10">
                        <TableCell></TableCell>
                        <TableCell className="pl-10">Deepak Singh</TableCell>
                        {isManpowerKPI ? (
                          <>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            {QUARTERS.map(q => <TableCell key={q.key}></TableCell>)}
                            <TableCell></TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>85</TableCell>
                            <TableCell>100</TableCell>
                            {showQuarters && QUARTERS.map(q => (
                              <QuarterCell
                                key={q.key}
                                quarterKey={q.key}
                                baseValue={21}
                                showData={true}
                                expandedQuarters={expandedQuarters}
                                toggleQuarter={toggleQuarter}
                              />
                            ))}
                            {showQuarters && (
                              <TableCell className="text-center font-semibold bg-muted/30">85</TableCell>
                            )}
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
                            <TableCell>{project.teamBreakdown.operationManagers.count}</TableCell>
                            <TableCell>{project.teamBreakdown.operationManagers.target}</TableCell>
                            {QUARTERS.map(q => (
                              <RoleQuarterCell
                                key={q.key}
                                quarterKey={q.key}
                                actual={project.teamBreakdown.operationManagers.count}
                                target={project.teamBreakdown.operationManagers.target}
                                expandedQuarters={expandedQuarters}
                                toggleQuarter={toggleQuarter}
                              />
                            ))}
                            <TableCell className="text-center font-semibold bg-muted/30">
                              {project.teamBreakdown.operationManagers.count}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            {showQuarters && QUARTERS.map(q => <TableCell key={q.key}></TableCell>)}
                            {showQuarters && <TableCell></TableCell>}
                          </>
                        )}
                      </TableRow>
                    )}

                    {/* Operation Manager Employee */}
                    {isExpanded && isRoleExpanded(project.projectId, "operation-manager") && (
                      <TableRow className="bg-muted/10">
                        <TableCell></TableCell>
                        <TableCell className="pl-10">Vikram Malhotra</TableCell>
                        {isManpowerKPI ? (
                          <>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            {QUARTERS.map(q => <TableCell key={q.key}></TableCell>)}
                            <TableCell></TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>170</TableCell>
                            <TableCell>250</TableCell>
                            {showQuarters && QUARTERS.map(q => (
                              <QuarterCell
                                key={q.key}
                                quarterKey={q.key}
                                baseValue={42}
                                showData={true}
                                expandedQuarters={expandedQuarters}
                                toggleQuarter={toggleQuarter}
                              />
                            ))}
                            {showQuarters && (
                              <TableCell className="text-center font-semibold bg-muted/30">170</TableCell>
                            )}
                          </>
                        )}
                      </TableRow>
                    )}

                    {/* Total Row */}
                    {isExpanded && (
                      <TableRow className="font-bold bg-muted/50">
                        <TableCell></TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>{project.totalAchieved}</TableCell>
                        <TableCell>{project.totalTarget}</TableCell>
                        {showQuarters && QUARTERS.map(q => (
                          <TableCell key={q.key} className="text-center">
                            {Math.round(project.totalAchieved / 4)}
                          </TableCell>
                        ))}
                        {showQuarters && (
                          <TableCell className="text-center bg-primary/10">{project.totalAchieved}</TableCell>
                        )}
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
