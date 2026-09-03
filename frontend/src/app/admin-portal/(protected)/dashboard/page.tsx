'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Loading } from '@/components/admin/ui';
import { adminApi } from '@/lib/admin/api-client';
import '../../../../styles/admin-cyberpunk.css';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [contentCounts, setContentCounts] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [messageStats, skillsRes, projectsRes, experienceRes, certificationsRes, activityRes] = await Promise.all([
        adminApi.getMessageStats(),
        adminApi.getSkills(),
        adminApi.getProjects(),
        adminApi.getExperience(),
        adminApi.getCertifications(),
        adminApi.getActivityLogs({ limit: 10 }),
      ]);

      if (messageStats.success) {
        setStats(messageStats.data);
      }

      setContentCounts({
        skills: skillsRes.success ? skillsRes.data?.length || 0 : 0,
        projects: projectsRes.success ? projectsRes.data?.length || 0 : 0,
        experience: experienceRes.success ? experienceRes.data?.length || 0 : 0,
        certifications: certificationsRes.success ? certificationsRes.data?.length || 0 : 0,
      });

      if (activityRes.success) {
        setRecentActivity(activityRes.data?.logs || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  const metricCards = [
    {
      title: 'Total Projects',
      value: contentCounts?.projects || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      color: 'cyan',
      trend: null,
    },
    {
      title: 'Skills Listed',
      value: contentCounts?.skills || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'magenta',
      trend: null,
    },
    {
      title: 'Unread Messages',
      value: stats?.unread || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'green',
      trend: stats?.unread > 0 ? 'up' : null,
    },
    {
      title: 'Experience Entries',
      value: contentCounts?.experience || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'yellow',
      trend: null,
    },
  ];

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'admin_login':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        );
      case 'content_create':
      case 'content_update':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'content_delete':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getEventColor = (eventType: string) => {
    if (eventType.includes('login')) return 'text-cyber-green';
    if (eventType.includes('create')) return 'text-cyber-cyan';
    if (eventType.includes('update')) return 'text-cyber-magenta';
    if (eventType.includes('delete')) return 'text-cyber-red';
    return 'text-cyber-text';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/10 via-cyber-magenta/10 to-cyber-green/10 rounded-lg blur-xl" />
        <Card className="relative backdrop-blur-sm" neonBorder glowColor="cyan">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-cyber font-bold neon-text-cyan mb-2">
                SYSTEM DASHBOARD
              </h2>
              <p className="text-cyber-text-muted font-tech">
                Welcome back, Administrator. All systems operational.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-16 h-16 rounded-full border-2 border-cyber-cyan flex items-center justify-center shadow-cyber-cyan animate-glow-pulse">
                <svg className="w-8 h-8 text-cyber-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <Card
            key={metric.title}
            className={`backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
            neonBorder
            glowColor={metric.color as any}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-cyber-${metric.color}/10 border border-cyber-${metric.color}/30`}>
                <div className={`text-cyber-${metric.color}`}>{metric.icon}</div>
              </div>
              {metric.trend && (
                <Badge variant={metric.trend === 'up' ? 'success' : 'warning'}>
                  {metric.trend === 'up' ? '↑' : '↓'}
                </Badge>
              )}
            </div>
            <div>
              <p className="text-cyber-text-dim text-sm font-tech mb-1">{metric.title}</p>
              <p className={`text-4xl font-cyber font-bold neon-text-${metric.color}`}>
                {metric.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card title="Quick Actions" neonBorder glowColor="magenta">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="cyan" size="sm" onClick={() => window.location.href = '/admin-portal-7x9k/projects'}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </Button>
            <Button variant="magenta" size="sm" onClick={() => window.location.href = '/admin-portal-7x9k/skills'}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Skill
            </Button>
            <Button variant="green" size="sm" onClick={() => window.location.href = '/admin-portal-7x9k/messages'}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              View Messages
            </Button>
            <Button variant="yellow" size="sm" onClick={() => window.location.href = '/admin-portal-7x9k/profile'}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* System Status */}
        <Card title="System Status" neonBorder glowColor="green">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-green/10 border border-cyber-green/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyber-green animate-pulse shadow-cyber-green" />
                <div>
                  <p className="text-sm font-tech text-cyber-text">Database</p>
                  <p className="text-xs text-cyber-text-dim">Connected</p>
                </div>
              </div>
              <Badge variant="success">ONLINE</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-green/10 border border-cyber-green/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyber-green animate-pulse shadow-cyber-green" />
                <div>
                  <p className="text-sm font-tech text-cyber-text">API Server</p>
                  <p className="text-xs text-cyber-text-dim">Responsive</p>
                </div>
              </div>
              <Badge variant="success">ONLINE</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyber-cyan animate-pulse shadow-cyber-cyan" />
                <div>
                  <p className="text-sm font-tech text-cyber-text">2FA System</p>
                  <p className="text-xs text-cyber-text-dim">Protected</p>
                </div>
              </div>
              <Badge variant="info">ACTIVE</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity" neonBorder glowColor="cyan">
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-cyber-text-dim font-tech">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-cyber-border/30 hover:bg-cyber-border/50 transition-colors border border-transparent hover:border-cyber-cyan/30"
              >
                <div className={`p-2 rounded-lg bg-cyber-darker ${getEventColor(activity.event_type)}`}>
                  {getEventIcon(activity.event_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-cyber-text font-tech truncate">
                    {activity.description || activity.event_type}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-cyber-text-dim">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                    {activity.entity_type && (
                      <Badge variant="default" className="text-xs">
                        {activity.entity_type}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

