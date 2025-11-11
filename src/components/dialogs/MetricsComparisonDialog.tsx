import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricsData {
  curriculumCompletion: number;
  counsellingCompletion: number;
  assessmentPassRate: number;
  avgTimeToMigrate: number;
}

interface ComparisonItem {
  label: string;
  metrics: MetricsData;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for demonstration
const mockTimeData: Record<string, MetricsData> = {
  'current': { curriculumCompletion: 85, counsellingCompletion: 88, assessmentPassRate: 78, avgTimeToMigrate: 14 },
  'last-month': { curriculumCompletion: 82, counsellingCompletion: 85, assessmentPassRate: 75, avgTimeToMigrate: 16 },
  'last-quarter': { curriculumCompletion: 78, counsellingCompletion: 80, assessmentPassRate: 72, avgTimeToMigrate: 18 },
};

const mockStateData: Record<string, MetricsData> = {
  'maharashtra': { curriculumCompletion: 88, counsellingCompletion: 90, assessmentPassRate: 82, avgTimeToMigrate: 12 },
  'karnataka': { curriculumCompletion: 85, counsellingCompletion: 87, assessmentPassRate: 78, avgTimeToMigrate: 14 },
  'tamil-nadu': { curriculumCompletion: 82, counsellingCompletion: 84, assessmentPassRate: 76, avgTimeToMigrate: 15 },
};

export const MetricsComparisonDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const [compareBy, setCompareBy] = useState<'time' | 'state'>('time');
  const [selectedItems, setSelectedItems] = useState<string[]>(['current', 'last-month']);

  const getComparisonData = (): ComparisonItem[] => {
    const data = compareBy === 'time' ? mockTimeData : mockStateData;
    return selectedItems.map(key => ({
      label: formatLabel(key, compareBy),
      metrics: data[key] || mockTimeData.current,
    }));
  };

  const formatLabel = (key: string, type: 'time' | 'state'): string => {
    if (type === 'time') {
      return key === 'current' ? 'Current Period' : key === 'last-month' ? 'Last Month' : 'Last Quarter';
    }
    return key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const calculateTrend = (current: number, previous: number): { value: number; direction: 'up' | 'down' | 'same' } => {
    const diff = current - previous;
    if (Math.abs(diff) < 0.5) return { value: 0, direction: 'same' };
    return { value: Math.abs(diff), direction: diff > 0 ? 'up' : 'down' };
  };

  const renderMetricCard = (label: string, items: ComparisonItem[], metricKey: keyof MetricsData, unit: string = '%', inverse: boolean = false) => {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">{label}</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => {
            const value = item.metrics[metricKey];
            const prevValue = idx > 0 ? items[idx - 1].metrics[metricKey] : null;
            const trend = prevValue !== null ? calculateTrend(value, prevValue) : null;
            const isPositive = inverse ? trend?.direction === 'down' : trend?.direction === 'up';

            return (
              <div key={item.label} className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold">{value}{unit}</div>
                  {trend && trend.direction !== 'same' && (
                    <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      {trend.value.toFixed(1)}{unit}
                    </div>
                  )}
                  {trend && trend.direction === 'same' && (
                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                      <Minus className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <Progress value={typeof value === 'number' ? value : 0} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  const comparisonData = getComparisonData();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Metrics Comparison</DialogTitle>
          <DialogDescription>
            Compare Centre Performance metrics across different time periods or states
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs value={compareBy} onValueChange={(v) => setCompareBy(v as 'time' | 'state')}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="time">Time Periods</TabsTrigger>
              <TabsTrigger value="state">States</TabsTrigger>
            </TabsList>

            <TabsContent value="time" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">First Period</label>
                  <Select value={selectedItems[0]} onValueChange={(v) => setSelectedItems([v, selectedItems[1]])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Period</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Second Period</label>
                  <Select value={selectedItems[1]} onValueChange={(v) => setSelectedItems([selectedItems[0], v])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Period</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="state" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">First State</label>
                  <Select value={selectedItems[0]} onValueChange={(v) => setSelectedItems([v, selectedItems[1]])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Second State</label>
                  <Select value={selectedItems[1]} onValueChange={(v) => setSelectedItems([selectedItems[0], v])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            {renderMetricCard('Curriculum Completion', comparisonData, 'curriculumCompletion')}
            {renderMetricCard('Counselling Completion', comparisonData, 'counsellingCompletion')}
            {renderMetricCard('Assessment Pass Rate', comparisonData, 'assessmentPassRate')}
            {renderMetricCard('Avg Time to Migrate', comparisonData, 'avgTimeToMigrate', ' days', true)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
