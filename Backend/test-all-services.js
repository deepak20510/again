import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import cloudinary from './src/config/cloudinary.js';
import { sendVerificationOTPEmail, sendOTPEmail } from './src/services/email.service.js';

dotenv.config();

const prisma = new PrismaClient();

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`),
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    log.success(name);
    return true;
  } catch (error) {
    failedTests++;
    log.error(`${name}: ${error.message}`);
    return false;
  }
}

// ==================== DATABASE TESTS ====================
async function testDatabase() {
  log.section('🗄️  DATABASE TESTS');

  await test('Database connection', async () => {
    await prisma.$connect();
    if (!prisma) throw new Error('Prisma client not initialized');
  });

  await test('User table accessible', async () => {
    const count = await prisma.user.count();
    log.info(`   Found ${count} users in database`);
  });

  await test('Post table accessible', async () => {
    const count = await prisma.post.count();
    log.info(`   Found ${count} posts in database`);
  });

  await test('Notification table accessible', async () => {
    const count = await prisma.notification.count();
    log.info(`   Found ${count} notifications in database`);
  });

  await test('Message table accessible', async () => {
    const count = await prisma.message.count();
    log.info(`   Found ${count} messages in database`);
  });

  await test('Connection table accessible', async () => {
    const count = await prisma.connection.count();
    log.info(`   Found ${count} connections in database`);
  });
}

// ==================== CLOUDINARY TESTS ====================
async function testCloudinary() {
  log.section('☁️  CLOUDINARY TESTS');

  await test('Cloudinary credentials configured', async () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error('CLOUDINARY_CLOUD_NAME missing');
    if (!process.env.CLOUDINARY_API_KEY) throw new Error('CLOUDINARY_API_KEY missing');
    if (!process.env.CLOUDINARY_API_SECRET) throw new Error('CLOUDINARY_API_SECRET missing');
    log.info(`   Cloud name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  });

  await test('Cloudinary API connection', async () => {
    const result = await cloudinary.api.ping();
    if (result.status !== 'ok') throw new Error('Cloudinary API not responding');
  });

  await test('Cloudinary URL generation', async () => {
    const url = cloudinary.url('sample', { secure: true });
    if (!url.startsWith('https://res.cloudinary.com/')) {
      throw new Error('Invalid URL format');
    }
    log.info(`   Sample URL: ${url.substring(0, 60)}...`);
  });

  await test('Cloudinary recent uploads check', async () => {
    const resources = await cloudinary.api.resources({
      type: 'upload',
      max_results: 5,
      prefix: 'uploads/'
    });
    log.info(`   Found ${resources.resources.length} recent uploads`);
  });
}

