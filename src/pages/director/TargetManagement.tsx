import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchTargetManagementData } from '@/store/slices/targetManagementSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TargetOverviewCards } from '@/components/target-management/TargetOverviewCards';
import { TargetAssignmentForm } from '@/components/target-management/TargetAssignmentForm';
import { CarryForwardList } from '@/components/target-management/CarryForwardList';
import { TargetReassignmentPanel } from '@/components/target-management/TargetReassignmentPanel';
import { EmployeeDepartureHandler } from '@/components/target-management/EmployeeDepartureHandler';
import { TargetHistoryTable } from '@/components/target-management/TargetHistoryTable';
import { ActiveTargetsTable } from '@/components/target-management/ActiveTargetsTable';
import { DropoutAnalytics } from '@/components/target-management/DropoutAnalytics';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const TargetManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, stats } = useAppSelector((state) => state.targetManagement);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchTargetManagementData());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchTargetManagementData());
  };

  return (
    <MainLayout role="director" title="Target Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Target Management</h1>
            <p className="text-muted-foreground">
              Assign, reassign, and manage targets across your team hierarchy
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Overview Cards */}
        <TargetOverviewCards stats={stats} loading={loading} />

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Active Targets</TabsTrigger>
            <TabsTrigger value="assign">Assign Target</TabsTrigger>
            <TabsTrigger value="dropouts">Dropout Analytics</TabsTrigger>
            <TabsTrigger value="carry-forward">
              Carry Forward
              {stats.carryForwardTargets > 0 && (
                <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs text-white">
                  {stats.carryForwardTargets}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="reassign">Reassign</TabsTrigger>
            <TabsTrigger value="departures">
              Departures
              {stats.unassignedTargets > 0 && (
                <span className="ml-2 rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
                  {stats.unassignedTargets}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <ActiveTargetsTable />
          </TabsContent>

          <TabsContent value="assign" className="space-y-4">
            <TargetAssignmentForm />
          </TabsContent>

          <TabsContent value="dropouts" className="space-y-4">
            <DropoutAnalytics loading={loading} />
          </TabsContent>

          <TabsContent value="carry-forward" className="space-y-4">
            <CarryForwardList />
          </TabsContent>

          <TabsContent value="reassign" className="space-y-4">
            <TargetReassignmentPanel />
          </TabsContent>

          <TabsContent value="departures" className="space-y-4">
            <EmployeeDepartureHandler />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <TargetHistoryTable />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TargetManagement;
