import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, Car, Calendar, MapPin, Plus, Trash2, IndianRupee, Calculator,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { WorkOrderBudget, HigherAuthorityAllocation, ActivityBudget } from './WorkOrderBudgetTab';

interface CreateBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (budget: Partial<WorkOrderBudget>) => void;
  workOrderTarget: number;
  existingBudget?: WorkOrderBudget | null;
}

export const CreateBudgetDialog: React.FC<CreateBudgetDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  workOrderTarget,
  existingBudget
}) => {
  const [activeTab, setActiveTab] = useState('salary');
  
  // Team Salary State
  const [fixedSalary, setFixedSalary] = useState(existingBudget?.teamSalary.totalFixedSalary || 0);
  const [higherAuthorityAllocations, setHigherAuthorityAllocations] = useState<HigherAuthorityAllocation[]>
    (existingBudget?.teamSalary.higherAuthorityAllocations || []);
  
  // Travel Expenses State
  const [travelEstimate, setTravelEstimate] = useState(existingBudget?.travelExpenses.estimatedBudget || 0);
  const [travelHistorical, setTravelHistorical] = useState(existingBudget?.travelExpenses.historicalAverage || 0);
  
  // Activity Costs State
  const [rozgaarSabha, setRozgaarSabha] = useState<ActivityBudget>
    (existingBudget?.activityCosts.rozgaarSabha || { name: 'Rozgaar Sabha', plannedEvents: 0, costPerEvent: 15000, totalCost: 0, historicalAverage: 14000 });
  const [mela, setMela] = useState<ActivityBudget>
    (existingBudget?.activityCosts.mela || { name: 'Job Mela', plannedEvents: 0, costPerEvent: 50000, totalCost: 0, historicalAverage: 48000 });
  const [autoMicing, setAutoMicing] = useState<ActivityBudget>
    (existingBudget?.activityCosts.autoMicing || { name: 'Auto Mic-ing', plannedEvents: 0, costPerEvent: 2500, totalCost: 0, historicalAverage: 2200 });
  const [otherActivities, setOtherActivities] = useState<ActivityBudget[]>
    (existingBudget?.activityCosts.otherActivities || []);
  
  // Migration Costs State
  const [transportCost, setTransportCost] = useState(existingBudget?.migrationCosts.transportCost || 0);
  const [foodAllowance, setFoodAllowance] = useState(existingBudget?.migrationCosts.foodAllowance || 0);
  const [accommodationCost, setAccommodationCost] = useState(existingBudget?.migrationCosts.accommodationCost || 0);
  const [documentationCost, setDocumentationCost] = useState(existingBudget?.migrationCosts.documentationCost || 0);

  // Calculations
  const totalHigherAuthorityAllocation = higherAuthorityAllocations.reduce((sum, a) => sum + a.allocatedAmount, 0);
  const totalTeamSalary = fixedSalary + totalHigherAuthorityAllocation;
  
  const totalActivityCost = rozgaarSabha.totalCost + mela.totalCost + autoMicing.totalCost + 
    otherActivities.reduce((sum, a) => sum + a.totalCost, 0);
  
  const totalMigrationCost = transportCost + foodAllowance + accommodationCost + documentationCost;
  const perCandidateMigration = workOrderTarget > 0 ? Math.round(totalMigrationCost / workOrderTarget) : 0;
  
  const totalBudget = totalTeamSalary + travelEstimate + totalActivityCost + totalMigrationCost;
  const costPerCandidate = workOrderTarget > 0 ? Math.round(totalBudget / workOrderTarget) : 0;

  const addHigherAuthorityAllocation = () => {
    setHigherAuthorityAllocations([
      ...higherAuthorityAllocations,
      { role: '', employeeName: '', baseSalary: 0, allocationPercentage: 0, allocatedAmount: 0 }
    ]);
  };

  const updateHigherAuthorityAllocation = (index: number, field: keyof HigherAuthorityAllocation, value: any) => {
    const updated = [...higherAuthorityAllocations];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'baseSalary' || field === 'allocationPercentage') {
      updated[index].allocatedAmount = Math.round(updated[index].baseSalary * (updated[index].allocationPercentage / 100));
    }
    
    setHigherAuthorityAllocations(updated);
  };

  const removeHigherAuthorityAllocation = (index: number) => {
    setHigherAuthorityAllocations(higherAuthorityAllocations.filter((_, i) => i !== index));
  };

  const updateActivity = (
    setter: React.Dispatch<React.SetStateAction<ActivityBudget>>,
    activity: ActivityBudget,
    field: keyof ActivityBudget,
    value: any
  ) => {
    const updated = { ...activity, [field]: value };
    if (field === 'plannedEvents' || field === 'costPerEvent') {
      updated.totalCost = updated.plannedEvents * updated.costPerEvent;
    }
    setter(updated);
  };

  const addOtherActivity = () => {
    setOtherActivities([
      ...otherActivities,
      { name: '', plannedEvents: 0, costPerEvent: 0, totalCost: 0, historicalAverage: 0 }
    ]);
  };

  const updateOtherActivity = (index: number, field: keyof ActivityBudget, value: any) => {
    const updated = [...otherActivities];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'plannedEvents' || field === 'costPerEvent') {
      updated[index].totalCost = updated[index].plannedEvents * updated[index].costPerEvent;
    }
    setOtherActivities(updated);
  };

  const removeOtherActivity = (index: number) => {
    setOtherActivities(otherActivities.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const budget: Partial<WorkOrderBudget> = {
      teamSalary: {
        totalFixedSalary: fixedSalary,
        higherAuthorityAllocations,
        totalTeamSalaryCost: totalTeamSalary
      },
      travelExpenses: {
        estimatedBudget: travelEstimate,
        actualExpenses: existingBudget?.travelExpenses.actualExpenses || 0,
        historicalAverage: travelHistorical,
        lastSyncDate: existingBudget?.travelExpenses.lastSyncDate
      },
      activityCosts: {
        rozgaarSabha,
        mela,
        autoMicing,
        otherActivities,
        totalActivityCost
      },
      migrationCosts: {
        perCandidateEstimate: perCandidateMigration,
        totalCandidates: workOrderTarget,
        transportCost,
        foodAllowance,
        accommodationCost,
        documentationCost,
        totalMigrationCost
      }
    };
    
    onSubmit(budget);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {existingBudget ? 'Edit' : 'Create'} Mobilisation Budget
          </DialogTitle>
        </DialogHeader>

        {/* Summary Bar */}
        <div className="bg-muted p-3 rounded-lg flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-muted-foreground">Total Budget: </span>
              <span className="font-bold text-primary">{formatCurrency(totalBudget)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Target: </span>
              <span className="font-semibold">{workOrderTarget.toLocaleString()}</span>
            </div>
          </div>
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded">
            Cost/Candidate: <strong>{formatCurrency(costPerCandidate)}</strong>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="salary" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Salary</span>
            </TabsTrigger>
            <TabsTrigger value="travel" className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Travel</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="migration" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Migration</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            {/* Team Salary Tab */}
            <TabsContent value="salary" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    Fixed Team Salary
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent>Total fixed salary of directly assigned team members</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={fixedSalary}
                      onChange={(e) => setFixedSalary(Number(e.target.value))}
                      placeholder="Enter total fixed salary"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Higher Authority Allocations
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                          <TooltipContent>Percentage of higher authorities' salary for multiple accountability</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Button variant="outline" size="sm" onClick={addHigherAuthorityAllocation}>
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {higherAuthorityAllocations.map((allocation, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-2 bg-muted/50 rounded">
                      <div className="col-span-3">
                        <Label className="text-xs">Role</Label>
                        <Input
                          value={allocation.role}
                          onChange={(e) => updateHigherAuthorityAllocation(index, 'role', e.target.value)}
                          placeholder="e.g., Regional Director"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Employee Name</Label>
                        <Input
                          value={allocation.employeeName}
                          onChange={(e) => updateHigherAuthorityAllocation(index, 'employeeName', e.target.value)}
                          placeholder="Name"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Base Salary (₹)</Label>
                        <Input
                          type="number"
                          value={allocation.baseSalary}
                          onChange={(e) => updateHigherAuthorityAllocation(index, 'baseSalary', Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">%</Label>
                        <Input
                          type="number"
                          value={allocation.allocationPercentage}
                          onChange={(e) => updateHigherAuthorityAllocation(index, 'allocationPercentage', Number(e.target.value))}
                          max={100}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Allocated</Label>
                        <div className="h-10 px-3 py-2 bg-background border rounded text-sm">
                          {formatCurrency(allocation.allocatedAmount)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="icon" onClick={() => removeHigherAuthorityAllocation(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {higherAuthorityAllocations.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No higher authority allocations added. Click "Add" to include percentage-based salary allocations.
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg flex justify-between items-center">
                <span className="font-medium">Total Team Salary Cost</span>
                <span className="text-lg font-bold text-purple-600">{formatCurrency(totalTeamSalary)}</span>
              </div>
            </TabsContent>

            {/* Travel Expenses Tab */}
            <TabsContent value="travel" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    Travel Budget Estimate
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent>Estimated travel budget based on historical data. Actual expenses will be tracked via TrackOlap or bulk upload.</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Estimated Budget (₹)</Label>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={travelEstimate}
                          onChange={(e) => setTravelEstimate(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Historical Average (₹)</Label>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={travelHistorical}
                          onChange={(e) => setTravelHistorical(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded text-sm">
                    <p className="font-medium mb-1">Expense Tracking Integration</p>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• TrackOlap API integration for real-time expense sync (coming soon)</li>
                      <li>• Bulk upload from Centre Manager for manual expense reporting</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg flex justify-between items-center">
                <span className="font-medium">Total Travel Budget</span>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(travelEstimate)}</span>
              </div>
            </TabsContent>

            {/* Activity Costs Tab */}
            <TabsContent value="activity" className="space-y-4">
              {/* Rozgaar Sabha */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Rozgaar Sabha</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">Planned Events</Label>
                      <Input
                        type="number"
                        value={rozgaarSabha.plannedEvents}
                        onChange={(e) => updateActivity(setRozgaarSabha, rozgaarSabha, 'plannedEvents', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Cost/Event (₹)</Label>
                      <Input
                        type="number"
                        value={rozgaarSabha.costPerEvent}
                        onChange={(e) => updateActivity(setRozgaarSabha, rozgaarSabha, 'costPerEvent', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Historical Avg (₹)</Label>
                      <Input type="number" value={rozgaarSabha.historicalAverage} disabled className="bg-muted" />
                    </div>
                    <div>
                      <Label className="text-xs">Total Cost</Label>
                      <div className="h-10 px-3 py-2 bg-muted border rounded text-sm font-medium">
                        {formatCurrency(rozgaarSabha.totalCost)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Mela */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Job Mela</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">Planned Events</Label>
                      <Input
                        type="number"
                        value={mela.plannedEvents}
                        onChange={(e) => updateActivity(setMela, mela, 'plannedEvents', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Cost/Event (₹)</Label>
                      <Input
                        type="number"
                        value={mela.costPerEvent}
                        onChange={(e) => updateActivity(setMela, mela, 'costPerEvent', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Historical Avg (₹)</Label>
                      <Input type="number" value={mela.historicalAverage} disabled className="bg-muted" />
                    </div>
                    <div>
                      <Label className="text-xs">Total Cost</Label>
                      <div className="h-10 px-3 py-2 bg-muted border rounded text-sm font-medium">
                        {formatCurrency(mela.totalCost)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Auto Mic-ing */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Auto Mic-ing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">Planned Events</Label>
                      <Input
                        type="number"
                        value={autoMicing.plannedEvents}
                        onChange={(e) => updateActivity(setAutoMicing, autoMicing, 'plannedEvents', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Cost/Event (₹)</Label>
                      <Input
                        type="number"
                        value={autoMicing.costPerEvent}
                        onChange={(e) => updateActivity(setAutoMicing, autoMicing, 'costPerEvent', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Historical Avg (₹)</Label>
                      <Input type="number" value={autoMicing.historicalAverage} disabled className="bg-muted" />
                    </div>
                    <div>
                      <Label className="text-xs">Total Cost</Label>
                      <div className="h-10 px-3 py-2 bg-muted border rounded text-sm font-medium">
                        {formatCurrency(autoMicing.totalCost)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Other Activities */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    Other Activities
                    <Button variant="outline" size="sm" onClick={addOtherActivity}>
                      <Plus className="h-4 w-4 mr-1" /> Add Activity
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {otherActivities.map((activity, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-2 bg-muted/50 rounded">
                      <div className="col-span-3">
                        <Label className="text-xs">Activity Name</Label>
                        <Input
                          value={activity.name}
                          onChange={(e) => updateOtherActivity(index, 'name', e.target.value)}
                          placeholder="Activity name"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Events</Label>
                        <Input
                          type="number"
                          value={activity.plannedEvents}
                          onChange={(e) => updateOtherActivity(index, 'plannedEvents', Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Cost/Event (₹)</Label>
                        <Input
                          type="number"
                          value={activity.costPerEvent}
                          onChange={(e) => updateOtherActivity(index, 'costPerEvent', Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Total</Label>
                        <div className="h-10 px-3 py-2 bg-background border rounded text-sm">
                          {formatCurrency(activity.totalCost)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="icon" onClick={() => removeOtherActivity(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {otherActivities.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No other activities added.
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg flex justify-between items-center">
                <span className="font-medium">Total Activity Cost</span>
                <span className="text-lg font-bold text-amber-600">{formatCurrency(totalActivityCost)}</span>
              </div>
            </TabsContent>

            {/* Migration Costs Tab */}
            <TabsContent value="migration" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    Candidate Migration Costs
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent>Costs for transporting and settling candidates at placement locations</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Transport Cost (₹)</Label>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={transportCost}
                          onChange={(e) => setTransportCost(Number(e.target.value))}
                          placeholder="Total transport cost"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Food Allowance (₹)</Label>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={foodAllowance}
                          onChange={(e) => setFoodAllowance(Number(e.target.value))}
                          placeholder="Total food allowance"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Accommodation Cost (₹)</Label>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={accommodationCost}
                          onChange={(e) => setAccommodationCost(Number(e.target.value))}
                          placeholder="Initial accommodation cost"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Documentation Cost (₹)</Label>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={documentationCost}
                          onChange={(e) => setDocumentationCost(Number(e.target.value))}
                          placeholder="Documentation & processing"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded flex justify-between items-center">
                    <span className="text-sm">Per Candidate Migration Cost</span>
                    <span className="font-semibold">{formatCurrency(perCandidateMigration)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg flex justify-between items-center">
                <span className="font-medium">Total Migration Cost</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(totalMigrationCost)}</span>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Formula: Total Budget ÷ Target = Cost/Candidate
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>
              {existingBudget ? 'Update Budget' : 'Create Budget'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
