import { useState } from 'react';
import { Bell, FileText, UserCheck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'document' | 'agent' | 'alert' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'document',
    title: 'Document Approved',
    message: 'Your E&O Insurance Policy has been verified',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'agent',
    title: 'New Agent Onboarded',
    message: 'Sarah Johnson completed onboarding',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'alert',
    title: 'License Expiring Soon',
    message: 'Agent Mike Davis license expires in 30 days',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '4',
    type: 'success',
    title: 'Compliance Check Passed',
    message: 'Quarterly compliance review completed',
    time: '1 day ago',
    read: true,
  },
  {
    id: '5',
    type: 'document',
    title: 'Document Pending Review',
    message: 'Background check requires attention',
    time: '2 days ago',
    read: true,
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'document':
      return <FileText className="w-4 h-4" />;
    case 'agent':
      return <UserCheck className="w-4 h-4" />;
    case 'alert':
      return <AlertTriangle className="w-4 h-4" />;
    case 'success':
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'document':
      return 'bg-primary/10 text-primary';
    case 'agent':
      return 'bg-chart-2/10 text-chart-2';
    case 'alert':
      return 'bg-destructive/10 text-destructive';
    case 'success':
      return 'bg-chart-1/10 text-chart-1';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 bg-popover">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[320px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    'w-full flex gap-3 p-4 text-left transition-colors hover:bg-accent/50',
                    !notification.read && 'bg-accent/30'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      getNotificationColor(notification.type)
                    )}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn(
                        'text-sm truncate',
                        !notification.read ? 'font-semibold text-foreground' : 'font-medium text-foreground'
                      )}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{notification.time}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t">
          <Button variant="ghost" className="w-full text-sm text-muted-foreground hover:text-foreground">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
