import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, ExternalLink, ChevronLeft, CheckCircle2, XCircle, Gift, Clock, Globe, Loader2, TrendingUp, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import type { Platform, News } from '../types';
import { formatDate } from '../utils/format';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';

export default function GameDetail() {
  const { slug } = useParams();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [similar, setSimilar] = useState<Platform[]>([]);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await api.getPlatformBySlug(slug);
        setPlatform(data);

        // Load similar platforms by category
        const simData = await api.getPlatformsByCategory(data.category);
        setSimilar(simData.filter(p => p.id !== data.id).slice(0, 3));

        // Load related news by tags
        if (data.tags && data.tags.length > 0) {
          const newsData = await api.getNewsByTags(data.tags);
          setRelatedNews(newsData);
        }
      } catch (err) {
        console.error('Failed to load platform details', err);
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

  if (!platform) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-display font-bold text-white mb-4">Platform Not Found</h1>
        <p className="text-gray-400 mb-8">The platform you are looking for does not exist or has been removed.</p>
        <Link to="/games" className="px-6 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors">
          Browse All Platforms
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Helmet>
        <title>{platform.seo_title || `${platform.name} - Reviews, Bonuses & Features`}</title>
        <meta name="description" content={platform.seo_description || `Read our comprehensive review of ${platform.name}. Discover exclusive bonuses, features, and player ratings.`} />
        {platform.seo_keywords && <meta name="keywords" content={platform.seo_keywords} />}
      </Helmet>

      {/* Hero Section */}
      <div className="relative pt-16 md:pt-20 pb-12 md:pb-16 border-b border-gray-800 bg-gray-900/30">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/games" className="inline-flex items-center text-xs md:text-sm font-medium text-gray-400 hover:text-amber-400 mb-6 md:mb-8 transition-colors active:scale-95">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Reviews
          </Link>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Desktop & Mobile Header Shared Logic */}
            <div className="flex items-center md:items-start gap-4 md:gap-8 w-full md:w-auto">
              {/* Logo */}
              <div className="w-16 h-16 md:w-32 md:h-32 rounded-xl md:rounded-2xl overflow-hidden border border-gray-700 flex-shrink-0 bg-gray-900 shadow-2xl">
                <img
                  src={platform.logo}
                  alt={`${platform.name} Logo`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Mobile Title & Score Block */}
              <div className="md:hidden flex-1 min-w-0">
                <h1 className="text-xl font-display font-bold text-white truncate mb-1">
                  {platform.name}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-display font-bold text-white">{platform.score}</span>
                  </div>
                  {platform.is_verified && (
                    <span className="text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>

              {/* Desktop Title Block (Hidden on Mobile) */}
              <div className="hidden md:block flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {platform.is_verified && (
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Secure
                    </span>
                  )}
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {platform.category}
                  </span>
                  {platform.tags?.map(tag => (
                    <Link key={tag} to={`/tags/${tag}`} className="bg-gray-800 border border-gray-700 hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-400 text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors">
                      #{tag}
                    </Link>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                  {platform.name} Review
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl">
                  A premium destination for players, offering extensive features like {(platform.features || []).join(', ').toLowerCase()}.
                </p>
              </div>
            </div>

            {/* Mobile Tags & Claim Block */}
            <div className="md:hidden w-full space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {platform.category}
                </span>
                {platform.tags?.slice(0, 3).map(tag => (
                  <Link key={tag} to={`/tags/${tag}`} className="bg-gray-800 border border-gray-700 text-gray-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    #{tag}
                  </Link>
                ))}
              </div>
              <button className="w-full py-3.5 rounded-xl bg-amber-500 text-[#111827] font-bold active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2">
                Claim Bonus <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop Score & CTA (Hidden on Mobile) */}
            <div className="hidden md:flex flex-col gap-4 w-full md:w-auto md:min-w-[240px]">
              <div className="glass-panel-gold rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <div className="text-xs text-amber-500/80 uppercase tracking-wider font-bold mb-1">Trust Score</div>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                  <span className="text-4xl font-display font-bold text-white">{platform.score}</span>
                  <span className="text-lg text-gray-500">/10</span>
                </div>
              </div>
              <button className="w-full px-6 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#111827] font-bold transition-transform active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2">
                Claim Bonus <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">

          {/* Bonus Offer */}
          {platform.bonus && (
            <div className="flex items-start gap-3 px-4 py-3 sm:px-5 sm:py-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
              <Gift className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-[11px] text-amber-500/70 font-bold uppercase tracking-widest mb-1">Exclusive Welcome Offer</div>
                <div className="text-base sm:text-lg font-bold text-amber-400 leading-snug">{platform.bonus}</div>
                <p className="text-gray-500 text-[11px] mt-1">T&C apply. Check platform website for wagering requirements.</p>
              </div>
            </div>
          )}

          {/* Key Features & Limitations — compact two-col on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {(platform.features || []).length > 0 && (
              <div className="rounded-xl bg-gray-900/60 border border-gray-800 p-4">
                <h3 className="text-sm font-display font-bold text-white mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Features
                </h3>
                <ul className="space-y-1.5">
                  {platform.features.map((feature, i) => (
                    <li key={`pro-${i}`} className="flex items-start gap-2 text-gray-300 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-xl bg-gray-900/60 border border-gray-800 p-4">
              <h3 className="text-sm font-display font-bold text-white mb-3 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-500" /> Limitations
              </h3>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-gray-300 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  Check local regulations before playing
                </li>
                <li className="flex items-start gap-2 text-gray-300 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  Bonus terms may change
                </li>
              </ul>
            </div>
          </div>

          {/* Rich text content */}
          {platform.content && (
            <section className="prose prose-invert prose-sm sm:prose-base max-w-none
              prose-p:text-gray-400 prose-p:leading-relaxed
              prose-headings:font-display prose-headings:text-white
              prose-a:text-amber-500 hover:prose-a:text-amber-400
              prose-strong:text-white prose-hr:border-gray-800">
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(platform.content || '') }} />
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 md:space-y-8">
          {/* Quick Facts */}
          <div className="glass-panel rounded-xl md:rounded-2xl p-5 md:p-6">
            <h3 className="text-base md:text-lg font-display font-bold text-white mb-4 md:mb-6">Quick Facts</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center py-2.5 md:py-3 border-b border-gray-800">
                <span className="text-gray-400 text-xs md:text-sm flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" /> Category</span>
                <span className="text-white text-xs md:text-sm font-medium">{platform.category}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 md:py-3 border-b border-gray-800">
                <span className="text-gray-400 text-xs md:text-sm flex items-center gap-2"><Globe className="w-3.5 h-3.5 md:w-4 md:h-4" /> Global Access</span>
                <span className="text-white text-xs md:text-sm font-medium">Available</span>
              </div>
              <div className="flex justify-between items-center py-2.5 md:py-3 border-b border-gray-800">
                <span className="text-gray-400 text-xs md:text-sm flex items-center gap-2"><Clock className="w-3.5 h-3.5 md:w-4 md:h-4" /> Payouts</span>
                <span className="text-white text-xs md:text-sm font-medium">&lt; 24 Hours</span>
              </div>
            </div>
          </div>

          {/* Similar Platforms */}
          {similar.length > 0 && (
            <div className="glass-panel rounded-xl md:rounded-2xl p-5 md:p-6">
              <h3 className="text-base md:text-lg font-display font-bold text-white mb-4 md:mb-6">Similar Platforms</h3>
              <div className="space-y-3 md:space-y-4">
                {similar.map(sim => (
                  <Link to={`/games/${sim.slug}`} key={sim.id} className="flex items-center gap-3 md:gap-4 group p-2 -mx-2 rounded-lg hover:bg-gray-800/50 transition-colors active:scale-95">
                    <img src={sim.logo} alt={sim.name} className="w-10 h-10 md:w-12 md:h-12 rounded-lg border border-gray-700 object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-display font-bold text-white group-hover:text-amber-400 transition-colors truncate mb-0.5 md:mb-1">{sim.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-amber-500 text-amber-500" />
                        <span className="text-[10px] md:text-xs text-gray-400 font-medium">{sim.score} Score</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>

      {/* Related News Section — outside the grid */}
      {relatedNews.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20">
          <div className="flex items-center justify-between mb-4 md:mb-6 border-b border-gray-800 pb-3">
            <h2 className="text-lg md:text-2xl font-display font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-amber-500" /> Related News
            </h2>
            <Link to="/news" className="text-xs md:text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Link>
          </div>

          {/* Desktop: 3-col vertical cards */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {relatedNews.map((news) => (
              <Link
                to={`/news/${news.slug}`}
                key={news.id}
                className="group flex flex-col glass-panel-interactive rounded-xl overflow-hidden hover:border-amber-500/30 transition-all"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-sm text-[#111827] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {news.category}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-2">
                    <Clock className="w-3 h-3" /> {formatDate(news.created_at)}
                  </div>
                  <h3 className="text-sm font-display font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2 leading-snug">
                    {news.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                    {news.excerpt}
                  </p>
                  <div className="mt-auto pt-3 border-t border-gray-800 flex items-center text-xs font-semibold text-gray-300 group-hover:text-amber-400 transition-colors">
                    Read More <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile: compact horizontal cards */}
          <div className="md:hidden space-y-3">
            {relatedNews.map((news) => (
              <Link
                to={`/news/${news.slug}`}
                key={news.id}
                className="group glass-panel-interactive rounded-xl p-3 flex flex-row gap-3 active:scale-[0.98] transition-transform h-28"
              >
                <div className="w-2/5 h-full rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-amber-500/90 backdrop-blur-sm text-[#111827] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    {news.category}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
                    <Clock className="w-3 h-3 flex-shrink-0" /> {formatDate(news.created_at)}
                  </div>
                  <h3 className="text-sm font-display font-bold text-white line-clamp-2 mb-1 leading-snug">
                    {news.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 line-clamp-2">
                    {news.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
