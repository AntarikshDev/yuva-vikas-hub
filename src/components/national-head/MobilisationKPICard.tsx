import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  isCurrency?: boolean;
}

export const MobilisationKPICard: React.FC<MobilisationKPICardProps> = ({
  title,
  metrics,
  isSelected,
  onClick,
  isCurrency = false,
}) => {
  const formatValue = (value: number) => {
    if (isCurrency) {
      return `₹${value.toLocaleString()}`;
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
