
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-neutral-800',
        primary: 'bg-primary-100 text-primary-800',
        secondary: 'bg-secondary-100 text-secondary-800',
        success: 'bg-success-100 text-success-800',
        warning: 'bg-warning-100 text-warning-800',
        error: 'bg-error-100 text-error-800',
        info: 'bg-info-100 text-info-800',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-sm',
      },
      withDot: {
        true: 'pl-2',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
      withDot: false,
    },
  }
);

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  label: string;
  phase?: 1 | 2 | 3;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  className,
  variant,
  size,
  withDot,
  label,
  phase,
  ...props
}) => {
  return (
    <span
      className={cn(statusBadgeVariants({ variant, size, withDot }), className)}
      {...props}
    >
      {withDot && (
        <span
          className={cn(
            'mr-1.5 h-2 w-2 rounded-full',
            variant === 'primary' && 'bg-primary-500',
            variant === 'secondary' && 'bg-secondary-500',
            variant === 'success' && 'bg-success-500',
            variant === 'warning' && 'bg-warning-500',
            variant === 'error' && 'bg-error-500',
            variant === 'info' && 'bg-info-500',
            variant === 'default' && 'bg-neutral-500',
          )}
        />
      )}
      {label}
      {phase && (
        <span className="ml-1.5 rounded-full bg-neutral-200 px-1 text-xs text-neutral-700">
          Phase {phase}
        </span>
      )}
    </span>
  );
};

StatusBadge.displayName = 'StatusBadge';
