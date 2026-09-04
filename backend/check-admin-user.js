#!/usr/bin/env node

/**
 * Check if Admin User Exists
 */

require('dotenv').config({ path: '.env.production' });

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  console.log('🔍 Checking Admin Users Table\n');

  try {
    // Count all users
    const { data: allUsers, error: countError } = await supabase
      .from('admin_users')
      .select('username, email, is_active', { count: 'exact' });

    console.log(`Total users in admin_users table: ${allUsers ? allUsers.length : 0}`);
    
    if (allUsers && allUsers.length > 0) {
      console.log('\n✅ Users found:');
      allUsers.forEach((user, i) => {
        console.log(`   ${i + 1}. ${user.username} (${user.email}) - ${user.is_active ? 'Active' : 'Inactive'}`);
      });
    } else {
      console.log('\n❌ NO USERS IN admin_users TABLE!');
      console.log('The table is empty. You need to insert the admin user.');
    }

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

check();