
import React, { ReactNode } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  filters?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  filters,
  children,
  footer,
  className = '',
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
          </div>
          {filters && <div className="flex space-x-2">{filters}</div>}
        </div>
      </CardHeader>
      <CardContent className="px-4 py-0">
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="border-t px-4 py-3">
          <div className="text-xs text-neutral-500">{footer}</div>
        </CardFooter>
      )}
    </Card>
  );
};
