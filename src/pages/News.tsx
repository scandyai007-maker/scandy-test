import { useState, useEffect } from 'react';
import { ChevronRight, Clock, MessageSquare, TrendingUp, Filter, Loader2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { News as NewsType, Platform } from '../types';
import { formatDate } from '../utils/format';

const categories = ['All News', 'Industry Updates', 'Game Releases', 'Regulations', 'Bonus Offers'];

export default function News() {
  const [activeCategory, setActiveCategory] = useState('All News');
  const [regularNews, setRegularNews] = useState<NewsType[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [trendingTags, setTrendingTags] = useState<any[]>([]);
  const [topPlatforms, setTopPlatforms] = useState<Platform[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [newsData, tagsData, platformsData] = await Promise.all([
          api.getNews(activeCategory),
          api.getTags(10),
          api.getPlatforms(10)
        ]);

        setTrendingTags(tagsData || []);
        setTopPlatforms(platformsData || []);

        if (activeCategory === 'All News') {
          const featured = await api.getFeaturedNews();
          setFeaturedNews(featured);
          setRegularNews(newsData.filter(n => n.id !== featured.id));
        } else {
          setFeaturedNews(null);
          setRegularNews(newsData);
        }
      } catch (err) {
        console.error('Failed to load news', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeCategory]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

      {/* Header */}
      <div className="mb-8 md:mb-12 border-b border-gray-800 pb-6 md:pb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 md:mb-3">Industry News & Insights</h1>
        <p className="text-sm md:text-base text-gray-400">Stay informed with the latest updates, regulatory changes, and exclusive offers.</p>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2 mb-6 md:mb-8 snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all snap-start active:scale-95 ${activeCategory === cat
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                : 'bg-gray-900/50 text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-gray-200'
              }`}
          >
            {cat}
          </button>
        ))}
        {/* Invisible spacer to ensure right padding works in all browsers */}
        <div className="w-1 flex-shrink-0 sm:hidden"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-3 md:space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-20 opacity-50">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Featured News */}
              {featuredNews && activeCategory === 'All News' && (
                <Link to={`/news/${featuredNews.slug}`} className="glass-panel-interactive rounded-xl md:rounded-2xl overflow-hidden flex flex-row md:flex-col group active:scale-[0.98] md:active:scale-100 transition-transform h-32 md:h-auto">
                  <div className="relative w-2/5 md:w-full h-full md:aspect-[2/1] overflow-hidden flex-shrink-0">
                    <img
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-amber-500 text-[#111827] text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-md uppercase tracking-wider shadow-lg z-20">
                      Featured
                    </div>
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent z-10"></div>
                    <div className="hidden md:block absolute bottom-0 left-0 p-6 md:p-8 w-full z-20">
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 mb-4">
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {formatDate(featuredNews.created_at)}</span>
                        <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-1.5" /> {featuredNews.comments_count} Comments</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                        {featuredNews.title}
                      </h2>
                      <p className="text-gray-300 line-clamp-2 max-w-3xl">
                        {featuredNews.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Content for Featured News */}
                  <div className="md:hidden p-3 flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
                      <span className="text-amber-500 font-medium truncate">{featuredNews.category}</span>
                      <span className="flex items-center flex-shrink-0"><Clock className="w-3 h-3 mr-1" /> {formatDate(featuredNews.created_at)}</span>
                    </div>
                    <h2 className="text-sm font-display font-bold text-white mb-1 line-clamp-2">
                      {featuredNews.title}
                    </h2>
                    <p className="text-[10px] text-gray-400 line-clamp-2 mb-2">
                      {featuredNews.excerpt}
                    </p>
                    <div className="flex items-center text-[10px] font-medium text-amber-500 mt-auto">
                      Read Article <ChevronRight className="w-3 h-3 ml-0.5" />
                    </div>
                  </div>
                </Link>
              )}

              {/* Regular News List */}
              <div className="space-y-3 md:space-y-6">
                {regularNews.map((news) => (
                  <Link to={`/news/${news.slug}`} key={news.id} className="glass-panel-interactive rounded-xl p-3 md:p-5 flex flex-row gap-3 md:gap-6 group active:scale-[0.98] md:active:scale-100 transition-transform h-28 md:h-auto">
                    <div className="w-2/5 md:w-48 h-full md:h-auto md:aspect-video rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-400 mb-1 md:mb-2">
                        <span className="text-amber-500 font-medium px-1.5 py-0.5 md:px-2 md:py-0.5 rounded bg-amber-500/10 border border-amber-500/20 truncate">
                          {news.category}
                        </span>
                        <span className="flex items-center flex-shrink-0"><Clock className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" /> {formatDate(news.created_at)}</span>
                      </div>
                      <h3 className="text-sm md:text-lg font-display font-bold text-white mb-1 md:mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-[10px] md:text-sm text-gray-400 line-clamp-2 mb-2 md:mb-4">
                        {news.excerpt}
                      </p>
                      <div className="flex items-center text-[10px] md:text-sm font-medium text-gray-300 group-hover:text-amber-400 transition-colors mt-auto">
                        Read Article <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-0.5 md:ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Load More */}
          <div className="mt-8 md:mt-10 flex justify-center">
            <button className="px-6 py-3 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm font-medium active:scale-95 transition-transform flex items-center gap-2 w-full sm:w-auto justify-center">
              Load More Articles
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 md:space-y-8">

          {/* Trending Topics */}
          <div className="glass-panel rounded-xl md:rounded-2xl p-5 md:p-6">
            <h3 className="text-base md:text-lg font-display font-bold text-white mb-4 md:mb-5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-amber-500" /> Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.length > 0 ? trendingTags.map(tag => (
                <Link to={`/tags/${tag.name}`} key={tag.id} className="bg-gray-900 border border-gray-800 text-gray-300 text-[10px] md:text-xs font-medium px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-md hover:border-amber-500/50 hover:text-amber-400 transition-colors active:scale-95">
                  #{tag.name}
                </Link>
              )) : (
                <div className="text-gray-500 text-sm">No topics available</div>
              )}
            </div>
          </div>

          {/* Top 10 Platforms */}
          <div className="glass-panel rounded-xl md:rounded-2xl p-5 md:p-6">
            <h3 className="text-base md:text-lg font-display font-bold text-white mb-4 md:mb-5 flex items-center gap-2">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-500 fill-amber-500" /> Top 10 Platforms
            </h3>
            <div className="space-y-3 md:space-y-4">
              {topPlatforms.map((p, i) => (
                <Link to={`/games/${p.slug}`} key={p.id} className="flex items-center gap-3 group active:scale-95 transition-transform">
                  <div className={`text-sm md:text-base font-display font-bold w-5 text-center ${
                    i < 3 ? 'text-amber-500' : 'text-gray-600'
                  }`}>
                    {i + 1}
                  </div>
                  <img src={p.logo} alt={p.name} className="w-8 h-8 md:w-10 md:h-10 rounded-lg border border-gray-700 object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs md:text-sm font-medium text-gray-200 group-hover:text-amber-400 transition-colors truncate">{p.name}</h4>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      {p.score}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
