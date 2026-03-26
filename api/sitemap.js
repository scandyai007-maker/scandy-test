import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const [settings, platforms, news, collections, tags] = await Promise.all([
      supabase.from('site_settings').select('canonical_base_url').eq('id', 1).single(),
      supabase.from('platforms').select('slug, updated_at'),
      supabase.from('news').select('slug, updated_at'),
      supabase.from('collections').select('slug, updated_at'),
      supabase.from('tags').select('name'),
    ]);

    const siteUrl = process.env.SITE_URL || settings.data?.canonical_base_url || `https://${req.headers.host}`;
    const today = new Date().toISOString().split('T')[0];

    const urls = [
      { loc: '', priority: '1.0', changefreq: 'daily' },
      { loc: '/games', priority: '0.9', changefreq: 'daily' },
      { loc: '/news', priority: '0.9', changefreq: 'daily' },
      { loc: '/collections', priority: '0.8', changefreq: 'weekly' },
      ...(platforms.data || []).map(p => ({
        loc: `/games/${p.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: p.updated_at?.split('T')[0]
      })),
      ...(news.data || []).map(n => ({
        loc: `/news/${n.slug}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: n.updated_at?.split('T')[0]
      })),
      ...(collections.data || []).map(c => ({
        loc: `/collections/${c.slug}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: c.updated_at?.split('T')[0]
      })),
      ...(tags.data || []).map(t => ({
        loc: `/tags/${encodeURIComponent(t.name)}`,
        priority: '0.5',
        changefreq: 'weekly'
      })),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${siteUrl}${u.loc}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(sitemap);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
}
