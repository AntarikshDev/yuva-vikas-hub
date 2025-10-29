import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { District, fetchDistrictDetails } from '@/store/slices/mobilisationSlice';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertsPanel } from './AlertsPanel';
import { ManagersTable } from './ManagersTable';
import { AuditTrail } from './AuditTrail';
import { TrendingUp, Users, Target } from 'lucide-react';

interface DetailPanelProps {
  district: District | null;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ district }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { managers, alerts, auditTrail } = useAppSelector(
    (state) => state.mobilisation
  );

  useEffect(() => {
    if (district?.id) {
      dispatch(fetchDistrictDetails(district.id));
    }
  }, [district?.id, dispatch]);

  if (!district) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Select a district to view details
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{district.name} - Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="managers">Managers</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Target</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {district.assignedTarget.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">Achieved</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {district.achieved.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-muted-foreground">Managers</span>
                  </div>
                  <p className="text-2xl font-bold">{district.managersCount}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">Avg Score</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {district.avgMobiliserScore.toFixed(1)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="managers">
            <ManagersTable managers={managers} />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel alerts={alerts.filter(a => a.entityId === district.id)} />
          </TabsContent>

          <TabsContent value="audit">
            <AuditTrail trail={auditTrail} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
