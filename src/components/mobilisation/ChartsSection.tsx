import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartsSectionProps {
  className?: string;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ className }) => {
  // Mock data - replace with real data from Redux
  const targetVsAchieved = [
    { period: 'Week 1', target: 5000, achieved: 4200 },
    { period: 'Week 2', target: 5000, achieved: 4800 },
    { period: 'Week 3', target: 5000, achieved: 5300 },
    { period: 'Week 4', target: 5000, achieved: 4950 },
  ];

  const funnelData = [
    { stage: 'Mobilisations', count: 15000 },
    { stage: 'Counselling', count: 12000 },
    { stage: 'Enrollments', count: 9500 },
    { stage: 'Placements', count: 7200 },
  ];

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target vs Achieved Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Target vs Achieved Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={targetVsAchieved}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="achieved"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
