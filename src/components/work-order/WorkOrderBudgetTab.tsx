import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, Car, Calendar, MapPin, IndianRupee, Calculator,
  Plus, Edit, FileText, TrendingUp, PieChart, Upload, RefreshCw
} from 'lucide-react';
import { CreateBudgetDialog } from './CreateBudgetDialog';
import { BulkExpenseUploadDialog } from './BulkExpenseUploadDialog';

export interface HigherAuthorityAllocation {
  role: string;
  employeeName: string;
  baseSalary: number;
  allocationPercentage: number;
  allocatedAmount: number;
}

export interface ActivityBudget {
  name: string;
  plannedEvents: number;
  costPerEvent: number;
  totalCost: number;
  historicalAverage: number;
}

export interface WorkOrderBudget {
  id: string;
  workOrderId: string;
  
  teamSalary: {
    totalFixedSalary: number;
    higherAuthorityAllocations: HigherAuthorityAllocation[];
    totalTeamSalaryCost: number;
  };
  
  travelExpenses: {
    estimatedBudget: number;
    actualExpenses: number;
    historicalAverage: number;
    lastSyncDate?: string;
  };
  
  activityCosts: {
    rozgaarSabha: ActivityBudget;
    mela: ActivityBudget;
    autoMicing: ActivityBudget;
    otherActivities: ActivityBudget[];
    totalActivityCost: number;
  };
  
  migrationCosts: {
    perCandidateEstimate: number;
    totalCandidates: number;
    transportCost: number;
    foodAllowance: number;
    accommodationCost: number;
    documentationCost: number;
    totalMigrationCost: number;
  };
  
  totalBudget: number;
  targetCandidates: number;
  costPerCandidate: number;
  
  status: 'draft' | 'pending_approval' | 'approved' | 'active';
  createdDate: string;
  createdBy: string;
  approvedDate?: string;
  approvedBy?: string;
}

interface WorkOrderBudgetTabProps {
  workOrderId: string;
  workOrderTarget: number;
}

