import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Users,
  CheckCheck,
  Eye,
} from 'lucide-react';
import { useAuth, NotificationItem, UserProfile } from '../../context/AuthContext';

export const AdminNotificationsSection: React.FC = () => {
  const {
    fetchAllCorporateUsers,
    sendNotification,
    fetchAdminNotifications,
    deleteNotification,
  } = useAuth();

  const [corporateList, setCorporateList] = useState<UserProfile[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Form State
  const [selectedRecipientUid, setSelectedRecipientUid] = useState<string>('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [type, setType] = useState<'general' | 'task' | 'milestone' | 'warning' | 'appreciation'>('general');
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRecipient, setFilterRecipient] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // all, read, unread
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [users, notifs] = await Promise.all([
        fetchAllCorporateUsers(),
        fetchAdminNotifications(),
      ]);
      setCorporateList(users);
      setNotifications(notifs);
    } catch (err) {
      console.error('Failed to load notifications data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!selectedRecipientUid) {
      setFormFeedback({ type: 'error', message: 'Please select an employee recipient or All Staff.' });
      return;
    }

    if (!title.trim()) {
      setFormFeedback({ type: 'error', message: 'Please provide a notification title.' });
      return;
    }

    if (!message.trim()) {
      setFormFeedback({ type: 'error', message: 'Please enter the notification message body.' });
      return;
    }

    let recipientName = 'All Corporate Employees';
    let recipientCode = 'BROADCAST';

    if (selectedRecipientUid !== 'all') {
      const selectedUser = corporateList.find((u) => u.uid === selectedRecipientUid);
      if (selectedUser) {
        recipientName = selectedUser.name;
        recipientCode = selectedUser.corporateUserId || '';
      }
    }

    setSending(true);
    try {
      const res = await sendNotification({
        recipientUid: selectedRecipientUid,
        recipientName,
        recipientCode,
        title: title.trim(),
        message: message.trim(),
        priority,
        type,
      });

      if (res.success) {
        setFormFeedback({ type: 'success', message: `Notification successfully sent to ${recipientName}!` });
        setTitle('');
        setMessage('');
        setPriority('normal');
        setType('general');
        // Refresh sent notifications list
        const updated = await fetchAdminNotifications();
        setNotifications(updated);
      } else {
        setFormFeedback({ type: 'error', message: res.error || 'Failed to dispatch notification.' });
      }
    } catch (err: any) {
      setFormFeedback({ type: 'error', message: err?.message || 'Failed to dispatch notification.' });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    setDeletingId(id);
    try {
      const res = await deleteNotification(id);
      if (res.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error('Delete notification failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filterRecipient !== 'all') {
      if (notif.recipientUid !== filterRecipient) return false;
    }
    if (filterPriority !== 'all') {
      if (notif.priority !== filterPriority) return false;
    }
    if (filterStatus !== 'all') {
      if (filterStatus === 'read' && !notif.isRead) return false;
      if (filterStatus === 'unread' && notif.isRead) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = notif.title.toLowerCase().includes(q);
      const matchMsg = notif.message.toLowerCase().includes(q);
      const matchRecip = notif.recipientName.toLowerCase().includes(q);
      const matchCode = (notif.recipientCode || '').toLowerCase().includes(q);
      return matchTitle || matchMsg || matchRecip || matchCode;
    }
    return true;
  });

  const getPriorityBadge = (p: NotificationItem['priority']) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded text-[10px] font-bold">Urgent</span>;
      case 'important':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">Important</span>;
      default:
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded text-[10px] font-bold">Normal</span>;
    }
  };

  const getTypeBadge = (t: NotificationItem['type']) => {
    switch (t) {
      case 'task':
        return <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium border border-purple-100">Task</span>;
      case 'milestone':
        return <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-100">Milestone</span>;
      case 'appreciation':
        return <span className="text-[11px] text-pink-700 bg-pink-50 px-2 py-0.5 rounded font-medium border border-pink-100">Appreciation</span>;
      case 'warning':
        return <span className="text-[11px] text-orange-700 bg-orange-50 px-2 py-0.5 rounded font-medium border border-orange-100">Warning</span>;
      default:
        return <span className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-medium border border-slate-200">General</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-purple-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-xs font-semibold mb-2">
              <Bell className="w-3.5 h-3.5" />
              Direct Staff Dispatch
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Employee Notifications Center</h2>
            <p className="text-purple-200 text-sm mt-1 max-w-xl">
              Send direct targeted instructions, urgent tasks, or appreciation alerts to registered employees and track their live read/unread status.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="self-start sm:self-center flex items-center gap-2 px-4 py-2 bg-purple-700/60 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold border border-purple-500/40 transition-all shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-purple-800/40 text-xs">
          <div className="bg-purple-950/50 p-3 rounded-xl border border-purple-800/30">
            <p className="text-purple-300 font-medium">Total Sent</p>
            <p className="text-xl font-bold text-white mt-1">{notifications.length}</p>
          </div>
          <div className="bg-purple-950/50 p-3 rounded-xl border border-purple-800/30">
            <p className="text-purple-300 font-medium">Read by Staff</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {notifications.filter((n) => n.isRead).length}
            </p>
          </div>
          <div className="bg-purple-950/50 p-3 rounded-xl border border-purple-800/30">
            <p className="text-purple-300 font-medium">Pending Unread</p>
            <p className="text-xl font-bold text-amber-400 mt-1">
              {notifications.filter((n) => !n.isRead).length}
            </p>
          </div>
          <div className="bg-purple-950/50 p-3 rounded-xl border border-purple-800/30">
            <p className="text-purple-300 font-medium">Active Staff Recipients</p>
            <p className="text-xl font-bold text-purple-200 mt-1">{corporateList.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Compose Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Compose New Notification</h3>
                <p className="text-xs text-slate-400">Target a registered corporate team member</p>
              </div>
            </div>

            {formFeedback && (
              <div
                className={`p-3 rounded-xl text-xs mb-4 flex items-start gap-2 border ${
                  formFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                {formFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                )}
                <span>{formFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
              {/* Recipient Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Select Recipient Employee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedRecipientUid}
                    onChange={(e) => setSelectedRecipientUid(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="">-- Choose Employee --</option>
                    <option value="all">📢 All Corporate Staff (Broadcast Notice)</option>
                    {corporateList.map((emp) => (
                      <option key={emp.uid} value={emp.uid}>
                        {emp.name} ({emp.corporateUserId || 'WDS Staff'}) - {emp.corporateRole || 'Sales'} [{emp.location || 'Pan-India'}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 font-medium"
                  >
                    <option value="normal">🔵 Normal</option>
                    <option value="important">🟡 Important</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Notification Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 font-medium"
                  >
                    <option value="general">General Notice</option>
                    <option value="task">Task Assignment</option>
                    <option value="milestone">Target / Milestone</option>
                    <option value="appreciation">Appreciation & Reward</option>
                    <option value="warning">Policy Alert / Warning</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Notification Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Client demo scheduled for 3:00 PM"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Message Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Type clear instructions or updates for this team member..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 resize-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Dispatching Notification...' : 'Send Notification'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Sent Notifications Log (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search sent notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Read States</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="important">Important</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>

          {/* List of Sent Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800">
                Dispatched Notifications ({filteredNotifications.length})
              </h3>
              <span className="text-[11px] text-slate-400">Live Status Tracking</span>
            </div>

            {loading ? (
              <div className="p-10 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-purple-600" />
                <p className="text-xs">Loading sent notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-10 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No notifications found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Compose your first notification on the left to reach corporate employees.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredNotifications.map((notif) => {
                  const sentDate = new Date(notif.createdAt);
                  const formattedTimeStr = sentDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={notif.id}
                      className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {getPriorityBadge(notif.priority)}
                          {getTypeBadge(notif.type)}
                          <span className="text-[11px] font-bold text-slate-800">
                            {notif.title}
                          </span>
                        </div>

                        {/* Read/Unread badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          {notif.isRead ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCheck className="w-3 h-3 text-emerald-600" />
                              Read
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Unread
                            </span>
                          )}

                          <button
                            onClick={() => handleDelete(notif.id)}
                            disabled={deletingId === notif.id}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-50">
                        <span className="font-medium text-slate-600">
                          Recipient: <strong className="text-purple-900">{notif.recipientName}</strong>{' '}
                          {notif.recipientCode && `(${notif.recipientCode})`}
                        </span>
                        <span>Sent {formattedTimeStr}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
