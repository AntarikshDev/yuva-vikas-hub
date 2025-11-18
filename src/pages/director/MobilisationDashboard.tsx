import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppSelector';
import { fetchPrograms, fetchWorkOrders, WorkOrder } from '@/store/slices/directorSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, TrendingDown, DollarSign, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TargetAssignmentDialog } from '@/components/director/TargetAssignmentDialog';
import { ProgramWorkOrdersTable } from '@/components/director/ProgramWorkOrdersTable';

const MobilisationDashboard = () => {
  const dispatch = useAppDispatch();
  const { programs, workOrders, isLoading } = useAppSelector((state) => state.director);
  const [targetDialogOpen, setTargetDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPrograms());
    dispatch(fetchWorkOrders(undefined));
  }, [dispatch]);

  // Calculate overall profitability
  const totalExpectedProfit = workOrders.reduce((sum, wo) => sum + wo.expectedProfit, 0);
  const totalTillDateProfit = workOrders.reduce((sum, wo) => sum + wo.tillDateProfit, 0);
  const totalGrossProfit = workOrders
    .filter(wo => wo.status === 'Completed' && wo.grossProfit)
    .reduce((sum, wo) => sum + (wo.grossProfit || 0), 0);

  const selectedProgramData = programs.find(p => p.name === selectedProgram);
  const selectedProgramWorkOrders = workOrders.filter(wo => wo.programName === selectedProgram);

  const handleViewDetails = (workOrder: WorkOrder) => {
    console.log('View work order details:', workOrder);
    // TODO: Open Work Order Details Dialog
  };

  if (selectedProgram && selectedProgramData) {
    return (
      <MainLayout role="director">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedProgram(null)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Button>
          </div>

          <ProgramWorkOrdersTable
            programName={selectedProgramData.name}
            workOrders={selectedProgramWorkOrders}
            onViewDetails={handleViewDetails}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout role="director">
      <div className="space-y-6">
        {/* Header with Assign Targets Button */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mobilisation Dashboard</h1>
            <p className="text-muted-foreground">
              Track work orders, targets, and mobilisation performance
            </p>
          </div>

          <Button 
            size="lg" 
            onClick={() => setTargetDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            Assign Targets
          </Button>
        </div>

        {/* Profitability Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expected Profitability</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(totalExpectedProfit / 100000).toFixed(2)}L</div>
              <p className="text-xs text-muted-foreground">From active work orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Till Date Profits</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(totalTillDateProfit / 100000).toFixed(2)}L</div>
              <p className="text-xs text-muted-foreground">
                {totalExpectedProfit > 0 ? ((totalTillDateProfit / totalExpectedProfit) * 100).toFixed(1) : 0}% of expected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
              <TrendingDown className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(totalGrossProfit / 100000).toFixed(2)}L</div>
              <p className="text-xs text-muted-foreground">From completed work orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Program KPI Tiles */}
        <div>
          <h2 className="text-xl font-bold mb-4">Programs Overview</h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {isLoading ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Loading programs...
              </div>
            ) : programs.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No programs found
              </div>
            ) : (
              programs.map((program) => (
                <Card
                  key={program.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                  onClick={() => setSelectedProgram(program.name)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{program.name}</CardTitle>
                    <CardDescription>Work Orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">{program.workOrderCount}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={program.activeWorkOrders > 0 ? 'default' : 'secondary'}>
                          {program.activeWorkOrders} Active
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {program.totalEnrolment} enrolled • {program.totalPlacement} placed
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Mobilisation Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Work Orders</p>
                <p className="text-2xl font-bold">{workOrders.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Work Orders</p>
                <p className="text-2xl font-bold">
                  {workOrders.filter(wo => wo.status === 'Active').length}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  ₹{(workOrders.reduce((sum, wo) => sum + wo.totalBudget, 0) / 10000000).toFixed(2)}Cr
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg Profit Margin</p>
                <p className="text-2xl font-bold">
                  {programs.length > 0 
                    ? (programs.reduce((sum, p) => sum + p.profitMargin, 0) / programs.length).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Assignment Dialog */}
        <TargetAssignmentDialog 
          open={targetDialogOpen} 
          onOpenChange={setTargetDialogOpen} 
        />
        
        {/* TODO: Add Program Work Orders Table */}
        {/* TODO: Add Payment Tracking Component */}
      </div>
    </MainLayout>
  );
};

export default MobilisationDashboard;
