/**
 * Admin API Client
 * Handles all API calls to the admin backend with authentication, CSRF protection, and error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class AdminApiClient {
  private csrfToken: string | null = null;

  /**
   * Get CSRF token from server
   */
  async getCsrfToken(): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/csrf`, {
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success && data.csrfToken) {
        this.csrfToken = data.csrfToken;
        return this.csrfToken;
      }

      throw new Error('Failed to get CSRF token');
    } catch (error) {
      console.error('CSRF token error:', error);
      throw error;
    }
  }

  /**
   * Make an API request with proper headers and error handling
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Add CSRF token for state-changing requests
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method || 'GET')) {
        const csrfToken = await this.getCsrfToken();
        headers['x-csrf-token'] = csrfToken;
      }

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `Request failed with status ${response.status}`,
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // ============================================
  // AUTHENTICATION
  // ============================================

  async login(username: string, password: string) {
    return this.request('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async verify2FA(userId: string, code: string) {
    return this.request('/admin/auth/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ userId, code }),
    });
  }

  async verifyBackupCode(userId: string, code: string) {
    return this.request('/admin/auth/verify-backup-code', {
      method: 'POST',
      body: JSON.stringify({ userId, code }),
    });
  }

  async logout() {
    return this.request('/admin/auth/logout', {
      method: 'POST',
    });
  }

  async logoutAll() {
    return this.request('/admin/auth/logout-all', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/admin/auth/me');
  }

  async getSessions() {
    return this.request('/admin/auth/sessions');
  }

  async terminateSession(sessionId: string) {
    return this.request(`/admin/auth/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  async getLoginAttempts(limit = 10) {
    return this.request(`/admin/auth/login-attempts?limit=${limit}`);
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    return this.request('/admin/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
  }

  // 2FA Management
  async setup2FA() {
    return this.request('/admin/auth/2fa/setup', {
      method: 'POST',
    });
  }

  async enable2FA(code: string) {
    return this.request('/admin/auth/2fa/enable', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async disable2FA(password: string) {
    return this.request('/admin/auth/2fa/disable', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async regenerateBackupCodes(password: string) {
    return this.request('/admin/auth/2fa/regenerate-backup-codes', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  // ============================================
  // CONTENT MANAGEMENT
  // ============================================

  // Profile
  async getProfile() {
    return this.request('/admin/content/profile');
  }

  async updateProfile(data: any) {
    return this.request('/admin/content/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Skills
  async getSkills(filters?: { category?: string; featured?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
    
    return this.request(`/admin/content/skills?${params.toString()}`);
  }

  async createSkill(data: any) {
    return this.request('/admin/content/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSkill(id: number, data: any) {
    return this.request(`/admin/content/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSkill(id: number) {
    return this.request(`/admin/content/skills/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderSkills(skillOrders: Array<{ id: number; sort_order: number }>) {
    return this.request('/admin/content/reorder/skills', {
      method: 'PUT',
      body: JSON.stringify({ skillOrders }),
    });
  }

  // Projects
  async getProjects(filters?: { category?: string; status?: string; featured?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
    
    return this.request(`/admin/content/projects?${params.toString()}`);
  }

  async getProject(slug: string) {
    return this.request(`/admin/content/projects/${slug}`);
  }

  async createProject(data: any) {
    return this.request('/admin/content/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: number, data: any) {
    return this.request(`/admin/content/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: number) {
    return this.request(`/admin/content/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderProjects(projectOrders: Array<{ id: number; sort_order: number }>) {
    return this.request('/admin/content/reorder/projects', {
      method: 'PUT',
      body: JSON.stringify({ projectOrders }),
    });
  }

  // Experience
  async getExperience(type?: string) {
    const params = type ? `?type=${type}` : '';
    return this.request(`/admin/content/experience${params}`);
  }

  async createExperience(data: any) {
    return this.request('/admin/content/experience', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateExperience(id: number, data: any) {
    return this.request(`/admin/content/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteExperience(id: number) {
    return this.request(`/admin/content/experience/${id}`, {
      method: 'DELETE',
    });
  }

  // Certifications
  async getCertifications() {
    return this.request('/admin/content/certifications');
  }

  async createCertification(data: any) {
    return this.request('/admin/content/certifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCertification(id: number, data: any) {
    return this.request(`/admin/content/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCertification(id: number) {
    return this.request(`/admin/content/certifications/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // MESSAGES & ACTIVITY
  // ============================================

  async getMessages(filters?: {
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));
    
    return this.request(`/admin/messages?${params.toString()}`);
  }

  async getMessageStats() {
    return this.request('/admin/messages/stats');
  }

  async getMessage(id: number) {
    return this.request(`/admin/messages/${id}`);
  }

  async markMessageAsRead(id: number) {
    return this.request(`/admin/messages/${id}/read`, {
      method: 'PUT',
    });
  }

  async markMessageAsUnread(id: number) {
    return this.request(`/admin/messages/${id}/unread`, {
      method: 'PUT',
    });
  }

  async archiveMessage(id: number) {
    return this.request(`/admin/messages/${id}/archive`, {
      method: 'PUT',
    });
  }

  async unarchiveMessage(id: number) {
    return this.request(`/admin/messages/${id}/unarchive`, {
      method: 'PUT',
    });
  }

  async deleteMessage(id: number) {
    return this.request(`/admin/messages/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkMessageAction(action: string, messageIds: number[]) {
    return this.request('/admin/messages/bulk-actions', {
      method: 'POST',
      body: JSON.stringify({ action, messageIds }),
    });
  }

  async exportMessages(filters?: { status?: string; startDate?: string; endDate?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    window.open(`${API_BASE_URL}/admin/messages/export/csv?${params.toString()}`, '_blank');
  }

  async getActivityLogs(filters?: {
    eventType?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.eventType) params.append('eventType', filters.eventType);
    if (filters?.entityType) params.append('entityType', filters.entityType);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));
    
    return this.request(`/admin/messages/activity?${params.toString()}`);
  }

  async getEventTypes() {
    return this.request('/admin/messages/activity/event-types');
  }
}

// Export singleton instance
export const adminApi = new AdminApiClient();
export default adminApi;
