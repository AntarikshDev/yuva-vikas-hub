
import React, { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  text: string;
  unread: boolean;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className }) => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      text: 'Center A attendance below threshold (65%)',
      unread: true,
      priority: 'high',
      timestamp: '5 min ago'
    },
    {
      id: '2', 
      text: 'Counselling overdue for 12 candidates',
      unread: true,
      priority: 'medium',
      timestamp: '15 min ago'
    },
    {
      id: '3',
      text: 'Batch completion milestone reached - District B',
      unread: false,
      priority: 'low',
      timestamp: '1 hour ago'
    },
    {
      id: '4',
      text: 'New trainer onboarding pending approval',
      unread: true,
      priority: 'medium',
      timestamp: '2 hours ago'
    },
    {
      id: '5',
      text: 'Monthly placement target achieved - Mumbai',
      unread: false,
      priority: 'low',
      timestamp: '3 hours ago'
    },
  ]);

  const unreadCount = alerts.filter(alert => alert.unread).length;
  
  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, unread: false } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, unread: false })));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        {alerts.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          alerts.map((alert) => (
            <DropdownMenuItem
              key={alert.id}
              className={cn(
                "flex flex-col items-start p-3 cursor-pointer",
                alert.unread ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50"
              )}
              onClick={() => markAsRead(alert.id)}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-start space-x-2 flex-1">
                  <div className={cn("w-2 h-2 rounded-full mt-2", getPriorityColor(alert.priority))} />
                  <div className="flex-1">
                    <p className={cn(
                      "text-sm leading-tight",
                      alert.unread ? "font-medium text-gray-900" : "text-gray-600"
                    )}>
                      {alert.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.timestamp}
                    </p>
                  </div>
                </div>
                {alert.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center">
          <Button variant="ghost" size="sm" className="text-xs">
            View all notifications
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
