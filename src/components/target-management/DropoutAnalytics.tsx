import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingDown, AlertTriangle, Users, ArrowDown } from 'lucide-react';

interface FunnelStage {
  key: string;
  label: string;
  target: number;
  achieved: number;
  dropouts: number;
  dropoutRate: number;
}

interface DropoutAnalyticsProps {
  loading?: boolean;
}

export const DropoutAnalytics: React.FC<DropoutAnalyticsProps> = ({ loading }) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState('month');
  const [selectedState, setSelectedState] = React.useState('all');

  // Mock funnel data - in real app this would come from Redux/API
  const funnelData: FunnelStage[] = [
    { key: 'ofr_registration', label: 'OFR Registration', target: 1500, achieved: 1420, dropouts: 0, dropoutRate: 0 },
    { key: 'approved_ofr', label: 'Approved OFR', target: 1400, achieved: 1280, dropouts: 140, dropoutRate: 9.86 },
    { key: 'migration', label: 'Migration', target: 1200, achieved: 1150, dropouts: 130, dropoutRate: 10.16 },
    { key: 'enrolment', label: 'Enrolment', target: 1000, achieved: 980, dropouts: 170, dropoutRate: 14.78 },
    { key: 'training_completion', label: 'Training Completion', target: 1000, achieved: 920, dropouts: 60, dropoutRate: 6.12 },
    { key: 'assessment', label: 'Assessment', target: 1000, achieved: 890, dropouts: 30, dropoutRate: 3.26 },
    { key: 'placement', label: 'Placement', target: 1000, achieved: 850, dropouts: 40, dropoutRate: 4.49 },
    { key: 'retention', label: 'Retention', target: 1000, achieved: 820, dropouts: 30, dropoutRate: 3.53 },
  ];

  const totalDropouts = funnelData.reduce((sum, stage) => sum + stage.dropouts, 0);
  const overallConversionRate = ((funnelData[funnelData.length - 1].achieved / funnelData[0].achieved) * 100).toFixed(1);
  const highestDropoutStage = funnelData.reduce((max, stage) => stage.dropoutRate > max.dropoutRate ? stage : max, funnelData[0]);

  const getDropoutSeverity = (rate: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (rate >= 10) return 'destructive';
    if (rate >= 5) return 'secondary';
    return 'outline';
  };

  const getBarColor = (rate: number): string => {
    if (rate >= 10) return 'bg-destructive';
    if (rate >= 5) return 'bg-amber-500';
    return 'bg-primary';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Dropouts</p>
                <p className="text-2xl font-bold text-destructive">{totalDropouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Conversion</p>
                <p className="text-2xl font-bold text-primary">{overallConversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Highest Drop Phase</p>
                <p className="text-lg font-bold text-amber-600">{highestDropoutStage.label}</p>
                <p className="text-xs text-muted-foreground">{highestDropoutStage.dropoutRate.toFixed(1)}% dropout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Final Retention</p>
                <p className="text-2xl font-bold text-emerald-600">{funnelData[funnelData.length - 1].achieved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            <SelectItem value="maharashtra">Maharashtra</SelectItem>
            <SelectItem value="karnataka">Karnataka</SelectItem>
            <SelectItem value="tamil_nadu">Tamil Nadu</SelectItem>
            <SelectItem value="gujarat">Gujarat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Candidate Dropout Funnel
          </CardTitle>
          <CardDescription>
            Visual representation of candidate progression and dropout at each phase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.map((stage, index) => {
              const widthPercent = (stage.achieved / funnelData[0].achieved) * 100;
              const isLastStage = index === funnelData.length - 1;
              
              return (
                <div key={stage.key} className="relative">
                  {/* Stage Row */}
                  <div className="flex items-center gap-4">
                    {/* Stage Label */}
                    <div className="w-40 shrink-0">
                      <p className="font-medium text-sm">{stage.label}</p>
                      <p className="text-xs text-muted-foreground">Target: {stage.target.toLocaleString()}</p>
                    </div>

                    {/* Funnel Bar */}
                    <div className="flex-1 relative">
                      <div className="h-10 bg-muted rounded-lg overflow-hidden">
                        <div
                          className={`h-full ${getBarColor(stage.dropoutRate)} transition-all duration-500 flex items-center justify-center`}
                          style={{ width: `${widthPercent}%` }}
                        >
                          <span className="text-sm font-semibold text-white">
                            {stage.achieved.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dropout Info */}
                    <div className="w-32 shrink-0 text-right">
                      {stage.dropouts > 0 ? (
                        <Badge variant={getDropoutSeverity(stage.dropoutRate)}>
                          -{stage.dropouts} ({stage.dropoutRate.toFixed(1)}%)
                        </Badge>
                      ) : (
                        <Badge variant="outline">Start</Badge>
                      )}
                    </div>
                  </div>

                  {/* Connector Arrow */}
                  {!isLastStage && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Phase-wise Dropout Details */}
      <Card>
        <CardHeader>
          <CardTitle>Phase-wise Dropout Analysis</CardTitle>
          <CardDescription>
            Detailed breakdown of dropouts at each target phase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.filter(s => s.dropouts > 0).map((stage) => (
              <div key={stage.key} className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{stage.label}</span>
                    <Badge variant={getDropoutSeverity(stage.dropoutRate)}>
                      {stage.dropoutRate.toFixed(1)}% dropout
                    </Badge>
                  </div>
                  <Progress 
                    value={100 - stage.dropoutRate} 
                    className="h-2"
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Retained: {stage.achieved}</span>
                    <span>Dropped: {stage.dropouts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Insights */}
      <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            Critical Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span><strong>Enrolment</strong> phase has the highest dropout rate at {funnelData.find(s => s.key === 'enrolment')?.dropoutRate.toFixed(1)}%. Consider additional candidate engagement before migration.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>Post-enrolment targets cannot be carried forward. Current shortfall of <strong>{1000 - (funnelData.find(s => s.key === 'retention')?.achieved || 0)}</strong> will be marked as dropouts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>To achieve 1000 retentions, OFR registration needs to be at least <strong>{Math.ceil(1000 / (Number(overallConversionRate) / 100))}</strong> based on current conversion rates.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
