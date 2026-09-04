#!/usr/bin/env node

/**
 * Test Available Routes on Production Backend
 */

const https = require('https');

const endpoints = [
  { method: 'GET', path: '/health' },
  { method: 'GET', path: '/api/admin/auth/csrf' },
  { method: 'POST', path: '/api/admin/auth/login' },
  { method: 'GET', path: '/api/profile' },
];

async function testEndpoint(method, path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'merelosjeff-portfolio-backend.vercel.app',
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Route Tester'
      }
    };

    if (method === 'POST') {
      options.headers['Content-Length'] = 0;
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          method,
          path,
          status: res.statusCode,
          body: data.substring(0, 100)
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        method,
        path,
        status: 'ERROR',
        error: error.message
      });
    });

    req.end();
  });
}

async function testAllEndpoints() {
  console.log('🧪 Testing Backend Routes\n');
  console.log('Backend: https://merelosjeff-portfolio-backend.vercel.app\n');
  console.log('─'.repeat(80) + '\n');

  for (const { method, path } of endpoints) {
    const result = await testEndpoint(method, path);
    const status = result.status === 200 ? '✅' : result.status ? '⚠️' : '❌';
    console.log(`${status} ${method.padEnd(6)} ${path.padEnd(40)} → ${result.status}`);
    if (result.error) console.log(`   Error: ${result.error}`);
  }

  console.log('\n' + '─'.repeat(80));
  console.log('\n📋 Summary:');
  console.log('✅ = Route exists and responds');
  console.log('⚠️  = Route exists but error (expected for some)');
  console.log('❌ = Route not found');
}

testAllEndpoints();