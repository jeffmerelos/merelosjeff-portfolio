const { supabase } = require('../config/database');

// Event Types
const EVENT_TYPES = {
  // Authentication
  LOGIN: 'login',
  LOGOUT: 'logout',
  LOGIN_FAILED: 'login_failed',
  TOTP_FAILED: '2fa_failed',
  SESSION_EXPIRED: 'session_expired',
  
  // Password Management
  PASSWORD_CHANGED: 'password_changed',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  
  // 2FA Management
  TOTP_ENABLED: '2fa_enabled',
  TOTP_DISABLED: '2fa_disabled',
  BACKUP_CODES_GENERATED: 'backup_codes_generated',
  BACKUP_CODE_USED: 'backup_code_used',
  
  // Content Management
  PROFILE_UPDATED: 'profile_updated',
  SKILL_CREATED: 'skill_created',
  SKILL_UPDATED: 'skill_updated',
  SKILL_DELETED: 'skill_deleted',
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_DELETED: 'project_deleted',
  EXPERIENCE_CREATED: 'experience_created',
  EXPERIENCE_UPDATED: 'experience_updated',
  EXPERIENCE_DELETED: 'experience_deleted',
  CERTIFICATION_CREATED: 'certification_created',
  CERTIFICATION_UPDATED: 'certification_updated',
  CERTIFICATION_DELETED: 'certification_deleted',
  
  // Contact Management
  MESSAGE_VIEWED: 'message_viewed',
  MESSAGE_ARCHIVED: 'message_archived',
  MESSAGE_DELETED: 'message_deleted',
  
  // Session Management
  SESSION_TERMINATED: 'session_terminated',
  ALL_SESSIONS_TERMINATED: 'all_sessions_terminated',
  
  // Settings
  SETTINGS_UPDATED: 'settings_updated',
  
  // Backup/Export
  DATA_EXPORTED: 'data_exported',
  DATA_IMPORTED: 'data_imported'
};

class AuditService {
  /**
   * Log an activity event
   */
  async log(eventType, userId, description, options = {}) {
    try {
      const {
        entityType = null,
        entityId = null,
        metadata = null,
        ipAddress = null,
        userAgent = null
      } = options;

      const { error } = await supabase
        .from('activity_logs')
        .insert({
          admin_user_id: userId,
          event_type: eventType,
          entity_type: entityType,
          entity_id: entityId,
          description,
          metadata: metadata ? JSON.stringify(metadata) : null,
          ip_address: ipAddress,
          user_agent: userAgent
        });

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  /**
   * Log authentication events
   */
  async logLogin(userId, username, ipAddress, userAgent, success = true) {
    const description = success
      ? `User ${username} logged in successfully`
      : `Failed login attempt for ${username}`;
    
    await this.log(
      success ? EVENT_TYPES.LOGIN : EVENT_TYPES.LOGIN_FAILED,
      success ? userId : null,
      description,
      { ipAddress, userAgent, metadata: { username } }
    );
  }

  async logLogout(userId, username, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.LOGOUT,
      userId,
      `User ${username} logged out`,
      { ipAddress, userAgent }
    );
  }

  async log2FAFailed(userId, username, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.TOTP_FAILED,
      userId,
      `2FA verification failed for ${username}`,
      { ipAddress, userAgent, metadata: { username } }
    );
  }

  async logSessionExpired(userId, username) {
    await this.log(
      EVENT_TYPES.SESSION_EXPIRED,
      userId,
      `Session expired for ${username}`,
      { metadata: { username } }
    );
  }

