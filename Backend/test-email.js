import { sendVerificationOTPEmail, sendOTPEmail } from './src/services/email.service.js';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  console.log('\n📧 Testing Email Service...\n');

  // Check environment variables
  console.log('Email Configuration:');
  console.log('- SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✓ Set' : '✗ Missing');
  console.log('- FROM_EMAIL:', process.env.FROM_EMAIL || 'Not set');
  console.log('- BREVO_API_KEY:', process.env.BREVO_API_KEY ? '✓ Set' : '✗ Missing');
  console.log('- EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Missing');
  console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set' : '✗ Missing');

  const testEmail = process.env.FROM_EMAIL || 'test@example.com';
  const testOTP = '123456';

  console.log('\n📨 Sending test verification OTP email...');
  try {
    await sendVerificationOTPEmail(testEmail, testOTP);
    console.log('✅ Verification email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
  }

  console.log('\n📨 Sending test password reset OTP email...');
  try {
    await sendOTPEmail(testEmail, testOTP);
    console.log('✅ Password reset email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
  }

  console.log('\n💡 If using Ethereal (test mode), check the console for preview URLs.');
  console.log('💡 If using SendGrid/Brevo, check your email inbox.');
}

testEmail()
  .then(() => {
    console.log('\n✅ Email test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Email test failed:', error);
    process.exit(1);
  });
