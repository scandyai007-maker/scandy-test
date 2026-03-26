import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Clock, User, Twitter, Facebook, Link as LinkIcon, Loader2, Star, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import type { News, Platform } from '../types';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { formatDate } from '../utils/format';

export default function NewsDetail() {
  const { slug } = useParams();
  const [news, setNews] = useState<News | null>(null);
  const [relatedPlatforms, setRelatedPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await api.getNewsBySlug(slug);
        setNews(data);

        // Load related platforms by tags
        if (data.tags && data.tags.length > 0) {
          const platforms = await api.getPlatformsByTags(data.tags);
          setRelatedPlatforms(platforms);
        }
      } catch (err) {
        console.error('Failed to load news detail', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin opacity-50" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-display font-bold text-white mb-4">Article Not Found</h1>
        <p className="text-gray-400 mb-8">The news article you are looking for does not exist.</p>
        <Link to="/news" className="px-6 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors">
          Browse News
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <Helmet>
        <title>{news.seo_title || `${news.title} - GamePortal News`}</title>
        <meta name="description" content={news.seo_description || news.excerpt} />
        {news.seo_keywords && <meta name="keywords" content={news.seo_keywords} />}
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative pt-20 pb-14 overflow-hidden">
        {/* Blurred background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={news.image}
            alt=""
            className="w-full h-full object-cover opacity-15 blur-md scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-body)]/60 via-[var(--bg-body)]/85 to-[var(--bg-body)]" />
        </div>

        <div className="relative z-10 max-w-[800px] mx-auto px-6 lg:px-8">
          {/* Back link */}
          <Link to="/news" className="inline-flex items-center text-sm text-gray-500 hover:text-amber-400 mb-10 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to News
          </Link>

          {/* Category + tags */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
              {news.category}
            </span>
            {news.tags?.map(tag => (
              <Link key={tag} to={`/tags/${tag}`} className="text-xs text-gray-500 hover:text-amber-400 transition-colors">
                #{tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-display font-bold text-white leading-[1.1] mb-8 tracking-tight">
            {news.title}
          </h1>

          {/* Meta row: author · date · socials */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {(news as any).author || 'System'}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(news.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 rounded-md text-gray-600 hover:text-gray-300 transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-md text-gray-600 hover:text-gray-300 transition-colors">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-md text-gray-600 hover:text-gray-300 transition-colors">
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Article body ─────────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto px-6 lg:px-8">

        {/* Excerpt — large lead paragraph with left accent */}
        {news.excerpt && (
          <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed pl-5 border-l-2 border-amber-500 mb-10">
            {news.excerpt}
          </p>
        )}

        {/* Body */}
        <div className="prose prose-invert prose-lg max-w-none
          prose-p:text-gray-400 prose-p:leading-[1.85]
          prose-headings:font-display prose-headings:text-white prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl
          prose-a:text-amber-500 prose-a:no-underline hover:prose-a:text-amber-400
          prose-strong:text-white
          prose-blockquote:border-l-amber-500 prose-blockquote:text-gray-400 prose-blockquote:not-italic
          prose-hr:border-gray-800
          prose-img:rounded-xl
        ">
          {news.content ? (
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content) }} />
          ) : (
            <p>
              More details about this breaking news update will be published shortly as the situation develops.
              Stay tuned for deeper coverage on the regulatory impact and how players will be affected.
            </p>
          )}
        </div>

        {/* Tags footer */}
        {news.tags && news.tags.length > 0 && (
          <div className="mt-14 pt-8 border-t border-gray-800/60 flex flex-wrap gap-2">
            {news.tags.map(tag => (
              <Link
                key={tag}
                to={`/tags/${tag}`}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-800/60 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

      </div>

      {/* Related Platforms Section */}
      {relatedPlatforms.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20">
          <div className="flex items-center justify-between mb-4 md:mb-6 border-b border-gray-800 pb-3">
            <h2 className="text-lg md:text-2xl font-display font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-500 fill-amber-500" /> Related Platforms
            </h2>
            <Link to="/games" className="text-xs md:text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Link>
          </div>

          {/* Desktop: 5-col grid */}
          <div className="hidden md:grid md:grid-cols-5 gap-4">
            {relatedPlatforms.map((p) => (
              <Link
                to={`/games/${p.slug}`}
                key={p.id}
                className="group glass-panel-interactive rounded-xl p-4 flex flex-col items-center text-center hover:border-amber-500/30 transition-all"
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  className="w-14 h-14 rounded-xl border border-gray-700 object-cover mb-3 group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <h4 className="text-sm font-display font-bold text-white group-hover:text-amber-400 transition-colors truncate w-full mb-1">{p.name}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {p.score}
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile: compact horizontal list */}
          <div className="md:hidden space-y-2">
            {relatedPlatforms.map((p, i) => (
              <Link
                to={`/games/${p.slug}`}
                key={p.id}
                className="group glass-panel-interactive rounded-xl p-3 flex items-center gap-3 active:scale-[0.98] transition-transform"
              >
                <div className={`text-xs font-display font-bold w-4 text-center ${i < 3 ? 'text-amber-500' : 'text-gray-600'}`}>
                  {i + 1}
                </div>
                <img
                  src={p.logo}
                  alt={p.name}
                  className="w-9 h-9 rounded-lg border border-gray-700 object-cover flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-display font-bold text-white truncate">{p.name}</h4>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {p.score}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
