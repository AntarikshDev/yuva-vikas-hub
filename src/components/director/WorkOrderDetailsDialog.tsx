import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';
import { WorkOrder } from '@/store/slices/directorSlice';
import { Button } from '@/components/ui/button';

interface WorkOrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrder: WorkOrder | null;
}

export const WorkOrderDetailsDialog: React.FC<WorkOrderDetailsDialogProps> = ({
  open,
  onOpenChange,
  workOrder,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!workOrder) return null;

  const getProgressPercentage = (actual: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((actual / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Mock activity logs
  const activityLogs = [
    { date: '2024-03-15', user: 'Admin', action: 'Work order created', type: 'info' },
    { date: '2024-03-16', user: 'Business Head', action: 'Approved work order', type: 'success' },
    { date: '2024-03-18', user: 'System', action: 'First district activated', type: 'success' },
    { date: '2024-03-20', user: 'Finance', action: 'Budget allocated', type: 'info' },
    { date: '2024-03-22', user: 'HR', action: 'Manpower assigned', type: 'success' },
  ];

  // Mock documents
  const documents = [
    { name: 'Work Order Document.pdf', type: 'Contract', date: '2024-03-15', size: '2.4 MB' },
    { name: 'Budget Breakdown.xlsx', type: 'Financial', date: '2024-03-16', size: '1.2 MB' },
    { name: 'District Assignment.pdf', type: 'Operational', date: '2024-03-18', size: '850 KB' },
    { name: 'Manpower Plan.docx', type: 'HR', date: '2024-03-20', size: '456 KB' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Work Order Details</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {workOrder.workOrderNo}
              </p>
            </div>
            <Badge variant="outline" className={getStatusColor(workOrder.status)}>
              {workOrder.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="manpower">Manpower</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(90vh-200px)] mt-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Key Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Work Order Date:</span>
                      <span className="text-sm font-medium">
                        {format(new Date(workOrder.workOrderDate), 'dd MMM yyyy')}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Centre Setup:</span>
                      <span className="text-sm font-medium">
                        {format(new Date(workOrder.centreSetupDate), 'dd MMM yyyy')}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mobilisation Start:</span>
                      <span className="text-sm font-medium">
                        {format(new Date(workOrder.mobilisationStartDate), 'dd MMM yyyy')}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Batch Incorporation:</span>
                      <span className="text-sm font-medium">
                        {format(new Date(workOrder.batchIncorporationDate), 'dd MMM yyyy')}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Districts Coverage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Districts:</span>
                      <span className="text-lg font-bold text-primary">
                        {workOrder.districtsActive}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Assigned Districts:</span>
                      <span className="text-lg font-bold">
                        {workOrder.districtsAssigned}
                      </span>
                    </div>
                    <Progress
                      value={getProgressPercentage(workOrder.districtsActive, workOrder.districtsAssigned)}
                      className="h-2"
                    />
                    <div className="flex flex-wrap gap-2 mt-4">
                      {workOrder.districts.map((district, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {district}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Enrolment Progress</p>
                      <p className="text-2xl font-bold">
                        {getProgressPercentage(workOrder.enrolmentAchieved, workOrder.enrolmentTarget).toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {workOrder.enrolmentAchieved} / {workOrder.enrolmentTarget}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Manpower Deployed</p>
                      <p className="text-2xl font-bold">
                        {getProgressPercentage(workOrder.manpowerCurrent, workOrder.manpowerRequired).toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {workOrder.manpowerCurrent} / {workOrder.manpowerRequired}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Budget Utilized</p>
                      <p className="text-2xl font-bold">
                        {getProgressPercentage(workOrder.costIncurred, workOrder.totalBudget).toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ₹{(workOrder.costIncurred / 100000).toFixed(2)}L
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Districts Active</p>
                      <p className="text-2xl font-bold">
                        {getProgressPercentage(workOrder.districtsActive, workOrder.districtsAssigned).toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {workOrder.districtsActive} / {workOrder.districtsAssigned}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityLogs.slice(0, 5).map((log, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`mt-1 ${
                          log.type === 'success' ? 'text-green-500' :
                          log.type === 'info' ? 'text-blue-500' : 'text-muted-foreground'
                        }`}>
                          {log.type === 'success' ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{log.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.user} • {format(new Date(log.date), 'dd MMM yyyy')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progress Tracking Tab */}
            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">District Activation Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workOrder.districts.map((district, idx) => {
                      const isActive = idx < workOrder.districtsActive;
                      return (
                        <div key={idx} className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            {isActive ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{district}</p>
                            <p className="text-xs text-muted-foreground">
                              {isActive ? 'Active' : 'Pending'}
                            </p>
                          </div>
                          <Badge variant={isActive ? 'default' : 'secondary'}>
                            {isActive ? 'Active' : 'Planned'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Enrollment Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Current Enrollment</span>
                      <span className="text-sm font-medium">
                        {workOrder.enrolmentAchieved} / {workOrder.enrolmentTarget}
                      </span>
                    </div>
                    <Progress
                      value={getProgressPercentage(workOrder.enrolmentAchieved, workOrder.enrolmentTarget)}
                      className="h-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Target</p>
                      <p className="text-2xl font-bold">{workOrder.enrolmentTarget}</p>
                    </div>
                    <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Achieved</p>
                      <p className="text-2xl font-bold text-green-600">{workOrder.enrolmentAchieved}</p>
                    </div>
                    <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Remaining</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {workOrder.enrolmentTarget - workOrder.enrolmentAchieved}
                      </p>
                    </div>
                    <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Progress</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {getProgressPercentage(workOrder.enrolmentAchieved, workOrder.enrolmentTarget).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">₹{(workOrder.totalBudget / 100000).toFixed(2)}L</p>
                    <p className="text-xs text-muted-foreground mt-1">Allocated</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Cost Incurred</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-orange-600">
                      ₹{(workOrder.costIncurred / 100000).toFixed(2)}L
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Till Date</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Remaining Budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">
                      ₹{((workOrder.totalBudget - workOrder.costIncurred) / 100000).toFixed(2)}L
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Available</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Fixed Budget</span>
                      <span className="text-sm font-medium">₹{(workOrder.fixedBudget / 100000).toFixed(2)}L</span>
                    </div>
                    <Progress
                      value={(workOrder.fixedBudget / workOrder.totalBudget) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Variable Budget</span>
                      <span className="text-sm font-medium">₹{(workOrder.variableBudget / 100000).toFixed(2)}L</span>
                    </div>
                    <Progress
                      value={(workOrder.variableBudget / workOrder.totalBudget) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Cost Per Candidate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Projected</p>
                      <p className="text-xl font-bold">
                        ₹{(workOrder.totalBudget / workOrder.enrolmentTarget).toFixed(0)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="text-xl font-bold text-blue-600">
                        ₹{workOrder.enrolmentAchieved > 0 
                          ? (workOrder.costIncurred / workOrder.enrolmentAchieved).toFixed(0)
                          : '0'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manpower Tab */}
            <TabsContent value="manpower" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Manpower Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1 p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Required</p>
                      <p className="text-2xl font-bold">{workOrder.manpowerRequired}</p>
                    </div>
                    <div className="space-y-1 p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="text-2xl font-bold text-green-600">{workOrder.manpowerCurrent}</p>
                    </div>
                    <div className="space-y-1 p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Shortage</p>
                      <p className="text-2xl font-bold text-red-600">
                        {Math.max(0, workOrder.manpowerRequired - workOrder.manpowerCurrent)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Deployment Progress</span>
                      <span className="text-sm font-medium">
                        {getProgressPercentage(workOrder.manpowerCurrent, workOrder.manpowerRequired).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={getProgressPercentage(workOrder.manpowerCurrent, workOrder.manpowerRequired)}
                      className="h-3"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Team Composition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { role: 'Mobilizers', count: Math.floor(workOrder.manpowerCurrent * 0.5), target: Math.floor(workOrder.manpowerRequired * 0.5) },
                      { role: 'Counsellors', count: Math.floor(workOrder.manpowerCurrent * 0.2), target: Math.floor(workOrder.manpowerRequired * 0.2) },
                      { role: 'Trainers', count: Math.floor(workOrder.manpowerCurrent * 0.15), target: Math.floor(workOrder.manpowerRequired * 0.15) },
                      { role: 'Support Staff', count: Math.floor(workOrder.manpowerCurrent * 0.15), target: Math.floor(workOrder.manpowerRequired * 0.15) },
                    ].map((team, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{team.role}</span>
                          <span className="text-sm font-medium">{team.count} / {team.target}</span>
                        </div>
                        <Progress
                          value={getProgressPercentage(team.count, team.target)}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Work Order Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.type} • {doc.size} • {format(new Date(doc.date), 'dd MMM yyyy')}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Document Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500" />
                        <div className="flex-1">
                          <p>{log.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(log.date), 'dd MMM yyyy')} • {log.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
