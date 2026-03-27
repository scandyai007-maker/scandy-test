// Serverless Function for AI Content Fill Simulation
// This simulates the process of searching the web and generating content.

export default async function handler(req, res) {
  // Add CORS headers for local development if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  try {
    // Simulate thinking/searching/generating delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Intelligence: Detect if it's a Pakistan-related keyword
    const k = keyword.toLowerCase();
    const isPakistan = k.includes('pakistan') || k.includes('pak') || k.includes('pkr');
    
    // Realistic Mock Data Generation
    const name = keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const mockData = {
      name: name,
      slug: (keyword || 'new-platform').toLowerCase().replace(/\s+/g, '-'),
      affiliate_link: `https://example.com/go/${(keyword || 'platform').toLowerCase().replace(/\s+/g, '-')}`,
      category: isPakistan ? "Pakistan Premium" : "International Gaming",
      score: 9.2,
      bonus: isPakistan 
        ? "200% Welcome Bonus + 100 Free Spins (Up to 25,000 PKR)" 
        : "100% Match Bonus up to $1,000 + 50 Free Spins",
      features: [
        "Certified Fair Gaming (RNG)",
        isPakistan ? "Support JazzCash & EasyPaisa" : "Instant Crypto Payouts",
        "24/7 Priority Support",
        "Mobile App Available"
      ],
      tags: isPakistan ? ["PKR Accepted", "Verified", "High Bonus"] : ["Trusted", "Global", "Secure"],
      content: `
        <h3>About ${name}</h3>
        <p><strong>${name}</strong> is a top-tier gaming platform that has recently gained significant traction in the ${isPakistan ? 'Pakistan' : 'international'} market. It stands out for its commitment to security and player satisfaction.</p>
        
        <h3>Key Highights</h3>
        <ul>
          <li><strong>Generous Bonuses:</strong> New players at ${name} can enjoy a highly competitive welcome package designed to boost their initial bankroll.</li>
          <li><strong>Payment Flexibility:</strong> ${isPakistan ? 'Tailored for local players, supporting popular methods like JazzCash.' : 'Comprehensive support for global credit cards and cryptocurrencies.'}</li>
          <li><strong>Gaming Variety:</strong> From live dealer games to the latest slots, variety is at the heart of the experience.</li>
        </ul>
        
        <h3>Our Verdict</h3>
        <p>If you are looking for a reliable, fast-paying, and exciting platform, ${name} is an excellent choice. Its SEO-optimized infrastructure and user-centric design make it a standout in 2026.</p>
      `.trim(),
      seo_title: `${name} Review 2026: Is it Safe? Bonus & Login Guide`,
      seo_description: `Expert review of ${name}. Explore the latest bonus offers, security features, and ${isPakistan ? 'local payment options in Pakistan' : 'global gaming features'}. Join now for exclusive rewards.`,
      seo_keywords: `${keyword}, ${name} login, trusted platform, ${isPakistan ? 'best casino Pakistan' : 'online gaming review'}`,
      logo: isPakistan 
        ? "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=200&h=200&auto=format&fit=crop" // Professional Avatar/Logo Style
        : "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&h=200&auto=format&fit=crop"
    };

    return res.status(200).json(mockData);

  } catch (error) {
    console.error('AI Fill Error:', error);
    return res.status(500).json({ error: 'Failed to generate content' });
  }
}
