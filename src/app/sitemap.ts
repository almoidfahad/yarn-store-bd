import type { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/staticContent';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://yarnstorebd.com';
  const routes = [
    '',
    '/about',
    '/about/team',
    '/manufacturing',
    '/trading',
    '/wholesale',
    '/products',
    '/products/cotton-yarn',
    '/products/polyester-yarn',
    '/products/embroidery-thread',
    '/products/yarn-cones',
    '/quality',
    '/certifications',
    '/export',
    '/export/yarn-supplier-bangladesh',
    '/industries',
    '/request-quote',
    '/request-sample',
    '/gallery',
    '/resources',
    '/blog',
    '/faq',
    '/contact',
    '/privacy-policy',
    '/terms',
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date('2026-10-31'),
    changeFrequency: route === '' || route.startsWith('/products') ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route.startsWith('/products') || route === '/request-quote' ? 0.9 : 0.75,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date('2026-10-25'),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
