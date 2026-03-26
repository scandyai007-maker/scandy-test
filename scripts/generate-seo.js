/**
 * Post-build script: generates sitemap.xml and robots.txt as static files
 * in the dist/ folder by fetching data from Supabase.
 * 
 * Usage: SITE_URL=https://your-domain.com node scripts/generate-seo.js
 */
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — writing fallback SEO files.');
  
  // Write a basic robots.txt
  writeFileSync(resolve(distDir, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  writeFileSync(resolve(distDir, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  console.log('✅ Wrote fallback robots.txt and sitemap.xml');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSEO() {
  // 1. Get site settings for robots.txt and base URL
  const { data: settings } = await supabase.from('site_settings').select('robots_txt, canonical_base_url').eq('id', 1).single();
  
  const siteUrl = process.env.SITE_URL || settings?.canonical_base_url || 'https://example.com';

  // 2. Write robots.txt
  let robotsTxt = settings?.robots_txt || 'User-agent: *\nAllow: /';
  // Append sitemap reference if not already present
  if (!robotsTxt.includes('Sitemap:')) {
    robotsTxt += `\n\nSitemap: ${siteUrl}/sitemap.xml`;
  }
  writeFileSync(resolve(distDir, 'robots.txt'), robotsTxt);
  console.log('✅ Generated robots.txt');

  // 3. Fetch all content for sitemap
  const [platforms, news, collections, tags] = await Promise.all([
    supabase.from('platforms').select('slug, updated_at'),
    supabase.from('news').select('slug, updated_at'),
    supabase.from('collections').select('slug, updated_at'),
    supabase.from('tags').select('name'),
  ]);

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

  writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap);
  console.log(`✅ Generated sitemap.xml with ${urls.length} URLs`);
}

generateSEO().catch((err) => {
  console.error('❌ SEO generation failed:', err.message);
  // Don't fail the build, just write fallbacks
  writeFileSync(resolve(distDir, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  writeFileSync(resolve(distDir, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  console.log('✅ Wrote fallback SEO files');
});
