import { useState, useEffect } from 'react';
import { ArrowRight, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '../../services/api';

export default function LatestReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getLatestReviews(3);
        setReviews(data);
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-2 md:gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Latest Analysis</h2>
          <p className="text-sm md:text-base text-gray-400 mt-1 md:mt-2">In-depth reviews and industry insights.</p>
        </div>
        <Link to="/news" className="hidden sm:flex text-sm font-medium text-amber-500 hover:text-amber-400 items-center gap-1 transition-colors active:scale-95">
          View All Articles <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {loading ? (
          <div className="col-span-1 md:col-span-3 flex justify-center py-12 opacity-50">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={`/news/${review.slug}`} className="glass-panel-interactive rounded-xl overflow-hidden group active:scale-[0.98] md:active:scale-100 transition-transform flex flex-row md:flex-col h-24 md:h-auto">
                <div className="relative w-1/3 md:w-full h-full md:h-48 overflow-hidden flex-shrink-0">
                  <img 
                    src={review.image} 
                    alt={review.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 md:top-3 md:right-3 md:left-auto bg-gray-900/80 backdrop-blur-sm border border-gray-700 px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-md flex items-center gap-1 md:gap-1.5">
                    <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-[10px] md:text-sm font-bold text-white">{review.rating}</span>
                  </div>
                </div>
                <div className="p-3 md:p-5 flex-1 flex flex-col justify-center min-w-0">
                  <div className="text-[10px] md:text-xs text-gray-500 mb-1 md:mb-2">{review.date}</div>
                  <h3 className="text-sm md:text-lg font-display font-semibold text-gray-200 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {review.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
