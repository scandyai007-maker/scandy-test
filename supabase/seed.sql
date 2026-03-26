-- ==========================================
-- GamePortal Initial Data Seed
-- Note: Must be executed AFTER schema.sql
-- ==========================================

-- Insert Default Platforms
INSERT INTO public.platforms (id, name, category, score, bonus, features, is_verified, logo) VALUES
('b0f4e420-9f5b-4c12-8d9e-c852fc63e9f1', 'NeonVegas Elite', 'Crypto Casinos', 9.9, '100% up to $1,000 + 50 Free Spins', ARRAY['Instant Payouts', '24/7 VIP Support', 'Provably Fair'], true, 'https://picsum.photos/seed/neonvegas/120/120'),
('c1f4e420-9f5b-4c12-8d9e-c852fc63e9f2', 'SpinCity Premium', 'Live Dealer', 9.7, '200% Match up to $500', ARRAY['Daily Cashback', 'Live Dealer Focus', 'No Withdrawal Limits'], true, 'https://picsum.photos/seed/spincity/120/120'),
('d2f4e420-9f5b-4c12-8d9e-c852fc63e9f3', 'AuraBet Global', 'Sports Betting', 9.5, 'Welcome Package up to $2,500', ARRAY['Sportsbook Included', 'Massive Game Library', 'Weekly Tournaments'], false, 'https://picsum.photos/seed/aurabet/120/120'),
('e3f4e420-9f5b-4c12-8d9e-c852fc63e9f4', 'CryptoRoyale', 'Crypto Casinos', 9.3, '1 BTC Welcome Bonus', ARRAY['Anonymous Play', 'Zero Fees', 'Instant Crypto Withdrawals'], true, 'https://picsum.photos/seed/cryptoroyale/120/120'),
('f4f4e420-9f5b-4c12-8d9e-c852fc63e9f5', 'Grand Fortune', 'High Roller', 9.1, '150% Match + 100 Free Spins', ARRAY['Classic Slots', 'High Roller Tables', 'Loyalty Program'], true, 'https://picsum.photos/seed/grandfortune/120/120');

-- Insert Extra Platforms
INSERT INTO public.platforms (name, category, score, bonus, features, is_verified, logo) VALUES
('CasinoNova X', 'Crypto Casinos', 9.0, '1 BTC Welcome Bonus', ARRAY['Instant Withdrawals', '24/7 Support', 'Provably Fair'], true, 'https://picsum.photos/seed/plat0/150/150'),
('LiveArena Pro', 'Live Dealer', 8.8, '200% Match + 50 Spins', ARRAY['Instant Withdrawals', '24/7 Support'], true, 'https://picsum.photos/seed/plat1/150/150'),
('BetSphere Global', 'Sports Betting', 8.7, '100% up to $500', ARRAY['Instant Withdrawals', '24/7 Support', 'Provably Fair'], false, 'https://picsum.photos/seed/plat2/150/150'),
('VaultBet Elite', 'High Roller', 9.2, 'No Deposit: 20 Spins', ARRAY['Instant Withdrawals', '24/7 Support'], true, 'https://picsum.photos/seed/plat3/150/150'),
('QuickCash Casino', 'Fast Payouts', 8.9, '100% up to $500', ARRAY['Instant Withdrawals', '24/7 Support', 'Provably Fair'], true, 'https://picsum.photos/seed/plat4/150/150');

-- Insert Reviews
INSERT INTO public.reviews (platform_id, title, date, rating, image) VALUES
('b0f4e420-9f5b-4c12-8d9e-c852fc63e9f1', 'NeonVegas Elite Review 2026: Is it still the king?', 'Mar 22, 2026', 9.9, 'https://picsum.photos/seed/rev1/600/400'),
('e3f4e420-9f5b-4c12-8d9e-c852fc63e9f4', 'CryptoRoyale Deep Dive: Anonymous Betting Tested', 'Mar 20, 2026', 9.3, 'https://picsum.photos/seed/rev2/600/400'),
('c1f4e420-9f5b-4c12-8d9e-c852fc63e9f2', 'Live Dealer Showdown: SpinCity vs Grand Fortune', 'Mar 18, 2026', 9.5, 'https://picsum.photos/seed/rev3/600/400');

