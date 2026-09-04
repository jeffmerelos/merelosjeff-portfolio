#!/usr/bin/env node

/**
 * Test Admin Login Against Production Backend
 */

const https = require('https');

function httpsRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testAdminLogin() {
  console.log('🧪 Testing Admin Login\n');

  try {
    // Test login
    console.log('Sending login request...');
    const response = await httpsRequest({
      hostname: 'merelosjeff-portfolio-backend.vercel.app',
      path: '/api/admin/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      username: 'admin',
      password: 'Admin@12345'
    });

    console.log(`Status: ${response.status}`);
    console.log(`Response:`, response.body);

    if (response.status === 200 && response.body.success) {
      console.log('\n✅ Login successful!');
      console.log('Admin credentials are working.');
    } else if (response.status === 401) {
      console.log('\n❌ Invalid credentials');
      console.log('The admin user may not exist in the database yet.');
      console.log('Follow the setup guide to create the admin user.');
    } else {
      console.log('\n⚠️  Unexpected response');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAdminLogin();