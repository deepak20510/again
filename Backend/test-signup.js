const API_URL = 'http://localhost:5000/api/v1';

async function testSignup() {
  try {
    console.log('🧪 Testing Signup Endpoint...\n');

    // Test 1: Signup with new email
    console.log('1. Testing signup with new email...');
    const newEmail = `test_${Date.now()}@example.com`;
    
    const signupRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newEmail,
        password: 'password123',
        role: 'STUDENT',
        phone: '1234567890'
      })
    });

    const signupData = await signupRes.json();
    console.log('Status:', signupRes.status);
    console.log('Response:', JSON.stringify(signupData, null, 2));

    if (signupData.success) {
      console.log('✅ Signup successful!');
      console.log('   User ID:', signupData.data.user.id);
      console.log('   Email:', signupData.data.user.email);
      console.log('   Role:', signupData.data.user.role);
    } else {
      console.log('❌ Signup failed:', signupData.message);
    }

    // Test 2: Signup with existing email (should fail)
    console.log('\n2. Testing signup with existing email...');
    const existingRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newEmail, // Same email as above
        password: 'password123',
        role: 'STUDENT'
      })
    });

    const existingData = await existingRes.json();
    console.log('Status:', existingRes.status);
    console.log('Response:', JSON.stringify(existingData, null, 2));

    if (existingRes.status === 409) {
      console.log('✅ Correctly rejected duplicate email');
    } else {
      console.log('❌ Should have returned 409 status');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSignup();
