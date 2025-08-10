'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

const blogPosts = [
  {
    id: 1,
    title: 'Best Running Shoes 2024: Price Comparison Guide',
    excerpt: 'Compare the top running shoes across multiple retailers. Find the best deals and save money on your next pair.',
    slug: 'best-running-shoes-2024',
    category: 'Athletic Footwear',
    readTime: '5 min read',
    image: '/blog/running-shoes.jpg',
    keywords: ['running shoes', 'online deals', 'retailer deals', 'athletic footwear'],
    publishDate: '2024-01-15'
  },
  {
    id: 2,
    title: 'How to Find the Best Deals Online',
    excerpt: 'Master the art of finding incredible deals across multiple retailers. Learn price tracking, coupon stacking, and more.',
    slug: 'online-deals-guide',
    category: 'Shopping Tips',
    readTime: '7 min read',
    image: '/blog/online-deals.jpg',
    keywords: ['online deals', 'shopping tips', 'price tracking', 'coupons'],
    publishDate: '2024-01-10'
  },
  {
    id: 3,
    title: 'Top Athletic Brands: Which Offers Better Value?',
    excerpt: 'Detailed comparison of major athletic brands pricing, quality, and value for money across different product categories.',
    slug: 'athletic-brands-comparison',
    category: 'Brand Comparison',
    readTime: '6 min read',
    image: '/blog/athletic-brands.jpg',
    keywords: ['athletic brands', 'brand comparison', 'athletic wear', 'value'],
    publishDate: '2024-01-05'
  },
  {
    id: 4,
    title: 'Top 10 Laptops Under $1000: Price Comparison',
    excerpt: 'Find the best laptops under $1000 with our comprehensive price comparison across major retailers.',
    slug: 'laptops-under-1000',
    category: 'Electronics',
    readTime: '8 min read',
    image: '/blog/laptops.jpg',
    keywords: ['laptops under 1000', 'budget laptops', 'computer deals', 'tech comparison'],
    publishDate: '2024-01-01'
  }
];

export default function BlogSection() {
  const { currentLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: getTranslation('allCategories', currentLanguage) },
    { id: 'Athletic Footwear', name: getTranslation('athleticFootwear', currentLanguage) },
    { id: 'Electronics', name: getTranslation('electronics', currentLanguage) },
    { id: 'Shopping Tips', name: getTranslation('shoppingTips', currentLanguage) },
    { id: 'Brand Comparison', name: getTranslation('brandComparison', currentLanguage) }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {getTranslation('latestArticles', currentLanguage)}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {getTranslation('blogDescription', currentLanguage)}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Post Image */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">{post.category}</span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Category and Read Time */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-600 font-medium">{post.category}</span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Keywords */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.keywords.slice(0, 3).map((keyword, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Read More Link */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  {getTranslation('readMore', currentLanguage)}
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Posts Button */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {getTranslation('viewAllPosts', currentLanguage)}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 