import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, ShieldCheck, Coins, Zap, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import type { Collection } from '../types';

const iconMap = {
  Coins,
  Trophy,
  Zap,
  ShieldCheck
};

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await api.getCollections();
        setCollections(data);
      } catch (err) {
        console.error('Failed to load collections', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header */}
      <div className="mb-8 md:mb-12 border-b border-gray-800 pb-6 md:pb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 md:mb-3">Curated Top Lists</h1>
        <p className="text-sm md:text-base text-gray-400">Expertly compiled rankings to help you find exactly what you're looking for.</p>
      </div>

      {/* Collections Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 opacity-50">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {collections.map((collection) => {
            const IconComponent = iconMap[collection.icon_name as keyof typeof iconMap] || Trophy;
            return (
              <Link 
                to={`/collections/${collection.slug}`} 
                key={collection.id} 
                className="glass-panel-interactive rounded-xl md:rounded-2xl overflow-hidden group flex flex-row md:flex-col h-28 md:h-auto active:scale-[0.98] md:active:scale-100 transition-transform"
              >
                {/* Image Side */}
                <div className="relative w-2/5 md:w-full h-full md:h-56 overflow-hidden flex-shrink-0">
                  <img 
                    src={collection.image} 
                    alt={collection.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 bg-gray-900/80 backdrop-blur-sm border border-gray-700 px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-full flex items-center gap-1 md:gap-1.5">
                    <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-500" />
                    <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">Top {collection.count} Games</span>
                  </div>
                </div>
                
                {/* Content Side */}
                <div className="p-3 md:p-6 lg:p-8 flex-1 flex flex-col justify-center min-w-0">
                  <h2 className="text-sm md:text-2xl font-display font-bold text-white mb-1 md:mb-3 group-hover:text-amber-400 transition-colors truncate md:whitespace-normal">
                    {collection.title}
                  </h2>
                  <p className="text-[10px] md:text-base text-gray-400 mb-2 md:mb-6 line-clamp-2 md:line-clamp-none">
                    {collection.description}
                  </p>
                  
                  <div className="flex items-center text-[10px] md:text-sm font-semibold text-amber-500 group-hover:text-amber-400 transition-colors mt-auto">
                    View Ranking <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-1.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}


    </div>
  );
}
