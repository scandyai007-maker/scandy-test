import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import { createClient } from '@supabase/supabase-js';

// SEO Plugin to serve dynamic robots.txt and sitemap.xml
function seoPlugin(env: Record<string, string>): Plugin {
  const supabase = createClient(
    env.VITE_SUPABASE_URL || '',
    env.VITE_SUPABASE_ANON_KEY || ''
  );

  const getSitemap = async (host: string) => {
    const baseUrl = host.startsWith('localhost') ? `http://${host}` : `https://${host}`;
    
    // Fetch all dynamic data
    const [platforms, news, collections, tags] = await Promise.all([
      supabase.from('platforms').select('slug'),
      supabase.from('news').select('slug'),
      supabase.from('collections').select('slug'),
      supabase.from('tags').select('name')
    ]);

    const urls = [
      '',
      '/games',
      '/news',
      '/collections',
      ...(platforms.data || []).map(p => `/games/${p.slug}`),
      ...(news.data || []).map(n => `/news/${n.slug}`),
      ...(collections.data || []).map(c => `/collections/${c.slug}`),
      ...(tags.data || []).map(t => `/tags/${t.name}`),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url}</loc>
    <changefreq>daily</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
    return xml;
  };

  const getRobotsTxt = async () => {
    const { data } = await supabase.from('site_settings').select('robots_txt').eq('id', 1).single();
    return data?.robots_txt || 'User-agent: *\nAllow: /';
  };

  return {
    name: 'vite-plugin-seo',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/robots.txt') {
          try {
            const content = await getRobotsTxt();
            res.setHeader('Content-Type', 'text/plain');
            res.end(content);
          } catch (e) {
            res.end('User-agent: *\nAllow: /');
          }
          return;
        }
        if (req.url === '/sitemap.xml') {
          try {
            const content = await getSitemap(req.headers.host || 'localhost:3000');
            res.setHeader('Content-Type', 'application/xml');
            res.end(content);
          } catch (e) {
            res.end('Error generating sitemap');
          }
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), seoPlugin(env)],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR === 'true' ? false : (process.env.NODE_ENV === 'development' && !process.env.APP_URL ? true : false),
    },
  };
});