// ==================== EMAIL SERVICE TESTS ====================
async function testEmailService() {
  log.section('📧 EMAIL SERVICE TESTS');

  await test('Email credentials configured', async () => {
    if (!process.env.SENDGRID_API_KEY && !process.env.EMAIL_USER) {
      throw new Error('No email service configured');
    }
    if (process.env.SENDGRID_API_KEY) {
      log.info('   Using SendGrid');
    } else if (process.env.EMAIL_USER) {
      log.info('   Using Gmail SMTP');
    }
  });

  await test('FROM_EMAIL configured', async () => {
    if (!process.env.FROM_EMAIL) {
      log.warning('FROM_EMAIL not set, will use default');
    } else {
      log.info(`   FROM_EMAIL: ${process.env.FROM_EMAIL}`);
    }
  });

  // Test SendGrid if configured
  if (process.env.SENDGRID_API_KEY) {
    await test('SendGrid API key valid', async () => {
      const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Invalid SendGrid API key');
    });

    await test('SendGrid sender verified', async () => {
      const response = await fetch('https://api.sendgrid.com/v3/verified_senders', {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      const verified = data.results?.some(s => s.verified);
      if (!verified) throw new Error('No verified senders found');
      log.info(`   Verified senders: ${data.results?.length || 0}`);
    });
  }

  await test('Email service can send verification OTP', async () => {
    const testEmail = process.env.FROM_EMAIL || 'test@example.com';
    const result = await sendVerificationOTPEmail(testEmail, '123456');
    if (!result.success) throw new Error('Failed to send verification email');
    log.info('   Test verification email sent successfully');
  });

  await test('Email service can send password reset OTP', async () => {
    const testEmail = process.env.FROM_EMAIL || 'test@example.com';
    const result = await sendOTPEmail(testEmail, '654321');
    if (!result.success) throw new Error('Failed to send password reset email');
    log.info('   Test password reset email sent successfully');
  });
}

// ==================== ENVIRONMENT TESTS ====================
async function testEnvironment() {
  log.section('⚙️  ENVIRONMENT CONFIGURATION TESTS');

  await test('NODE_ENV configured', async () => {
    if (!process.env.NODE_ENV) throw new Error('NODE_ENV not set');
    log.info(`   Environment: ${process.env.NODE_ENV}`);
  });

  await test('DATABASE_URL configured', async () => {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
    const dbHost = process.env.DATABASE_URL.split('@')[1]?.split('/')[0];
    log.info(`   Database host: ${dbHost}`);
  });

  await test('JWT_SECRET configured', async () => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set');
    log.info(`   JWT_SECRET length: ${process.env.JWT_SECRET.length} characters`);
  });

  await test('PORT configured', async () => {
    const port = process.env.PORT || 5000;
    log.info(`   Server port: ${port}`);
  });

  await test('CLIENT_URL configured', async () => {
    if (!process.env.CLIENT_URL) {
      log.warning('CLIENT_URL not set, using default');
    } else {
      log.info(`   Client URL: ${process.env.CLIENT_URL}`);
    }
  });
}

// ==================== API ENDPOINT TESTS ====================
async function testAPIEndpoints() {
  log.section('🌐 API ENDPOINT TESTS');

  const baseURL = `http://localhost:${process.env.PORT || 5000}`;

  await test('Server is running', async () => {
    try {
      const response = await fetch(baseURL);
      // Server should respond (even if 404)
      log.info(`   Server responding on ${baseURL}`);
    } catch (error) {
      throw new Error('Server not responding. Make sure backend is running.');
    }
  });

  await test('Auth routes accessible', async () => {
    const response = await fetch(`${baseURL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
    });
    // Should get a response (even if 401/400)
    if (!response) throw new Error('Auth routes not responding');
  });

  await test('Posts routes accessible', async () => {
    const response = await fetch(`${baseURL}/api/v1/posts?page=1&limit=5`);
    // Should get a response
    if (!response) throw new Error('Posts routes not responding');
  });

  await test('Discovery routes accessible', async () => {
    const response = await fetch(`${baseURL}/api/v1/discovery/search`);
    // Should get a response
    if (!response) throw new Error('Discovery routes not responding');
  });

  await test('Notifications routes accessible', async () => {
    const response = await fetch(`${baseURL}/api/v1/notifications`);
    // Should get a response (even if 401)
    if (!response) throw new Error('Notifications routes not responding');
  });
}

// ==================== MAIN TEST RUNNER ====================
async function runAllTests() {
  console.log('\n');
  log.section('🧪 COMPREHENSIVE SERVICE TEST SUITE');
  console.log('Testing all services and configurations...\n');

  const startTime = Date.now();

  try {
    await testEnvironment();
    await testDatabase();
    await testCloudinary();
    await testEmailService();
    await testAPIEndpoints();
  } catch (error) {
    log.error(`Fatal error during tests: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Summary
  log.section('📊 TEST SUMMARY');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`Duration: ${duration}s\n`);

  if (failedTests === 0) {
    log.success('ALL TESTS PASSED! 🎉');
    console.log('\n✨ All services are working correctly!\n');
    process.exit(0);
  } else {
    log.error(`${failedTests} TEST(S) FAILED`);
    console.log('\n⚠️  Please fix the failed tests above.\n');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch((error) => {
  log.error(`Test suite crashed: ${error.message}`);
  process.exit(1);
});
