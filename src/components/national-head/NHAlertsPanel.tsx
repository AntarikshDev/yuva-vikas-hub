import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Alert {
  id: string;
  type: 'off_track' | 'pending_approval' | 'compliance' | 'high_dropout';
  state: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

interface Props {
  alerts: Alert[];
  isLoading: boolean;
}

export const NHAlertsPanel: React.FC<Props> = ({ alerts, isLoading }) => {
  const [filter, setFilter] = useState<string>('all');

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </Card>
    );
  }

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.priority === filter);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'off_track': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'compliance': return <CheckCircle className="h-5 w-5 text-yellow-500" />;
      case 'high_dropout': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default: return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Alerts & Tasks</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'high' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('high')}
          >
            High
          </Button>
          <Button
            variant={filter === 'medium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('medium')}
          >
            Medium
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No alerts to display
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-3">
                {getTypeIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getPriorityColor(alert.priority)} className="text-xs">
                      {alert.priority}
                    </Badge>
                    <span className="text-sm font-semibold">{alert.state}</span>
                  </div>
                  <p className="text-sm mb-2">{alert.message}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(alert.createdAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="ghost" size="sm">Resolve</Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
