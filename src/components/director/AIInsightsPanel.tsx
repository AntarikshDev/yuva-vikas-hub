import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const AIInsightsPanel: React.FC = () => {
  // Phase 2 placeholder with mock data
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Insights
          <Badge variant="secondary" className="ml-2">Phase 2</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Dropout Prediction Index</h3>
              <Badge variant="destructive">High Risk</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Risk Level</span>
                <span className="font-medium">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground">
              Based on attendance, performance, and engagement patterns
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Recruitment Quality Index</h3>
              <Badge variant="default">Good</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Quality Score</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground">
              Overall program health across all parameters
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
