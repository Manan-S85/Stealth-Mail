import { NextResponse } from 'next/server';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const category = searchParams.get('category');
    const publishedOnly = searchParams.get('publishedOnly') || 'true';
    const page = searchParams.get('page') || '1';

    // Build query parameters
    const params = new URLSearchParams({
      limit,
      publishedOnly,
      page
    });

    if (category) {
      params.append('category', category);
    }

    // Make request to Express server
    const response = await fetch(`${SERVER_URL}/api/articles?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Error proxying to Express server:', error.message);
    
    // Return fallback data if server is not available
    const fallbackArticles = [
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
        tags: ['guide', 'temporary-email', 'services']
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
        tags: ['security', 'comparison', 'email']
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
        tags: ['api', 'mail-service', 'technology']
      }
    ];

    return NextResponse.json({
      success: true,
      articles: fallbackArticles,
      total: fallbackArticles.length,
      page: 1,
      limit: 10,
      hasMore: false
    });
  }
}