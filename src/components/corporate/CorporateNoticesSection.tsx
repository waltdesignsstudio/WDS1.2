import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Pin,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Eye,
  X,
  FileText,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useAuth, NoticeItem } from '../../context/AuthContext';

export const CorporateNoticesSection: React.FC = () => {
  const { fetchNotices } = useAuth();

  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewingNotice, setViewingNotice] = useState<NoticeItem | null>(null);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const data = await fetchNotices();
      setNotices(data);
    } catch (err) {
      console.error('Failed to fetch corporate notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const filteredNotices = notices.filter((n) => {
    if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    }
    return true;
  });

  const getPriorityBadge = (p: NoticeItem['priority']) => {
    switch (p) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded text-[10px] font-bold">
            🔴 Critical Directive
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">
            🟡 High Priority
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-semibold">
            Standard Notice
          </span>
        );
    }
  };

  const getCategoryBadge = (c: NoticeItem['category']) => {
    switch (c) {
      case 'Urgent':
        return (
          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px] font-semibold">
            Urgent Directive
          </span>
        );
      case 'Sales Update':
        return (
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold">
            Sales & Revenue
          </span>
        );
      case 'Policy':
        return (
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[11px] font-semibold">
            Policy & Compliance
          </span>
        );
      case 'Holiday':
        return (
          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[11px] font-semibold">
            Holiday Calendar
          </span>
        );
      case 'Event':
        return (
          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-semibold">
            Corporate Event
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 rounded text-[11px] font-semibold">
            General
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-rose-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 border border-rose-400/30 rounded-full text-rose-300 text-xs font-semibold mb-2">
              <Megaphone className="w-3.5 h-3.5" />
              Corporate Communications
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Official Notice Board</h2>
            <p className="text-rose-200 text-sm mt-1 max-w-xl">
              Stay updated with the latest company announcements, commission structures, holiday schedules, and executive directives.
            </p>
          </div>
          <button
            onClick={loadNotices}
            disabled={loading}
            className="self-start sm:self-center flex items-center gap-2 px-4 py-2 bg-rose-700/60 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold border border-rose-500/40 transition-all shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Board
          </button>
        </div>

        {/* Quick info bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-rose-800/40 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-rose-900/30">
            <p className="text-slate-400 font-medium">Published Bulletins</p>
            <p className="text-xl font-bold text-white mt-1">{notices.length}</p>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-rose-900/30">
            <p className="text-slate-400 font-medium">Pinned Directives</p>
            <p className="text-xl font-bold text-amber-400 mt-1">
              {notices.filter((n) => n.isPinned).length}
            </p>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-rose-900/30">
            <p className="text-slate-400 font-medium">Access Permission</p>
            <p className="text-sm font-bold text-emerald-400 mt-1">View-Only Authorized</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notice board..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="General">General</option>
            <option value="Policy">Policy & Compliance</option>
            <option value="Sales">Sales Updates</option>
            <option value="Urgent">Urgent Directives</option>
            <option value="Holiday">Holiday Calendars</option>
            <option value="Event">Corporate Events</option>
          </select>
        </div>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-400">
          <RefreshCw className="w-7 h-7 mx-auto mb-2 animate-spin text-rose-600" />
          <p className="text-xs">Loading corporate notice board...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-400">
          <Megaphone className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No notices posted yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            When management publishes corporate updates or directives, they will be displayed here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotices.map((notice) => {
            const pubDate = new Date(notice.createdAt);
            const dateStr = pubDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={notice.id}
                onClick={() => setViewingNotice(notice)}
                className={`bg-white rounded-2xl p-5 shadow-sm border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                  notice.isPinned
                    ? 'border-amber-300 ring-2 ring-amber-100/80 bg-gradient-to-b from-amber-50/20 to-white'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      {notice.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded text-[10px] font-bold">
                          <Pin className="w-2.5 h-2.5" />
                          Pinned
                        </span>
                      )}
                      {getCategoryBadge(notice.category)}
                    </div>
                    {getPriorityBadge(notice.priority)}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{dateStr}</span>
                  <span className="text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
                    <Eye className="w-3.5 h-3.5" /> Read Notice
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reader Modal */}
      {viewingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                {getCategoryBadge(viewingNotice.category)}
                {getPriorityBadge(viewingNotice.priority)}
                {viewingNotice.isPinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded text-[10px] font-bold">
                    <Pin className="w-2.5 h-2.5" />
                    Pinned
                  </span>
                )}
              </div>
              <button
                onClick={() => setViewingNotice(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-3">
              {viewingNotice.title}
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-800 whitespace-pre-wrap leading-relaxed border border-slate-200 mb-4 font-sans">
              {viewingNotice.content}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Published by {viewingNotice.authorName}</span>
              <span>{new Date(viewingNotice.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingNotice(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
