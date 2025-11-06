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
        const notionArticles = data.results.map(page => {
          const props = page.properties;
          
          // Try multiple possible property names for title
          const title = props.Title?.title?.[0]?.plain_text || 
                       props.Name?.title?.[0]?.plain_text ||
                       props.title?.title?.[0]?.plain_text ||
                       'Welcome to Stealth Mail';
          
          // Try multiple possible property names for summary/description
          const summary = props.Summary?.rich_text?.[0]?.plain_text ||
                         props.Description?.rich_text?.[0]?.plain_text ||
                         props.Excerpt?.rich_text?.[0]?.plain_text ||
                         'Learn about secure temporary email services and privacy protection.';
          
          // Try to get category
          const category = props.Category?.select?.name ||
                          props.Type?.select?.name ||
                          'Privacy';
          
          // Try to get author
          const author = props.Author?.rich_text?.[0]?.plain_text ||
                        props.Created_by?.rich_text?.[0]?.plain_text ||
                        'Stealth Mail Team';
          
          return {
            id: page.id,
            title: title,
            summary: summary,
            category: category,
            author: author,
            publishedAt: props.Published_Date?.date?.start || props.Created?.created_time || page.created_time,
            readTime: props.Read_Time?.number || props.ReadTime?.number || 5,
            tags: props.Tags?.multi_select?.map(tag => tag.name) || ['privacy', 'email', 'security'],
            isPublished: props.Published?.checkbox !== false, // Default to published unless explicitly false
            url: `/blog/${page.id}`,
          };
        });

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
