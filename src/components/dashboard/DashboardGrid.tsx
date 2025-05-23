
import React from 'react';

type DashboardGridProps = {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg';
};

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
}) => {
  // Map gap size to tailwind classes
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };
  
  // Map column count to tailwind grid-cols classes
  const getColClasses = () => {
    let classes = 'grid';
    if (columns.sm) classes += ` grid-cols-1`;
    if (columns.md) classes += ` md:grid-cols-${Math.min(columns.md, 12)}`;
    if (columns.lg) classes += ` lg:grid-cols-${Math.min(columns.lg, 12)}`;
    if (columns.xl) classes += ` xl:grid-cols-${Math.min(columns.xl, 12)}`;
    return classes;
  };
  
  return (
    <div className={`${getColClasses()} ${gapClasses[gap]}`}>
      {children}
    </div>
  );
};