  /**
   * Log password management events
   */
  async logPasswordChanged(userId, username, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.PASSWORD_CHANGED,
      userId,
      `Password changed for ${username}`,
      { ipAddress, userAgent }
    );
  }

  /**
   * Log 2FA management events
   */
  async log2FAEnabled(userId, username, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.TOTP_ENABLED,
      userId,
      `2FA enabled for ${username}`,
      { ipAddress, userAgent }
    );
  }

  async log2FADisabled(userId, username, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.TOTP_DISABLED,
      userId,
      `2FA disabled for ${username}`,
      { ipAddress, userAgent }
    );
  }

  async logBackupCodesGenerated(userId, username, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.BACKUP_CODES_GENERATED,
      userId,
      `Backup codes regenerated for ${username}`,
      { ipAddress, userAgent }
    );
  }

  async logBackupCodeUsed(userId, username, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.BACKUP_CODE_USED,
      userId,
      `Backup code used by ${username}`,
      { ipAddress, userAgent, metadata: { username } }
    );
  }

  /**
   * Log content management events
   */
  async logProfileUpdated(userId, username, changedFields, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.PROFILE_UPDATED,
      userId,
      `Profile updated by ${username}`,
      {
        entityType: 'profile',
        metadata: { changedFields },
        ipAddress,
        userAgent
      }
    );
  }

  async logSkillCreated(userId, username, skillId, skillName, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.SKILL_CREATED,
      userId,
      `Skill "${skillName}" created by ${username}`,
      {
        entityType: 'skill',
        entityId: skillId.toString(),
        metadata: { skillName },
        ipAddress,
        userAgent
      }
    );
  }

  async logSkillUpdated(userId, username, skillId, skillName, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.SKILL_UPDATED,
      userId,
      `Skill "${skillName}" updated by ${username}`,
      {
        entityType: 'skill',
        entityId: skillId.toString(),
        metadata: { skillName },
        ipAddress,
        userAgent
      }
    );
  }

  async logSkillDeleted(userId, username, skillId, skillName, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.SKILL_DELETED,
      userId,
      `Skill "${skillName}" deleted by ${username}`,
      {
        entityType: 'skill',
        entityId: skillId.toString(),
        metadata: { skillName },
        ipAddress,
        userAgent
      }
    );
  }

  async logProjectCreated(userId, username, projectId, projectTitle, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.PROJECT_CREATED,
      userId,
      `Project "${projectTitle}" created by ${username}`,
      {
        entityType: 'project',
        entityId: projectId.toString(),
        metadata: { projectTitle },
        ipAddress,
        userAgent
      }
    );
  }

  async logProjectUpdated(userId, username, projectId, projectTitle, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.PROJECT_UPDATED,
      userId,
      `Project "${projectTitle}" updated by ${username}`,
      {
        entityType: 'project',
        entityId: projectId.toString(),
        metadata: { projectTitle },
        ipAddress,
        userAgent
      }
    );
  }

  async logProjectDeleted(userId, username, projectId, projectTitle, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.PROJECT_DELETED,
      userId,
      `Project "${projectTitle}" deleted by ${username}`,
      {
        entityType: 'project',
        entityId: projectId.toString(),
        metadata: { projectTitle },
        ipAddress,
        userAgent
      }
    );
  }

  async logExperienceCreated(userId, username, experienceId, company, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.EXPERIENCE_CREATED,
      userId,
      `Experience entry "${company}" created by ${username}`,
      {
        entityType: 'experience',
        entityId: experienceId.toString(),
        metadata: { company },
        ipAddress,
        userAgent
      }
    );
  }

  async logExperienceUpdated(userId, username, experienceId, company, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.EXPERIENCE_UPDATED,
      userId,
      `Experience entry "${company}" updated by ${username}`,
      {
        entityType: 'experience',
        entityId: experienceId.toString(),
        metadata: { company },
        ipAddress,
        userAgent
      }
    );
  }

  async logExperienceDeleted(userId, username, experienceId, company, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.EXPERIENCE_DELETED,
      userId,
      `Experience entry "${company}" deleted by ${username}`,
      {
        entityType: 'experience',
        entityId: experienceId.toString(),
        metadata: { company },
        ipAddress,
        userAgent
      }
    );
  }

  /**
   * Log contact management events
   */
  async logMessageViewed(userId, username, messageId, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.MESSAGE_VIEWED,
      userId,
      `Contact message #${messageId} viewed by ${username}`,
      {
        entityType: 'contact_message',
        entityId: messageId.toString(),
        ipAddress,
        userAgent
      }
    );
  }

  async logMessageArchived(userId, username, messageId, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.MESSAGE_ARCHIVED,
      userId,
      `Contact message #${messageId} archived by ${username}`,
      {
        entityType: 'contact_message',
        entityId: messageId.toString(),
        ipAddress,
        userAgent
      }
    );
  }

  async logMessageDeleted(userId, username, messageId, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.MESSAGE_DELETED,
      userId,
      `Contact message #${messageId} deleted by ${username}`,
      {
        entityType: 'contact_message',
        entityId: messageId.toString(),
        ipAddress,
        userAgent
      }
    );
  }

  /**
   * Log session management events
   */
  async logSessionTerminated(userId, username, sessionId, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.SESSION_TERMINATED,
      userId,
      `Session ${sessionId} terminated by ${username}`,
      {
        metadata: { sessionId },
        ipAddress,
        userAgent
      }
    );
  }

  async logAllSessionsTerminated(userId, username, ipAddress, userAgent) {
    await this.log(
      EVENT_TYPES.ALL_SESSIONS_TERMINATED,
      userId,
      `All sessions terminated by ${username}`,
      { ipAddress, userAgent }
    );
  }

  /**
   * Get activity logs with filtering
   */
  async getActivityLogs(options = {}) {
    try {
      const {
        userId = null,
        eventType = null,
        entityType = null,
        startDate = null,
        endDate = null,
        limit = 50,
        offset = 0,
        search = null
      } = options;

      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          admin_users (username, email)
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('admin_user_id', userId);
      }

      if (eventType) {
        query = query.eq('event_type', eventType);
      }

      if (entityType) {
        query = query.eq('entity_type', entityType);
      }

      if (startDate) {
        query = query.gte('created_at', startDate);
      }

      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      if (search) {
        query = query.ilike('description', `%${search}%`);
      }

      query = query.range(offset, offset + limit - 1);

      const { data: logs, error, count } = await query;

      if (error) {
        console.error('Error fetching activity logs:', error);
        return { success: false, error: 'Failed to fetch activity logs' };
      }

      return {
        success: true,
        logs: logs || [],
        total: count || 0,
        limit,
        offset
      };
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return { success: false, error: 'Failed to fetch activity logs' };
    }
  }

  /**
   * Clean old activity logs (keep last 90 days)
   */
  async cleanOldLogs(daysToKeep = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const { error } = await supabase
        .from('activity_logs')
        .delete()
        .lt('created_at', cutoffDate.toISOString());

      if (error) {
        console.error('Error cleaning old logs:', error);
      }
    } catch (error) {
      console.error('Error cleaning old logs:', error);
    }
  }
}

module.exports = new AuditService();
module.exports.EVENT_TYPES = EVENT_TYPES;
