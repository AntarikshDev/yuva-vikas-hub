import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Gauge, Users, UserMinus, FileWarning } from 'lucide-react';

interface CentreHealthData {
  avgUtilisation: number;
  avgAttendance: number;
  dropoutPercent: number;
  pendingDocuments: number;
}

interface Props {
  centreHealth: CentreHealthData | null;
  isLoading: boolean;
}

export const NHCentreHealthSnapshot: React.FC<Props> = ({ centreHealth, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!centreHealth) return null;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Avg Utilisation</h3>
          <Gauge className="h-5 w-5 text-primary" />
        </div>
        <div className="text-2xl font-bold mb-1">{centreHealth.avgUtilisation}%</div>
        <p className="text-xs text-muted-foreground">Centre capacity used</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Avg Attendance</h3>
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div className="text-2xl font-bold mb-1">{centreHealth.avgAttendance}%</div>
        <p className="text-xs text-muted-foreground">Daily attendance rate</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Dropout Rate</h3>
          <UserMinus className="h-5 w-5 text-destructive" />
        </div>
        <div className="text-2xl font-bold mb-1 text-destructive">{centreHealth.dropoutPercent}%</div>
        <p className="text-xs text-muted-foreground">Candidates dropped</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Pending Documents</h3>
          <FileWarning className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="text-2xl font-bold mb-1 text-yellow-600">{centreHealth.pendingDocuments}</div>
        <p className="text-xs text-muted-foreground">Awaiting verification</p>
      </Card>
    </div>
  );
};
