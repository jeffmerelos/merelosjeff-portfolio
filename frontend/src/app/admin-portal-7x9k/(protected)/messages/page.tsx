'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Loading, useToast, Badge, Table } from '@/components/admin/ui';
import { adminApi } from '@/lib/admin/api-client';
import '../../../../styles/admin-cyberpunk.css';

export default function MessagesPage() {
  const { addToast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  });

  useEffect(() => {
    loadMessages();
    loadStats();
  }, [filters]);

  const loadMessages = async () => {
    try {
      const params: any = { limit: 100 };
      if (filters.search) params.search = filters.search;
      if (filters.status !== 'all') params.status = filters.status;

      const response = await adminApi.getMessages(params);
      if (response.success) {
        setMessages(response.data?.messages || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      addToast('Failed to load messages', 'error');
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await adminApi.getMessageStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleViewMessage = async (message: any) => {
    setSelectedMessage(message);
    setViewModalOpen(true);

    if (!message.is_read) {
      await adminApi.markMessageAsRead(message.id);
      loadMessages();
      loadStats();
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map((m) => m.id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedMessages.length === 0) {
      addToast('No messages selected', 'warning');
      return;
    }

    try {
      const response = await adminApi.bulkMessageAction(selectedMessages, action);
      if (response.success) {
        addToast(`Bulk ${action} completed`, 'success');
        setSelectedMessages([]);
        loadMessages();
        loadStats();
      } else {
        addToast(response.error || 'Bulk action failed', 'error');
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      addToast('Bulk action failed', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await adminApi.deleteMessage(id);
      if (response.success) {
        addToast('Message deleted successfully', 'success');
        loadMessages();
        loadStats();
        setViewModalOpen(false);
      } else {
        addToast(response.error || 'Failed to delete message', 'error');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      addToast('Failed to delete message', 'error');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await adminApi.exportMessagesCSV();
      if (response.success && response.data?.csv) {
        const blob = new Blob([response.data.csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `messages-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        addToast('CSV exported successfully', 'success');
      } else {
        addToast('Failed to export CSV', 'error');
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      addToast('Failed to export CSV', 'error');
    }
  };

  const getStatusBadge = (message: any) => {
    if (message.is_archived) return <Badge variant="default">Archived</Badge>;
    if (!message.is_read) return <Badge variant="warning">Unread</Badge>;
    return <Badge variant="success">Read</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card neonBorder glowColor="cyan">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyber-text-dim font-tech">Total Messages</p>
              <p className="text-3xl font-cyber text-cyber-cyan mt-1">{stats?.total || 0}</p>
            </div>
            <svg className="w-12 h-12 text-cyber-cyan opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </Card>

        <Card neonBorder glowColor="yellow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyber-text-dim font-tech">Unread</p>
              <p className="text-3xl font-cyber text-cyber-yellow mt-1">{stats?.unread || 0}</p>
            </div>
            <svg className="w-12 h-12 text-cyber-yellow opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </Card>

        <Card neonBorder glowColor="magenta">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyber-text-dim font-tech">Archived</p>
              <p className="text-3xl font-cyber text-cyber-magenta mt-1">{stats?.archived || 0}</p>
            </div>
            <svg className="w-12 h-12 text-cyber-magenta opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
        </Card>
      </div>

      {/* Messages Table */}
      <Card title="Contact Messages" neonBorder glowColor="cyan">
        <div className="space-y-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by name, email, or message..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 bg-cyber-darker border border-cyber-border rounded-lg text-cyber-text focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all font-tech"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>

            <Button variant="green" onClick={handleExportCSV}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedMessages.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
              <span className="text-sm text-cyber-cyan font-tech">
                {selectedMessages.length} selected
              </span>
              <Button size="sm" variant="cyan" onClick={() => handleBulkAction('read')}>
                Mark Read
              </Button>
              <Button size="sm" variant="yellow" onClick={() => handleBulkAction('unread')}>
                Mark Unread
              </Button>
              <Button size="sm" variant="magenta" onClick={() => handleBulkAction('archive')}>
                Archive
              </Button>
              <Button size="sm" variant="red" onClick={() => handleBulkAction('delete')}>
                Delete
              </Button>
            </div>
          )}
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-12 text-cyber-text-dim">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="font-tech">No messages found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer group ${
                  selectedMessages.includes(message.id)
                    ? 'bg-cyber-cyan/10 border-cyber-cyan'
                    : 'bg-cyber-darker border-cyber-border hover:border-cyber-cyan'
                } ${!message.is_read ? 'border-l-4 border-l-cyber-yellow' : ''}`}
                onClick={() => handleViewMessage(message)}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(message.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggleSelect(message.id);
                    }}
                    className="mt-1 w-5 h-5 rounded border-cyber-border bg-cyber-darker checked:bg-cyber-cyan focus:ring-2 focus:ring-cyber-cyan"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-cyber text-cyber-text mb-1">{message.name}</h3>
                        <p className="text-sm text-cyber-text-muted font-tech">{message.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(message)}
                      </div>
                    </div>

                    <p className="text-sm text-cyber-text mb-2 line-clamp-2 font-tech">
                      {message.message}
                    </p>

                    <p className="text-xs text-cyber-text-dim font-tech">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* View Message Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Message Details"
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-tech text-cyber-text-dim mb-1">Name</label>
                <p className="text-cyber-text font-tech">{selectedMessage.name}</p>
              </div>
              <div>
                <label className="block text-sm font-tech text-cyber-text-dim mb-1">Email</label>
                <p className="text-cyber-text font-tech">{selectedMessage.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-tech text-cyber-text-dim mb-1">Subject</label>
              <p className="text-cyber-text font-tech">{selectedMessage.subject || 'No subject'}</p>
            </div>

            <div>
              <label className="block text-sm font-tech text-cyber-text-dim mb-1">Message</label>
              <div className="p-4 bg-cyber-darker border border-cyber-border rounded-lg">
                <p className="text-cyber-text font-tech whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-tech text-cyber-text-dim mb-1">Received</label>
              <p className="text-cyber-text font-tech">{formatDate(selectedMessage.created_at)}</p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-cyber-border">
              {!selectedMessage.is_read && (
                <Button
                  variant="cyan"
                  onClick={async () => {
                    await adminApi.markMessageAsRead(selectedMessage.id);
                    loadMessages();
                    loadStats();
                    setViewModalOpen(false);
                  }}
                >
                  Mark as Read
                </Button>
              )}
              {!selectedMessage.is_archived && (
                <Button
                  variant="magenta"
                  onClick={async () => {
                    await adminApi.archiveMessage(selectedMessage.id);
                    loadMessages();
                    loadStats();
                    setViewModalOpen(false);
                  }}
                >
                  Archive
                </Button>
              )}
              <Button
                variant="red"
                onClick={() => handleDelete(selectedMessage.id)}
              >
                Delete
              </Button>
              <div className="flex-1" />
              <Button variant="default" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
