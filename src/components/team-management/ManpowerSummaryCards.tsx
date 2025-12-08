import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, UserCheck, UserX, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ManpowerSummaryCardsProps {
  programName: string | undefined;
  centreName: string;
  centreId: string;
  totalRequired: number;
  totalAssigned: number;
  remaining: number;
}

export const ManpowerSummaryCards: React.FC<ManpowerSummaryCardsProps> = ({
  programName,
  centreName,
  centreId,
  totalRequired,
  totalAssigned,
  remaining,
}) => {
  const percentageAssigned = totalRequired > 0 
    ? Math.round((totalAssigned / totalRequired) * 100) 
    : 0;

  const isFullyStaffed = remaining <= 0;
  const isUnderStaffed = remaining > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Program & Centre Info */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Program</p>
              <p className="text-lg font-semibold text-foreground truncate">
                {programName || 'All Programs'}
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-primary/10">
            <p className="text-sm text-muted-foreground">Centre</p>
            <p className="font-medium">{centreName}</p>
            <p className="text-xs text-muted-foreground">ID: {centreId}</p>
          </div>
        </CardContent>
      </Card>

      {/* Total Required */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Manpower Required</p>
              <p className="text-3xl font-bold text-foreground">{totalRequired}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Across all roles in selected centres
          </p>
        </CardContent>
      </Card>

      {/* Total Assigned */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Manpower Assigned</p>
              <p className="text-3xl font-bold text-green-600">{totalAssigned}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Staffing Progress</span>
              <span className="font-medium">{percentageAssigned}%</span>
            </div>
            <Progress 
              value={percentageAssigned} 
              className={cn(
                "h-2",
                percentageAssigned >= 100 && "[&>div]:bg-green-500",
                percentageAssigned >= 75 && percentageAssigned < 100 && "[&>div]:bg-blue-500",
                percentageAssigned < 75 && "[&>div]:bg-amber-500"
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Remaining */}
      <Card className={cn(
        isUnderStaffed && "border-amber-200 bg-amber-50/50"
      )}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Remaining to Fill</p>
              <p className={cn(
                "text-3xl font-bold",
                isFullyStaffed ? "text-green-600" : "text-amber-600"
              )}>
                {Math.max(0, remaining)}
              </p>
            </div>
            <div className={cn(
              "p-2 rounded-lg",
              isFullyStaffed ? "bg-green-100" : "bg-amber-100"
            )}>
              {isFullyStaffed ? (
                <UserCheck className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              )}
            </div>
          </div>
          <p className={cn(
            "mt-3 text-sm font-medium",
            isFullyStaffed ? "text-green-600" : "text-amber-600"
          )}>
            {isFullyStaffed 
              ? "All positions filled!" 
              : `${remaining} vacant position${remaining > 1 ? 's' : ''} need attention`
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
