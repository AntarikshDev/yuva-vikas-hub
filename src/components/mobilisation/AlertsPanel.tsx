import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { Alert, acknowledgeAlert } from '@/store/slices/mobilisationSlice';
import { Alert as AlertUI, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Info, Check } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const dispatch = useDispatch<AppDispatch>();

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, any> = {
      critical: 'destructive',
      warning: 'secondary',
      info: 'default',
    };
    return (
      <Badge variant={variants[severity]}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No alerts at this time
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <AlertUI key={alert.id}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {getIcon(alert.severity)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTitle className="mb-0">{alert.title}</AlertTitle>
                  {getSeverityBadge(alert.severity)}
                </div>
                <AlertDescription className="text-sm">
                  {alert.description}
                </AlertDescription>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            {!alert.acknowledged && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => dispatch(acknowledgeAlert(alert.id))}
              >
                <Check className="w-3 h-3 mr-1" />
                Acknowledge
              </Button>
            )}
          </div>
        </AlertUI>
      ))}
    </div>
  );
};
