#!/usr/bin/env node

/**
 * Direct Login Test - Bypass Frontend
 * Tests the login endpoint directly to see the exact error
 */

const http = require('http');

const loginData = JSON.stringify({
  username: 'admin',
  password: 'Admin@12345'
});

const options = {
  hostname: 'merelosjeff-portfolio-backend.vercel.app',
  port: 443,
  path: '/api/admin/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData),
    'User-Agent': 'Node.js Test'
  }
};

console.log('🧪 Testing Login Endpoint Directly\n');
console.log('POST', options.hostname + options.path);
console.log('Body:', JSON.parse(loginData));
console.log('\n' + '─'.repeat(60) + '\n');

const req = require('https').request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('\nResponse Body:\n');
    
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
      
      if (parsed.errors) {
        console.log('\n' + '─'.repeat(60));
        console.log('VALIDATION ERRORS:');
        console.log('─'.repeat(60));
        parsed.errors.forEach((err, i) => {
          console.log(`${i + 1}. Field: ${err.field}`);
          console.log(`   Message: ${err.message}\n`);
        });
      }
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(loginData);
req.end();