import React from 'react';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { Users, Building, TrendingUp, Target, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface NationalKPICardsProps {
  kpis: {
    totalCandidates: number;
    totalCandidatesGrowth: number;
    activeCentres: number;
    placementRate: number;
    retentionRate6Months: number;
    centreUtilisation: { current: number; total: number };
  } | null;
  isLoading: boolean;
}

export const NationalKPICards: React.FC<NationalKPICardsProps> = ({ kpis, isLoading }) => {
  if (isLoading || !kpis) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <EnhancedStatCard
        title="Total Candidates"
        value={kpis.totalCandidates.toLocaleString()}
        icon={<Users className="h-6 w-6" />}
        trend={{ value: kpis.totalCandidatesGrowth, isPositive: true }}
        footer="Registered nationally"
        intent="primary"
      />

      <EnhancedStatCard
        title="Active Centres"
        value={kpis.activeCentres}
        icon={<Building className="h-6 w-6" />}
        footer="Operational centres"
        intent="info"
      />

      <EnhancedStatCard
        title="Placement Rate"
        value={`${kpis.placementRate}%`}
        icon={<TrendingUp className="h-6 w-6" />}
        trend={{ value: 2.3, isPositive: true }}
        footer="Overall placement"
        intent="success"
      />

      <EnhancedStatCard
        title="Retention (6M)"
        value={`${kpis.retentionRate6Months}%`}
        icon={<Target className="h-6 w-6" />}
        trend={{ value: 1.5, isPositive: true }}
        footer="6-month retention"
        intent="success"
      />

      <EnhancedStatCard
        title="Centre Utilisation"
        value={`${Math.round((kpis.centreUtilisation.current / kpis.centreUtilisation.total) * 100)}%`}
        icon={<BarChart className="h-6 w-6" />}
        footer={`${kpis.centreUtilisation.current}/${kpis.centreUtilisation.total}`}
        intent="info"
      />
    </div>
  );
};
