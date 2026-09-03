const express = require('express');
const router = express.Router();
const { supabase } = require('../config/database');
const { authenticateAdmin, extractRequestInfo } = require('../middleware/auth');
const { adminApiLimiter } = require('../middleware/rateLimiter');
const { csrfProtection } = require('../middleware/csrf');
const { validateMessageFilter } = require('../middleware/validators');
const auditService = require('../services/auditService');

// Apply middleware to all routes
router.use(extractRequestInfo);
router.use(authenticateAdmin);
router.use(adminApiLimiter);

// ============================================
// CONTACT MESSAGES MANAGEMENT
// ============================================

/**
 * GET /api/admin/messages
 * Get contact messages with filtering
 */
router.get('/', validateMessageFilter, async (req, res) => {
  try {
    const { 
      status = 'all', 
      search = '', 
      startDate, 
      endDate, 
      limit = 20, 
      offset = 0 
    } = req.query;

    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Filter by read/archived status
    if (status === 'unread') {
      query = query.eq('is_read', false).eq('is_archived', false);
    } else if (status === 'read') {
      query = query.eq('is_read', true).eq('is_archived', false);
    } else if (status === 'archived') {
      query = query.eq('is_archived', true);
    } else if (status !== 'all') {
      query = query.eq('is_archived', false);
    }

    // Search by name, email, subject, or message
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`
      );
    }

    // Filter by date range
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: messages, error, count } = await query;

    if (error) {
      console.error('Get messages error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch messages'
      });
    }

    res.json({
      success: true,
      messages: messages || [],
      total: count || 0,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  }
});

/**
 * GET /api/admin/messages/stats
 * Get message statistics
 */
router.get('/stats', async (req, res) => {
  try {
    // Get total messages
    const { count: total } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true });

    // Get unread messages
    const { count: unread } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .eq('is_archived', false);

    // Get archived messages
    const { count: archived } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_archived', true);

    // Get messages from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: lastWeek } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    res.json({
      success: true,
      stats: {
        total: total || 0,
        unread: unread || 0,
        archived: archived || 0,
        lastWeek: lastWeek || 0
      }
    });
  } catch (error) {
    console.error('Get message stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch message statistics'
    });
  }
});

/**
 * GET /api/admin/messages/:id
 * Get a single message and mark as read
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user, clientIp, userAgent } = req;

    // Get message
    const { data: message, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Mark as read if not already
    if (!message.is_read) {
      await supabase
        .from('contact_messages')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', id);

      message.is_read = true;
      message.read_at = new Date().toISOString();

      // Log activity
      await auditService.logMessageViewed(
        user.id,
        user.username,
        parseInt(id),
        clientIp,
        userAgent
      );
    }

    res.json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch message'
    });
  }
});

/**
 * PUT /api/admin/messages/:id/read
 * Mark a message as read
 */
router.put('/:id/read', csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const { user, clientIp, userAgent } = req;

    const { data: message, error } = await supabase
      .from('contact_messages')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to mark message as read'
      });
    }

    // Log activity
    await auditService.logMessageViewed(
      user.id,
      user.username,
      parseInt(id),
      clientIp,
      userAgent
    );

    res.json({
      success: true,
      message,
      message_text: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark message as read'
    });
  }
});

/**
 * PUT /api/admin/messages/:id/unread
 * Mark a message as unread
 */
router.put('/:id/unread', csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: message, error } = await supabase
      .from('contact_messages')
      .update({ 
        is_read: false, 
        read_at: null 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to mark message as unread'
      });
    }

    res.json({
      success: true,
      message,
      message_text: 'Message marked as unread'
    });
  } catch (error) {
    console.error('Mark message as unread error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark message as unread'
    });
  }
});

/**
 * PUT /api/admin/messages/:id/archive
 * Archive a message
 */
router.put('/:id/archive', csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const { user, clientIp, userAgent } = req;

    const { data: message, error } = await supabase
      .from('contact_messages')
      .update({ 
        is_archived: true,
        archived_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to archive message'
      });
    }

    // Log activity
    await auditService.logMessageArchived(
      user.id,
      user.username,
      parseInt(id),
      clientIp,
      userAgent
    );

    res.json({
      success: true,
      message,
      message_text: 'Message archived'
    });
  } catch (error) {
    console.error('Archive message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to archive message'
    });
  }
});

/**
 * PUT /api/admin/messages/:id/unarchive
 * Unarchive a message
 */
router.put('/:id/unarchive', csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: message, error } = await supabase
      .from('contact_messages')
      .update({ 
        is_archived: false,
        archived_at: null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to unarchive message'
      });
    }

    res.json({
      success: true,
      message,
      message_text: 'Message unarchived'
    });
  } catch (error) {
    console.error('Unarchive message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unarchive message'
    });
  }
});

/**
 * DELETE /api/admin/messages/:id
 * Delete a message
 */
router.delete('/:id', csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const { user, clientIp, userAgent } = req;

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete message error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete message'
      });
    }

    // Log activity
    await auditService.logMessageDeleted(
      user.id,
      user.username,
      parseInt(id),
      clientIp,
      userAgent
    );

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message'
    });
  }
});

/**
 * POST /api/admin/messages/bulk-actions
 * Perform bulk actions on messages
 */
router.post('/bulk-actions', csrfProtection, async (req, res) => {
  try {
    const { action, messageIds } = req.body;
    const { user, clientIp, userAgent } = req;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message IDs'
      });
    }

    let updateData = {};
    let actionMessage = '';

    switch (action) {
      case 'mark-read':
        updateData = { is_read: true, read_at: new Date().toISOString() };
        actionMessage = 'Messages marked as read';
        break;
      case 'mark-unread':
        updateData = { is_read: false, read_at: null };
        actionMessage = 'Messages marked as unread';
        break;
      case 'archive':
        updateData = { is_archived: true, archived_at: new Date().toISOString() };
        actionMessage = 'Messages archived';
        // Log each archive
        for (const id of messageIds) {
          await auditService.logMessageArchived(user.id, user.username, id, clientIp, userAgent);
        }
        break;
      case 'unarchive':
        updateData = { is_archived: false, archived_at: null };
        actionMessage = 'Messages unarchived';
        break;
      case 'delete':
        // Delete messages
        const { error: deleteError } = await supabase
          .from('contact_messages')
          .delete()
          .in('id', messageIds);

        if (deleteError) {
          return res.status(500).json({
            success: false,
            error: 'Failed to delete messages'
          });
        }

        // Log each deletion
        for (const id of messageIds) {
          await auditService.logMessageDeleted(user.id, user.username, id, clientIp, userAgent);
        }

        return res.json({
          success: true,
          message: 'Messages deleted successfully'
        });
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action'
        });
    }

    // Perform bulk update for non-delete actions
    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from('contact_messages')
        .update(updateData)
        .in('id', messageIds);

      if (error) {
        console.error('Bulk action error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to perform bulk action'
        });
      }
    }

    res.json({
      success: true,
      message: actionMessage
    });
  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform bulk action'
    });
  }
});

/**
 * GET /api/admin/messages/export
 * Export messages to CSV
 */
router.get('/export/csv', async (req, res) => {
  try {
    const { status = 'all', startDate, endDate } = req.query;

    let query = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (status === 'unread') {
      query = query.eq('is_read', false).eq('is_archived', false);
    } else if (status === 'read') {
      query = query.eq('is_read', true).eq('is_archived', false);
    } else if (status === 'archived') {
      query = query.eq('is_archived', true);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: messages, error } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to export messages'
      });
    }

    // Generate CSV
    const csvHeader = 'ID,Name,Email,Subject,Message,Submitted At,Read,Archived\n';
    const csvRows = messages.map(msg => {
      const cleanMessage = (msg.message || '').replace(/"/g, '""').replace(/\n/g, ' ');
      const cleanSubject = (msg.subject || '').replace(/"/g, '""');
      return `${msg.id},"${msg.name}","${msg.email}","${cleanSubject}","${cleanMessage}","${msg.created_at}",${msg.is_read},${msg.is_archived}`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="contact-messages-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Export messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export messages'
    });
  }
});

// ============================================
// ACTIVITY LOGS
// ============================================

/**
 * GET /api/admin/activity
 * Get activity logs with filtering
 */
router.get('/activity', async (req, res) => {
  try {
    const {
      eventType,
      entityType,
      startDate,
      endDate,
      search,
      limit = 50,
      offset = 0
    } = req.query;

    const options = {
      eventType,
      entityType,
      startDate,
      endDate,
      search,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const result = await auditService.getActivityLogs(options);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      logs: result.logs,
      total: result.total,
      limit: result.limit,
      offset: result.offset
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity logs'
    });
  }
});

/**
 * GET /api/admin/activity/event-types
 * Get available event types
 */
router.get('/activity/event-types', (req, res) => {
  const eventTypes = [
    { value: 'login', label: 'Login' },
    { value: 'logout', label: 'Logout' },
    { value: 'login_failed', label: 'Failed Login' },
    { value: '2fa_failed', label: '2FA Failed' },
    { value: 'password_changed', label: 'Password Changed' },
    { value: '2fa_enabled', label: '2FA Enabled' },
    { value: '2fa_disabled', label: '2FA Disabled' },
    { value: 'backup_codes_generated', label: 'Backup Codes Generated' },
    { value: 'backup_code_used', label: 'Backup Code Used' },
    { value: 'profile_updated', label: 'Profile Updated' },
    { value: 'skill_created', label: 'Skill Created' },
    { value: 'skill_updated', label: 'Skill Updated' },
    { value: 'skill_deleted', label: 'Skill Deleted' },
    { value: 'project_created', label: 'Project Created' },
    { value: 'project_updated', label: 'Project Updated' },
    { value: 'project_deleted', label: 'Project Deleted' },
    { value: 'experience_created', label: 'Experience Created' },
    { value: 'experience_updated', label: 'Experience Updated' },
    { value: 'experience_deleted', label: 'Experience Deleted' },
    { value: 'message_viewed', label: 'Message Viewed' },
    { value: 'message_archived', label: 'Message Archived' },
    { value: 'message_deleted', label: 'Message Deleted' },
    { value: 'session_terminated', label: 'Session Terminated' },
    { value: 'all_sessions_terminated', label: 'All Sessions Terminated' }
  ];

  res.json({
    success: true,
    eventTypes
  });
});

module.exports = router;
