import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';
import { WorkOrder } from '@/store/slices/directorSlice';
import { cn } from '@/lib/utils';

interface PaymentTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrder: WorkOrder | null;
}

export const PaymentTrackingDialog: React.FC<PaymentTrackingDialogProps> = ({
  open,
  onOpenChange,
  workOrder,
}) => {
  const [activeTab, setActiveTab] = useState('cycles');

  if (!workOrder) return null;

  const totalPaymentsReceived = workOrder.paymentCycles
    .filter((cycle) => cycle.status === 'Received')
    .reduce((sum, cycle) => sum + cycle.amount, 0);

  const totalPaymentsExpected = workOrder.paymentCycles.reduce(
    (sum, cycle) => sum + cycle.amount,
    0
  );

  const paymentProgress = totalPaymentsExpected > 0
    ? (totalPaymentsReceived / totalPaymentsExpected) * 100
    : 0;

  const pendingPayments = workOrder.paymentCycles.filter(
    (cycle) => cycle.status === 'Pending'
  ).length;

  const delayedPayments = workOrder.paymentCycles.filter(
    (cycle) => cycle.status === 'Delayed'
  ).length;

  const costPerCandidate = workOrder.enrolmentAchieved > 0
    ? workOrder.costIncurred / workOrder.enrolmentAchieved
    : 0;

  const expectedCostPerCandidate = workOrder.enrolmentTarget > 0
    ? workOrder.totalBudget / workOrder.enrolmentTarget
    : 0;

  const profitMargin = workOrder.totalBudget > 0
    ? ((workOrder.expectedProfit / workOrder.totalBudget) * 100)
    : 0;

  const actualProfitMargin = workOrder.costIncurred > 0
    ? ((workOrder.tillDateProfit / totalPaymentsReceived) * 100)
    : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Received':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'Delayed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Received':
        return 'default';
      case 'Delayed':
        return 'destructive';
      case 'Pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Payment Tracking & Financial Analysis</DialogTitle>
          <DialogDescription>
            Work Order: {workOrder.workOrderNo} | Program: {workOrder.programName}
          </DialogDescription>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  ₹{(totalPaymentsReceived / 100000).toFixed(2)}L
                </span>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {paymentProgress.toFixed(0)}% of expected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Expected Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  ₹{(workOrder.expectedProfit / 100000).toFixed(2)}L
                </span>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {profitMargin.toFixed(1)}% margin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Till Date Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  ₹{(workOrder.tillDateProfit / 100000).toFixed(2)}L
                </span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {actualProfitMargin.toFixed(1)}% actual margin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cost/Candidate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  ₹{(costPerCandidate / 1000).toFixed(1)}K
                </span>
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Target: ₹{(expectedCostPerCandidate / 1000).toFixed(1)}K
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Progress Bar */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Overall Payment Progress</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>{workOrder.paymentCycles.filter(c => c.status === 'Received').length} Received</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span>{pendingPayments} Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span>{delayedPayments} Delayed</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>₹{(totalPaymentsReceived / 100000).toFixed(2)}L received</span>
                <span className="text-muted-foreground">
                  ₹{(totalPaymentsExpected / 100000).toFixed(2)}L expected
                </span>
              </div>
              <Progress value={paymentProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cycles">Payment Cycles</TabsTrigger>
            <TabsTrigger value="profitability">Profitability</TabsTrigger>
            <TabsTrigger value="analysis">Cost Analysis</TabsTrigger>
          </TabsList>

          {/* Payment Cycles Tab */}
          <TabsContent value="cycles" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Payment Cycle Details</h3>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            <div className="space-y-3">
              {workOrder.paymentCycles.map((cycle) => (
                <Card key={cycle.cycleNumber}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          <span className="font-bold text-primary">#{cycle.cycleNumber}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">Cycle {cycle.cycleNumber}</h4>
                            <Badge variant={getStatusVariant(cycle.status)}>
                              {cycle.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Expected: {format(new Date(cycle.expectedDate), 'dd MMM yyyy')}
                            </div>
                            {cycle.receivedDate && (
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                Received: {format(new Date(cycle.receivedDate), 'dd MMM yyyy')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold">
                          ₹{(cycle.amount / 100000).toFixed(2)}L
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {cycle.percentage}% of total
                        </div>
                      </div>
                    </div>

                    {/* Cycle Progress */}
                    <div className="mt-3">
                      <Progress
                        value={cycle.status === 'Received' ? 100 : cycle.status === 'Delayed' ? 50 : 0}
                        className={cn(
                          "h-2",
                          cycle.status === 'Received' && "bg-green-100",
                          cycle.status === 'Delayed' && "bg-red-100"
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profitability Tab */}
          <TabsContent value="profitability" className="space-y-4">
            <h3 className="text-lg font-semibold">Profitability Analysis</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fixed Budget</span>
                    <span className="font-semibold">₹{(workOrder.fixedBudget / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Variable Budget</span>
                    <span className="font-semibold">₹{(workOrder.variableBudget / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="border-t pt-4 flex items-center justify-between">
                    <span className="font-medium">Total Budget</span>
                    <span className="text-lg font-bold">₹{(workOrder.totalBudget / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cost Incurred</span>
                    <span className="font-semibold text-orange-600">
                      ₹{(workOrder.costIncurred / 100000).toFixed(2)}L
                    </span>
                  </div>
                  <Progress
                    value={(workOrder.costIncurred / workOrder.totalBudget) * 100}
                    className="h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Profit Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Expected Profit</span>
                    <div className="text-right">
                      <div className="font-semibold">₹{(workOrder.expectedProfit / 100000).toFixed(2)}L</div>
                      <div className="text-xs text-muted-foreground">{profitMargin.toFixed(1)}% margin</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Till Date Profit</span>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        ₹{(workOrder.tillDateProfit / 100000).toFixed(2)}L
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {actualProfitMargin.toFixed(1)}% actual
                      </div>
                    </div>
                  </div>
                  {workOrder.grossProfit && (
                    <div className="border-t pt-4 flex items-center justify-between">
                      <span className="font-medium">Gross Profit (Completed)</span>
                      <span className="text-lg font-bold text-green-600">
                        ₹{(workOrder.grossProfit / 100000).toFixed(2)}L
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    {workOrder.tillDateProfit >= workOrder.expectedProfit ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Above expected profit</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-orange-600" />
                        <span className="text-orange-600">Below expected profit</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cost Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            <h3 className="text-lg font-semibold">Cost Per Candidate Analysis</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Current Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Candidates Enrolled</span>
                      <span className="font-semibold">
                        {workOrder.enrolmentAchieved} / {workOrder.enrolmentTarget}
                      </span>
                    </div>
                    <Progress
                      value={(workOrder.enrolmentAchieved / workOrder.enrolmentTarget) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Actual Cost per Candidate</span>
                      <span className="text-2xl font-bold">₹{(costPerCandidate / 1000).toFixed(1)}K</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Expected Cost per Candidate</span>
                    <span className="font-semibold">₹{(expectedCostPerCandidate / 1000).toFixed(1)}K</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Variance</span>
                    <span className={cn(
                      "font-semibold",
                      costPerCandidate > expectedCostPerCandidate ? "text-red-600" : "text-green-600"
                    )}>
                      {costPerCandidate > expectedCostPerCandidate ? "+" : "-"}
                      ₹{(Math.abs(costPerCandidate - expectedCostPerCandidate) / 1000).toFixed(1)}K
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Projections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Remaining Target</span>
                    <span className="font-semibold">
                      {workOrder.enrolmentTarget - workOrder.enrolmentAchieved} candidates
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Remaining Budget</span>
                    <span className="font-semibold">
                      ₹{((workOrder.totalBudget - workOrder.costIncurred) / 100000).toFixed(2)}L
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Projected Final Cost/Candidate</span>
                      <span className="text-xl font-bold">
                        ₹{workOrder.enrolmentTarget > 0 
                          ? ((workOrder.totalBudget / workOrder.enrolmentTarget) / 1000).toFixed(1) 
                          : 0}K
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    {costPerCandidate <= expectedCostPerCandidate ? (
                      <p className="text-green-600">
                        ✓ On track - Current cost per candidate is within budget
                      </p>
                    ) : (
                      <p className="text-orange-600">
                        ⚠ Attention needed - Current cost exceeds expected budget per candidate
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
