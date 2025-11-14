import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, MousePointerClick } from 'lucide-react';

interface ActivityMetricsPanelProps {
  activities: {
    rozgaarMelaCount: number;
    sabhaCount: number;
    influencersRegistered: number;
    byState: Array<{ 
      state: string; 
      rozgaarMela: number;
      rozgaarSabha: number;
      influencers: number;
    }>;
    recentActivities: any[];
  } | undefined;
  isLoading: boolean;
  onCardClick?: () => void;
}

export const ActivityMetricsPanel: React.FC<ActivityMetricsPanelProps> = ({ 
  activities, 
  isLoading, 
  onCardClick 
}) => {
  if (isLoading || !activities) {
    return <Skeleton className="h-96" />;
  }

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01]" 
      onClick={onCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Activity & Influencer Metrics</CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MousePointerClick className="h-3 w-3" />
            <span>Click for details</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-xl font-bold text-primary">{activities.rozgaarMelaCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Rozgaar Mela</div>
          </div>
          <div className="text-center p-3 bg-orange-500/5 rounded-lg">
            <div className="text-xl font-bold text-orange-600">{activities.sabhaCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Rozgaar Sabha</div>
          </div>
          <div className="text-center p-3 bg-green-500/5 rounded-lg">
            <div className="text-xl font-bold text-green-600 flex items-center justify-center gap-1">
              <Users className="h-4 w-4" />
              {activities.influencersRegistered}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Influencers</div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Activities by State</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={activities.byState} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="state" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fontSize: 11 }}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar 
                dataKey="rozgaarMela" 
                fill="hsl(var(--primary))" 
                name="Rozgaar Mela"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="rozgaarSabha" 
                fill="hsl(25 95% 53%)" 
                name="Rozgaar Sabha"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="influencers" 
                fill="hsl(142 71% 45%)" 
                name="Influencers"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
