import HeroSection from '../components/home/HeroSection';
import Leaderboard from '../components/home/Leaderboard';
import LatestReviews from '../components/home/LatestReviews';

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-24 pb-10">
      <HeroSection />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
        <Leaderboard />
        <LatestReviews />
      </div>
    </div>
  );
}
