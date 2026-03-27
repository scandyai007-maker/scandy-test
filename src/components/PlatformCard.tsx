import { Link } from 'react-router-dom';
import { Star, ShieldCheck, Gift, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { Platform } from '../types';
import { stripHtml } from '../utils/format';

interface PlatformCardProps {
  key?: number | string;
  platform: Platform;
  index: number;
  variant?: 'leaderboard' | 'grid';
  rank?: number;
}

export default function PlatformCard({ platform, index, variant = 'grid', rank }: PlatformCardProps) {
  const isLeaderboard = variant === 'leaderboard';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
        isLeaderboard && index === 0 
          ? 'glass-panel-gold z-10' 
          : 'glass-panel-interactive'
      } ${!isLeaderboard ? 'flex flex-col h-full active:scale-[0.98] md:active:scale-100' : ''}`}
    >
      {isLeaderboard && (
        <div className={`absolute top-0 left-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-display font-bold text-sm md:text-base rounded-br-xl z-20 ${
          index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-[#111827]' : 
          index === 1 ? 'bg-gradient-to-br from-[#d1d5db] to-[#6b7280] text-[#111827]' :
          index === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-900 text-[#ffffff]' :
          'bg-gray-800 text-gray-400'
        }`}>
          #{rank || index + 1}
        </div>
      )}

      {/* Mobile Compact Layout */}
      <div className={`md:hidden ${isLeaderboard ? 'p-4 pt-5' : 'flex p-3 gap-3 items-center'}`}>
        {isLeaderboard ? (
          <>
            <div className="flex items-center gap-3 mb-4 pl-6">
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/10 flex-shrink-0 bg-gray-900 shadow-2xl">
                <img src={platform.logo} alt={platform.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-display font-bold text-white truncate">{platform.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Gift className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-amber-500 uppercase tracking-tight">
                    {stripHtml(platform.bonus)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 ml-2">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span className="text-2xl font-display font-bold text-white">{platform.score}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to={`/games/${platform.slug}`} className="flex-1 py-3.5 rounded-xl bg-gray-800/50 text-white text-sm font-bold text-center border border-gray-700 active:scale-95 transition-transform">
                Review
              </Link>
              <a 
                href={platform.affiliate_link || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex-[1.8] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform ${
                  index === 0 ? 'bg-amber-500 text-[#111827]' : 'bg-emerald-600 text-[#ffffff]'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                Play Now <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0 bg-gray-900">
              <img src={platform.logo} alt={platform.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-display font-bold text-white truncate pr-2">{platform.name}</h3>
                <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded-md flex-shrink-0">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-bold text-white">{platform.score}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Gift className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="text-[10px] font-medium text-amber-400 truncate">{stripHtml(platform.bonus)}</span>
              </div>
              <div className="flex gap-2 mt-auto">
                <Link to={`/games/${platform.slug}`} className="px-3 py-1.5 rounded-md bg-gray-800 text-white text-[10px] font-medium text-center border border-gray-700" onClick={(e) => e.stopPropagation()}>Review</Link>
                <a 
                  href={platform.affiliate_link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 rounded-md bg-emerald-600 text-[#ffffff] text-[10px] font-bold flex items-center justify-center gap-1" 
                  onClick={(e) => e.stopPropagation()}
                >
                  Play <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Desktop Detailed Layout */}
      <div className={`hidden md:flex ${isLeaderboard ? 'p-6 flex-row items-center gap-6' : 'flex-col p-5 h-full'}`}>
        {isLeaderboard ? (
          <>
            <div className="flex items-center gap-5 w-1/3 pl-6">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0 bg-gray-900">
                <img src={platform.logo} alt={platform.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white mb-1">{platform.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {platform.tags?.map(tag => (
                    <Link key={tag} to={`/tags/${tag}`} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-all">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-1/3 flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <Gift className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-amber-400">{stripHtml(platform.bonus)}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {platform.features.slice(0, 2).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-1/3 flex items-center justify-end gap-6">
              <div className="flex flex-col items-end">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Trust Score</div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span className="text-2xl font-display font-bold text-white">{platform.score}</span>
                  <span className="text-sm text-gray-500">/10</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <a 
                  href={platform.affiliate_link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`px-6 py-2.5 rounded-lg font-semibold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2 ${
                    index === 0 
                      ? 'bg-amber-500 hover:bg-amber-400 text-[#111827] shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-[#ffffff]'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  Play Now <ExternalLink className="w-4 h-4" />
                </a>
                <Link to={`/games/${platform.slug}`} className="text-xs text-center text-gray-400 hover:text-white transition-colors">
                  Read Review
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0 bg-gray-900">
                <img 
                  src={platform.logo} 
                  alt={platform.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-lg font-display font-bold text-white truncate">
                    {platform.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-md flex-shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-bold text-white">{platform.score}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="truncate">{platform.category}</span>
                  {platform.is_verified && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0"></span>
                      <span className="flex items-center text-emerald-500 flex-shrink-0">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-3 mb-5 border border-gray-800/50 flex-grow">
              <div className="flex items-start gap-2 mb-3">
                <Gift className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-amber-400 leading-tight">{stripHtml(platform.bonus)}</span>
              </div>
              <div className="space-y-1.5">
                {platform.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-1 h-1 rounded-full bg-gray-600 flex-shrink-0"></div>
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-auto">
              <Link 
                to={`/games/${platform.slug}`} 
                className="flex-1 py-2.5 rounded-lg bg-gray-800 text-white text-sm font-medium text-center border border-gray-700 active:scale-95 transition-transform"
                onClick={(e) => e.stopPropagation()}
              >
                Review
              </Link>
              <a 
                href={platform.affiliate_link || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-[2] py-2.5 rounded-lg bg-emerald-600 text-[#ffffff] text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                onClick={(e) => e.stopPropagation()}
              >
                Play Now <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