export const WorkOrderBudgetTab: React.FC<WorkOrderBudgetTabProps> = ({
  workOrderId,
  workOrderTarget
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [budget, setBudget] = useState<WorkOrderBudget | null>({
    id: 'BUD001',
    workOrderId: workOrderId,
    teamSalary: {
      totalFixedSalary: 425000,
      higherAuthorityAllocations: [
        { role: 'Regional Director', employeeName: 'Mr. Vikram Mehta', baseSalary: 150000, allocationPercentage: 10, allocatedAmount: 15000 },
        { role: 'Zonal Manager', employeeName: 'Ms. Kavita Sharma', baseSalary: 100000, allocationPercentage: 15, allocatedAmount: 15000 },
      ],
      totalTeamSalaryCost: 455000
    },
    travelExpenses: {
      estimatedBudget: 180000,
      actualExpenses: 45000,
      historicalAverage: 165000,
      lastSyncDate: '2024-01-10'
    },
    activityCosts: {
      rozgaarSabha: { name: 'Rozgaar Sabha', plannedEvents: 8, costPerEvent: 15000, totalCost: 120000, historicalAverage: 14000 },
      mela: { name: 'Job Mela', plannedEvents: 3, costPerEvent: 50000, totalCost: 150000, historicalAverage: 48000 },
      autoMicing: { name: 'Auto Mic-ing', plannedEvents: 20, costPerEvent: 2500, totalCost: 50000, historicalAverage: 2200 },
      otherActivities: [
        { name: 'Door-to-Door Campaign', plannedEvents: 15, costPerEvent: 3000, totalCost: 45000, historicalAverage: 2800 }
      ],
      totalActivityCost: 365000
    },
    migrationCosts: {
      perCandidateEstimate: 3500,
      totalCandidates: 500,
      transportCost: 1200000,
      foodAllowance: 250000,
      accommodationCost: 200000,
      documentationCost: 100000,
      totalMigrationCost: 1750000
    },
    totalBudget: 2750000,
    targetCandidates: 500,
    costPerCandidate: 5500,
    status: 'approved',
    createdDate: '2024-01-01',
    createdBy: 'Rahul Sharma',
    approvedDate: '2024-01-03',
    approvedBy: 'National Head'
  });

  const handleCreateBudget = (newBudget: Partial<WorkOrderBudget>) => {
    const totalBudget = 
      (newBudget.teamSalary?.totalTeamSalaryCost || 0) +
      (newBudget.travelExpenses?.estimatedBudget || 0) +
      (newBudget.activityCosts?.totalActivityCost || 0) +
      (newBudget.migrationCosts?.totalMigrationCost || 0);

    const costPerCandidate = workOrderTarget > 0 ? Math.round(totalBudget / workOrderTarget) : 0;

    setBudget({
      ...newBudget,
      id: `BUD${Date.now()}`,
      workOrderId,
      totalBudget,
      targetCandidates: workOrderTarget,
      costPerCandidate,
      status: 'pending_approval',
      createdDate: new Date().toISOString(),
      createdBy: 'Current User'
    } as WorkOrderBudget);
    setIsCreateDialogOpen(false);
  };

  const handleBulkUpload = (expenses: any[]) => {
    if (budget) {
      const totalActual = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      setBudget({
        ...budget,
        travelExpenses: {
          ...budget.travelExpenses,
          actualExpenses: budget.travelExpenses.actualExpenses + totalActual,
          lastSyncDate: new Date().toISOString().split('T')[0]
        }
      });
    }
    setIsBulkUploadOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive', label: string }> = {
      draft: { variant: 'outline', label: 'Draft' },
      pending_approval: { variant: 'secondary', label: 'Pending Approval' },
      approved: { variant: 'default', label: 'Approved' },
      active: { variant: 'default', label: 'Active' }
    };
    const { variant, label } = variants[status] || variants.draft;
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (!budget) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-4 bg-muted rounded-full">
          <Calculator className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">No Budget Created</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Create a mobilisation budget to track team salary, travel expenses, activity costs, and candidate migration costs.
        </p>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
        
        <CreateBudgetDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateBudget}
          workOrderTarget={workOrderTarget}
        />
      </div>
    );
  }

  const budgetBreakdown = [
    { label: 'Team Salary', value: budget.teamSalary.totalTeamSalaryCost, color: 'bg-purple-500', percentage: (budget.teamSalary.totalTeamSalaryCost / budget.totalBudget) * 100 },
    { label: 'Travel Expenses', value: budget.travelExpenses.estimatedBudget, color: 'bg-blue-500', percentage: (budget.travelExpenses.estimatedBudget / budget.totalBudget) * 100 },
    { label: 'Activity Costs', value: budget.activityCosts.totalActivityCost, color: 'bg-amber-500', percentage: (budget.activityCosts.totalActivityCost / budget.totalBudget) * 100 },
    { label: 'Migration Costs', value: budget.migrationCosts.totalMigrationCost, color: 'bg-green-500', percentage: (budget.migrationCosts.totalMigrationCost / budget.totalBudget) * 100 },
  ];

  const travelUtilization = budget.travelExpenses.estimatedBudget > 0 
    ? (budget.travelExpenses.actualExpenses / budget.travelExpenses.estimatedBudget) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mobilisation Budget</h2>
          <p className="text-muted-foreground">Work Order Target: {workOrderTarget.toLocaleString()} candidates</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(budget.status)}
          <Button variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Budget
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(budget.totalBudget)}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Per Candidate</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(budget.costPerCandidate)}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Target Candidates</p>
                <p className="text-2xl font-bold text-amber-600">{budget.targetCandidates.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-full">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Travel Utilized</p>
                <p className="text-2xl font-bold text-blue-600">{travelUtilization.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Breakdown Visual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Budget Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Stacked Bar */}
            <div className="h-8 rounded-full overflow-hidden flex">
              {budgetBreakdown.map((item, index) => (
                <div
                  key={index}
                  className={`${item.color} transition-all`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.label}: ${formatCurrency(item.value)} (${item.percentage.toFixed(1)}%)`}
                />
              ))}
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {budgetBreakdown.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.value)} ({item.percentage.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Salary Section */}
        <Card>
          <CardHeader className="bg-purple-50 dark:bg-purple-950/20">
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Users className="h-5 w-5" />
              Team Salary (Fixed)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">Direct Team Fixed Salary</span>
              <span className="font-semibold">{formatCurrency(budget.teamSalary.totalFixedSalary)}</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Higher Authority Allocations</p>
              {budget.teamSalary.higherAuthorityAllocations.map((allocation, index) => (
                <div key={index} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded">
                  <div>
                    <p className="font-medium">{allocation.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{allocation.role} • {allocation.allocationPercentage}% of {formatCurrency(allocation.baseSalary)}</p>
                  </div>
                  <span className="font-semibold">{formatCurrency(allocation.allocatedAmount)}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t font-semibold">
              <span>Total Team Salary Cost</span>
              <span className="text-purple-600">{formatCurrency(budget.teamSalary.totalTeamSalaryCost)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Travel Expenses Section */}
        <Card>
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Car className="h-5 w-5" />
                Team Travel Expenses
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsBulkUploadOpen(true)}>
                  <Upload className="h-3 w-3 mr-1" />
                  Bulk Upload
                </Button>
                <Button variant="outline" size="sm" disabled title="TrackOlap API Integration">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Actual vs Estimated</span>
                <span>{formatCurrency(budget.travelExpenses.actualExpenses)} / {formatCurrency(budget.travelExpenses.estimatedBudget)}</span>
              </div>
              <Progress value={travelUtilization} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {travelUtilization.toFixed(1)}% utilized • Last sync: {budget.travelExpenses.lastSyncDate || 'Never'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-muted/50 p-3 rounded">
                <p className="text-xs text-muted-foreground">Estimated Budget</p>
                <p className="text-lg font-semibold">{formatCurrency(budget.travelExpenses.estimatedBudget)}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded">
                <p className="text-xs text-muted-foreground">Historical Average</p>
                <p className="text-lg font-semibold">{formatCurrency(budget.travelExpenses.historicalAverage)}</p>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground italic">
              * Actual expenses will be synced via TrackOlap API or bulk upload from Centre Manager
            </p>
          </CardContent>
        </Card>

        {/* Activity Costs Section */}
        <Card>
          <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Calendar className="h-5 w-5" />
              Activity Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {[budget.activityCosts.rozgaarSabha, budget.activityCosts.mela, budget.activityCosts.autoMicing, ...budget.activityCosts.otherActivities].map((activity, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <div>
                  <p className="font-medium">{activity.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.plannedEvents} events × {formatCurrency(activity.costPerEvent)}/event
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Historical avg: {formatCurrency(activity.historicalAverage)}/event
                  </p>
                </div>
                <span className="font-semibold">{formatCurrency(activity.totalCost)}</span>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-3 border-t font-semibold">
              <span>Total Activity Cost</span>
              <span className="text-amber-600">{formatCurrency(budget.activityCosts.totalActivityCost)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Migration Costs Section */}
        <Card>
          <CardHeader className="bg-green-50 dark:bg-green-950/20">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <MapPin className="h-5 w-5" />
              Candidate Migration Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 p-3 rounded">
                <p className="text-xs text-muted-foreground">Transport Cost</p>
                <p className="font-semibold">{formatCurrency(budget.migrationCosts.transportCost)}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded">
                <p className="text-xs text-muted-foreground">Food Allowance</p>
                <p className="font-semibold">{formatCurrency(budget.migrationCosts.foodAllowance)}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded">
                <p className="text-xs text-muted-foreground">Accommodation</p>
                <p className="font-semibold">{formatCurrency(budget.migrationCosts.accommodationCost)}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded">
                <p className="text-xs text-muted-foreground">Documentation</p>
                <p className="font-semibold">{formatCurrency(budget.migrationCosts.documentationCost)}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-muted-foreground">Per Candidate Estimate</span>
              <span>{formatCurrency(budget.migrationCosts.perCandidateEstimate)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Candidates</span>
              <span>{budget.migrationCosts.totalCandidates.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t font-semibold">
              <span>Total Migration Cost</span>
              <span className="text-green-600">{formatCurrency(budget.migrationCosts.totalMigrationCost)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Calculation */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground mb-1">Budget Calculation Formula</p>
              <p className="text-lg font-mono">
                Mobilisation Budget ÷ Number of Targets = <strong>Cost Per Candidate</strong>
              </p>
            </div>
            <div className="flex items-center gap-2 text-lg font-mono bg-background px-4 py-2 rounded-lg border">
              <span>{formatCurrency(budget.totalBudget)}</span>
              <span>÷</span>
              <span>{budget.targetCandidates.toLocaleString()}</span>
              <span>=</span>
              <span className="text-primary font-bold">{formatCurrency(budget.costPerCandidate)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateBudgetDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateBudget}
        workOrderTarget={workOrderTarget}
        existingBudget={budget}
      />
      
      <BulkExpenseUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        onUpload={handleBulkUpload}
      />
    </div>
  );
};
