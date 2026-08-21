import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Eye,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  X,
  User,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { useAuth, NotificationItem } from '../../context/AuthContext';

export const CorporateNotificationsSection: React.FC = () => {
  const { fetchEmployeeNotifications, markNotificationAsRead } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'urgent' | 'tasks'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingNotification, setReadingNotification] = useState<NotificationItem | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployeeNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load employee notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string, currentlyRead: boolean) => {
    if (currentlyRead) return;
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
      );
    } catch (err) {
      console.error('Mark read failed:', err);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;

    try {
      await Promise.all(unread.map((n) => markNotificationAsRead(n.id)));
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filterType === 'unread' && notif.isRead) return false;
    if (filterType === 'urgent' && notif.priority === 'normal') return false;
    if (filterType === 'tasks' && notif.type !== 'task' && notif.type !== 'milestone') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        notif.title.toLowerCase().includes(q) ||
        notif.message.toLowerCase().includes(q) ||
        notif.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getPriorityBadge = (p: NotificationItem['priority']) => {
    switch (p) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded text-[10px] font-bold">
            🔴 Urgent
          </span>
        );
      case 'important':
        return (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">
            🟡 Important
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-semibold">
            Standard
          </span>
        );
    }
  };

  const getTypeBadge = (t: NotificationItem['type']) => {
    switch (t) {
      case 'task':
        return (
          <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium border border-purple-100">
            Task Assignment
          </span>
        );
      case 'milestone':
        return (
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-100">
            Target Milestone
          </span>
        );
      case 'appreciation':
        return (
          <span className="text-[11px] text-pink-700 bg-pink-50 px-2 py-0.5 rounded font-medium border border-pink-100">
            Recognition & Appreciation
          </span>
        );
      case 'warning':
        return (
          <span className="text-[11px] text-orange-700 bg-orange-50 px-2 py-0.5 rounded font-medium border border-orange-100">
            Policy Notice
          </span>
        );
      default:
        return (
          <span className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-medium border border-slate-200">
            General
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-xs font-semibold mb-2">
              <Bell className="w-3.5 h-3.5" />
              Inbox & Alerts
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Personalized Notifications</h2>
            <p className="text-purple-200 text-sm mt-1 max-w-xl">
              Direct notifications, assigned sales duties, quota updates, and executive announcements sent directly to your corporate account.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow transition-all"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All as Read ({unreadCount})
              </button>
            )}
            <button
              onClick={loadNotifications}
              disabled={loading}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-600 shadow"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-purple-800/40 text-xs">
          <div className="bg-purple-950/50 p-3 rounded-xl border border-purple-800/30">
            <p className="text-purple-300 font-medium">Total Received</p>
            <p className="text-xl font-bold text-white mt-1">{notifications.length}</p>
          </div>
          <div className="bg-purple-950/50 p-3 rounded-xl border border-purple-800/30">
            <p className="text-purple-300 font-medium">Unread Messages</p>
            <p className="text-xl font-bold text-amber-400 mt-1">{unreadCount}</p>
          </div>
          <div className="bg-purple-950/50 p-3 rounded-xl border border-purple-800/30">
            <p className="text-purple-300 font-medium">Read & Acknowledged</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {notifications.filter((n) => n.isRead).length}
            </p>
          </div>
          <div className="bg-purple-950/50 p-3 rounded-xl border border-purple-800/30">
            <p className="text-purple-300 font-medium">High Priority / Urgent</p>
            <p className="text-xl font-bold text-rose-400 mt-1">
              {notifications.filter((n) => n.priority !== 'normal').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search your notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
          />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'unread'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilterType('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'urgent'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Urgent / High
          </button>
          <button
            onClick={() => setFilterType('tasks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'tasks'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tasks & Milestones
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-7 h-7 mx-auto mb-2 animate-spin text-purple-600" />
            <p className="text-xs">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No notifications found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You are all caught up! When administration sends you a directive, task, or recognition, it will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notif) => {
              const sentDate = new Date(notif.createdAt);
              const formattedTime = sentDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    handleMarkAsRead(notif.id, notif.isRead);
                    setReadingNotification(notif);
                  }}
                  className={`p-4 transition-all cursor-pointer flex flex-col gap-2 ${
                    !notif.isRead
                      ? 'bg-purple-50/40 hover:bg-purple-50/80 border-l-4 border-l-purple-600'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 flex-1">
                      {/* Unread indicator dot */}
                      {!notif.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0 mt-1.5 animate-pulse" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          {getPriorityBadge(notif.priority)}
                          {getTypeBadge(notif.type)}
                        </div>

                        <h3 className={`text-xs text-slate-900 ${!notif.isRead ? 'font-bold' : 'font-semibold'}`}>
                          {notif.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed whitespace-pre-wrap">
                          {notif.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {notif.isRead ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          <CheckCheck className="w-3 h-3 text-slate-400" />
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          New
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">{formattedTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {readingNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                {getPriorityBadge(readingNotification.priority)}
                {getTypeBadge(readingNotification.type)}
              </div>
              <button
                onClick={() => setReadingNotification(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-3">
              {readingNotification.title}
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-800 whitespace-pre-wrap leading-relaxed border border-slate-200 mb-4 font-sans">
              {readingNotification.message}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Dispatched by Admin Team</span>
              <span>{new Date(readingNotification.createdAt).toLocaleString()}</span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setReadingNotification(null)}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                Close Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
