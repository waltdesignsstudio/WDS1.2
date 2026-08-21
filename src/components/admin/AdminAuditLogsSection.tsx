import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Filter,
  RefreshCw,
  Download,
  Calendar,
  User,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Target,
  Megaphone,
  Bell,
  Trophy,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  FileText,
} from 'lucide-react';
import { useAuth, AuditLogItem } from '../../context/AuthContext';

export const AdminAuditLogsSection: React.FC = () => {
  const { fetchAuditLogs } = useAuth();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const getActionBadge = (actionType: AuditLogItem['actionType']) => {
    switch (actionType) {
      case 'salary_update':
        return {
          label: 'Salary & Milestones',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: DollarSign,
        };
      case 'attendance_status':
        return {
          label: 'Attendance Decision',
          bg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          icon: CheckCircle2,
        };
      case 'user_register':
        return {
          label: 'Staff Registration',
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: UserPlus,
        };
      case 'expected_data_create':
      case 'expected_data_delete':
        return {
          label: actionType === 'expected_data_create' ? 'Expected Lead Added' : 'Expected Lead Deleted',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Target,
        };
      case 'daily_report_create':
      case 'daily_report_delete':
      case 'daily_report_status':
        return {
          label: 'Daily Report Lead',
          bg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
          icon: FileSpreadsheet,
        };
      case 'notice_publish':
      case 'notice_edit':
      case 'notice_delete':
        return {
          label: 'Corporate Notice',
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: Megaphone,
        };
      case 'notification_send':
      case 'notification_delete':
        return {
          label: 'Staff Notification',
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Bell,
        };
      case 'leaderboard_create':
      case 'leaderboard_update':
      case 'leaderboard_delete':
      case 'leaderboard_sync':
        return {
          label: 'Leaderboard Update',
          bg: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: Trophy,
        };
      default:
        return {
          label: 'Administrative Action',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: Layers,
        };
    }
  };

  const filteredLogs = logs.filter((log) => {
    // Action Type filter
    if (actionFilter !== 'all') {
      if (actionFilter === 'salary' && log.actionType !== 'salary_update') return false;
      if (actionFilter === 'attendance' && log.actionType !== 'attendance_status') return false;
      if (actionFilter === 'users' && log.actionType !== 'user_register') return false;
      if (actionFilter === 'expected' && !log.actionType.startsWith('expected_data')) return false;
      if (actionFilter === 'reports' && !log.actionType.startsWith('daily_report')) return false;
      if (actionFilter === 'notices' && !log.actionType.startsWith('notice')) return false;
      if (actionFilter === 'notifications' && !log.actionType.startsWith('notification')) return false;
      if (actionFilter === 'leaderboard' && !log.actionType.startsWith('leaderboard')) return false;
    }

    // Entity filter
    if (entityFilter !== 'all' && log.entityType !== entityFilter) {
      return false;
    }

    // Time filter
    if (timeFilter !== 'all') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      if (timeFilter === 'today') {
        if (logDate.toDateString() !== now.toDateString()) return false;
      } else if (timeFilter === '7days') {
        const diffDays = (now.getTime() - logDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      } else if (timeFilter === '30days') {
        const diffDays = (now.getTime() - logDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 30) return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAdmin = log.adminName.toLowerCase().includes(q) || log.adminEmail.toLowerCase().includes(q);
      const matchTarget = (log.targetName || '').toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchAction = log.actionType.toLowerCase().includes(q);
      return matchAdmin || matchTarget || matchDetails || matchAction;
    }

    return true;
  });

  // Calculate Metrics
  const totalLogs = logs.length;
  const salaryEdits = logs.filter((l) => l.actionType === 'salary_update').length;
  const attendanceEdits = logs.filter((l) => l.actionType === 'attendance_status').length;
  const noticeAndNotifs = logs.filter((l) => l.actionType.startsWith('notice') || l.actionType.startsWith('notification')).length;
  const leadsActions = logs.filter((l) => l.actionType.startsWith('expected') || l.actionType.startsWith('daily_report')).length;

  const exportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Timestamp', 'Admin Name', 'Admin Email', 'Action Type', 'Entity', 'Target Name', 'Details'];
    const rows = filteredLogs.map((l) => [
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.adminName.replace(/"/g, '""')}"`,
      `"${l.adminEmail.replace(/"/g, '""')}"`,
      `"${l.actionType}"`,
      `"${l.entityType}"`,
      `"${(l.targetName || '').replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WDS_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-slate-700/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5" />
              Enterprise Transparency & Governance
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Administrative Audit Log System</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Chronological, tamper-evident ledger recording all high-impact actions made by system administrators, including salary/earnings edits, attendance approvals, lead assignments, and corporate broadcasts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              disabled={filteredLogs.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg transition-all"
              title="Download CSV report"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={loadLogs}
              disabled={loading}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-600 shadow transition-all"
              title="Refresh logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-700/60 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 font-medium">Total Audit Events</p>
            <p className="text-xl font-bold text-white mt-1">{totalLogs}</p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 font-medium">Salary & Quotas</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">{salaryEdits}</p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 font-medium">Attendance Decisions</p>
            <p className="text-xl font-bold text-indigo-400 mt-1">{attendanceEdits}</p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 font-medium">Notices & Notifs</p>
            <p className="text-xl font-bold text-rose-400 mt-1">{noticeAndNotifs}</p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 font-medium">Leads & Reports</p>
            <p className="text-xl font-bold text-amber-400 mt-1">{leadsActions}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center gap-3 justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by admin name, employee target, or action keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        {/* Action Type Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Action Categories</option>
              <option value="salary">Salary & Milestone Edits</option>
              <option value="attendance">Attendance Approvals/Rejections</option>
              <option value="users">Staff Registrations</option>
              <option value="expected">Expected Lead Records</option>
              <option value="reports">Daily Report Records</option>
              <option value="notices">Corporate Notices</option>
              <option value="notifications">Direct Notifications</option>
              <option value="leaderboard">Leaderboard Updates</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Past 7 Days</option>
              <option value="30days">Past 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Audit Trail Entries ({filteredLogs.length})
            </h3>
          </div>
          {filteredLogs.length < logs.length && (
            <span className="text-xs text-slate-400">
              Filtered from {logs.length} total entries
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-7 h-7 mx-auto mb-2 animate-spin text-indigo-500" />
            <p className="text-sm">Fetching secure audit records from Firestore...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No audit logs matching criteria</p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Any admin actions such as salary updates, attendance status approvals, notice postings, and lead assignments will be automatically recorded here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const badge = getActionBadge(log.actionType);
              const BadgeIcon = badge.icon;
              const isExpanded = expandedLogId === log.id;
              const dateObj = new Date(log.timestamp);
              const formattedDateStr = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const formattedTimeStr = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              });

              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Icon */}
                      <div className={`p-2 rounded-xl border shrink-0 ${badge.bg}`}>
                        <BadgeIcon className="w-4 h-4" />
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            Entity: {log.entityType}
                          </span>
                          {log.targetName && (
                            <span className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-medium truncate max-w-[200px]">
                              Target: {log.targetName}
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                          {log.details}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-500">
                          <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                            <User className="w-3 h-3 text-slate-400" />
                            Admin: <strong className="text-slate-700">{log.adminName}</strong> ({log.adminEmail})
                          </span>
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {formattedDateStr} at {formattedTimeStr}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expand metadata toggle if metadata exists */}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="self-start sm:self-center flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                      >
                        <span>{isExpanded ? 'Hide Payload' : 'Inspect Payload'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>

                  {/* Expanded JSON details */}
                  {isExpanded && log.metadata && (
                    <div className="mt-3 p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto shadow-inner border border-slate-800">
                      <div className="text-slate-400 font-sans text-[10px] uppercase font-bold mb-1">
                        Raw Action Metadata Payload
                      </div>
                      <pre>{JSON.stringify(log.metadata, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
