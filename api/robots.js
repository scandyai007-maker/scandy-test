import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const { data } = await supabase.from('site_settings').select('robots_txt').eq('id', 1).single();
    
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(data?.robots_txt || 'User-agent: *\nAllow: /');
  } catch (error) {
    res.status(500).send('User-agent: *\nAllow: /');
  }
}
