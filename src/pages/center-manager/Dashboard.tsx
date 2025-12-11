import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Users, FileCheck, Award, Briefcase, TrendingUp, AlertTriangle } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import CurriculumProgressCard from '@/components/dashboard/CurriculumProgressCard';
import { useGetCenterManagerDashboardQuery } from '@/store/api/apiSlice';

// Mock data for fallback
const mockKpiData = {
  enrolledCandidates: 245,
  counsellingCompletion: 87.5,
  documentCompliance: 92.3,
  ofrsSubmitted: 156,
  placementsConfirmed: 142,
  postPlacementFollowUp: 78.9
};

const mockAlerts = [
  { id: 1, text: '3 Counselling Sheets not submitted', type: 'error', unread: true },
  { id: 2, text: '2 Placement Confirmations pending', type: 'warning', unread: true },
  { id: 3, text: '5 Document verifications overdue', type: 'error', unread: false },
  { id: 4, text: '1 Travel letter pending approval', type: 'warning', unread: true },
];

const mockCenters = [
  { id: 'C-001', name: 'Delhi Center' },
  { id: 'C-002', name: 'Mumbai Center' },
  { id: 'C-003', name: 'Bangalore Center' },
];

const mockBatches = [
  { id: 'all', name: 'All Batches' },
  { id: 'DDU-GKY-B5', name: 'DDU-GKY Batch 5' },
  { id: 'DDU-GKY-B6', name: 'DDU-GKY Batch 6' },
  { id: 'DDU-GKY-B7', name: 'DDU-GKY Batch 7' },
];

const CenterManagerDashboard = () => {
  const [selectedCenter, setSelectedCenter] = useState('C-001');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // RTK Query with mock fallback
  const { data: apiData, isLoading, error } = useGetCenterManagerDashboardQuery({
    centerId: selectedCenter,
    batchId: selectedBatch !== 'all' ? selectedBatch : undefined
  });

  let kpiData: typeof mockKpiData;
  let alerts: typeof mockAlerts;
  let centers: typeof mockCenters;
  let batches: typeof mockBatches;

  if (!apiData) {
    kpiData = mockKpiData;
    alerts = mockAlerts;
    centers = mockCenters;
    batches = mockBatches;
  } else {
    kpiData = apiData.kpiData || apiData.data?.kpiData || mockKpiData;
    alerts = apiData.alerts || apiData.data?.alerts || mockAlerts;
    centers = apiData.centers || apiData.data?.centers || mockCenters;
    batches = apiData.batches || apiData.data?.batches || mockBatches;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Centre Manager Dashboard</h1>
        
        <div className="flex flex-wrap gap-3">
          <Select value={selectedCenter} onValueChange={setSelectedCenter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Centre" />
            </SelectTrigger>
            <SelectContent>
              {centers.map((center: any) => (
                <SelectItem key={center.id} value={center.id}>
                  {center.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch: any) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            className="w-48"
            placeholder="Select Date Range"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Candidates</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.enrolledCandidates}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Counselling Completion</CardTitle>
            <FileCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.counsellingCompletion}%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Document Compliance</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.documentCompliance}%</div>
            <p className="text-xs text-muted-foreground">+3% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OFRs Submitted</CardTitle>
            <Briefcase className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.ofrsSubmitted}</div>
            <p className="text-xs text-muted-foreground">+8 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placements Confirmed</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.placementsConfirmed}</div>
            <p className="text-xs text-muted-foreground">89% placement rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Post-Placement Follow-Up</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.postPlacementFollowUp}%</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Pending Tasks & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert: any) => (
              <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={alert.type === 'error' ? 'destructive' : 'default'}
                    className={alert.type === 'warning' ? 'bg-orange-100 text-orange-800' : ''}
                  >
                    {alert.type === 'error' ? 'High' : 'Medium'}
                  </Badge>
                  <span className={`${alert.unread ? 'font-medium' : ''}`}>
                    {alert.text}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CurriculumProgressCard userRole="center-manager" />
    </div>
  );
};

export default CenterManagerDashboard;
