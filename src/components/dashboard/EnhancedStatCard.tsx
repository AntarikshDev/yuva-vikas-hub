import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { Badge } from '@/components/ui/badge';

const statCardVariants = cva(
  'flex flex-col rounded-lg border p-4 bg-white shadow-sm transition-all duration-300 hover:shadow-md relative overflow-hidden',
  {
    variants: {
      intent: {
        primary: 'border-primary-100 bg-gradient-to-br from-white to-primary-50',
        secondary: 'border-secondary-100 bg-gradient-to-br from-white to-secondary-50',
        success: 'border-success-100 bg-gradient-to-br from-white to-green-50',
        error: 'border-error-100 bg-gradient-to-br from-white to-red-50',
        warning: 'border-warning-100 bg-gradient-to-br from-white to-amber-50',
        info: 'border-info-100 bg-gradient-to-br from-white to-blue-50',
        neutral: 'border-neutral-200 bg-gradient-to-br from-white to-neutral-50',
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

export interface EnhancedStatCardProps
  extends Omit<HTMLMotionProps<"div">, "title">, 
    VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  sparkline?: number[];
  status?: 'green' | 'orange' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  footer?: React.ReactNode;
}

export const EnhancedStatCard = React.forwardRef<HTMLDivElement, EnhancedStatCardProps>(
  ({ className, title, value, icon, sparkline, status, trend, footer, intent, size, ...props }, ref) => {
    
    const getStatusBadge = (status: 'green' | 'orange' | 'red') => {
      const statusConfig = {
        green: { variant: 'default' as const, className: 'bg-green-500 hover:bg-green-600' },
        orange: { variant: 'secondary' as const, className: 'bg-amber-500 hover:bg-amber-600 text-white' },
        red: { variant: 'destructive' as const, className: 'bg-red-500 hover:bg-red-600' },
      };
      
      return (
        <Badge 
          variant={statusConfig[status].variant}
          className={cn("absolute top-2 right-2 w-3 h-3 p-0 rounded-full", statusConfig[status].className)}
        />
      );
    };

    const getSparklineColor = (status?: 'green' | 'orange' | 'red') => {
      switch (status) {
        case 'green': return '#10b981';
        case 'orange': return '#f59e0b';
        case 'red': return '#ef4444';
        default: return '#6366f1';
      }
    };

    return (
      <motion.div
        ref={ref}
        className={cn(statCardVariants({ intent, size }), className)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, scale: 1.02 }}
        {...props}
      >
        <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 opacity-10 rounded-full bg-gradient-to-br from-transparent to-current" />
        
        {/* Status Badge */}
        {status && getStatusBadge(status)}
        
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium text-neutral-600">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            
            {/* Sparkline */}
            {sparkline && sparkline.length > 0 && (
              <div className="w-full h-8 mt-2">
                <Sparklines data={sparkline} width={120} height={30}>
                  <SparklinesLine 
                    color={getSparklineColor(status)} 
                    style={{ strokeWidth: 2, fill: 'none' }}
                  />
                </Sparklines>
              </div>
            )}
            
            {trend && (
              <div className="flex items-center mt-2">
                <motion.span 
                  className={cn(
                    "text-xs font-medium flex items-center",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 10 
                  }}
                >
                  {trend.isPositive ? '↑' : '↓'} {trend.value}%
                </motion.span>
                <span className="ml-1 text-xs text-neutral-500">
                  {trend.isPositive ? 'increase' : 'decrease'} vs last period
                </span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              "rounded-full p-3 shadow-md transform transition-transform duration-300 hover:rotate-12 ml-4",
              intent === 'primary' && "bg-primary-100 text-primary-700",
              intent === 'secondary' && "bg-secondary-100 text-secondary-700",
              intent === 'success' && "bg-green-100 text-green-700",
              intent === 'error' && "bg-red-100 text-red-700",
              intent === 'warning' && "bg-amber-100 text-amber-700",
              intent === 'info' && "bg-blue-100 text-blue-700",
              intent === 'neutral' && "bg-neutral-100 text-neutral-700",
            )}>
              {icon}
            </div>
          )}
        </div>
        
        {footer && (
          <div className="mt-3 text-xs text-neutral-500 border-t border-neutral-100 pt-2">
            {footer}
          </div>
        )}
      </motion.div>
    );
  }
);

EnhancedStatCard.displayName = 'EnhancedStatCard';