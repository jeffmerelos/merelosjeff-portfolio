#!/usr/bin/env node

/**
 * Production Admin User Setup Script
 * Automatically creates admin user with predefined credentials in Supabase
 */

const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

// Production Supabase Configuration
const SUPABASE_URL = 'https://ulgcfvvtxqzpodlzpdth.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ2NmdnZ0eHF6cG9kbHpwZHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNzk3MDQsImV4cCI6MjA5OTY1NTcwNH0.xKL-tl_PxPPCEB1d0TSAJKougCfBro7pB9Ia-07j95w';

// Admin Credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  email: 'jeffmerelos.coredev@gmail.com',
  password: 'Admin@12345', // Change this after first login!
  // Pre-hashed password (bcrypt, salt rounds: 12)
  // This hash corresponds to: Admin@12345
  passwordHash: '$2b$12$gSvqqUPHRHaRtoaGz1DtCuK3qsHyIqMLEDtbKA.BM6I.LKxKJZ.0y'
};

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function setupAdminUser() {
  console.log('\n🚀 Production Admin User Setup');
  console.log('==============================\n');

  try {
    // Step 1: Check if admin user already exists
    console.log('📋 Step 1: Checking for existing admin user...');
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id, username, email, is_active, created_at')
      .eq('username', ADMIN_CREDENTIALS.username)
      .single();

    if (existingUser) {
      console.log('✅ Admin user already exists!');
      console.log(`   Username: ${existingUser.username}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Status: ${existingUser.is_active ? 'Active' : 'Inactive'}`);
      console.log(`   Created: ${existingUser.created_at}`);
      console.log('\n💡 The admin user is ready to use!\n');
      return;
    }

    // Step 2: Create admin user
    console.log('👤 Step 2: Creating admin user...');
    
    const { data: newUser, error: createError } = await supabase
      .from('admin_users')
      .insert({
        username: ADMIN_CREDENTIALS.username,
        email: ADMIN_CREDENTIALS.email,
        password_hash: ADMIN_CREDENTIALS.passwordHash,
        is_active: true,
        totp_enabled: false,
        failed_login_count: 0
      })
      .select()
      .single();

    if (createError) {
      if (createError.code === '42501') {
        console.error('❌ Row Level Security Error!');
        console.log('\n💡 Solution: Your Supabase RLS policies are blocking API access.');
        console.log('   Please run the SQL directly in Supabase SQL Editor:');
        console.log('   File: SETUP_PRODUCTION_ADMIN.sql\n');
      } else {
        console.error('❌ Error creating admin user:', createError);
      }
      return;
    }

    // Step 3: Verify creation
    console.log('✅ Admin user created successfully!');
    console.log(`   ID: ${newUser.id}`);
    console.log(`   Username: ${newUser.username}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Status: Active`);
    console.log(`   Created: ${newUser.created_at}`);

    // Step 4: Test password
    console.log('\n🧪 Step 3: Testing password verification...');
    const passwordValid = await bcrypt.compare(
      ADMIN_CREDENTIALS.password,
      ADMIN_CREDENTIALS.passwordHash
    );
    
    if (passwordValid) {
      console.log('✅ Password hashing verified!');
    } else {
      console.log('❌ Password verification failed!');
    }

    // Step 5: Display login information
    console.log('\n' + '='.repeat(50));
    console.log('🎯 LOGIN CREDENTIALS');
    console.log('='.repeat(50));
    console.log(`\n🌐 Admin Portal URL:`);
    console.log(`   https://merelosjeff-portfolio-frontend.vercel.app/admin-portal/login`);
    console.log(`\n👤 Username: ${ADMIN_CREDENTIALS.username}`);
    console.log(`\n🔑 Password: ${ADMIN_CREDENTIALS.password}`);
    console.log('\n' + '='.repeat(50));

    // Security warnings
    console.log('\n⚠️  SECURITY REMINDERS:');
    console.log('   1. ✅ Change the default password after first login');
    console.log('   2. ✅ Enable 2FA (Two-Factor Authentication)');
    console.log('   3. ✅ Never share these credentials');
    console.log('   4. ✅ Review login attempts regularly');
    console.log('   5. ✅ Use strong passwords (min 12 characters)\n');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n💡 Make sure:');
    console.log('   1. Your Supabase credentials are correct');
    console.log('   2. The admin_users table exists');
    console.log('   3. Row Level Security (RLS) allows API access');
  }
}

// Run setup
setupAdminUser();