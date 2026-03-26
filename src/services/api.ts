import { supabase } from '../lib/supabase';
import type { Platform, Review, News, Collection, CollectionPlatform } from '../types';

export const api = {
  // --- Platforms ---
  async getPlatforms(limit?: number) {
    let query = supabase.from('platforms').select('*').order('score', { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data as Platform[];
  },

  async getPlatformById(id: string) {
    const { data, error } = await supabase.from('platforms').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Platform;
  },

  async getPlatformBySlug(slug: string) {
    const { data, error } = await supabase.from('platforms').select('*').eq('slug', slug).single();
    if (error) throw error;
    return data as Platform;
  },

  async getPlatformsByCategory(category: string) {
    const { data, error } = await supabase.from('platforms').select('*').eq('category', category).order('score', { ascending: false }).order('updated_at', { ascending: false });
    if (error) throw error;
    return data as Platform[];
  },

  async getPlatformsByTag(tagName: string) {
    const { data, error } = await supabase.from('platforms').select('*').contains('tags', [tagName]).order('score', { ascending: false });
    if (error) throw error;
    return data as Platform[];
  },

  async getPlatformsByTags(tagNames: string[], limit: number = 10) {
    if (!tagNames || tagNames.length === 0) return [];
    const { data, error } = await supabase
      .from('platforms')
      .select('*')
      .overlaps('tags', tagNames)
      .order('score', { ascending: false })
      .order('updated_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as Platform[];
  },

  async getTags(limit?: number) {
    let query = supabase.from('tags').select('*');
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // --- Reviews ---
  async getLatestReviews(limit: number = 3) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, platforms(*)')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data; // Returns reviews joined with their platform
  },

  // --- News ---
  async getNews(category: string = 'All News', limit?: number) {
    let query = supabase.from('news').select('*').order('created_at', { ascending: false });
    
    if (category !== 'All News') {
      query = query.eq('category', category);
    }
    
    if (limit) query = query.limit(limit);
    
    const { data, error } = await query;
    if (error) throw error;
    return data as News[];
  },

  async getFeaturedNews() {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    // If no featured news, fallback to latest
    if (error || !data) {
      const { data: latestData, error: latestError } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(1).single();
      if (latestError) throw latestError;
      return latestData as News;
    }
    return data as News;
  },

  async getNewsById(id: string) {
    const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
    if (error) throw error;
    return data as News;
  },

  async getNewsBySlug(slug: string) {
    const { data, error } = await supabase.from('news').select('*').eq('slug', slug).single();
    if (error) throw error;
    return data as News;
  },

  async getNewsByTag(tagName: string) {
    const { data, error } = await supabase.from('news').select('*').contains('tags', [tagName]).order('created_at', { ascending: false });
    if (error) throw error;
    return data as News[];
  },

  async getNewsByTags(tagNames: string[], limit: number = 3) {
    if (!tagNames || tagNames.length === 0) return [];
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .overlaps('tags', tagNames)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as News[];
  },

  // --- Collections ---
  async getCollections() {
    const { data, error } = await supabase
      .from('collections')
      .select('*, collection_platforms(count)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data as any[]).map(col => ({
      ...col,
      count: col.collection_platforms?.[0]?.count || 0
    })) as Collection[];
  },

  async getCollectionById(id: string) {
    const { data, error } = await supabase
      .from('collections')
      .select('*, collection_platforms(count)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      count: (data as any).collection_platforms?.[0]?.count || 0
    } as Collection;
  },

  async getCollectionBySlug(slug: string) {
    const { data, error } = await supabase
      .from('collections')
      .select('*, collection_platforms(count)')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return {
      ...data,
      count: (data as any).collection_platforms?.[0]?.count || 0
    } as Collection;
  },

  async getCollectionPlatforms(collectionId: string) {
    // This uses a join table to get the platforms ordered by rank
    const { data, error } = await supabase
      .from('collection_platforms')
      .select('rank, platforms(*)')
      .eq('collection_id', collectionId)
      .order('rank', { ascending: true });
      
    if (error) throw error;
    return data as unknown as CollectionPlatform[];
  },

  // --- Global SEO Config ---
  async getSiteSettings() {
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (error && error.code !== 'PGRST116') { // PGRST116 is no rows
      console.error('Error fetching site settings', error);
    }
    return data || {
      site_name: 'GamePortal',
      seo_title: 'GamePortal - The Ultimate Crypto Gaming Destination',
      seo_description: 'Discover the best crypto casinos, blockchain games, and web3 experiences.',
      seo_keywords: 'crypto casino, bitcoin casino, web3 gaming'
    };
  }
};
