import { createFileRoute } from '@tanstack/react-router';

import { db } from '@/shared/server/db';

const BASE_URL = process.env.VITE_PRODUCTION_API_URL || '';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority.toFixed(2)}</priority>` : ''}
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const urls: SitemapUrl[] = [];
        const today = new Date().toISOString().split('T')[0];

        // Static pages
        urls.push({
          loc: BASE_URL,
          lastmod: today,
          changefreq: 'weekly',
          priority: 1.0,
        });

        urls.push({
          loc: `${BASE_URL}/contact`,
          lastmod: today,
          changefreq: 'monthly',
          priority: 0.8,
        });

        urls.push({
          loc: `${BASE_URL}/menu`,
          lastmod: today,
          changefreq: 'monthly',
          priority: 0.6,
        });

        urls.push({
          loc: `${BASE_URL}/articles`,
          lastmod: today,
          changefreq: 'daily',
          priority: 0.9,
        });

        urls.push({
          loc: `${BASE_URL}/portfolio`,
          lastmod: today,
          changefreq: 'weekly',
          priority: 0.9,
        });

        urls.push({
          loc: `${BASE_URL}/policy/privacy`,
          lastmod: today,
          changefreq: 'yearly',
          priority: 0.3,
        });

        urls.push({
          loc: `${BASE_URL}/policy/terms`,
          lastmod: today,
          changefreq: 'yearly',
          priority: 0.3,
        });

        // Dynamic articles
        try {
          const articles = await db.article.findMany({
            select: { id: true, date: true },
          });
          for (const article of articles) {
            urls.push({
              loc: `${BASE_URL}/articles/${article.id}`,
              lastmod: article.date,
              changefreq: 'monthly',
              priority: 0.7,
            });
          }
        } catch {
          // Continue without articles if fetch fails
        }

        // Dynamic portfolios
        try {
          const portfolios = await db.portfolio.findMany({
            select: { id: true },
          });
          for (const portfolio of portfolios) {
            urls.push({
              loc: `${BASE_URL}/portfolio/${portfolio.id}`,
              lastmod: today,
              changefreq: 'monthly',
              priority: 0.7,
            });
          }
        } catch {
          // Continue without portfolios if fetch fails
        }

        const sitemap = generateSitemapXml(urls);

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      },
    },
  },
});
