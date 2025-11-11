import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StateDetailDialog } from '@/components/dialogs/StateDetailDialog';

interface StateData {
  stateId: string;
  name: string;
  target: number;
  achieved: number;
  percent: number;
}

interface Props {
  states: StateData[];
  isLoading: boolean;
}

export const NHStateHeatmap: React.FC<Props> = ({ states, isLoading }) => {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-96" />
      </Card>
    );
  }

  const handleStateClick = (state: StateData) => {
    setSelectedState(state);
    setDialogOpen(true);
  };

  const getColor = (percent: number) => {
    if (percent >= 90) return 'bg-green-500';
    if (percent >= 80) return 'bg-green-400';
    if (percent >= 70) return 'bg-yellow-400';
    if (percent >= 60) return 'bg-orange-400';
    return 'bg-red-500';
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">State Performance Heatmap</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {states.map((state) => (
          <div
            key={state.stateId}
            onClick={() => handleStateClick(state)}
            className={`p-5 rounded-lg ${getColor(state.percent)} text-white hover:scale-105 transition-transform cursor-pointer`}
          >
            <div className="font-semibold text-sm mb-2">{state.name}</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs opacity-90">Target</div>
                <div className="font-bold">{state.target.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs opacity-90">Achieved</div>
                <div className="font-bold">{state.achieved.toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="text-2xl font-bold">{state.percent}%</div>
              <div className="text-xs opacity-90">Achievement Rate</div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm border-t pt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-muted-foreground">≥90% (Excellent)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 rounded" />
          <span className="text-muted-foreground">80-90% (Good)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded" />
          <span className="text-muted-foreground">70-80% (Fair)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-400 rounded" />
          <span className="text-muted-foreground">60-70% (At Risk)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span className="text-muted-foreground">&lt;60% (Critical)</span>
        </div>
      </div>

      {selectedState && (
        <StateDetailDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          stateName={selectedState.name}
          stateData={{
            target: selectedState.target,
            achieved: selectedState.achieved,
            percent: selectedState.percent,
          }}
        />
      )}
    </Card>
  );
};
