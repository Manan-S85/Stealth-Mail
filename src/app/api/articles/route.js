import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // Try to fetch from Notion first
  if (process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID) {
    try {
      const response = await fetch(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.NOTION_TOKEN,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: 10,
        }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        const notionArticles = data.results.map(page => ({
          id: page.id,
          title: page.properties.Title?.title?.[0]?.plain_text || 'Untitled',
          summary: page.properties.Summary?.rich_text?.[0]?.plain_text || 'No summary available',
          category: page.properties.Category?.select?.name || 'General',
          author: page.properties.Author?.rich_text?.[0]?.plain_text || 'Anonymous',
          publishedAt: page.properties.Published_Date?.date?.start || page.created_time,
          readTime: page.properties.Read_Time?.number || 5,
          tags: page.properties.Tags?.multi_select?.map(tag => tag.name) || [],
          isPublished: page.properties.Published?.checkbox || false,
          url: `/blog/${page.id}`,
        }));

        if (notionArticles.length > 0) {
          return NextResponse.json({
            success: true,
            articles: notionArticles,
            total: notionArticles.length,
            page: 1,
            totalPages: 1,
            source: 'notion',
          });
        }
      }
    } catch (error) {
      console.error('Notion API Error:', error);
      // Fall through to fallback articles
    }
  }

  // Fallback articles if Notion is not available
  const articles = [
    {
      id: '1',
      title: 'Welcome to Stealth Mail',
      summary: 'Learn how to use temporary email addresses to protect your privacy and avoid spam.',
      category: 'Privacy',
      author: 'Stealth Mail Team',
      publishedAt: new Date().toISOString(),
      readTime: 5,
      tags: ['privacy', 'email', 'security'],
      isPublished: true,
      url: '/blog/1',
    },
    {
      id: '2', 
      title: 'Why Use Temporary Email?',
      summary: 'Discover the benefits of using disposable email addresses for online registrations.',
      category: 'Security',
      author: 'Stealth Mail Team',
      publishedAt: new Date().toISOString(),
      readTime: 3,
      tags: ['security', 'privacy', 'tips'],
      isPublished: true,
      url: '/blog/2',
    }
  ];

  return NextResponse.json({
    success: true,
    articles: articles,
    total: articles.length,
    page: 1,
    totalPages: 1,
    source: 'fallback',
  });
}
