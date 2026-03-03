const API_URL = 'http://localhost:5000/api/v1';

async function testAnalytics() {
  try {
    console.log('🧪 Testing Analytics Endpoint...\n');

    // First, login to get a token
    console.log('1. Logging in...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'tksfri2024@gmail.com',
        password: 'password123'
      })
    });

    const loginData = await loginRes.json();
    
    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.message);
      return;
    }

    const token = loginData.data.token;
    const userId = loginData.data.user.id;
    console.log('✅ Login successful');
    console.log('   User ID:', userId);
    console.log('   Role:', loginData.data.user.role);

    // Test analytics endpoint
    console.log('\n2. Fetching analytics...');
    const analyticsRes = await fetch(`${API_URL}/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const analyticsData = await analyticsRes.json();

    if (!analyticsData.success) {
      console.error('❌ Analytics fetch failed:', analyticsData.message);
      return;
    }

    console.log('✅ Analytics fetched successfully\n');
    console.log('📊 Analytics Data:');
    console.log(JSON.stringify(analyticsData.data, null, 2));

    // Summary
    console.log('\n📈 Summary:');
    console.log(`   Profile Views: ${analyticsData.data.overview.profileViews}`);
    console.log(`   Post Impressions: ${analyticsData.data.overview.postImpressions}`);
    console.log(`   Search Appearances: ${analyticsData.data.overview.searchAppearances}`);
    console.log(`   Growth: ${analyticsData.data.overview.growthPercentage}%`);
    console.log(`   Total Posts: ${analyticsData.data.content.totalPosts}`);
    console.log(`   Average Rating: ${analyticsData.data.content.averageRating}`);
    console.log(`   Connections: ${analyticsData.data.engagement.connections}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAnalytics();
