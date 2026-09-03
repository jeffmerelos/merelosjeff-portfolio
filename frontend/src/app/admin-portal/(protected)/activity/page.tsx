'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Loading, Badge } from '@/components/admin/ui';
import { adminApi } from '@/lib/admin/api-client';
import '../../../../styles/admin-cyberpunk.css';

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    eventType: 'all',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadEventTypes();
  }, []);

  useEffect(() => {
    loadActivities();
  }, [filters]);

  const loadEventTypes = async () => {
    try {
      const response = await adminApi.getEventTypes();
      if (response.success) {
        setEventTypes(response.data?.eventTypes || []);
      }
    } catch (error) {
      console.error('Error loading event types:', error);
    }
  };

  const loadActivities = async () => {
    try {
      const params: any = { limit: 100 };
      if (filters.search) params.search = filters.search;
      if (filters.eventType !== 'all') params.eventType = filters.eventType;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await adminApi.getActivityLogs(params);
      if (response.success) {
        setActivities(response.data?.logs || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading activities:', error);
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    if (eventType.includes('login')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      );
    }
    if (eventType.includes('logout')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      );
    }
    if (eventType.includes('create')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      );
    }
    if (eventType.includes('update')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    }
    if (eventType.includes('delete')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
    }
    if (eventType.includes('2fa')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    }
    if (eventType.includes('password')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const getEventColor = (eventType: string) => {
    if (eventType.includes('login')) return 'text-cyber-green';
    if (eventType.includes('logout')) return 'text-cyber-yellow';
    if (eventType.includes('create')) return 'text-cyber-cyan';
    if (eventType.includes('update')) return 'text-cyber-magenta';
    if (eventType.includes('delete')) return 'text-cyber-red';
    if (eventType.includes('2fa')) return 'text-cyber-green';
    if (eventType.includes('password')) return 'text-cyber-yellow';
    return 'text-cyber-text';
  };

  const getEventBadge = (eventType: string) => {
    if (eventType.includes('login')) return <Badge variant="success">Login</Badge>;
    if (eventType.includes('logout')) return <Badge variant="warning">Logout</Badge>;
    if (eventType.includes('create')) return <Badge variant="info">Create</Badge>;
    if (eventType.includes('update')) return <Badge variant="default">Update</Badge>;
    if (eventType.includes('delete')) return <Badge variant="danger">Delete</Badge>;
    if (eventType.includes('2fa')) return <Badge variant="success">2FA</Badge>;
    if (eventType.includes('password')) return <Badge variant="warning">Password</Badge>;
    return <Badge variant="default">{eventType}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatEventType = (eventType: string) => {
    return eventType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Activity Log" neonBorder glowColor="cyan">
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search activities..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />

            <select
              value={filters.eventType}
              onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
              className="px-4 py-2 bg-cyber-darker border border-cyber-border rounded-lg text-cyber-text focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all font-tech"
            >
              <option value="all">All Events</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {formatEventType(type)}
                </option>
              ))}
            </select>

            <Input
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />

            <Input
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-cyber-text-muted font-tech">
              {activities.length} activit{activities.length !== 1 ? 'ies' : 'y'} found
            </p>
            <Button
              variant="cyan"
              size="sm"
              onClick={() => setFilters({ search: '', eventType: 'all', startDate: '', endDate: '' })}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-12 text-cyber-text-dim">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-tech">No activities found</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-cyber-border" />

            {/* Activity Items */}
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id} className="relative pl-20 pb-4">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-6 w-5 h-5 rounded-full border-2 border-cyber-border ${getEventColor(
                      activity.event_type
                    )} bg-current shadow-lg`}
                  />

                  {/* Activity Card */}
                  <div className="p-4 rounded-lg bg-cyber-darker border border-cyber-border hover:border-cyber-cyan transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg bg-cyber-darker ${getEventColor(activity.event_type)}`}>
                          {getEventIcon(activity.event_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-cyber text-cyber-text">
                              {formatEventType(activity.event_type)}
                            </h3>
                            {getEventBadge(activity.event_type)}
                          </div>
                          <p className="text-sm text-cyber-text-muted font-tech">
                            {activity.description || 'No description'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-cyber-text-dim font-tech whitespace-nowrap ml-4">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>

                    {/* Additional Details */}
                    <div className="mt-3 pt-3 border-t border-cyber-border/50 flex flex-wrap gap-4 text-xs text-cyber-text-dim font-tech">
                      {activity.entity_type && (
                        <div className="flex items-center gap-1">
                          <span className="text-cyber-cyan">Entity:</span>
                          <span>{activity.entity_type}</span>
                        </div>
                      )}
                      {activity.entity_id && (
                        <div className="flex items-center gap-1">
                          <span className="text-cyber-cyan">ID:</span>
                          <span>{activity.entity_id}</span>
                        </div>
                      )}
                      {activity.ip_address && (
                        <div className="flex items-center gap-1">
                          <span className="text-cyber-cyan">IP:</span>
                          <span>{activity.ip_address}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-3 p-3 bg-cyber-black/50 rounded border border-cyber-border/30">
                        <p className="text-xs text-cyber-text-dim mb-2 font-tech">Metadata:</p>
                        <pre className="text-xs text-cyber-text font-mono overflow-x-auto custom-scrollbar">
                          {JSON.stringify(activity.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

