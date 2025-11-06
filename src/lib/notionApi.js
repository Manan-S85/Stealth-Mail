// Frontend API utilities for Notion integration
import axios from 'axios';

const API_BASE_URL = '/api';

class NotionAPI {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`📝 Notion API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('📝 Notion API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`📝 Notion API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('📝 Notion API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch articles from Notion database
   * @param {Object} options - Query options
   * @param {number} options.limit - Maximum number of articles to fetch
   * @param {string} options.category - Filter by category
   * @param {boolean} options.publishedOnly - Only fetch published articles
   * @returns {Promise<{articles: Array}>}
   */
  async getArticles(options = {}) {
    try {
      const { limit = 10, category, publishedOnly = true } = options;
      
      const params = {
        limit,
        publishedOnly,
      };
      
      if (category) {
        params.category = category;
      }

      const response = await this.client.get('/articles', { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch articles',
      };
    }
  }

  /**
   * Get a specific article by ID
   * @param {string} articleId - The article ID from Notion
   * @returns {Promise<{article: Object}>}
   */
  async getArticle(articleId) {
    try {
      const response = await this.client.get(`/articles/${articleId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch article',
      };
    }
  }

  /**
   * Search articles by query
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<{articles: Array}>}
   */
  async searchArticles(query, options = {}) {
    try {
      const { limit = 10 } = options;
      
      const response = await this.client.get('/articles/search', {
        params: {
          query,
          limit,
        },
      });
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to search articles',
      };
    }
  }

  /**
   * Get popular articles
   * @param {number} limit - Maximum number of articles to fetch
   * @returns {Promise<{articles: Array}>}
   */
  async getPopularArticles(limit = 6) {
    try {
      const response = await this.client.get('/articles/popular', {
        params: { limit },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch popular articles',
      };
    }
  }

  /**
   * Get articles by category
   * @param {string} category - Category name
   * @param {number} limit - Maximum number of articles to fetch
   * @returns {Promise<{articles: Array}>}
   */
  async getArticlesByCategory(category, limit = 10) {
    try {
      const response = await this.client.get(`/articles/category/${category}`, {
        params: { limit },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch articles by category',
      };
    }
  }

  /**
   * Get article categories
   * @returns {Promise<{categories: Array}>}
   */
  async getCategories() {
    try {
      const response = await this.client.get('/articles/categories');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch categories',
      };
    }
  }
}

// Create and export a singleton instance
const notionApi = new NotionAPI();
export default notionApi;

// Export individual methods for convenience
export const { 
  getArticles, 
  getArticle, 
  searchArticles, 
  getPopularArticles,
  getArticlesByCategory,
  getCategories
} = notionApi;

// Export utility functions
export const formatArticleDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateReadTime = (content) => {
  if (!content) return '1 min read';
  
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes} min read`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const getCategoryColor = (category) => {
  const colors = {
    'Privacy': 'bg-blue-100 text-blue-800',
    'Guide': 'bg-green-100 text-green-800',
    'Security': 'bg-red-100 text-red-800',
    'Tips': 'bg-yellow-100 text-yellow-800',
    'News': 'bg-purple-100 text-purple-800',
    'Tutorial': 'bg-indigo-100 text-indigo-800',
    'Review': 'bg-pink-100 text-pink-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};