import { createClient } from '@supabase/supabase-js';

// Use same env variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_URL';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@gameportal.com',
    password: 'password123',
  });

  if (error) {
    console.error('Error creating user:', error);
  } else {
    console.log('✅ Admin user created successfully:', data.user?.email);
  }
}

createAdmin();
