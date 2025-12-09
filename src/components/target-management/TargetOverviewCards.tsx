import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TargetOverviewCardsProps {
  stats: {
    totalActiveTargets: number;
    pendingAssignments: number;
    carryForwardTargets: number;
    unassignedTargets: number;
  };
  loading: boolean;
}

export const TargetOverviewCards: React.FC<TargetOverviewCardsProps> = ({ stats, loading }) => {
  const cards = [
    {
      title: 'Active Targets',
      value: stats.totalActiveTargets,
      icon: Target,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Pending Assignments',
      value: stats.pendingAssignments,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Carry Forward Queue',
      value: stats.carryForwardTargets,
      icon: ArrowRightLeft,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Unassigned (Departures)',
      value: stats.unassignedTargets,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-3xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
