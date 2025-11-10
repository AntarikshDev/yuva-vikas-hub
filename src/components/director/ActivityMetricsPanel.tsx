import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

interface ActivityMetricsPanelProps {
  activities: {
    rozgaarMelaCount: number;
    sabhaCount: number;
    influencersRegistered: number;
    byState: Array<{ state: string; count: number }>;
  } | undefined;
  isLoading: boolean;
}

export const ActivityMetricsPanel: React.FC<ActivityMetricsPanelProps> = ({ activities, isLoading }) => {
  if (isLoading || !activities) {
    return <Skeleton className="h-96" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity & Influencer Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{activities.rozgaarMelaCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Rozgaar Mela</div>
            </div>
            <div className="text-center p-4 bg-secondary/5 rounded-lg">
              <div className="text-2xl font-bold text-secondary">{activities.sabhaCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Sabha Count</div>
            </div>
            <div className="text-center p-4 bg-green-500/5 rounded-lg">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                <Users className="h-5 w-5" />
                {activities.influencersRegistered}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Influencers</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Activities by State</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activities.byState}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
