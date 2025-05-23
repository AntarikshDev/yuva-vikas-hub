
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { StatusBadge } from './StatusBadge';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
  actions?: {
    label: string;
    href?: string;
    onClick?: () => void;
  }[];
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'success': return 'success';
      default: return 'info';
    }
  };
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const handleActionClick = (
    e: React.MouseEvent,
    action: { onClick?: () => void; href?: string }
  ) => {
    if (!action.href) {
      e.preventDefault();
    }
    if (action.onClick) {
      action.onClick();
    }
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex space-x-1 text-sm">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="h-8 text-xs"
              >
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-8 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="h-8 w-8 text-neutral-300" />
              <p className="mt-2 text-sm text-neutral-600">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-b p-3 ${
                  notification.read ? 'bg-white' : 'bg-neutral-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <StatusBadge
                    variant={getTypeVariant(notification.type)}
                    withDot
                    label={notification.title}
                  />
                  <span className="text-xs text-neutral-500">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                </div>
                
                <p className="mt-1 text-sm">{notification.message}</p>
                
                {notification.actions && notification.actions.length > 0 && (
                  <div className="mt-2 flex space-x-2">
                    {notification.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        asChild={!!action.href}
                        className="h-8 text-xs"
                        onClick={(e) => handleActionClick(e, action)}
                      >
                        {action.href ? (
                          <a href={action.href}>{action.label}</a>
                        ) : (
                          action.label
                        )}
                      </Button>
                    ))}
                    
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-auto h-8 text-xs text-neutral-500"
                        onClick={() => onMarkAsRead?.(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
