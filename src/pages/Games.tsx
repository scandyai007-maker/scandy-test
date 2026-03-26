import { useState, useEffect } from 'react';
import { Filter, Search, ChevronDown, Loader2 } from 'lucide-react';
import PlatformCard from '../components/PlatformCard';
import { api } from '../services/api';
import type { Platform } from '../types';

const categories = ['All Platforms', 'Crypto Casinos', 'Sports Betting', 'Live Dealer', 'High Roller', 'Fast Payouts'];

export default function Games() {
  const [activeCategory, setActiveCategory] = useState('All Platforms');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformsList, setPlatformsList] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await api.getPlatforms();
        setPlatformsList(data);
      } catch (err) {
        console.error('Failed to load games', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredPlatforms = platformsList.filter(p => {
    const matchesCategory = activeCategory === 'All Platforms' || p.category === activeCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12 border-b border-gray-800 pb-6 md:pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 md:mb-3">Platform Reviews</h1>
          <p className="text-sm md:text-base text-gray-400">Comprehensive analysis of the top-rated platforms.</p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative group flex-1 md:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500/50 focus:bg-gray-900 transition-all w-full md:w-64"
            />
          </div>
          <button className="p-2.5 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors active:scale-95 flex-shrink-0">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2 mb-6 md:mb-8 snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all snap-start active:scale-95 ${
              activeCategory === cat 
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' 
                : 'bg-gray-900/50 text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
        <div className="w-1 flex-shrink-0 sm:hidden"></div>
      </div>

      {/* Grid View */}
      {loading ? (
        <div className="flex justify-center items-center py-20 opacity-50">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
          {filteredPlatforms.map((platform, index) => (
            <PlatformCard key={platform.id} platform={platform} index={index} variant="grid" />
          ))}
        </div>
      )}
      
      {/* Load More */}
      <div className="mt-8 md:mt-12 flex justify-center">
        <button className="px-6 py-3 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm font-medium active:scale-95 transition-transform flex items-center gap-2 w-full sm:w-auto justify-center">
          Load More Platforms <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
