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
