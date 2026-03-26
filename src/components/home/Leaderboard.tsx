import { useState, useEffect } from 'react';
import { ArrowRight, Trophy, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PlatformCard from '../PlatformCard';
import { api } from '../../services/api';
import type { Platform } from '../../types';

export default function Leaderboard() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getPlatforms(5);
        setPlatforms(data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section id="leaderboard">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-2 md:gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white flex items-center gap-2 md:gap-3">
            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-amber-500" /> 
            Top Rated Platforms
          </h2>
          <p className="text-sm md:text-base text-gray-400 mt-1 md:mt-2">Our rigorously tested and verified recommendations.</p>
        </div>
        <Link to="/games" className="hidden sm:flex text-sm font-medium text-amber-500 hover:text-amber-400 items-center gap-1 transition-colors active:scale-95">
          Complete Ranking <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-10 opacity-50">
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-amber-500 animate-spin" />
          </div>
        ) : (
          platforms.map((platform, index) => (
            <PlatformCard key={platform.id} platform={platform} index={index} variant="leaderboard" />
          ))
        )}
      </div>
      
      {/* Mobile View All Link */}
      <div className="mt-6 flex justify-center sm:hidden">
        <Link to="/games" className="px-6 py-3 rounded-lg bg-gray-900 border border-gray-800 text-sm font-medium text-white active:scale-95 transition-transform flex items-center gap-2 w-full justify-center">
          View Complete Ranking <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
