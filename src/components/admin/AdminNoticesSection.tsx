import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Pin,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  X,
  FileText,
} from 'lucide-react';
import { useAuth, NoticeItem, CreateNoticePayload } from '../../context/AuthContext';

export const AdminNoticesSection: React.FC = () => {
  const { createNotice, fetchNotices, updateNotice, deleteNotice } = useAuth();

  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Create Modal / Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CreateNoticePayload['category']>('General');
  const [priority, setPriority] = useState<CreateNoticePayload['priority']>('normal');
  const [isPinned, setIsPinned] = useState(false);
  const [validUntil, setValidUntil] = useState('');

  // Edit Modal State
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState<CreateNoticePayload['category']>('General');
  const [editPriority, setEditPriority] = useState<CreateNoticePayload['priority']>('normal');
  const [editIsPinned, setEditIsPinned] = useState(false);
  const [editValidUntil, setEditValidUntil] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // View reader modal
  const [viewingNotice, setViewingNotice] = useState<NoticeItem | null>(null);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const data = await fetchNotices();
      setNotices(data);
    } catch (err) {
      console.error('Failed to fetch notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!title.trim() || !content.trim()) {
      setFormFeedback({ type: 'error', message: 'Please provide both notice title and announcement details.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createNotice({
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        isPinned,
        validUntil: validUntil || undefined,
      });

      if (res.success) {
        setShowCreateModal(false);
        setTitle('');
        setContent('');
        setCategory('General');
        setPriority('normal');
        setIsPinned(false);
        setValidUntil('');
        await loadNotices();
      } else {
        setFormFeedback({ type: 'error', message: res.error || 'Failed to publish notice.' });
      }
    } catch (err: any) {
      setFormFeedback({ type: 'error', message: err?.message || 'Failed to publish notice.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (notice: NoticeItem) => {
    setEditingNotice(notice);
    setEditTitle(notice.title);
    setEditContent(notice.content);
    setEditCategory(notice.category);
    setEditPriority(notice.priority);
    setEditIsPinned(notice.isPinned || false);
    setEditValidUntil(notice.validUntil || '');
  };

  const handleUpdateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;

    if (!editTitle.trim() || !editContent.trim()) {
      alert('Please provide both notice title and details.');
      return;
    }

    setIsEditing(true);
    try {
      const res = await updateNotice(editingNotice.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
        category: editCategory,
        priority: editPriority,
        isPinned: editIsPinned,
        validUntil: editValidUntil || undefined,
      });

      if (res.success) {
        setEditingNotice(null);
        await loadNotices();
      } else {
        alert(res.error || 'Failed to update notice.');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update notice.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async (id: string, noticeTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete notice "${noticeTitle}"?`)) return;
    try {
      const res = await deleteNotice(id);
      if (res.success) {
        setNotices((prev) => prev.filter((n) => n.id !== id));
      } else {
        alert(res.error || 'Failed to delete notice.');
      }
    } catch (err) {
      console.error('Delete notice error:', err);
    }
  };

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
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 rounded text-[10px] font-bold">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded text-[10px] font-bold">High Priority</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-bold">Standard</span>;
    }
  };

  const getCategoryBadge = (c: NoticeItem['category']) => {
    switch (c) {
      case 'Urgent':
        return <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px] font-semibold">Urgent</span>;
      case 'Sales Update':
        return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold">Sales Update</span>;
      case 'Policy':
        return <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[11px] font-semibold">Policy & Compliance</span>;
      case 'Holiday':
        return <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[11px] font-semibold">Holiday Calendar</span>;
      case 'Event':
        return <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-semibold">Corporate Event</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-50 text-slate-700 border border-slate-200 rounded text-[11px] font-semibold">General</span>;
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
            <h2 className="text-2xl font-bold tracking-tight">Corporate Notice Board</h2>
            <p className="text-rose-200 text-sm mt-1 max-w-xl">
              Publish official announcements, corporate directives, policy changes, and event updates instantly visible to all registered employees.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFormFeedback(null);
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Publish Notice
            </button>
            <button
              onClick={loadNotices}
              disabled={loading}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-600 transition-all shadow"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notices by keyword or title..."
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

      {/* Notices Grid / Cards */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-400">
          <RefreshCw className="w-7 h-7 mx-auto mb-2 animate-spin text-rose-600" />
          <p className="text-xs">Loading corporate notices...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-400">
          <Megaphone className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No notices found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click "Publish Notice" above to broadcast company announcements to all employees.
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
                className={`bg-white rounded-2xl p-5 shadow-sm border transition-all flex flex-col justify-between ${
                  notice.isPinned
                    ? 'border-amber-300 ring-2 ring-amber-100/80 bg-gradient-to-b from-amber-50/20 to-white'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top tags */}
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

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {notice.title}
                  </h3>

                  {/* Preview content */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                    {notice.content}
                  </p>
                </div>

                {/* Footer and Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{dateStr}</span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingNotice(notice)}
                      className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View full notice"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(notice)}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit notice"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(notice.id, notice.title)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Publish Notice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Publish New Corporate Notice</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
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

            <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notice Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Annual Sales Incentive Scheme & Quarter Milestones"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 font-medium"
                  >
                    <option value="General">General</option>
                    <option value="Policy">Policy & Compliance</option>
                    <option value="Sales">Sales Directive</option>
                    <option value="Urgent">Urgent Directive</option>
                    <option value="Holiday">Holiday Notice</option>
                    <option value="Event">Event Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 font-medium"
                  >
                    <option value="normal">Standard</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Valid Until (Optional)</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                    />
                    <span className="font-semibold text-slate-700">Pin to top of noticeboard</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Announcement Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Write complete notice details, operational procedures, or official directives..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish to Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Edit Notice</h3>
              </div>
              <button
                onClick={() => setEditingNotice(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateNotice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                  >
                    <option value="General">General</option>
                    <option value="Policy">Policy & Compliance</option>
                    <option value="Sales">Sales Directive</option>
                    <option value="Urgent">Urgent Directive</option>
                    <option value="Holiday">Holiday Notice</option>
                    <option value="Event">Event Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                  >
                    <option value="normal">Standard</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={editValidUntil}
                    onChange={(e) => setEditValidUntil(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editIsPinned}
                      onChange={(e) => setEditIsPinned(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-700">Pin to top</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Announcement Details</label>
                <textarea
                  rows={5}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingNotice(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
                >
                  {isEditing ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
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

            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100 mb-4">
              {viewingNotice.content}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Published by {viewingNotice.authorName}</span>
              <span>{new Date(viewingNotice.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
