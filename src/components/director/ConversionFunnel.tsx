import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

interface ConversionFunnelProps {
  funnel: {
    mobilisations: number;
    counselling: number;
    enrollments: number;
    trainingCompletion: number;
    placements: number;
    retention: number;
  } | undefined;
  isLoading: boolean;
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ funnel, isLoading }) => {
  if (isLoading || !funnel) {
    return <Skeleton className="h-64" />;
  }

  const stages = [
    { name: 'Mobilisations', value: funnel.mobilisations, color: 'bg-blue-500' },
    { name: 'Counselling', value: funnel.counselling, color: 'bg-indigo-500' },
    { name: 'Enrollments', value: funnel.enrollments, color: 'bg-purple-500' },
    { name: 'Training Completion', value: funnel.trainingCompletion, color: 'bg-violet-500' },
    { name: 'Placements', value: funnel.placements, color: 'bg-pink-500' },
    { name: 'Retention', value: funnel.retention, color: 'bg-rose-500' },
  ];

  const getDropoffPercent = (current: number, previous: number) => {
    return ((previous - current) / previous * 100).toFixed(1);
  };

  const getProgressPercent = (value: number) => {
    return (value / funnel.mobilisations * 100).toFixed(1);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Conversion Funnel (Monthly)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {stages.map((stage, index) => {
          const prevValue = index > 0 ? stages[index - 1].value : stage.value;
          const dropoff = index > 0 ? getDropoffPercent(stage.value, prevValue) : '0';
          const progress = getProgressPercent(stage.value);

          return (
            <div key={stage.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{stage.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{stage.value.toLocaleString()}</span>
                  <span className="text-muted-foreground">({progress}%)</span>
                  {index > 0 && (
                    <span className="text-destructive">↓{dropoff}%</span>
                  )}
                </div>
              </div>
              <div className="relative w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stage.color} transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
