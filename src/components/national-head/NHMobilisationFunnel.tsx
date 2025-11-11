import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface FunnelData {
  mobilisations: number;
  counselling: number;
  registered: number;
  migrated: number;
  enrolled: number;
  placed: number;
}

interface Props {
  funnel: FunnelData | null;
  isLoading: boolean;
}

export const NHMobilisationFunnel: React.FC<Props> = ({ funnel, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-32" />
      </Card>
    );
  }

  if (!funnel) return null;

  const stages = [
    { label: 'Mobilisations', value: funnel.mobilisations, color: 'bg-blue-500' },
    { label: 'Counselling', value: funnel.counselling, color: 'bg-indigo-500' },
    { label: 'Registered', value: funnel.registered, color: 'bg-purple-500' },
    { label: 'Migrated', value: funnel.migrated, color: 'bg-pink-500' },
    { label: 'Enrolled', value: funnel.enrolled, color: 'bg-rose-500' },
    { label: 'Placed', value: funnel.placed, color: 'bg-red-500' },
  ];

  const maxValue = funnel.mobilisations;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Mobilisation Funnel</h2>
      
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const widthPercent = (stage.value / maxValue) * 100;
          const conversionRate = index > 0 
            ? ((stage.value / stages[index - 1].value) * 100).toFixed(1)
            : '100';

          return (
            <div key={stage.label} className="relative">
              <div className="flex items-center justify-between mb-1 text-sm">
                <span className="font-medium">{stage.label}</span>
                <span className="text-muted-foreground">
                  {stage.value.toLocaleString()} ({conversionRate}%)
                </span>
              </div>
              <div className="h-10 bg-muted rounded-lg overflow-hidden">
                <div
                  className={`h-full ${stage.color} flex items-center justify-center text-white font-semibold transition-all duration-300`}
                  style={{ width: `${widthPercent}%` }}
                >
                  {widthPercent > 20 && stage.value.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
