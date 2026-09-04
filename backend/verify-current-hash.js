#!/usr/bin/env node

/**
 * Verify Current Hash in Production Database
 */

require('dotenv').config({ path: '.env.production' });

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verify() {
  console.log('🔍 Verifying Current Password Hash\n');
  console.log('Database:', SUPABASE_URL.split('/')[2]);
  console.log('─'.repeat(60) + '\n');

  try {
    // Get admin user
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('username, email, password_hash, is_active')
      .eq('username', 'admin')
      .single();

    if (error) {
      console.error('❌ Error fetching user:', error);
      process.exit(1);
    }

    if (!user) {
      console.error('❌ Admin user not found!');
      process.exit(1);
    }

    console.log('✅ Admin user found:');
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Active: ${user.is_active}`);
    console.log(`   Hash: ${user.password_hash}`);
    console.log('\n' + '─'.repeat(60) + '\n');

    // Test password verification
    const PASSWORD_TO_TEST = 'Admin@12345';
    const isMatch = await bcrypt.compare(PASSWORD_TO_TEST, user.password_hash);

    console.log('🧪 Testing Password Verification:');
    console.log(`   Password: "${PASSWORD_TO_TEST}"`);
    console.log(`   Hash matches: ${isMatch ? '✅ YES' : '❌ NO'}`);

    if (isMatch) {
      console.log('\n✅ SUCCESS! Password hash is correct!');
      console.log('If login still fails, the problem is NOT the password hash.');
      console.log('Check:');
      console.log('  1. Database connection/propagation delay');
      console.log('  2. Backend restart/deployment');
      console.log('  3. Browser cache');
      console.log('  4. CSRF token issues');
    } else {
      console.log('\n❌ FAILED! Hash still doesn\'t match the password!');
      console.log('The update may not have completed or wrong hash was used.');
      console.log('\nCorrect hash should be:');
      console.log('  $2b$12$MtiMCnM7/EV2dnD36NQz9edjoU3wT5XEX6ehxuU44gdSmsY4/cL62');
      console.log('\nCurrent hash:');
      console.log(`  ${user.password_hash}`);
    }

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

verify();