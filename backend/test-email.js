#!/usr/bin/env node
/**
 * Email Test Script
 * Tests the contact form email functionality
 * 
 * Usage: node test-email.js
 */

require('dotenv').config({ path: '.env.production' });
const { sendContactEmail, sendAutoReply } = require('./src/config/mailer');

console.log('\n🧪 Testing Email Configuration...\n');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Email Host:', process.env.EMAIL_HOST);
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email From:', process.env.EMAIL_FROM);
console.log('Email To:', process.env.EMAIL_TO);
console.log('\n📧 Sending test contact email...\n');

// Test data
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Email from Contact Form',
  message: 'This is a test message to verify the contact form email functionality is working correctly. If you receive this, the configuration is good!'
};

// Send test email
sendContactEmail(testData)
  .then(() => {
    console.log('✅ Contact email sent successfully!');
    console.log('📬 Check your inbox:', process.env.EMAIL_TO);
    console.log('\n📨 Sending auto-reply email...\n');
    
    // Send auto-reply
    return sendAutoReply({ name: testData.name, email: testData.email });
  })
  .then(() => {
    console.log('✅ Auto-reply email sent successfully!');
    console.log('📬 Check test inbox:', testData.email);
    console.log('\n✅ All email tests passed!\n');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Email test failed:', err.message);
    console.error('\nFull error:', err);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Check your EMAIL_USER and EMAIL_PASS are correct');
    console.error('   2. Ensure 2FA is enabled on Gmail and you\'re using an App Password');
    console.error('   3. Verify EMAIL_HOST is smtp.gmail.com and EMAIL_PORT is 587');
    console.error('   4. Make sure EMAIL_SECURE is set to false (not true) for port 587\n');
    process.exit(1);
  });
