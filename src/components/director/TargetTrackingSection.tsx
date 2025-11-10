import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface TargetTrackingSectionProps {
  targetTracking: {
    national: { target: number; achieved: number };
    byProgram: Array<{
      programId: string;
      name: string;
      target: number;
      achieved: number;
    }>;
    weeklyTrend: Array<{ week: string; achieved: number }>;
  } | null;
  isLoading: boolean;
}

export const TargetTrackingSection: React.FC<TargetTrackingSectionProps> = ({ targetTracking, isLoading }) => {
  if (isLoading || !targetTracking) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const nationalData = [
    {
      name: 'National',
      Target: targetTracking.national.target,
      Achieved: targetTracking.national.achieved,
    }
  ];

  const programData = targetTracking.byProgram.map(p => ({
    name: p.name,
    Target: p.target,
    Achieved: p.achieved,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Target Tracking & Achievements</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium mb-4">National Target vs Achieved</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nationalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Target" fill="hsl(var(--primary))" />
                <Bar dataKey="Achieved" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Weekly Achievement Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={targetTracking.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="achieved" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Program-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={programData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Target" fill="hsl(var(--primary))" />
              <Bar dataKey="Achieved" fill="hsl(var(--chart-2))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
