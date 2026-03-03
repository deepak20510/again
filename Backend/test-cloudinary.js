import cloudinary from './src/config/cloudinary.js';
import dotenv from 'dotenv';

dotenv.config();

async function testCloudinary() {
  console.log('\n🧪 Testing Cloudinary Configuration...\n');

  // Check environment variables
  console.log('Environment Variables:');
  console.log('- CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing');
  console.log('- CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing');
  console.log('- CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing');

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.log('\n❌ Cloudinary credentials are missing!');
    process.exit(1);
  }

  try {
    // Test API connection by fetching account details
    console.log('\n📡 Testing Cloudinary API connection...');
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary API is responding:', result);

    // Test URL generation
    console.log('\n🔗 Testing URL generation...');
    const testUrl = cloudinary.url('sample', {
      secure: true,
      transformation: [{ quality: 'auto' }]
    });
    console.log('Generated URL:', testUrl);
    
    if (testUrl.startsWith('https://res.cloudinary.com/')) {
      console.log('✅ URL format is correct (HTTPS)');
    } else {
      console.log('⚠️  URL format might be incorrect:', testUrl);
    }

    // List recent uploads
    console.log('\n📁 Checking recent uploads...');
    const resources = await cloudinary.api.resources({
      type: 'upload',
      max_results: 5,
      prefix: 'uploads/'
    });
    
    console.log(`Found ${resources.resources.length} recent uploads:`);
    resources.resources.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.public_id}`);
      console.log(`   URL: ${resource.secure_url}`);
      console.log(`   Format: ${resource.format}, Size: ${(resource.bytes / 1024).toFixed(2)} KB`);
    });

    console.log('\n✅ All Cloudinary tests passed!');
    console.log('\n💡 If users still can\'t see images:');
    console.log('   1. Check browser console for CORS errors');
    console.log('   2. Verify the URLs in the database are full HTTPS URLs');
    console.log('   3. Make sure Cloudinary account is active and not over quota');
    
  } catch (error) {
    console.error('\n❌ Cloudinary test failed:', error.message);
    if (error.http_code === 401) {
      console.error('   → Invalid API credentials. Check your .env file.');
    } else if (error.http_code === 404) {
      console.error('   → Cloud name not found. Verify CLOUDINARY_CLOUD_NAME.');
    }
    process.exit(1);
  }
}

testCloudinary();
