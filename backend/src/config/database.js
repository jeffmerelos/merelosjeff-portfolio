const { createClient } = require('@supabase/supabase-js');

// Create Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials.');
  console.error('Please set SUPABASE_URL and SUPABASE_KEY in your environment variables.');
  // Don't exit on startup - let Vercel handle the error
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection on startup (optional - don't fail if it fails)
const testConnection = async () => {
  try {
    const { error } = await supabase
      .from('profile')
      .select('*')
      .limit(1);

    if (error) throw error;

    console.log('✅ Supabase PostgreSQL connected');
  } catch (err) {
    console.error('⚠️  Supabase connection warning:', err.message);
    // Don't exit - Vercel will handle it, just log the warning
  }
};

module.exports = { supabase, testConnection };
