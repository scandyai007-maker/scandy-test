import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Search, ShieldCheck, Globe, Coins, Home, List, Gift, Newspaper, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [seo, setSeo] = useState<any>(null);
  
  // To test the "single language" condition, you can remove items from this array
  const supportedLanguages = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' }
  ];
  const [currentLang, setCurrentLang] = useState(supportedLanguages[0]);

  const location = useLocation();

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Fetch dynamic SEO settings if they exist
    api.getSiteSettings().then((data) => setSeo(data)).catch(console.error);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Top Rated', shortName: 'Top 10', path: '/', icon: Home },
    { name: 'Reviews', shortName: 'Reviews', path: '/games', icon: List },
    { name: 'Bonuses', shortName: 'Bonuses', path: '/collections', icon: Gift },
    { name: 'Industry News', shortName: 'News', path: '/news', icon: Newspaper },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 pb-16 md:pb-0">
      {seo && (
        <Helmet>
          <title>{seo.seo_title}</title>
          <meta name="description" content={seo.seo_description} />
          <meta name="keywords" content={seo.seo_keywords} />
          {/* Open Graph */}
          <meta property="og:title" content={seo.seo_title} />
          <meta property="og:description" content={seo.seo_description} />
          <meta property="og:site_name" content={seo.site_name} />
          <meta property="og:type" content="website" />
          {seo.og_image_url && <meta property="og:image" content={seo.og_image_url} />}
          {seo.canonical_base_url && <meta property="og:url" content={seo.canonical_base_url} />}
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seo.seo_title} />
          <meta name="twitter:description" content={seo.seo_description} />
          {seo.og_image_url && <meta name="twitter:image" content={seo.og_image_url} />}
          {/* Favicon */}
          {seo.favicon_url && <link rel="icon" href={seo.favicon_url} />}
          {/* Canonical URL */}
          {seo.canonical_base_url && <link rel="canonical" href={seo.canonical_base_url} />}
          {/* Google Search Console Verification */}
          {seo.google_site_verification && <meta name="google-site-verification" content={seo.google_site_verification} />}
          {/* Google Analytics */}
          {seo.google_analytics_id && (
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${seo.google_analytics_id}`}></script>
          )}
          {seo.google_analytics_id && (
            <script>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${seo.google_analytics_id}');`}</script>
          )}
        </Helmet>
      )}
      {/* Desktop Navbar */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-gray-900/90 backdrop-blur-md border-b border-gray-800/50 shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-10">
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 group active:scale-95 transition-transform">
                <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-[#111827] p-1.5 md:p-2 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-lg md:text-xl font-display font-bold text-white tracking-wide">
                  Trust<span className="text-amber-500">Rank</span>
                </span>
              </Link>
              
              {/* Desktop Nav Links */}
              <nav className="hidden md:flex space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors active:scale-95 ${
                      isActive(link.path)
                        ? 'bg-white/10 text-amber-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              {/* Language Selector */}
              {supportedLanguages.length > 1 && (
                <div className="hidden md:block relative">
                  <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    onBlur={() => setTimeout(() => setIsLangMenuOpen(false), 200)}
                    className="text-gray-400 hover:text-amber-400 transition-colors p-2 rounded-full hover:bg-white/5 active:scale-95"
                    aria-label="Toggle language"
                  >
                    <Globe className="h-5 w-5" />
                  </button>
                  
                  {isLangMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
                      {supportedLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setCurrentLang(lang);
                            setIsLangMenuOpen(false);
                            // In a real app, you would also initialize i18n change language here
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            currentLang.code === lang.code 
                              ? 'bg-amber-500/10 text-amber-500' 
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={toggleTheme}
                className="text-gray-400 hover:text-amber-400 transition-colors p-2 rounded-full hover:bg-white/5 active:scale-95"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16 md:pt-20">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation (App-like) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${
                  active ? 'text-amber-500' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''}`} />
                <span className="text-[10px] font-medium">{link.shortName}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 mt-16 md:mt-24 pb-8 md:pb-0">
        <div className="max-w-[1400px] mx-auto py-12 md:py-16 px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-8">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-[#111827] p-2 rounded-lg">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xl font-display font-bold text-white tracking-wide">
                  Trust<span className="text-amber-500">Rank</span>
                </span>
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Independent, data-driven reviews and rankings for premium online platforms. We analyze, verify, and rank so you can play with confidence.
              </p>
              <div className="flex items-center gap-2 text-amber-500/50">
                <Coins className="w-5 h-5" />
                <span className="text-xs font-medium tracking-widest uppercase">Verified Fair</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-0">
              <div>
                <h3 className="text-sm font-display font-semibold text-white uppercase tracking-wider mb-4 md:mb-6">Rankings</h3>
                <ul className="space-y-3 md:space-y-4">
                  <li><Link to="/" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Top 10 Overall</Link></li>
                  <li><Link to="/collections" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Best Bonuses</Link></li>
                  <li><Link to="/games" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Crypto Platforms</Link></li>
                  <li><Link to="/news" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Newest Additions</Link></li>
                </ul>
              </div>
              
              <div className="md:mt-8">
                <h3 className="text-sm font-display font-semibold text-white uppercase tracking-wider mb-4 md:mb-6">Resources</h3>
                <ul className="space-y-3 md:space-y-4">
                  <li><a href="#" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Review Methodology</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Player Guides</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Scam Alerts</a></li>
                </ul>
              </div>
            </div>
            
            <div className="hidden md:block">
              <h3 className="text-sm font-display font-semibold text-white uppercase tracking-wider mb-6">About Us</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Our Team</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Contact</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 md:mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-500 text-center md:text-left">
              {seo?.footer_copyright || '© 2026 TrustRank Analytics. All rights reserved. 18+ Only. Please play responsibly.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-xs text-gray-600 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">SSL Secured</span>
              <span className="text-xs text-gray-600 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">RNG Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
