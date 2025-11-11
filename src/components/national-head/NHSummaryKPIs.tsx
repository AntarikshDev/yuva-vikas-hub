import React from 'react';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { TrendingUp, TrendingDown, Users, Target, Award, Building2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SummaryData {
  targetAssigned: number;
  targetAchieved: number;
  placementAchieved: number;
  retention6m: number;
  activeClusters: number;
}

interface Props {
  summary: SummaryData | null;
  isLoading: boolean;
}

export const NHSummaryKPIs: React.FC<Props> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const achievementPercent = (summary.targetAchieved / summary.targetAssigned) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <EnhancedStatCard
        title="NH Target Assigned"
        value={summary.targetAssigned.toLocaleString()}
        icon={<Target className="h-5 w-5" />}
        intent="primary"
        footer="Monthly target"
      />
      
      <EnhancedStatCard
        title="Target Achieved"
        value={summary.targetAchieved.toLocaleString()}
        icon={<TrendingUp className="h-5 w-5" />}
        intent={achievementPercent >= 80 ? 'success' : achievementPercent >= 60 ? 'warning' : 'error'}
        trend={{ value: achievementPercent, isPositive: achievementPercent >= 80 }}
        footer="Mobilisation"
      />
      
      <EnhancedStatCard
        title="Placement Achieved"
        value={summary.placementAchieved.toLocaleString()}
        icon={<Award className="h-5 w-5" />}
        intent="success"
        footer="Candidates placed"
      />
      
      <EnhancedStatCard
        title="Retention (6 Months)"
        value={`${summary.retention6m}%`}
        icon={<Users className="h-5 w-5" />}
        intent={summary.retention6m >= 75 ? 'success' : 'warning'}
        trend={{ value: 2, isPositive: summary.retention6m >= 75 }}
        footer="Still employed"
      />
      
      <EnhancedStatCard
        title="Active Clusters"
        value={summary.activeClusters.toString()}
        icon={<Building2 className="h-5 w-5" />}
        intent="info"
        footer="Under NH"
      />
    </div>
  );
};
