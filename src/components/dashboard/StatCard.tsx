
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statCardVariants = cva(
  'flex flex-col rounded-lg border p-4 bg-white shadow-sm',
  {
    variants: {
      intent: {
        primary: 'border-primary-100 bg-primary-50',
        secondary: 'border-secondary-100 bg-secondary-50',
        success: 'border-success-100 bg-success-50',
        error: 'border-error-100 bg-error-50',
        warning: 'border-warning-100 bg-warning-50',
        info: 'border-info-100 bg-info-50',
        neutral: 'border-neutral-200',
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-5',
      }
    },
    defaultVariants: {
      intent: 'neutral',
      size: 'md',
    },
  }
);

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  footer?: React.ReactNode;
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, title, value, icon, trend, footer, intent, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(statCardVariants({ intent, size }), className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-600">{title}</p>
            <h3 className="text-2xl font-semibold tracking-tight">{value}</h3>
            
            {trend && (
              <div className="flex items-center">
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-success-600" : "text-error-600"
                )}>
                  {trend.isPositive ? '↑' : '↓'} {trend.value}%
                </span>
                <span className="ml-1 text-xs text-neutral-500">vs last period</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              "rounded-full p-2",
              intent === 'primary' && "bg-primary-100",
              intent === 'secondary' && "bg-secondary-100",
              intent === 'success' && "bg-success-100",
              intent === 'error' && "bg-error-100",
              intent === 'warning' && "bg-warning-100",
              intent === 'info' && "bg-info-100",
              intent === 'neutral' && "bg-neutral-100",
            )}>
              {icon}
            </div>
          )}
        </div>
        
        {footer && (
          <div className="mt-4 pt-3 border-t border-neutral-200 text-xs text-neutral-500">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';
