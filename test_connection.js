const tests = [];

// Test core dependencies
try {
  require('react');
  tests.push({ name: 'react', status: 'OK' });
} catch (e) {
  tests.push({ name: 'react', status: 'FAIL', error: e.message });
}

try {
  require('next');
  tests.push({ name: 'next', status: 'OK' });
} catch (e) {
  tests.push({ name: 'next', status: 'FAIL', error: e.message });
}

try {
  require('next-auth');
  tests.push({ name: 'next-auth', status: 'OK' });
} catch (e) {
  tests.push({ name: 'next-auth', status: 'FAIL', error: e.message });
}

try {
  require('@prisma/client');
  tests.push({ name: '@prisma/client', status: 'OK' });
} catch (e) {
  tests.push({ name: '@prisma/client', status: 'FAIL', error: e.message });
}

try {
  require('bcryptjs');
  tests.push({ name: 'bcryptjs', status: 'OK' });
} catch (e) {
  tests.push({ name: 'bcryptjs', status: 'FAIL', error: e.message });
}

try {
  require('date-fns');
  tests.push({ name: 'date-fns', status: 'OK' });
} catch (e) {
  tests.push({ name: 'date-fns', status: 'FAIL', error: e.message });
}

try {
  require('nodemailer');
  tests.push({ name: 'nodemailer', status: 'OK' });
} catch (e) {
  tests.push({ name: 'nodemailer', status: 'FAIL', error: e.message });
}

try {
  require('otplib');
  tests.push({ name: 'otplib', status: 'OK' });
} catch (e) {
  tests.push({ name: 'otplib', status: 'FAIL', error: e.message });
}

try {
  require('qrcode');
  tests.push({ name: 'qrcode', status: 'OK' });
} catch (e) {
  tests.push({ name: 'qrcode', status: 'FAIL', error: e.message });
}

try {
  require('recharts');
  tests.push({ name: 'recharts', status: 'OK' });
} catch (e) {
  tests.push({ name: 'recharts', status: 'FAIL', error: e.message });
}

try {
  require('zod');
  tests.push({ name: 'zod', status: 'OK' });
} catch (e) {
  tests.push({ name: 'zod', status: 'FAIL', error: e.message });
}

console.log('\n=== HRIS Dependency Test ===\n');
let passed = 0;
let failed = 0;

tests.forEach(t => {
  if (t.status === 'OK') {
    console.log(`✓ ${t.name}`);
    passed++;
  } else {
    console.log(`✗ ${t.name}: ${t.error}`);
    failed++;
  }
});

console.log(`\n${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.log('Run: npm install');
  process.exit(1);
}

console.log('All dependencies loaded successfully!');
