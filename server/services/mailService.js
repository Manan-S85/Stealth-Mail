const axios = require('axios');

class MailService {
  constructor() {
    this.baseURL = 'https://api.mail.tm';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Stealth-Mail/1.0'
      }
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`📧 Mail.tm API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('📧 Mail.tm API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`📧 Mail.tm API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('📧 Mail.tm API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get available domains from Mail.tm
   * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
   */
  async getDomains() {
    try {
      console.log('🌐 Fetching available domains...');
      const response = await this.client.get('/domains');
      
      const domains = response.data?.['hydra:member'] || response.data || [];
      console.log(`✅ Found ${domains.length} available domains`);
      
      return {
        success: true,
        data: domains.map(domain => ({
          id: domain.id,
          domain: domain.domain,
          isActive: domain.isActive
        }))
      };
    } catch (error) {
      console.error('❌ Failed to fetch domains:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch domains'
      };
    }
  }

  /**
   * Create a new temporary email account
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async createAccount() {
    try {
      console.log('📧 Creating new temporary email account...');
      
      // First, get available domains
      const domainsResult = await this.getDomains();
      if (!domainsResult.success || !domainsResult.data.length) {
        throw new Error('No available domains');
      }

      // Use the first active domain
      const activeDomain = domainsResult.data.find(d => d.isActive) || domainsResult.data[0];
      console.log(`🌐 Using domain: ${activeDomain.domain}`);

      // Generate random username
      const username = this.generateRandomUsername();
      const email = `${username}@${activeDomain.domain}`;
      const password = this.generateRandomPassword();

      console.log(`📧 Creating account: ${email}`);

      // Create account
      const accountResponse = await this.client.post('/accounts', {
        address: email,
        password: password
      });

      const accountData = accountResponse.data;
      console.log('✅ Account created successfully');

      // Get JWT token
      const tokenResponse = await this.client.post('/token', {
        address: email,
        password: password
      });

      const token = tokenResponse.data.token;
      console.log('✅ Authentication token obtained');

      return {
        success: true,
        data: {
          id: accountData.id,
          email: email,
          token: token,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        }
      };
    } catch (error) {
      console.error('❌ Failed to create account:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create email account'
      };
    }
  }

  /**
   * Get messages for an email account
   * @param {string} email - Email address
   * @param {string} token - JWT token
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getMessages(email, token) {
    try {
      console.log(`📬 Fetching messages for: ${email}`);
      
      if (!token) {
        console.log('⚠️ No token provided, returning empty inbox');
        return {
          success: true,
          data: { messages: [], total: 0 }
        };
      }

      const response = await this.client.get('/messages', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const messages = response.data?.['hydra:member'] || response.data || [];
      console.log(`✅ Found ${messages.length} messages`);

      // Format messages for frontend
      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        from: msg.from?.address || msg.from,
        to: msg.to?.[0]?.address || email,
        subject: msg.subject,
        intro: msg.intro,
        text: msg.text,
        html: msg.html,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        seen: msg.seen,
        flagged: msg.flagged,
        isDeleted: msg.isDeleted,
        retention: msg.retention,
        retentionDate: msg.retentionDate
      }));

      return {
        success: true,
        data: {
          messages: formattedMessages,
          total: messages.length
        }
      };
    } catch (error) {
      console.error('❌ Failed to fetch messages:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch messages'
      };
    }
  }

  /**
   * Get a specific message by ID
   * @param {string} messageId - Message ID
   * @param {string} token - JWT token
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getMessage(messageId, token) {
    try {
      console.log(`📄 Fetching message: ${messageId}`);
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication token required'
        };
      }

      const response = await this.client.get(`/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const message = response.data;
      console.log('✅ Message fetched successfully');

      return {
        success: true,
        data: {
          id: message.id,
          from: message.from?.address || message.from,
          to: message.to?.[0]?.address,
          subject: message.subject,
          intro: message.intro,
          text: message.text,
          html: message.html,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          seen: message.seen,
          flagged: message.flagged,
          attachments: message.attachments || []
        }
      };
    } catch (error) {
      console.error('❌ Failed to fetch message:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Message not found'
      };
    }
  }

  /**
   * Delete an email account
   * @param {string} email - Email address
   * @param {string} token - JWT token
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteAccount(email, token) {
    try {
      console.log(`🗑️ Deleting account: ${email}`);
      
      if (!token) {
        return {
          success: false,
          error: 'Authentication token required'
        };
      }

      // Get account info first to get the ID
      const accountResponse = await this.client.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const accountId = accountResponse.data.id;

      // Delete the account
      await this.client.delete(`/accounts/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('✅ Account deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to delete account:', error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete account'
      };
    }
  }

  /**
   * Generate random username
   * @returns {string}
   */
  generateRandomUsername() {
    const adjectives = ['quick', 'lazy', 'jumpy', 'silent', 'bright', 'dark', 'fast', 'slow'];
    const nouns = ['fox', 'cat', 'dog', 'bird', 'fish', 'bear', 'wolf', 'lion'];
    const numbers = Math.floor(Math.random() * 1000);
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adjective}${noun}${numbers}`;
  }

  /**
   * Generate random password
   * @returns {string}
   */
  generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
  }
}

module.exports = MailService;