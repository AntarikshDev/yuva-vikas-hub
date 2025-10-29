import React from 'react';
import { TargetAssignment } from '@/store/slices/mobilisationSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Target } from 'lucide-react';

interface AuditTrailProps {
  trail: TargetAssignment[];
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ trail }) => {
  if (trail.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No audit trail available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {trail.map((entry) => (
        <Card key={entry.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="font-medium">{entry.targetType}</span>
              </div>
              <Badge variant="outline">{entry.value.toLocaleString()}</Badge>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3" />
                <span>Assigned by: {entry.assignedBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Period: {entry.period}</span>
              </div>
              {entry.notes && (
                <p className="text-xs mt-2 p-2 bg-muted rounded">
                  {entry.notes}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
