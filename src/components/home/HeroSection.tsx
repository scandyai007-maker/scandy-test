import { Trophy, Dices, ShieldCheck, Star, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative pt-12 md:pt-20 pb-20 md:pb-32 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-amber-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900/80 border border-gray-800 text-xs md:text-sm text-gray-300 mb-6 md:mb-8 backdrop-blur-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Updated for March 2026
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 md:mb-6 tracking-tight leading-tight"
        >
          Discover <span className="text-gold-gradient">Trusted</span> Platforms
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2"
        >
          Expert reviews, verified bonuses, and real player feedback. We analyze the data so you can play with confidence.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4 sm:px-0"
        >
          <button 
            onClick={() => document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#111827] font-bold transition-transform active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" /> View Top 10 List
          </button>
          <Link 
            to="/collections" 
            className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-medium transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Dices className="w-5 h-5 text-gray-400" /> Compare Bonuses
          </Link>
        </motion.div>
        
        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-gray-800/50 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 md:gap-16 opacity-80 md:opacity-60 px-4 md:justify-center"
        >
          <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-300 whitespace-nowrap snap-center">
            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" /> 150+ Verified
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-300 whitespace-nowrap snap-center">
            <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-500" /> 10k+ Reviews
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-300 whitespace-nowrap snap-center pr-4 md:pr-0">
            <Gift className="w-4 h-4 md:w-5 md:h-5 text-blue-500" /> $5M+ Claimed
          </div>
        </motion.div>
      </div>
    </section>
  );
}
