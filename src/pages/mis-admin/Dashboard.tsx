import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Users, Building, AlertTriangle, CreditCard, Calendar, Bell, Activity, Database, Clock } from 'lucide-react';
import { DateRange } from 'react-day-picker';

const MISAdminDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCenter, setSelectedCenter] = useState('all');

  // Mock data for KPIs
  const kpiData = {
    totalActiveUsers: 1247,
    centresActive: 89,
    pendingDataSyncErrors: 23,
    pendingWalletApprovals: 15,
    reportRequestsScheduled: 45,
    alertsTriggered: 7
  };

  // Mock system health data
  const systemHealth = {
    apiUptime: 'operational',
    syncQueuePending: 156,
    syncQueueProcessed: 2847,
    lastBackup: '2025-07-18 03:30:00'
  };

  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'north', name: 'North Region' },
    { id: 'south', name: 'South Region' },
    { id: 'east', name: 'East Region' },
    { id: 'west', name: 'West Region' }
  ];

  const centers = [
    { id: 'all', name: 'All Centers' },
    { id: 'c001', name: 'Center Delhi-001' },
    { id: 'c002', name: 'Center Mumbai-002' },
    { id: 'c003', name: 'Center Bangalore-003' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'warning': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const kpiCards = [
    {
      title: 'Total Active Users',
      value: kpiData.totalActiveUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Centres Active',
      value: kpiData.centresActive.toString(),
      icon: Building,
      color: 'text-green-600'
    },
    {
      title: 'Pending Data Sync Errors',
      value: kpiData.pendingDataSyncErrors.toString(),
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      title: 'Pending Wallet Approvals',
      value: kpiData.pendingWalletApprovals.toString(),
      icon: CreditCard,
      color: 'text-orange-600'
    },
    {
      title: 'Report Requests Scheduled',
      value: kpiData.reportRequestsScheduled.toString(),
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Alerts Triggered (Today)',
      value: kpiData.alertsTriggered.toString(),
      icon: Bell,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">MIS Admin Dashboard</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            className="w-64"
            placeholder="Select Date Range"
          />
          
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCenter} onValueChange={setSelectedCenter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Center" />
            </SelectTrigger>
            <SelectContent>
              {centers.map((center) => (
                <SelectItem key={center.id} value={center.id}>
                  {center.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Health Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* API Uptime */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">API Uptime</p>
                <p className="text-lg font-semibold">99.9%</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(systemHealth.apiUptime)}`}></div>
            </div>

            {/* Sync Queue Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sync Queue</p>
                <p className="text-sm">
                  <span className="text-orange-600 font-medium">{systemHealth.syncQueuePending}</span> pending
                </p>
                <p className="text-sm">
                  <span className="text-green-600 font-medium">{systemHealth.syncQueueProcessed}</span> processed
                </p>
              </div>
              <Database className="h-6 w-6 text-blue-500" />
            </div>

            {/* Last Backup */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Backup</p>
                <p className="text-sm font-medium">{systemHealth.lastBackup}</p>
              </div>
              <Clock className="h-6 w-6 text-green-500" />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 p-4 border rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Quick Actions</p>
              <Button size="sm" variant="outline" className="text-xs">
                Force Sync
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                View Alerts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Alerts
              </span>
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Data Sync Failed</p>
                  <p className="text-xs text-muted-foreground">Centre Delhi-001 - 2 min ago</p>
                </div>
                <Badge variant="destructive">High</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Wallet Approval Pending</p>
                  <p className="text-xs text-muted-foreground">15 requests - 1 hour ago</p>
                </div>
                <Badge variant="secondary">Medium</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Scheduled Report Ready</p>
                  <p className="text-xs text-muted-foreground">Monthly Report - 3 hours ago</p>
                </div>
                <Badge>Info</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Database Size</span>
                <span className="font-medium">2.4 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">API Calls Today</span>
                <span className="font-medium">45,672</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Sessions</span>
                <span className="font-medium">234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Server Load</span>
                <span className="font-medium text-green-600">Normal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <span className="font-medium">68%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MISAdminDashboard;