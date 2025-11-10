import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

interface CandidatePipelineFlowProps {
  pipeline: {
    registered: number;
    ready: number;
    migrated: number;
    enrolled: number;
    placed: number;
    retained: number;
  } | undefined;
  isLoading: boolean;
}

export const CandidatePipelineFlow: React.FC<CandidatePipelineFlowProps> = ({ pipeline, isLoading }) => {
  if (isLoading || !pipeline) {
    return <Skeleton className="h-64" />;
  }

  const stages = [
    { name: 'Registered', value: pipeline.registered, color: 'bg-blue-500' },
    { name: 'Ready', value: pipeline.ready, color: 'bg-indigo-500' },
    { name: 'Migrated', value: pipeline.migrated, color: 'bg-purple-500' },
    { name: 'Enrolled', value: pipeline.enrolled, color: 'bg-pink-500' },
    { name: 'Placed', value: pipeline.placed, color: 'bg-rose-500' },
    { name: 'Retained', value: pipeline.retained, color: 'bg-red-500' },
  ];

  const getDropoffPercent = (current: number, previous: number) => {
    return ((previous - current) / previous * 100).toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {stages.map((stage, index) => {
            const prevValue = index > 0 ? stages[index - 1].value : stage.value;
            const dropoff = index > 0 ? getDropoffPercent(stage.value, prevValue) : '0';
            const percentOfTotal = ((stage.value / pipeline.registered) * 100).toFixed(1);

            return (
              <React.Fragment key={stage.name}>
                <div className="flex-shrink-0">
                  <div className={`${stage.color} rounded-lg p-4 text-white min-w-[140px]`}>
                    <div className="text-xs opacity-90 mb-1">{stage.name}</div>
                    <div className="text-2xl font-bold">{stage.value.toLocaleString()}</div>
                    <div className="text-xs opacity-75 mt-1">{percentOfTotal}% of total</div>
                    {index > 0 && (
                      <div className="text-xs opacity-75 mt-1">
                        -{dropoff}% drop
                      </div>
                    )}
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
