const { Client } = require('@notionhq/client');

class NotionService {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
    this.databaseId = process.env.NOTION_DATABASE_ID;
    
    if (!process.env.NOTION_TOKEN) {
      console.warn('⚠️ NOTION_TOKEN not found in environment variables');
    }
    
    if (!process.env.NOTION_DATABASE_ID) {
      console.warn('⚠️ NOTION_DATABASE_ID not found in environment variables');
    }
  }

  /**
   * Get articles from Notion database
   * @param {Object} options - Query options
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getArticles(options = {}) {
    try {
      console.log('📚 Fetching articles from Notion...', options);
      
      // If no Notion configuration, return fallback data
      if (!this.databaseId || !process.env.NOTION_TOKEN) {
        console.log('📚 Using fallback articles data');
        return this.getFallbackArticles(options);
      }

      const { limit = 10, category, publishedOnly = true, page = 1 } = options;
      
      // Build filter conditions
      const filter = {
        and: []
      };
      
      if (publishedOnly) {
        filter.and.push({
          or: [
            {
              property: 'Published',
              date: {
                is_not_empty: true
              }
            },
            {
              property: 'Public',
              checkbox: {
                equals: true
              }
            }
          ]
        });
      }
      
      if (category) {
        filter.and.push({
          property: 'Category',
          select: {
            equals: category
          }
        });
      }

      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: filter.and.length > 0 ? filter : undefined,
        sorts: [
          {
            property: 'Created',
            direction: 'descending'
          }
        ],
        page_size: Math.min(limit, 100),
        start_cursor: page > 1 ? this.getStartCursor(page, limit) : undefined
      });

      const articles = response.results.map(page => this.formatNotionPage(page));
      
      console.log(`✅ Found ${articles.length} articles from Notion`);
      
      return {
        success: true,
        data: {
          articles,
          total: articles.length,
          hasMore: response.has_more
        }
      };
    } catch (error) {
      console.error('❌ Failed to fetch articles from Notion:', error.message);
      console.log('📚 Using fallback articles data due to error');
      return this.getFallbackArticles(options);
    }
  }

  /**
   * Get popular articles
   * @param {number} limit - Number of articles to fetch
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getPopularArticles(limit = 6) {
    try {
      console.log('🔥 Fetching popular articles from Notion...', { limit });
      
      // If no Notion configuration, return fallback data
      if (!this.databaseId || !process.env.NOTION_TOKEN) {
        console.log('🔥 Using fallback popular articles data');
        return this.getFallbackPopularArticles(limit);
      }

      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          and: [
            {
              or: [
                {
                  property: 'Published',
                  date: {
                    is_not_empty: true
                  }
                },
                {
                  property: 'Public',
                  checkbox: {
                    equals: true
                  }
                }
              ]
            },
            {
              property: 'Featured',
              checkbox: {
                equals: true
              }
            }
          ]
        },
        sorts: [
          {
            property: 'Created',
            direction: 'descending'
          }
        ],
        page_size: Math.min(limit, 100)
      });

      const articles = response.results.map(page => this.formatNotionPage(page));
      
      console.log(`✅ Found ${articles.length} popular articles from Notion`);
      
      return {
        success: true,
        data: { articles }
      };
    } catch (error) {
      console.error('❌ Failed to fetch popular articles from Notion:', error.message);
      console.log('🔥 Using fallback popular articles data due to error');
      return this.getFallbackPopularArticles(limit);
    }
  }

  /**
   * Search articles
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async searchArticles(query, options = {}) {
    try {
      console.log('🔍 Searching articles in Notion...', { query, options });
      
      // If no Notion configuration, return fallback search
      if (!this.databaseId || !process.env.NOTION_TOKEN) {
        console.log('🔍 Using fallback search data');
        return this.getFallbackSearchResults(query, options);
      }

      const { limit = 10 } = options;

      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          and: [
            {
              property: 'Status',
              select: {
                equals: 'Published'
              }
            },
            {
              or: [
                {
                  property: 'Title',
                  rich_text: {
                    contains: query
                  }
                },
                {
                  property: 'Excerpt',
                  rich_text: {
                    contains: query
                  }
                }
              ]
            }
          ]
        },
        sorts: [
          {
            property: 'Created',
            direction: 'descending'
          }
        ],
        page_size: Math.min(limit, 100)
      });

      const articles = response.results.map(page => this.formatNotionPage(page));
      
      console.log(`✅ Found ${articles.length} matching articles`);
      
      return {
        success: true,
        data: {
          articles,
          total: articles.length
        }
      };
    } catch (error) {
      console.error('❌ Failed to search articles in Notion:', error.message);
      console.log('🔍 Using fallback search data due to error');
      return this.getFallbackSearchResults(query, options);
    }
  }

  /**
   * Get article categories
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getCategories() {
    try {
      console.log('📂 Fetching categories from Notion...');
      
      // If no Notion configuration, return fallback data
      if (!this.databaseId || !process.env.NOTION_TOKEN) {
        console.log('📂 Using fallback categories data');
        return {
          success: true,
          data: {
            categories: ['Privacy', 'Security', 'Guide', 'Tips', 'News']
          }
        };
      }

      const response = await this.notion.databases.retrieve({
        database_id: this.databaseId
      });

      const categoryProperty = response.properties.Category;
      const categories = categoryProperty?.select?.options?.map(option => option.name) || [];
      
      console.log(`✅ Found ${categories.length} categories`);
      
      return {
        success: true,
        data: { categories }
      };
    } catch (error) {
      console.error('❌ Failed to fetch categories from Notion:', error.message);
      return {
        success: true,
        data: {
          categories: ['Privacy', 'Security', 'Guide', 'Tips', 'News']
        }
      };
    }
  }

  /**
   * Get articles by category
   * @param {string} category - Category name
   * @param {number} limit - Number of articles to fetch
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getArticlesByCategory(category, limit = 10) {
    return this.getArticles({ category, limit, publishedOnly: true });
  }

  /**
   * Get a specific article by ID
   * @param {string} articleId - Article ID
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
   */
  async getArticle(articleId) {
    try {
      console.log('📖 Fetching article by ID from Notion...', { articleId });
      
      // If no Notion configuration, return fallback data
      if (!this.databaseId || !process.env.NOTION_TOKEN) {
        console.log('📖 Using fallback article data');
        return this.getFallbackArticle(articleId);
      }

      const response = await this.notion.pages.retrieve({
        page_id: articleId
      });

      const article = this.formatNotionPage(response);
      
      console.log('✅ Article fetched successfully');
      
      return {
        success: true,
        data: article
      };
    } catch (error) {
      console.error('❌ Failed to fetch article from Notion:', error.message);
      return {
        success: false,
        error: error.message || 'Article not found'
      };
    }
  }

  /**
   * Format Notion page to article object
   * @param {Object} page - Notion page object
   * @returns {Object} - Formatted article
   */
  formatNotionPage(page) {
    const properties = page.properties;
    
    // Extract cover image
    let coverImage = null;
    
    // First, check page cover
    if (page.cover) {
      if (page.cover.type === 'external') {
        coverImage = page.cover.external.url;
      } else if (page.cover.type === 'file') {
        coverImage = page.cover.file.url;
      }
    }
    
    // Then check ImageURLs property (your database uses this as rich_text)
    if (!coverImage && properties.ImageURLs) {
      if (properties.ImageURLs.type === 'rich_text' && properties.ImageURLs.rich_text.length > 0) {
        const imageUrl = this.getPlainText(properties.ImageURLs.rich_text);
        if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('https'))) {
          coverImage = imageUrl;
        }
      } else if (properties.ImageURLs.files && properties.ImageURLs.files.length > 0) {
        const file = properties.ImageURLs.files[0];
        if (file.type === 'external') {
          coverImage = file.external.url;
        } else if (file.type === 'file') {
          coverImage = file.file.url;
        }
      } else if (properties.ImageURLs.url) {
        coverImage = properties.ImageURLs.url;
      }
    }
    
    // Fallback to Cover property 
    if (!coverImage && properties.Cover) {
      if (properties.Cover.files && properties.Cover.files.length > 0) {
        const file = properties.Cover.files[0];
        if (file.type === 'external') {
          coverImage = file.external.url;
        } else if (file.type === 'file') {
          coverImage = file.file.url;
        }
      } else if (properties.Cover.url) {
        coverImage = properties.Cover.url;
      }
    }
    
    return {
      id: page.id,
      title: this.getPlainText(properties.Name?.title || properties.Title?.title || []),
      excerpt: this.getPlainText(properties.Description?.rich_text || properties.Excerpt?.rich_text || []),
      author: this.getPlainText(properties.Author?.rich_text || []) || 'Stealth Mail Team',
      category: properties.Category?.select?.name || properties.Tags?.multi_select?.[0]?.name || 'General',
      date: properties.Published?.date?.start || properties.Created?.created_time || properties['Last Updated']?.last_edited_time || new Date().toISOString(),
      readTime: properties.ReadTime?.rich_text?.[0]?.plain_text || '5 min read',
      url: properties.URL?.url || properties.Slug?.rich_text?.[0]?.plain_text ? `/${this.getPlainText(properties.Slug.rich_text)}` : '#',
      published: (properties.Published?.date?.start !== null && properties.Published?.date?.start !== undefined) || properties.Public?.checkbox === true,
      popular: properties.Featured?.checkbox || properties.Popular?.checkbox || false,
      views: properties.Views?.number || 0,
      tags: properties.Tags?.multi_select?.map(tag => tag.name) || [],
      coverImage: coverImage
    };
  }

  /**
   * Extract plain text from Notion rich text
   * @param {Array} richText - Notion rich text array
   * @returns {string} - Plain text
   */
  getPlainText(richText) {
    return richText.map(text => text.plain_text).join('');
  }

  /**
   * Fallback articles data when Notion is not configured
   * @param {Object} options - Query options
   * @returns {Object} - Fallback response
   */
  getFallbackArticles(options = {}) {
    const { limit = 10, category } = options;
    
    const allArticles = [
      {
        id: '1',
        title: 'Best Temporary Email Services in 2025: Complete Guide',
        excerpt: 'Wondering what is the best service for temporary email service to use for your needs? Explore the top offerings along with stealthmail.com',
        author: 'Stealth Mail Team',
        category: 'Guide',
        date: '2025-10-01T10:00:00Z',
        readTime: '5 min read',
        url: '#',
        published: true,
        popular: true,
        views: 1250,
        tags: ['guide', 'temporary-email', 'services'],
        coverImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop'
      },
      {
        id: '2',
        title: 'Disposable Temporary Email vs Regular Email: Complete Security Comparison Guide 2025',
        excerpt: 'Comparison of features, pros and cons of a disposable email vs regular email from the perspective of security and other paradigms',
        author: 'Security Team',
        category: 'Security',
        date: '2025-09-22T14:30:00Z',
        readTime: '8 min read',
        url: '#',
        published: true,
        popular: true,
        views: 980,
        tags: ['security', 'comparison', 'email'],
        coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop'
      },
      {
        id: '3',
        title: 'API-based Mail Service',
        excerpt: 'Explore the use cases of an API based Mail service and understand what it can do for you',
        author: 'Tech Team',
        category: 'Technology',
        date: '2025-09-16T09:15:00Z',
        readTime: '6 min read',
        url: '#',
        published: true,
        popular: true,
        views: 750,
        tags: ['api', 'mail-service', 'technology'],
        coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop'
      },
      {
        id: '4',
        title: 'What Is Temporary Email and How Does It Work?',
        excerpt: 'Learn the fundamentals of temporary email services and understand how they protect your privacy online',
        author: 'Education Team',
        category: 'Education',
        date: '2025-09-16T16:45:00Z',
        readTime: '4 min read',
        url: '#',
        published: true,
        popular: false,
        views: 1100,
        tags: ['education', 'how-to', 'basics'],
        coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop'
      },
      {
        id: '5',
        title: 'Are Temporary Email Services Safe? Answers to 10 Common Questions',
        excerpt: 'Get answers to the most frequently asked questions about temporary email security and privacy',
        author: 'Security Team',
        category: 'Security',
        date: '2025-09-01T16:45:00Z',
        readTime: '7 min read',
        url: '#',
        published: true,
        popular: false,
        views: 890,
        tags: ['security', 'faq', 'safety'],
        coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop'
      },
      {
        id: '6',
        title: 'Top 7 Reasons to Use Disposable Email Addresses in 2025',
        excerpt: 'Discover the key benefits of using disposable email addresses for online privacy and security',
        author: 'Privacy Team',
        category: 'Privacy',
        date: '2025-09-01T16:45:00Z',
        readTime: '5 min read',
        url: '#',
        published: true,
        popular: false,
        views: 1050,
        tags: ['privacy', 'benefits', 'disposable-email'],
        coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop'
      }
    ];

    let filteredArticles = allArticles;
    
    if (category) {
      filteredArticles = allArticles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    const limitedArticles = filteredArticles.slice(0, limit);
    
    return {
      success: true,
      data: {
        articles: limitedArticles,
        total: filteredArticles.length,
        hasMore: filteredArticles.length > limit
      }
    };
  }

  /**
   * Fallback popular articles data
   * @param {number} limit - Number of articles
   * @returns {Object} - Fallback response
   */
  getFallbackPopularArticles(limit = 6) {
    const result = this.getFallbackArticles({ limit: 10 });
    const popularArticles = result.data.articles
      .filter(article => article.popular)
      .slice(0, limit);
    
    return {
      success: true,
      data: { articles: popularArticles }
    };
  }

  /**
   * Fallback search results
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Object} - Fallback response
   */
  getFallbackSearchResults(query, options = {}) {
    const { limit = 10 } = options;
    const result = this.getFallbackArticles({ limit: 20 });
    
    const searchResults = result.data.articles.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, limit);
    
    return {
      success: true,
      data: {
        articles: searchResults,
        total: searchResults.length
      }
    };
  }

  /**
   * Fallback single article data
   * @param {string} articleId - Article ID
   * @returns {Object} - Fallback response
   */
  getFallbackArticle(articleId) {
    const result = this.getFallbackArticles();
    const article = result.data.articles.find(a => a.id === articleId);
    
    if (article) {
      return {
        success: true,
        data: article
      };
    }
    
    return {
      success: false,
      error: 'Article not found'
    };
  }
}

module.exports = NotionService;