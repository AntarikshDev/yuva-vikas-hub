import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export type KPIType = 'mobilisation_team' | 'enrolment_target' | 'mobilisation_cost' | 
                      'training_completion' | 'conversion_pe' | 'conversion_rp';

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

const KPI_COLUMNS: Record<KPIType, { label: string; key: string }[]> = {
  mobilisation_team: [
    { label: 'Project Name', key: 'projectName' },
    { label: 'Actual Team', key: 'actualTeam' },
    { label: 'Required Team', key: 'requiredTeam' },
    { label: 'April', key: 'aprilManpower' },
    { label: 'May', key: 'mayManpower' },
    { label: 'June', key: 'juneManpower' },
  ],
  enrolment_target: [
    { label: 'Project Name', key: 'projectName' },
    { label: 'Team Targeted', key: 'teamTargeted' },
    { label: 'April ↓', key: 'april' },
    { label: 'YTD', key: 'ytd' },
  ],
  mobilisation_cost: [
    { label: 'Project Name', key: 'projectName' },
    { label: 'Team Targeted', key: 'teamTargeted' },
    { label: 'Total Cost/Budget', key: 'totalCost' },
    { label: 'Cost/Candidate', key: 'costPerCandidate' },
  ],
  training_completion: [
    { label: 'Project Name', key: 'projectName' },
    { label: 'Team Targeted', key: 'teamTargeted' },
    { label: 'Month ↓', key: 'month' },
    { label: 'YTD', key: 'ytd' },
    { label: 'Date Range', key: 'dateRange' },
  ],
  conversion_pe: [
    { label: 'Project Name', key: 'projectName' },
    { label: 'Team Targeted', key: 'teamTargeted' },
    { label: 'Month', key: 'month' },
    { label: 'YTD', key: 'ytd' },
    { label: 'Date Range', key: 'dateRange' },
  ],
  conversion_rp: [
    { label: 'Project Name', key: 'projectName' },
    { label: 'Team Targeted', key: 'teamTargeted' },
    { label: 'Total Cost', key: 'totalCost' },
    { label: 'Cost/Candidate', key: 'costPerCandidate' },
  ],
};

