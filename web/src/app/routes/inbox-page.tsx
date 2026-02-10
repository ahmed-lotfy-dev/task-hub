import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Check,
  CheckCheck,
  MessageSquare,
  UserPlus,
  Layout,
  Clock,
  Inbox,
  ArrowRight
} from 'lucide-react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export function InboxPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-muted rounded-full"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground mt-1">
            You have {unreadCount} unread notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-muted p-1 rounded-lg flex items-center">
            <Button
              variant={filter === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className="text-xs"
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className="text-xs"
            >
              Unread
            </Button>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Card className="min-h-[600px] flex flex-col overflow-hidden border-border/50 shadow-sm">
        {filteredNotifications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">All caught up!</h3>
            <p className="max-w-xs mt-2">
              {filter === 'unread'
                ? "You don't have any unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border/40">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "group flex items-start gap-4 p-5 hover:bg-muted/30 transition-colors relative",
                    !notification.isRead && "bg-blue-50/40 dark:bg-blue-900/10"
                  )}
                >
                  {/* Status Indicator */}
                  {!notification.isRead && (
                    <span className="absolute left-0 top-6 w-1 h-8 bg-blue-500 rounded-r-full" />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    "shrink-0 w-10 h-10 rounded-full flex items-center justify-center border",
                    notification.activity.action === 'assign' ? "bg-amber-100 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800" :
                      notification.activity.action === 'comment' ? "bg-blue-100 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800" :
                        "bg-gray-100 border-gray-200 text-gray-600"
                  )}>
                    {notification.activity.action === 'assign' && <UserPlus className="h-5 w-5" />}
                    {notification.activity.action === 'comment' && <MessageSquare className="h-5 w-5" />}
                    {notification.activity.action === 'create' && <Layout className="h-5 w-5" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          <span className="font-semibold">{notification.activity.actor?.name || 'Someone'}</span>
                          {' '}
                          <span className="font-normal text-muted-foreground">
                            {notification.activity.action === 'comment' ? 'commented on' : 'assigned you to'}
                          </span>
                          {' '}
                          <span className="font-medium text-primary">
                            {notification.activity.entityType === 'card' ? 'task' : notification.activity.entityType}
                          </span>
                        </p>

                        {/* Deep Linking Logic */}
                        {(notification.activity.boardId && (notification.activity.entityType === 'card' || notification.activity.entityType === 'comment')) ? (
                          <Link
                            to={`/board/${notification.activity.boardId}?cardId=${notification.activity.entityType === 'card'
                                ? notification.activity.entityId
                                : notification.activity.metadata?.cardId}`}
                            className="block group-hover:text-primary transition-colors"
                          >
                            <p className="text-base font-medium text-foreground/90 flex items-center gap-2">
                              {notification.activity.entityName || 'Untitled Item'}
                              <ArrowRight className="h-3 w-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all text-muted-foreground" />
                            </p>
                          </Link>
                        ) : (
                          <p className="text-base font-medium text-foreground/90">
                            {notification.activity.entityName || 'Untitled Item'}
                          </p>
                        )}

                        {notification.activity.action === 'comment' && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 bg-muted/40 p-2 rounded-md border border-border/40 italic">
                            "{notification.activity.entityType === 'comment' ? notification.activity.entityName : 'New comment'}"
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4 text-primary" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}
