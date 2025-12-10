import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, Car, Calendar, MapPin, IndianRupee, Calculator,
  Plus, Edit, FileText, TrendingUp, PieChart, Upload, RefreshCw,
  CheckCircle, Loader2
} from 'lucide-react';
import { CreateBudgetDialog } from './CreateBudgetDialog';
import { BulkExpenseUploadDialog } from './BulkExpenseUploadDialog';
import { ExpenseApprovalDialog } from './ExpenseApprovalDialog';
import { toast } from '@/hooks/use-toast';
import * as budgetApi from '@/services/budgetApi';

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
  const [isExpenseApprovalOpen, setIsExpenseApprovalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [budget, setBudget] = useState<WorkOrderBudget | null>(null);
  const [teamSalaryData, setTeamSalaryData] = useState<budgetApi.TeamSalaryData | null>(null);

  // Fetch budget and team data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [budgetData, teamData] = await Promise.all([
          budgetApi.fetchBudget(workOrderId),
          budgetApi.fetchTeamSalary(workOrderId),
        ]);
        setBudget(budgetData);
        setTeamSalaryData(teamData);
      } catch (error) {
        console.error('Failed to load budget data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load budget data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [workOrderId]);

  const handleCreateBudget = async (newBudget: Partial<WorkOrderBudget>) => {
    try {
      const createdBudget = await budgetApi.createBudget({
        ...newBudget,
        workOrderId,
      });
      setBudget(createdBudget);
      setIsCreateDialogOpen(false);
      toast({
        title: 'Budget Created',
        description: 'Mobilisation budget has been created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create budget',
        variant: 'destructive',
      });
    }
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
      toast({
        title: 'Expenses Uploaded',
        description: `${expenses.length} expense records uploaded successfully`,
      });
    }
    setIsBulkUploadOpen(false);
  };

  const handleExpenseApproval = (expenseIds: string[], remarks: string) => {
    toast({
      title: 'Expenses Approved',
      description: `${expenseIds.length} expenses approved successfully`,
    });
    setIsExpenseApprovalOpen(false);
  };

  const handleExpenseReject = (expenseIds: string[], reason: string) => {
    toast({
      title: 'Expenses Rejected',
      description: `${expenseIds.length} expenses rejected`,
    });
    setIsExpenseApprovalOpen(false);
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading budget data...</p>
      </div>
    );
  }

  // Empty state - no budget created
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
        
        {/* Show team salary preview from Assignment */}
        {teamSalaryData && (
          <Card className="w-full max-w-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Salary (Auto-fetched from Assignment)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Direct Team Members</span>
                  <span className="font-medium">{teamSalaryData.members.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Fixed Salary</span>
                  <span className="font-bold text-primary">{formatCurrency(teamSalaryData.totalFixedSalary)}</span>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  This data will be auto-populated when you create the budget
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
        
        <CreateBudgetDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateBudget}
          workOrderTarget={workOrderTarget}
          teamSalaryData={teamSalaryData}
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
                <Button variant="outline" size="sm" onClick={() => setIsExpenseApprovalOpen(true)}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approvals
                </Button>
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
                  <p className="font-medium text-sm">{activity.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.plannedEvents} events × {formatCurrency(activity.costPerEvent)}/event
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(activity.totalCost)}</p>
                  <p className="text-xs text-muted-foreground">
                    Hist. avg: {formatCurrency(activity.historicalAverage)}/event
                  </p>
                </div>
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
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-xs text-muted-foreground">Transport</p>
                <p className="font-semibold">{formatCurrency(budget.migrationCosts.transportCost)}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-xs text-muted-foreground">Food Allowance</p>
                <p className="font-semibold">{formatCurrency(budget.migrationCosts.foodAllowance)}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-xs text-muted-foreground">Accommodation</p>
                <p className="font-semibold">{formatCurrency(budget.migrationCosts.accommodationCost)}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-xs text-muted-foreground">Documentation</p>
                <p className="font-semibold">{formatCurrency(budget.migrationCosts.documentationCost)}</p>
              </div>
            </div>
            
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded text-center">
              <p className="text-sm text-muted-foreground">Per Candidate Migration Cost</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(budget.migrationCosts.perCandidateEstimate)}</p>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t font-semibold">
              <span>Total Migration Cost ({budget.migrationCosts.totalCandidates} candidates)</span>
              <span className="text-green-600">{formatCurrency(budget.migrationCosts.totalMigrationCost)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Per Candidate Formula */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">{formatCurrency(budget.totalBudget)}</p>
            </div>
            <span className="text-2xl text-muted-foreground">÷</span>
            <div>
              <p className="text-sm text-muted-foreground">Target Candidates</p>
              <p className="text-2xl font-bold">{budget.targetCandidates.toLocaleString()}</p>
            </div>
            <span className="text-2xl text-muted-foreground">=</span>
            <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg">
              <p className="text-sm opacity-80">Cost Per Candidate</p>
              <p className="text-3xl font-bold">{formatCurrency(budget.costPerCandidate)}</p>
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
        teamSalaryData={teamSalaryData}
      />
      
      <BulkExpenseUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        onUpload={handleBulkUpload}
      />

      <ExpenseApprovalDialog
        open={isExpenseApprovalOpen}
        onOpenChange={setIsExpenseApprovalOpen}
        teamMembers={[]}
        onApprove={handleExpenseApproval}
        onReject={handleExpenseReject}
        currentUserLevel={2}
      />
    </div>
  );
};
