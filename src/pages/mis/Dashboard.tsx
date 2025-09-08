import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Users, FileSpreadsheet, Calendar, Upload, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { DateRange } from 'react-day-picker';
const MISDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Mock data for center-specific KPIs
  const centerData = {
    centerName: 'Delhi Training Center - 001',
    totalCandidates: 247,
    activeBatches: 8,
    readyForMigration: 32,
    pendingActivities: 5,
    lastDataUpload: '2025-08-20 09:30:00',
    migrationsPending: 15
  };
  const kpiCards = [{
    title: 'Total Candidates',
    value: centerData.totalCandidates.toString(),
    icon: Users,
    color: 'text-blue-600'
  }, {
    title: 'Active Batches',
    value: centerData.activeBatches.toString(),
    icon: FileSpreadsheet,
    color: 'text-green-600'
  }, {
    title: 'Ready for Migration',
    value: centerData.readyForMigration.toString(),
    icon: CheckCircle,
    color: 'text-purple-600'
  }, {
    title: 'Pending Activities Upload',
    value: centerData.pendingActivities.toString(),
    icon: Upload,
    color: 'text-orange-600'
  }];
  const recentActivities = [{
    type: 'Attendance Upload',
    date: '2025-08-20',
    status: 'completed',
    details: 'Morning session - 45 candidates'
  }, {
    type: 'Curriculum Upload',
    date: '2025-08-20',
    status: 'completed',
    details: 'ACPL Module 3 - Batch B2024-01'
  }, {
    type: 'Evening Attendance',
    date: '2025-08-20',
    status: 'pending',
    details: 'Evening session data pending'
  }, {
    type: 'Status Update',
    date: '2025-08-19',
    status: 'completed',
    details: '8 candidates moved to Enrolled'
  }];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-orange-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  return <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">MIS Dashboard</h1>
        <p className="text-muted-foreground mt-1">{centerData.centerName}</p>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} className="w-64" placeholder="Select Date Range" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>)}
      </div>

      {/* Recent Activities & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activities
              </span>
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{activity.type}</p>
                    <p className="text-xs text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.status)}`}></div>
                    <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                      {activity.status}
                    </Badge>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* Center Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Center Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Data Upload</span>
                <span className="font-medium">{centerData.lastDataUpload}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Migrations This Week</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Enrollments This Week</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Data Upload Status</span>
                <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Migrations</span>
                <span className="font-medium text-orange-600">{centerData.migrationsPending}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default MISDashboard;