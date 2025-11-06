'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Calendar, User, BookOpen, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch articles from Notion API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles || []);
        } else {
          console.error('Failed to fetch articles');
          // Fallback demo data with images matching your design
          setArticles([
            {
              id: '1',
              title: 'Best Temporary Email Services in 2025: Complete Guide',
              excerpt: 'Wondering what is the best service for temporary email service to use for your needs? Explore the top offerings along with stealthmail.com',
              author: 'Stealth Mail Team',
              date: '2025-10-01',
              readTime: '5 min read',
              category: 'Guide',
              url: '#',
              coverImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop'
            },
            {
              id: '2',
              title: 'Disposable Temporary Email vs Regular Email: Complete Security Comparison Guide 2025',
              excerpt: 'Comparison of features, pros and cons of a disposable email vs regular email from the perspective of security and other paradigms',
              author: 'Security Team',
              date: '2025-09-22',
              readTime: '8 min read',
              category: 'Security',
              url: '#',
              coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop'
            },
            {
              id: '3',
              title: 'API-based Mail Service',
              excerpt: 'Explore the use cases of an API based Mail service and understand what it can do for you',
              author: 'Tech Team',
              date: '2025-09-16',
              readTime: '6 min read',
              category: 'Technology',
              url: '#',
              coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop'
            },
            {
              id: '4',
              title: 'What Is Temporary Email and How Does It Work?',
              excerpt: 'Learn the fundamentals of temporary email services and understand how they protect your privacy online',
              author: 'Education Team',
              date: '2025-09-16',
              readTime: '4 min read',
              category: 'Education',
              url: '#',
              coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop'
            },
            {
              id: '5',
              title: 'Are Temporary Email Services Safe? Answers to 10 Common Questions',
              excerpt: 'Get answers to the most frequently asked questions about temporary email security and privacy',
              author: 'Security Team',
              date: '2025-09-01',
              readTime: '7 min read',
              category: 'Security',
              url: '#',
              coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop'
            },
            {
              id: '6',
              title: 'Top 7 Reasons to Use Disposable Email Addresses in 2025',
              excerpt: 'Discover the key benefits of using disposable email addresses for online privacy and security',
              author: 'Privacy Team',
              date: '2025-09-01',
              readTime: '5 min read',
              category: 'Privacy',
              url: '#',
              coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        // Same fallback data
        setArticles([
          {
            id: '1',
            title: 'Best Temporary Email Services in 2025: Complete Guide',
            excerpt: 'Wondering what is the best service for temporary email service to use for your needs? Explore the top offerings along with stealthmail.com',
            author: 'Stealth Mail Team',
            date: '2025-10-01',
            readTime: '5 min read',
            category: 'Guide',
            url: '#',
            coverImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop'
          },
          {
            id: '2',
            title: 'Disposable Temporary Email vs Regular Email: Complete Security Comparison Guide 2025',
            excerpt: 'Comparison of features, pros and cons of a disposable email vs regular email from the perspective of security and other paradigms',
            author: 'Security Team',
            date: '2025-09-22',
            readTime: '8 min read',
            category: 'Security',
            url: '#',
            coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop'
          },
          {
            id: '3',
            title: 'API-based Mail Service',
            excerpt: 'Explore the use cases of an API based Mail service and understand what it can do for you',
            author: 'Tech Team',
            date: '2025-09-16',
            readTime: '6 min read',
            category: 'Technology',
            url: '#',
            coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop'
          },
          {
            id: '4',
            title: 'What Is Temporary Email and How Does It Work?',
            excerpt: 'Learn the fundamentals of temporary email services and understand how they protect your privacy online',
            author: 'Education Team',
            date: '2025-09-16',
            readTime: '4 min read',
            category: 'Education',
            url: '#',
            coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop'
          },
          {
            id: '5',
            title: 'Are Temporary Email Services Safe? Answers to 10 Common Questions',
            excerpt: 'Get answers to the most frequently asked questions about temporary email security and privacy',
            author: 'Security Team',
            date: '2025-09-01',
            readTime: '7 min read',
            category: 'Security',
            url: '#',
            coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop'
          },
          {
            id: '6',
            title: 'Top 7 Reasons to Use Disposable Email Addresses in 2025',
            excerpt: 'Discover the key benefits of using disposable email addresses for online privacy and security',
            author: 'Privacy Team',
            date: '2025-09-01',
            readTime: '5 min read',
            category: 'Privacy',
            url: '#',
            coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Privacy': 'bg-blue-100 text-blue-800',
      'Guide': 'bg-green-100 text-green-800',
      'Security': 'bg-red-100 text-red-800',
      'Tips': 'bg-yellow-100 text-yellow-800',
      'News': 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <section id="articles" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Articles</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay informed with our latest guides and privacy tips
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="articles" className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Popular Articles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed with our latest guides and privacy tips
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <article 
              key={article.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  <a href={article.url} className="block">
                    {article.title}
                  </a>
                </h3>

                {/* Date */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(article.date)}
                </div>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a 
            href="#" 
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            View All Articles
            <ExternalLink className="h-5 w-5 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}