import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

interface CompliancePanelProps {
  compliance: {
    centreComplianceRate: number;
    statesOffTrack: Array<{
      stateId: string;
      name: string;
      achievementRate: number;
      status: 'critical' | 'warning';
    }>;
  } | null;
  isLoading: boolean;
}

export const CompliancePanel: React.FC<CompliancePanelProps> = ({ compliance, isLoading }) => {
  if (isLoading || !compliance) {
    return <Skeleton className="h-96" />;
  }

  const complianceData = [
    { name: 'Compliant', value: compliance.centreComplianceRate },
    { name: 'Non-Compliant', value: 100 - compliance.centreComplianceRate }
  ];

  const COLORS = ['hsl(var(--chart-2))', 'hsl(var(--destructive))'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance & Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-4">Centre Compliance Rate</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              States Off-Track (&lt;80%)
            </h3>
            <div className="space-y-2">
              {compliance.statesOffTrack.map((state) => (
                <div 
                  key={state.stateId} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={state.status === 'critical' ? 'destructive' : 'secondary'}>
                      {state.status === 'critical' ? 'Critical' : 'Warning'}
                    </Badge>
                    <span className="text-sm font-medium">{state.name}</span>
                  </div>
                  <span className="text-sm font-bold">{state.achievementRate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
