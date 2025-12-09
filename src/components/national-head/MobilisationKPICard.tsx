import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MetricLine {
  label: string;
  target: number;
  achieved: number;
}

interface MobilisationKPICardProps {
  title: string;
  metrics: MetricLine[];
  isSelected: boolean;
  onClick: () => void;
  showTimeFilter?: boolean;
  isCurrency?: boolean;
}

type TimeFilter = 'monthly' | 'quarterly' | 'half-yearly' | 'annual';

const timeFilterMultipliers: Record<TimeFilter, number> = {
  monthly: 1,
  quarterly: 3,
  'half-yearly': 6,
  annual: 12,
};

export const MobilisationKPICard: React.FC<MobilisationKPICardProps> = ({
  title,
  metrics,
  isSelected,
  onClick,
  showTimeFilter = false,
  isCurrency = false,
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('monthly');

  const getFilteredValue = (value: number) => {
    if (!showTimeFilter) return value;
    return value * timeFilterMultipliers[timeFilter];
  };

  const formatValue = (value: number) => {
    const filteredValue = getFilteredValue(value);
    if (isCurrency) {
      return `₹${filteredValue.toLocaleString()}`;
    }
    return filteredValue.toLocaleString();
  };

  return (
    <Card
      onClick={(e) => {
        // Prevent card click when clicking on select
        if ((e.target as HTMLElement).closest('[data-radix-select-trigger]')) {
          return;
        }
        onClick();
      }}
      className={cn(
        'p-4 cursor-pointer transition-all hover:shadow-md',
        isSelected 
          ? 'bg-cyan-500/10 border-cyan-500 shadow-cyan-500/20' 
          : 'bg-card hover:bg-accent/5'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      
      {showTimeFilter && (
        <div className="mb-3" onClick={(e) => e.stopPropagation()}>
          <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
            <SelectTrigger className="h-7 text-xs" data-radix-select-trigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="half-yearly">Half-Yearly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{metric.label}</span>
            <span className={cn(
              'text-sm font-bold',
              isSelected ? 'text-cyan-600' : 'text-foreground'
            )}>
              {formatValue(metric.achieved)}/{formatValue(metric.target)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
