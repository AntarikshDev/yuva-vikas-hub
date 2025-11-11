import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StateData {
  stateId: string;
  name: string;
  percent: number;
}

interface Props {
  states: StateData[];
  isLoading: boolean;
}

export const NHStateHeatmap: React.FC<Props> = ({ states, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-96" />
      </Card>
    );
  }

  const getColor = (percent: number) => {
    if (percent >= 90) return 'bg-green-500';
    if (percent >= 80) return 'bg-green-400';
    if (percent >= 70) return 'bg-yellow-400';
    if (percent >= 60) return 'bg-orange-400';
    return 'bg-red-500';
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">State Performance Heatmap</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {states.map((state) => (
          <div
            key={state.stateId}
            className={`p-4 rounded-lg ${getColor(state.percent)} text-white hover:scale-105 transition-transform cursor-pointer`}
          >
            <div className="font-semibold">{state.name}</div>
            <div className="text-2xl font-bold">{state.percent}%</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span>≥90%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded" />
          <span>70-90%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span>&lt;70%</span>
        </div>
      </div>
    </Card>
  );
};
