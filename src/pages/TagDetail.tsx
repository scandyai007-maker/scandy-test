import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tag, Loader2, Gamepad2, FileText, ChevronLeft, Clock } from 'lucide-react';
import { api } from '../services/api';
import type { Platform, News } from '../types';
import PlatformCard from '../components/PlatformCard';
import { formatDate } from '../utils/format';

export default function TagDetail() {
  const { name } = useParams<{ name: string }>();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!name) return;
      try {
        setLoading(true);
        const [platformsData, newsData] = await Promise.all([
          api.getPlatformsByTag(name),
          api.getNewsByTag(name)
        ]);
        setPlatforms(platformsData);
        setNews(newsData);
      } catch (err) {
        console.error('Failed to load tag data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [name]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin opacity-50" />
      </div>
    );
  }

  const hasContent = platforms.length > 0 || news.length > 0;

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 max-w-[1200px] mx-auto min-h-screen">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-amber-400 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
      </Link>
      
      <div className="mb-12">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-4">
          <Tag className="w-5 h-5" />
          <span className="font-display font-bold text-lg uppercase tracking-wider">{name}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
          Browsing Tag: <span className="text-amber-500">#{name}</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Explore all the platforms, reviews, and latest news tagged with {name}.
        </p>
      </div>

      {!hasContent && (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-900/50 rounded-2xl border border-gray-800 text-center">
          <Tag className="w-16 h-16 text-gray-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Content Found</h2>
          <p className="text-gray-400">There are currently no platforms or news articles associated with this tag.</p>
        </div>
      )}

      {platforms.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Gamepad2 className="w-5 h-5 text-[#111827]" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Apps & Platforms</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, i) => (
              <PlatformCard key={platform.id} platform={platform} index={i} variant="grid" />
            ))}
          </div>
        </div>
      )}

      {news.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <FileText className="w-5 h-5 text-[#111827]" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">News & Articles</h2>
          </div>
          <div className="space-y-3 md:space-y-6">
            {news.map((item) => (
              <Link key={item.id} to={`/news/${item.slug}`} className="glass-panel-interactive rounded-xl p-3 md:p-5 flex flex-row gap-3 md:gap-6 group active:scale-[0.98] md:active:scale-100 transition-transform h-28 md:h-auto">
                <div className="w-2/5 md:w-56 h-full md:h-auto md:aspect-video rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm text-gray-400 mb-1 md:mb-2">
                    <span className="text-emerald-500 font-medium px-1.5 py-0.5 md:px-2 md:py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 truncate">
                      {item.category}
                    </span>
                    <span className="flex items-center flex-shrink-0"><Clock className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" /> {formatDate(item.created_at)}</span>
                  </div>
                  <h3 className="text-sm md:text-xl font-display font-bold text-white mb-1 md:mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="hidden md:block text-sm text-gray-400 line-clamp-2 mb-4">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center text-[10px] md:text-sm font-medium text-gray-300 group-hover:text-amber-400 transition-colors mt-auto">
                    Read Article &rarr;
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
