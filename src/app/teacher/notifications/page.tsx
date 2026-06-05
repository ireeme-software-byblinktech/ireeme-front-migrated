"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useMe } from "@/features/auth/queries";
import { Bell, Check, CheckCheck, Trash2, Archive, Filter, BarChart3, ClipboardList, Clock, Heart, AlertTriangle, DollarSign, Info, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: "GRADE" | "ASSIGNMENT" | "ATTENDANCE" | "HEALTH" | "DISCIPLINE" | "FINANCE" | "GENERAL" | "MESSAGE";
  isRead: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const notificationTypeConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  GRADE: { color: "bg-blue-100 text-blue-700", icon: <BarChart3 size={20} />, label: "Grade" },
  ASSIGNMENT: { color: "bg-purple-100 text-purple-700", icon: <ClipboardList size={20} />, label: "Assignment" },
  ATTENDANCE: { color: "bg-green-100 text-green-700", icon: <Clock size={20} />, label: "Attendance" },
  HEALTH: { color: "bg-red-100 text-red-700", icon: <Heart size={20} />, label: "Health" },
  DISCIPLINE: { color: "bg-yellow-100 text-yellow-700", icon: <AlertTriangle size={20} />, label: "Discipline" },
  FINANCE: { color: "bg-orange-100 text-orange-700", icon: <DollarSign size={20} />, label: "Finance" },
  GENERAL: { color: "bg-gray-100 text-gray-700", icon: <Info size={20} />, label: "General" },
  MESSAGE: { color: "bg-cyan-100 text-cyan-700", icon: <MessageCircle size={20} />, label: "Message" },
};

const formatNotificationTime = (date: string): string => {
  const notifDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - notifDate.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSecs < 60) return "now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;

  return notifDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function TeacherNotificationsPage() {
  const { data: user } = useMe();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Fetch notifications
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["notifications", page],
    queryFn: () => apiClient<NotificationsResponse>(`/api/v1/notifications?page=${page}&limit=20`),
    enabled: !!user,
  });

  const notifications = response?.data || [];
  const filteredNotifications = notifications.filter((n) => {
    if (filterType && n.type !== filterType) return false;
    if (unreadOnly && n.isRead) return false;
    return true;
  });

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: () =>
      apiClient("/api/v1/notifications/read-all", {
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"], refetchType: "all" });
    },
  });

  // Mark one as read mutation
  const markOneReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      apiClient(`/api/v1/notifications/${notificationId}/read`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"], refetchType: "all" });
    },
  });

  const handleMarkAsRead = (notificationId: string) => {
    markOneReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllReadMutation.mutate();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const types = Array.from(new Set(notifications.map((n) => n.type)));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-black rounded-lg">
                <Bell size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-500 text-sm mt-1">Stay updated with your activities</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  {unreadCount} unread
                </span>
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markAllReadMutation.isPending}
                  className="p-2.5 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  title="Mark all as read"
                >
                  <CheckCheck size={20} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Unread Filter */}
            <button
              onClick={() => setUnreadOnly(!unreadOnly)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                unreadOnly
                  ? "bg-black text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              )}
            >
              <Filter size={16} />
              {unreadOnly ? "Unread" : "All"}
            </button>

            {/* Type Filters */}
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(filterType === type ? null : type)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  filterType === type
                    ? "bg-black text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                )}
              >
                <div className={filterType === type ? "text-white" : "text-gray-600"}>
                  {notificationTypeConfig[type]?.icon}
                </div>
                {notificationTypeConfig[type]?.label || type}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block p-3 bg-gray-200 rounded-full animate-spin mb-4">
                <div className="w-6 h-6 bg-white rounded-full" />
              </div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                <Bell size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {filterType || unreadOnly
                  ? "No notifications match your filters"
                  : "You're all caught up! Check back later."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const config = notificationTypeConfig[notification.type] || notificationTypeConfig.GENERAL;
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "bg-white rounded-lg p-4 border-l-4 transition-all hover:shadow-md",
                    notification.isRead
                      ? "border-gray-200 opacity-75"
                      : "border-black bg-gradient-to-r from-white to-gray-50 shadow-sm"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn("p-2.5 rounded-lg text-lg shrink-0", config.color)}>
                      {config.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={cn("font-semibold text-gray-900", !notification.isRead && "font-bold")}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500 shrink-0 whitespace-nowrap">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{notification.body}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={cn("px-2 py-1 rounded text-xs font-medium", config.color)}>
                          {config.label}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markOneReadMutation.isPending}
                        className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                        title="Mark as read"
                      >
                        <Check size={18} className="text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {response && response.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {page} of {response.totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(response.totalPages, page + 1))}
              disabled={page === response.totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
