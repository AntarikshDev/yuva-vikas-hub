import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { GraduationCap, CheckCircle, Clock } from 'lucide-react';

interface ProgramHealthData {
  trainingCompletion: number;
  assessmentPass: number;
  avgTimeToMigrate: number;
}

interface Props {
  programHealth: ProgramHealthData | null;
  isLoading: boolean;
}

export const NHProgramHealthCards: React.FC<Props> = ({ programHealth, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!programHealth) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Training Completion</h3>
          <GraduationCap className="h-5 w-5 text-primary" />
        </div>
        <div className="text-3xl font-bold mb-2">{programHealth.trainingCompletion}%</div>
        <Progress value={programHealth.trainingCompletion} className="mb-2" />
        <p className="text-sm text-muted-foreground">
          {programHealth.trainingCompletion >= 80 ? 'On track' : 'Needs attention'}
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Assessment Pass Rate</h3>
          <CheckCircle className="h-5 w-5 text-primary" />
        </div>
        <div className="text-3xl font-bold mb-2">{programHealth.assessmentPass}%</div>
        <Progress value={programHealth.assessmentPass} className="mb-2" />
        <p className="text-sm text-muted-foreground">
          {programHealth.assessmentPass >= 75 ? 'Excellent' : 'Improvement needed'}
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Avg Time to Migrate</h3>
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div className="text-3xl font-bold mb-2">{programHealth.avgTimeToMigrate} days</div>
        <p className="text-sm text-muted-foreground">
          Target: ≤15 days
        </p>
        <p className="text-sm font-medium text-primary mt-1">
          {programHealth.avgTimeToMigrate <= 15 ? '✓ On target' : 'Behind schedule'}
        </p>
      </Card>
    </div>
  );
};
