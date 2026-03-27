export interface Platform {
  id: string;
  slug: string;
  name: string;
  category: string;
  score: number;
  bonus: string;
  features: string[];
  tags?: string[];
  content?: string | null;
  logo: string;
  is_verified: boolean;
  affiliate_link?: string;
  created_at?: string;
  updated_at?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export interface Review {
  id: string;
  platform_id: string;
  title: string;
  date: string;
  image: string;
  rating: number;
  created_at?: string;
}

export interface News {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string | null;
  category: string;
  comments_count: number;
  image: string;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_name: string;
  color: string;
  count: number;
  image: string;
  created_at?: string;
}

export interface CollectionPlatform {
  id: string;
  collection_id: string;
  platform_id: string;
  rank: number;
  platforms?: Platform; // Used when joining
}

export interface SiteSettings {
  id: number;
  site_name: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  favicon_url?: string;
  og_image_url?: string;
  canonical_base_url?: string;
  google_site_verification?: string;
  google_analytics_id?: string;
  footer_copyright?: string;
  footer_description?: string;
  footer_column_1_title?: string;
  footer_column_2_title?: string;
  footer_column_3_title?: string;
  footer_column_1_links?: Array<{ label: string; url: string }>;
  footer_column_2_links?: Array<{ label: string; url: string }>;
  footer_column_3_links?: Array<{ label: string; url: string }>;
}
