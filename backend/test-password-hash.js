#!/usr/bin/env node

/**
 * Test Password Hash Verification
 * Checks if the stored hash matches the test password
 */

const bcrypt = require('bcrypt');

const PASSWORD_TO_TEST = 'Admin@12345';
const HASH_IN_DATABASE = '$2b$12$gSvqqUPHRHaRtoaGz1DtCuK3qsHyIqMLEDtbKA.BM6I.LKxKJZ.0y';

console.log('🧪 Testing Password Hash\n');
console.log('Password:', PASSWORD_TO_TEST);
console.log('Hash:', HASH_IN_DATABASE);
console.log('\n' + '─'.repeat(60) + '\n');

bcrypt.compare(PASSWORD_TO_TEST, HASH_IN_DATABASE, (err, isMatch) => {
  if (err) {
    console.error('❌ Error:', err);
    return;
  }

  console.log('Password matches hash:', isMatch ? '✅ YES' : '❌ NO');
  
  if (isMatch) {
    console.log('\n✅ PASSWORD VERIFICATION SUCCESS');
    console.log('The password "Admin@12345" matches the stored hash!');
    console.log('\nThis means:');
    console.log('- The hash in the database is CORRECT');
    console.log('- If login still fails, the problem is elsewhere');
  } else {
    console.log('\n❌ PASSWORD VERIFICATION FAILED');
    console.log('The password "Admin@12345" DOES NOT match the stored hash!');
    console.log('\nThis means:');
    console.log('- The hash in the database is WRONG');
    console.log('- You need to update the admin user with the correct hash');
    console.log('- Or regenerate the hash with the correct password');
  }

  console.log('\n' + '─'.repeat(60));
  console.log('\nTo fix: Generate a new hash with this code:');
  console.log('bcrypt.hash("Admin@12345", 12).then(hash => console.log(hash))');
});
