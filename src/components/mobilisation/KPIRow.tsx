import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, CheckCircle, Activity, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StateKPIs } from '@/store/slices/mobilisationSlice';

interface KPIRowProps {
  kpis: StateKPIs | null;
  isLoading: boolean;
}

export const KPIRow: React.FC<KPIRowProps> = ({ kpis, isLoading }) => {
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpiCards = [
    {
      label: 'State Target',
      value: kpis.stateTarget.toLocaleString(),
      subtitle: 'This Month',
      icon: Target,
      color: 'text-primary',
    },
    {
      label: 'Achieved',
      value: kpis.achieved.toLocaleString(),
      subtitle: `${kpis.percentAchieved}% Complete`,
      icon: CheckCircle,
      color: 'text-green-600',
      progress: kpis.percentAchieved,
    },
    {
      label: 'Active Clusters',
      value: kpis.activeClusters.toString(),
      subtitle: `${kpis.onTrackPercentage}% On Track`,
      icon: Users,
      color: 'text-blue-600',
      trend: kpis.onTrackPercentage > 70 ? 'up' : 'down',
    },
    {
      label: 'Conversion Funnel',
      value: `${Math.round((kpis.enrollments / kpis.mobilisations) * 100)}%`,
      subtitle: `${kpis.mobilisations} → ${kpis.enrollments}`,
      icon: Activity,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((kpi, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {kpi.label}
                </p>
                <h3 className="text-3xl font-bold text-foreground mb-1">
                  {kpi.value}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {kpi.subtitle}
                  {kpi.trend === 'up' && (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  )}
                  {kpi.trend === 'down' && (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                </p>
              </div>
              <kpi.icon className={`w-8 h-8 ${kpi.color} opacity-80`} />
            </div>
            {kpi.progress !== undefined && (
              <Progress value={kpi.progress} className="mt-4 h-2" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
