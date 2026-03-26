import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Star, ExternalLink, ShieldCheck, Gift, Trophy, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import type { Collection, CollectionPlatform, Platform } from '../types';
import { stripHtml } from '../utils/format';
import PlatformCard from '../components/PlatformCard';

export default function CollectionDetail() {
  const { slug } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [bridges, setBridges] = useState<CollectionPlatform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        setLoading(true);
        const colData = await api.getCollectionBySlug(slug);
        const platformsData = await api.getCollectionPlatforms(colData.id);
        setCollection(colData);
        setBridges(platformsData);
      } catch (err) {
        console.error('Failed to load collection details', err);
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

  if (!collection) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-display font-bold text-white mb-4">Collection Not Found</h1>
        <p className="text-gray-400 mb-8">The list you are looking for does not exist.</p>
        <Link to="/collections" className="px-6 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors">
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative pt-20 pb-16 border-b border-gray-800 bg-gray-900/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8">
          <Link to="/collections" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-amber-400 mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Lists
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <span className={`bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider`}>
              <Trophy className="w-3.5 h-3.5" /> Curated Ranking
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
            {collection.title}
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Ranked List */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 mt-12">
        <div className="space-y-6">
          {bridges.map((bridge, index) => {
            const platform = bridge.platforms as unknown as Platform;
            if (!platform) return null;
            return (
              <PlatformCard 
                key={bridge.id || index} 
                platform={platform} 
                index={index} 
                variant="leaderboard" 
                rank={bridge.rank}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
