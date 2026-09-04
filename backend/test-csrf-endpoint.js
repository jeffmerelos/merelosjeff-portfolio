#!/usr/bin/env node

/**
 * Test CSRF Token Endpoint
 */

const https = require('https');

const options = {
  hostname: 'merelosjeff-portfolio-backend.vercel.app',
  port: 443,
  path: '/api/admin/auth/csrf',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js Test'
  }
};

console.log('🧪 Testing CSRF Token Endpoint\n');
console.log('GET', options.hostname + options.path);
console.log('\n' + '─'.repeat(60) + '\n');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('\nResponse Body:\n');
    
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();