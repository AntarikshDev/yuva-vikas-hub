import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface StateHeatmapProps {
  statePerformance: Array<{
    stateId: string;
    name: string;
    score: number;
    mobilisation: number;
    training: number;
    placement: number;
  }>;
  isLoading: boolean;
}

export const StateHeatmap: React.FC<StateHeatmapProps> = ({ statePerformance, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statePerformance.map((state) => (
        <Card 
          key={state.stateId} 
          className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-sm">{state.name}</h3>
            <Badge variant={getScoreVariant(state.score)}>
              {state.score}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Mobilisation</span>
              <span className="font-medium">{state.mobilisation}%</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getScoreColor(state.mobilisation)}`}
                style={{ width: `${state.mobilisation}%` }}
              />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Training</span>
              <span className="font-medium">{state.training}%</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getScoreColor(state.training)}`}
                style={{ width: `${state.training}%` }}
              />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Placement</span>
              <span className="font-medium">{state.placement}%</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getScoreColor(state.placement)}`}
                style={{ width: `${state.placement}%` }}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