export const MobilisationPerformanceTable: React.FC<MobilisationPerformanceTableProps> = ({
  projects,
  selectedKPI,
  isLoading,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set(['mobiliser'])); // Default mobiliser expanded

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

  const columns = KPI_COLUMNS[selectedKPI];

  const renderCellValue = (project: ProjectPerformance, columnKey: string) => {
    switch (columnKey) {
      case 'projectName':
        return project.projectName;
      case 'actualTeam':
        return project.totalAchieved;
      case 'requiredTeam':
        return project.totalTarget;
      case 'teamTarget':
        return `${project.totalAchieved}/${project.totalTarget}`;
      case 'teamTargeted':
        return project.totalTarget;
      case 'aprilManpower':
        return project.monthlyData.april?.achieved || 0;
      case 'mayManpower':
        return project.monthlyData.may?.achieved || 0;
      case 'juneManpower':
        return project.monthlyData.june?.achieved || 0;
      case 'april':
        return project.monthlyData.april?.achieved || 0;
      case 'may':
        return `${project.monthlyData.may?.percent || 0}%`;
      case 'june':
        return project.monthlyData.june?.achieved || 0;
      case 'ytd':
        return project.totalAchieved;
      case 'totalCost':
        return `₹${(project.totalTarget * 5000).toLocaleString()}`;
      case 'costPerCandidate':
        return `₹5,000`;
      case 'month':
        return project.monthlyData.june?.achieved || 0;
      case 'dateRange':
        return '01-Jun to 30-Jun';
      default:
        return '-';
    }
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const isExpanded = expandedRows.has(project.projectId);
                return (
                  <React.Fragment key={project.projectId}>
                    {/* Main Project Row */}
                    <TableRow 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleRow(project.projectId)}
                    >
                      <TableCell>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell key={col.key} className="font-medium">
                          {renderCellValue(project, col.key)}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Expanded Team Breakdown */}
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} className="bg-muted/30 p-0">
                          <div className="p-4 space-y-4">
                            {/* Manpower Progress */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Mobiliser Manpower</span>
                                <span className="font-semibold">{project.manpowerPercent}%</span>
                              </div>
                              <Progress value={project.manpowerPercent} className="h-2" />
                            </div>

                            {/* Team Breakdown Table */}
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Role</TableHead>
                                  <TableHead>Count/Target</TableHead>
                                  <TableHead>April</TableHead>
                                  <TableHead>May</TableHead>
                                  <TableHead>June</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {/* Mobilisers */}
                                <TableRow 
                                  className="cursor-pointer hover:bg-muted/30"
                                  onClick={() => toggleRole(project.projectId, 'mobiliser')}
                                >
                                  <TableCell className="font-semibold" colSpan={5}>
                                    <div className="flex items-center gap-2">
                                      {isRoleExpanded(project.projectId, 'mobiliser') ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                      Mobiliser
                                    </div>
                                  </TableCell>
                                </TableRow>
                                {isRoleExpanded(project.projectId, 'mobiliser') && project.teamBreakdown.mobilisers.map((mobiliser) => (
                                  <TableRow key={mobiliser.name} className="bg-muted/10">
                                    <TableCell className="pl-8">{mobiliser.name}</TableCell>
                                    <TableCell>{mobiliser.achieved.total}/{mobiliser.target}</TableCell>
                                    <TableCell>{mobiliser.achieved.april || 60}</TableCell>
                                    <TableCell>{mobiliser.achieved.may || 400}</TableCell>
                                    <TableCell>{mobiliser.achieved.june || 0}</TableCell>
                                  </TableRow>
                                ))}

                                {/* Mobiliser Manager */}
                                <TableRow 
                                  className="cursor-pointer hover:bg-muted/30"
                                  onClick={() => toggleRole(project.projectId, 'mobiliser-manager')}
                                >
                                  <TableCell className="font-semibold" colSpan={5}>
                                    <div className="flex items-center gap-2">
                                      {isRoleExpanded(project.projectId, 'mobiliser-manager') ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                      Mobiliser Manager ({project.teamBreakdown.mobiliserManagers.count}/{project.teamBreakdown.mobiliserManagers.target})
                                    </div>
                                  </TableCell>
                                </TableRow>
                                {isRoleExpanded(project.projectId, 'mobiliser-manager') && (
                                  <>
                                    <TableRow className="bg-muted/10">
                                      <TableCell className="pl-8">Rajesh Kumar</TableCell>
                                      <TableCell>1/1</TableCell>
                                      <TableCell>-</TableCell>
                                      <TableCell>-</TableCell>
                                      <TableCell>-</TableCell>
                                    </TableRow>
                                    <TableRow className="bg-muted/10">
                                      <TableCell className="pl-8">Priya Sharma</TableCell>
                                      <TableCell>1/1</TableCell>
                                      <TableCell>-</TableCell>
                                      <TableCell>-</TableCell>
                                      <TableCell>-</TableCell>
                                    </TableRow>
                                    <TableRow className="bg-muted/10">
                                      <TableCell className="pl-8">Amit Verma</TableCell>
                                      <TableCell>1/1</TableCell>
                                      <TableCell>-</TableCell>
                                      <TableCell>-</TableCell>
                                      <TableCell>-</TableCell>
                                    </TableRow>
                                  </>
                                )}

                                {/* Centre Manager */}
                                <TableRow 
                                  className="cursor-pointer hover:bg-muted/30"
                                  onClick={() => toggleRole(project.projectId, 'centre-manager')}
                                >
                                  <TableCell className="font-semibold" colSpan={5}>
                                    <div className="flex items-center gap-2">
                                      {isRoleExpanded(project.projectId, 'centre-manager') ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                      Centre Manager ({project.teamBreakdown.centreManagers.count}/{project.teamBreakdown.centreManagers.target})
                                    </div>
                                  </TableCell>
                                </TableRow>
                                {isRoleExpanded(project.projectId, 'centre-manager') && (
                                  <TableRow className="bg-muted/10">
                                    <TableCell className="pl-8">Deepak Singh</TableCell>
                                    <TableCell>1/2</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>-</TableCell>
                                  </TableRow>
                                )}

                                {/* Operation Manager */}
                                <TableRow 
                                  className="cursor-pointer hover:bg-muted/30"
                                  onClick={() => toggleRole(project.projectId, 'operation-manager')}
                                >
                                  <TableCell className="font-semibold" colSpan={5}>
                                    <div className="flex items-center gap-2">
                                      {isRoleExpanded(project.projectId, 'operation-manager') ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                      Operation Manager ({project.teamBreakdown.operationManagers.count}/{project.teamBreakdown.operationManagers.target})
                                    </div>
                                  </TableCell>
                                </TableRow>
                                {isRoleExpanded(project.projectId, 'operation-manager') && (
                                  <TableRow className="bg-muted/10">
                                    <TableCell className="pl-8">Vikram Malhotra</TableCell>
                                    <TableCell>1/1</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>-</TableCell>
                                  </TableRow>
                                )}

                                {/* Total */}
                                <TableRow className="font-bold bg-muted/50">
                                  <TableCell>Total Target/Manpower</TableCell>
                                  <TableCell>{project.totalAchieved}/{project.totalTarget}</TableCell>
                                  <TableCell>{project.monthlyData.april?.achieved || 0}</TableCell>
                                  <TableCell>{project.monthlyData.may?.achieved || 0}</TableCell>
                                  <TableCell>{project.monthlyData.june?.achieved || 0}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
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
