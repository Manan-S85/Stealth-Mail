// Frontend API utilities for Mail.tm integration
import axios from 'axios';

const API_BASE_URL = '/api';

class MailAPI {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`📧 Mail API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('📧 Mail API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`📧 Mail API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('📧 Mail API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Create a new temporary email address
   * @returns {Promise<{email: string, token: string, expiresAt: Date}>}
   */
  async createTemporaryEmail() {
    try {
      const response = await this.client.post('/mail/create');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create email',
      };
    }
  }

  /**
   * Get inbox messages for a temporary email
   * @param {string} email - The temporary email address
   * @param {string} token - The authentication token for the email
   * @returns {Promise<{messages: Array}>}
   */
  async getInboxMessages(email, token) {
    try {
      const response = await this.client.get('/mail/inbox', {
        params: { email },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch messages',
      };
    }
  }

  /**
   * Get a specific message by ID
   * @param {string} messageId - The message ID
   * @param {string} token - The authentication token
   * @returns {Promise<{message: Object}>}
   */
  async getMessage(messageId, token) {
    try {
      const response = await this.client.get(`/mail/message/${messageId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch message',
      };
    }
  }

  /**
   * Delete a temporary email (if supported)
   * @param {string} email - The temporary email address
   * @param {string} token - The authentication token
   * @returns {Promise<{success: boolean}>}
   */
  async deleteEmail(email, token) {
    try {
      const response = await this.client.delete('/mail/delete', {
        data: { email },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete email',
      };
    }
  }
}

// Create and export a singleton instance
const mailApi = new MailAPI();
export default mailApi;

// Export individual methods for convenience
export const { 
  createTemporaryEmail, 
  getInboxMessages, 
  getMessage, 
  deleteEmail 
} = mailApi;

// Export utility functions
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatEmailAddress = (email) => {
  if (!email) return '';
  return email.toLowerCase().trim();
};

export const getEmailDomain = (email) => {
  if (!email || !email.includes('@')) return '';
  return email.split('@')[1];
};