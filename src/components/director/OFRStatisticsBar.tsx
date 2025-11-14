import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Clock, CheckCircle, XCircle, ArrowRight, UserCheck } from 'lucide-react';
import { OFRStatistics } from '@/store/slices/directorSlice';

interface OFRStatisticsBarProps {
  statistics: OFRStatistics;
}

export const OFRStatisticsBar: React.FC<OFRStatisticsBarProps> = ({ statistics }) => {
  const stats = [
    {
      label: 'Total Entries',
      value: statistics.totalEntries,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Pending Verification',
      value: statistics.pendingVerification,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Verified',
      value: statistics.verified,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Rejected',
      value: statistics.rejected,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Ready for Migration',
      value: statistics.readyForMigration,
      icon: ArrowRight,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      label: 'Migrated',
      value: statistics.migrated,
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-600/10',
    },
    {
      label: 'Recent (7 days)',
      value: statistics.recentEntries,
      icon: TrendingUp,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Conversion Rate',
      value: `${statistics.conversionRate}%`,
      icon: statistics.conversionRate > 60 ? TrendingUp : TrendingDown,
      color: statistics.conversionRate > 60 ? 'text-success' : 'text-warning',
      bgColor: statistics.conversionRate > 60 ? 'bg-success/10' : 'bg-warning/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-3 lg:p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1 truncate">{stat.label}</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground truncate">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-1.5 lg:p-2 rounded-lg flex-shrink-0 ml-2`}>
                <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
