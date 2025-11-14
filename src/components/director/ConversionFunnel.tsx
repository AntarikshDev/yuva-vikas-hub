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
      <CardHeader>
        <CardTitle>Conversion Funnel (Monthly)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {stages.map((stage, index) => {
            const prevValue = index > 0 ? stages[index - 1].value : stage.value;
            const dropoff = index > 0 ? getDropoffPercent(stage.value, prevValue) : '0';
            const progress = getProgressPercent(stage.value);

            return (
              <div key={stage.name} className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{stage.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{stage.value.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">({progress}%)</span>
                      </div>
                    </div>
                    <div className="relative w-full h-8 bg-secondary rounded-lg overflow-hidden">
                      <div
                        className={`h-full ${stage.color} transition-all duration-500 flex items-center justify-end pr-2`}
                        style={{ width: `${progress}%` }}
                      >
                        <span className="text-white text-xs font-medium">{progress}%</span>
                      </div>
                    </div>
                    {index > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Drop-off: {dropoff}% from previous stage
                      </div>
                    )}
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <div className="flex items-center justify-center my-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
