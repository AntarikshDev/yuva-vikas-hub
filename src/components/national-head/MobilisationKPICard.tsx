import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricLine {
  label: string;
  value: number | string;
}

interface MobilisationKPICardProps {
  title: string;
  metrics: MetricLine[];
  isSelected: boolean;
  onClick: () => void;
}

export const MobilisationKPICard: React.FC<MobilisationKPICardProps> = ({
  title,
  metrics,
  isSelected,
  onClick,
}) => {
  const formatValue = (value: number | string) => {
    if (typeof value === 'string') {
      return value;
    }
    return value.toLocaleString();
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-4 cursor-pointer transition-all hover:shadow-md',
        isSelected 
          ? 'bg-cyan-500/10 border-cyan-500 shadow-cyan-500/20' 
          : 'bg-card hover:bg-accent/5'
      )}
    >
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-1.5">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{metric.label}</span>
            <span className={cn(
              'text-sm font-bold',
              isSelected ? 'text-cyan-600' : 'text-foreground'
            )}>
              {formatValue(metric.value)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
