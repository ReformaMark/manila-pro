"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Bell,
  Download,
  UserPlus,
  Trash2,
  Check,
  X,
  LogIn,
  FileText,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";

export function AdminNotificationBell() {
  const [lastChecked, setLastChecked] = useState<number>(Date.now());
  const [isOpen, setIsOpen] = useState(false);

  const recentActivities = useQuery(api.admin_activity.getRecentActivities, {
    limit: 50,
  });
  const unreadCount = useQuery(api.admin_activity.getUnreadActivityCount, {
    since: lastChecked,
  });
  const stats = useQuery(api.admin_activity.getActivityStats);

  // Mark notifications as read when popover opens
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setLastChecked(Date.now());
      // Store in localStorage for persistence
      localStorage.setItem("lastCheckedNotifications", Date.now().toString());
    }
  };

  // Load last checked time on mount
  useEffect(() => {
    const stored = localStorage.getItem("lastCheckedNotifications");
    if (stored) {
      setLastChecked(parseInt(stored));
    }
  }, []);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "export":
        return <Download className="h-4 w-4 text-green-600" />;
      case "create":
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case "approve":
        return <Check className="h-4 w-4 text-green-600" />;
      case "reject":
        return <X className="h-4 w-4 text-red-600" />;
      case "login":
        return <LogIn className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case "export":
        return "bg-green-100 dark:bg-green-900/20";
      case "create":
        return "bg-blue-100 dark:bg-blue-900/20";
      case "delete":
        return "bg-red-100 dark:bg-red-900/20";
      case "approve":
        return "bg-green-100 dark:bg-green-900/20";
      case "reject":
        return "bg-red-100 dark:bg-red-900/20";
      case "login":
        return "bg-purple-100 dark:bg-purple-900/20";
      default:
        return "bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const filterByType = (type?: string) => {
    if (!recentActivities) return [];
    if (!type) return recentActivities;
    return recentActivities.filter((activity) => activity.actionType === type);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white hover:text-white/80 hover:bg-white/10"
        >
          <Bell className="h-5 w-5" />
          {(unreadCount ?? 0) > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {(unreadCount ?? 0) > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Admin Activity Log</h3>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>Today: {stats?.today ?? 0}</span>
            <span>•</span>
            <span>Week: {stats?.thisWeek ?? 0}</span>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
            <TabsTrigger value="all" className="text-xs">
              All
              <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                {recentActivities?.length ?? 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="export" className="text-xs">
              <Download className="h-3 w-3" />
            </TabsTrigger>
            <TabsTrigger value="create" className="text-xs">
              <UserPlus className="h-3 w-3" />
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px]">
            {/* All Activities */}
            <TabsContent value="all" className="m-0">
              <div className="divide-y">
                {!recentActivities ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    Loading activities...
                  </div>
                ) : recentActivities.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No recent activity
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity._id}
                      className={`p-3 hover:bg-muted/5 transition-colors ${
                        activity.timestamp > lastChecked
                          ? "bg-blue-50 dark:bg-blue-950/20"
                          : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`p-2 rounded-lg h-fit ${getActionColor(activity.actionType)}`}
                        >
                          {getActionIcon(activity.actionType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight text-foreground">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">
                              by {activity.adminName}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(activity.timestamp, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                          {activity.metadata?.reportType && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {activity.metadata.reportType}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Export Activities */}
            <TabsContent value="export" className="m-0">
              <div className="divide-y">
                {filterByType("export").length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No export activity
                  </div>
                ) : (
                  filterByType("export").map((activity) => (
                    <div key={activity._id} className="p-3 hover:bg-muted/5">
                      <div className="flex gap-3">
                        <div
                          className={`p-2 rounded-lg h-fit ${getActionColor(activity.actionType)}`}
                        >
                          {getActionIcon(activity.actionType)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(activity.timestamp, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Create Activities */}
            <TabsContent value="create" className="m-0">
              <div className="divide-y">
                {filterByType("create").length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No create activity
                  </div>
                ) : (
                  filterByType("create").map((activity) => (
                    <div key={activity._id} className="p-3 hover:bg-muted/5">
                      <div className="flex gap-3">
                        <div
                          className={`p-2 rounded-lg h-fit ${getActionColor(activity.actionType)}`}
                        >
                          {getActionIcon(activity.actionType)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(activity.timestamp, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
