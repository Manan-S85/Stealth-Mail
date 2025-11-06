const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const NotionService = require('../services/notionService');

const router = express.Router();
const notionService = new NotionService();

/**
 * @route   GET /api/articles
 * @desc    Get all articles from Notion
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const { 
    limit = 10, 
    category, 
    publishedOnly = true,
    page = 1 
  } = req.query;
  
  console.log('📚 Fetching articles...', { limit, category, publishedOnly, page });
  
  try {
    const result = await notionService.getArticles({
      limit: parseInt(limit),
      category,
      publishedOnly: publishedOnly === 'true',
      page: parseInt(page)
    });
    
    if (result.success) {
      console.log(`✅ Found ${result.data.articles?.length || 0} articles`);
      res.status(200).json({
        success: true,
        articles: result.data.articles || [],
        total: result.data.total || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: result.data.hasMore || false
      });
    } else {
      console.error('❌ Failed to fetch articles:', result.error);
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to fetch articles'
      });
    }
  } catch (error) {
    console.error('💥 Error in articles route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching articles'
    });
  }
}));

/**
 * @route   GET /api/articles/popular
 * @desc    Get popular articles
 * @access  Public
 */
router.get('/popular', asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;
  
  console.log('🔥 Fetching popular articles...', { limit });
  
  try {
    const result = await notionService.getPopularArticles(parseInt(limit));
    
    if (result.success) {
      console.log(`✅ Found ${result.data.articles?.length || 0} popular articles`);
      res.status(200).json({
        success: true,
        articles: result.data.articles || []
      });
    } else {
      console.error('❌ Failed to fetch popular articles:', result.error);
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to fetch popular articles'
      });
    }
  } catch (error) {
    console.error('💥 Error in popular articles route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching popular articles'
    });
  }
}));

/**
 * @route   GET /api/articles/search
 * @desc    Search articles by query
 * @access  Public
 */
router.get('/search', asyncHandler(async (req, res) => {
  const { query, limit = 10 } = req.query;
  
  console.log('🔍 Searching articles...', { query, limit });
  
  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Search query is required'
    });
  }
  
  try {
    const result = await notionService.searchArticles(query.trim(), {
      limit: parseInt(limit)
    });
    
    if (result.success) {
      console.log(`✅ Found ${result.data.articles?.length || 0} matching articles`);
      res.status(200).json({
        success: true,
        articles: result.data.articles || [],
        query: query.trim(),
        total: result.data.total || 0
      });
    } else {
      console.error('❌ Failed to search articles:', result.error);
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to search articles'
      });
    }
  } catch (error) {
    console.error('💥 Error in search articles route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while searching articles'
    });
  }
}));

/**
 * @route   GET /api/articles/categories
 * @desc    Get all article categories
 * @access  Public
 */
router.get('/categories', asyncHandler(async (req, res) => {
  console.log('📂 Fetching article categories...');
  
  try {
    const result = await notionService.getCategories();
    
    if (result.success) {
      console.log(`✅ Found ${result.data.categories?.length || 0} categories`);
      res.status(200).json({
        success: true,
        categories: result.data.categories || []
      });
    } else {
      console.error('❌ Failed to fetch categories:', result.error);
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to fetch categories'
      });
    }
  } catch (error) {
    console.error('💥 Error in categories route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching categories'
    });
  }
}));

/**
 * @route   GET /api/articles/category/:category
 * @desc    Get articles by category
 * @access  Public
 */
router.get('/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { limit = 10 } = req.query;
  
  console.log('📂 Fetching articles by category...', { category, limit });
  
  if (!category) {
    return res.status(400).json({
      success: false,
      error: 'Category is required'
    });
  }
  
  try {
    const result = await notionService.getArticlesByCategory(
      decodeURIComponent(category), 
      parseInt(limit)
    );
    
    if (result.success) {
      console.log(`✅ Found ${result.data.articles?.length || 0} articles in category: ${category}`);
      res.status(200).json({
        success: true,
        articles: result.data.articles || [],
        category: decodeURIComponent(category),
        total: result.data.total || 0
      });
    } else {
      console.error('❌ Failed to fetch articles by category:', result.error);
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to fetch articles by category'
      });
    }
  } catch (error) {
    console.error('💥 Error in category articles route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching articles by category'
    });
  }
}));

/**
 * @route   GET /api/articles/:id
 * @desc    Get a specific article by ID
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  console.log('📖 Fetching article by ID...', { id });
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Article ID is required'
    });
  }
  
  try {
    const result = await notionService.getArticle(id);
    
    if (result.success) {
      console.log('✅ Article fetched successfully');
      res.status(200).json({
        success: true,
        article: result.data
      });
    } else {
      console.error('❌ Failed to fetch article:', result.error);
      res.status(404).json({
        success: false,
        error: result.error || 'Article not found'
      });
    }
  } catch (error) {
    console.error('💥 Error in article by ID route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching article'
    });
  }
}));

module.exports = router;