-- Insert News
INSERT INTO public.news (title, excerpt, content, category, date, comments_count, image, is_featured) VALUES
('NeonVegas Partners with Visa for Instant Payouts', 'A new partnership promises to cut withdrawal times to under 5 minutes for all Visa cardholders worldwide.', 'Full article content for NeonVegas partnership.', 'Industry Updates', 'Mar 24, 2026', 42, 'https://picsum.photos/seed/news0/800/400', true),
('Mega Jackpot Slots Expansion: 200 New Games Added', 'Three of the top platforms have simultaneously announced major game library expansions with a focus on progressive jackpot slots.', 'Details about new slot games...', 'Game Releases', 'Mar 23, 2026', 18, 'https://picsum.photos/seed/news1/800/400', false),
('Exclusive: Claim 50 Free Spins This Weekend Only', 'A limited-time bonus offer is available at several top-rated platforms this weekend. Here is how to claim yours before it expires.', 'Guide on claiming free spins...', 'Bonus Offers', 'Mar 22, 2026', 31, 'https://picsum.photos/seed/news2/800/400', false),
('EU Tightens KYC Rules: What Players Need to Know', 'New European regulations set to take effect in Q3 2026 will require stricter identity verification for all licensed platforms operating in the EU.', 'In-depth review of KYC rules...', 'Regulations', 'Mar 21, 2026', 55, 'https://picsum.photos/seed/news3/800/400', false);

-- Insert Collections
INSERT INTO public.collections (id, title, description, icon_name, color, count, image) VALUES
('a0f4e420-9f5b-4c12-8d9e-c852fc63e9f1', 'Best Crypto Casinos', 'Platforms offering instant crypto deposits, anonymous play, and exclusive Bitcoin bonuses.', 'Coins', 'from-amber-500 to-orange-600', 10, 'https://picsum.photos/seed/col_crypto/800/400'),
('a1f4e420-9f5b-4c12-8d9e-c852fc63e9f2', 'Top High Roller Bonuses', 'Massive match bonuses and VIP programs tailored for players who bet big.', 'Trophy', 'from-purple-500 to-indigo-600', 5, 'https://picsum.photos/seed/col_highroller/800/400'),
('a2f4e420-9f5b-4c12-8d9e-c852fc63e9f3', 'Fastest Payouts', 'Verified platforms that process withdrawals in under 24 hours, guaranteed.', 'Zap', 'from-emerald-400 to-teal-600', 8, 'https://picsum.photos/seed/col_payouts/800/400'),
('a3f4e420-9f5b-4c12-8d9e-c852fc63e9f4', 'Safest & Most Trusted', 'Fully licensed, audited, and provably fair platforms with flawless track records.', 'ShieldCheck', 'from-blue-400 to-cyan-600', 15, 'https://picsum.photos/seed/col_safe/800/400');

-- Link Collections to Platforms
INSERT INTO public.collection_platforms (collection_id, platform_id, rank) VALUES
('a0f4e420-9f5b-4c12-8d9e-c852fc63e9f1', 'e3f4e420-9f5b-4c12-8d9e-c852fc63e9f4', 1),
('a0f4e420-9f5b-4c12-8d9e-c852fc63e9f1', 'b0f4e420-9f5b-4c12-8d9e-c852fc63e9f1', 2),
('a1f4e420-9f5b-4c12-8d9e-c852fc63e9f2', 'f4f4e420-9f5b-4c12-8d9e-c852fc63e9f5', 1),
('a2f4e420-9f5b-4c12-8d9e-c852fc63e9f3', 'c1f4e420-9f5b-4c12-8d9e-c852fc63e9f2', 1);
