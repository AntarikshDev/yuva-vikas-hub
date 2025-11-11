import React from 'react';
import { Card } from '@/components/ui/card';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, TrendingDown } from 'lucide-react';

interface StateData {
  stateId: string;
  name: string;
  target: number;
  achieved: number;
  percent: number;
  status: 'On Track' | 'At Risk' | 'Off Track';
}

interface Props {
  states: StateData[];
  isLoading: boolean;
}

export const NHStateLeaderboard: React.FC<Props> = ({ states, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-96" />
      </Card>
    );
  }

  const sortedStates = [...states].sort((a, b) => b.percent - a.percent);
  const topStates = sortedStates.slice(0, 10);
  const bottomStates = sortedStates.slice(-10).reverse();

  const columns: Column<StateData>[] = [
    {
      id: 'rank',
      header: 'Rank',
      cell: (item) => {
        const index = sortedStates.findIndex(s => s.stateId === item.stateId) + 1;
        return (
          <div className="flex items-center gap-2">
            {index <= 3 && <Trophy className="h-4 w-4 text-yellow-500" />}
            <span className="font-medium">{index}</span>
          </div>
        );
      },
    },
    {
      id: 'name',
      header: 'State',
      cell: (item) => <div className="font-medium">{item.name}</div>,
    },
    {
      id: 'target',
      header: 'Target',
      cell: (item) => item.target.toLocaleString(),
    },
    {
      id: 'achieved',
      header: 'Achieved',
      cell: (item) => item.achieved.toLocaleString(),
    },
    {
      id: 'percent',
      header: '% Achieved',
      cell: (item) => `${item.percent}%`,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item) => {
        const variant = item.status === 'On Track' ? 'success' : item.status === 'At Risk' ? 'warning' : 'error';
        return <StatusBadge label={item.status} variant={variant} withDot />;
      },
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">State Leaderboard</h2>
      
      {/* Top Performers */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h3 className="text-base font-semibold">Top Performers</h3>
        </div>
        <DataTable columns={columns} data={topStates} />
      </div>

      {/* Bottom Performers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="h-5 w-5 text-destructive" />
          <h3 className="text-base font-semibold">Need Attention</h3>
        </div>
        <DataTable columns={columns} data={bottomStates} />
      </div>
    </Card>
  );
};
