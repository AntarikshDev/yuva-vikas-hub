import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataTable, Column } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';

interface StateData {
  stateId: string;
  name: string;
  target: number;
  achieved: number;
  percent: number;
  status: 'On Track' | 'At Risk' | 'Off Track';
}

interface Props {
  weeklyTrend: Array<{ week: string; target: number; achieved: number }>;
  topStates: StateData[];
  isLoading: boolean;
}

export const NHTargetVsAchieved: React.FC<Props> = ({ weeklyTrend, topStates, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-64" />
      </Card>
    );
  }

  const columns: Column<StateData>[] = [
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
      <h2 className="text-xl font-bold mb-4">Target vs Achieved</h2>
      
      {/* Weekly Trend Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Weekly Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="target" stroke="hsl(var(--primary))" strokeWidth={2} name="Target" />
            <Line type="monotone" dataKey="achieved" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Achieved" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top 5 States Table */}
      <div>
        <h3 className="text-sm font-medium mb-3">Top 5 States</h3>
        <DataTable columns={columns} data={topStates.slice(0, 5)} />
      </div>
    </Card>
  );
};
