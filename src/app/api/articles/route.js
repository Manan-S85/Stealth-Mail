import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
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
  });
}
