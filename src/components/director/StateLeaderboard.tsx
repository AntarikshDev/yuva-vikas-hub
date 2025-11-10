import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, TrendingDown } from 'lucide-react';

interface StateLeaderboardProps {
  states: Array<{
    stateId: string;
    name: string;
    target: number;
    achieved: number;
    percentAchieved: number;
    rank: number;
  }>;
  isLoading: boolean;
}

export const StateLeaderboard: React.FC<StateLeaderboardProps> = ({ states, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  const top10 = states.slice(0, 3);
  const bottom10 = states.slice(-3);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getStatusColor = (percent: number) => {
    if (percent >= 90) return 'default';
    if (percent >= 80) return 'secondary';
    return 'destructive';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          State Performance Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3 text-green-600">Top Performers</h3>
            <div className="space-y-2">
              {top10.map((state) => (
                <div
                  key={state.stateId}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getMedalEmoji(state.rank)}</span>
                    <div>
                      <div className="font-medium text-sm">{state.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {state.achieved.toLocaleString()} / {state.target.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(state.percentAchieved)}>
                    {state.percentAchieved.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 text-red-600 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Needs Attention
            </h3>
            <div className="space-y-2">
              {bottom10.map((state) => (
                <div
                  key={state.stateId}
                  className="flex items-center justify-between p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">#{state.rank}</span>
                    <div>
                      <div className="font-medium text-sm">{state.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {state.achieved.toLocaleString()} / {state.target.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="destructive">
                    {state.percentAchieved.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
