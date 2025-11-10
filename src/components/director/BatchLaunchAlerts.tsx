import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface BatchLaunchAlertsProps {
  batches: Array<{
    id: string;
    name: string;
    state: string;
    trainer: string;
    launchDate: string;
    remarks: string;
  }>;
  isLoading: boolean;
}

export const BatchLaunchAlerts: React.FC<BatchLaunchAlertsProps> = ({ batches, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Batch Launches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {batches.map((batch) => (
            <Card key={batch.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm">{batch.name}</h3>
                  <Badge variant="outline">
                    {format(new Date(batch.launchDate), 'MMM dd')}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{batch.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>{batch.trainer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span className="text-foreground">{batch.remarks}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="default" className="flex-1">
                    Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
