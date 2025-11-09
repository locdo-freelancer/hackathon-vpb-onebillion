/**
 * Test Connection to Deployed Backend
 * Run this to verify backend is accessible
 */

const BACKEND_URL = "https://hackathon-vpb-onebillion.vercel.app";

// Test backend health/availability
async function testBackendConnection() {
  console.log("🔍 Testing connection to:", BACKEND_URL);
  console.log("");
  
  try {
    const response = await fetch(`${BACKEND_URL}/api`, {
      method: "GET",
    });
    
    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      console.log("✅ Backend is accessible!");
      console.log("📊 Response:", data);
      return true;
    } else {
      console.log("⚠️ Backend responded with status:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ Cannot connect to backend:", error.message);
    return false;
  }
}

// Test Auth Register API
async function testRegisterAPI() {
  console.log("\n🧪 Testing Register API...");
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: "Test123!@#",
        full_name: "Test User",
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Register API works!");
      console.log("📝 Response:", data);
      return data;
    } else {
      console.log("⚠️ Register API error:", data);
      return null;
    }
  } catch (error) {
    console.error("❌ Register API failed:", error.message);
    return null;
  }
}

// Test Auth Login API
async function testLoginAPI() {
  console.log("\n🧪 Testing Login API...");
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "demo@onebillion.vn",
        password: "Demo123!@#",
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.access_token) {
      console.log("✅ Login API works!");
      console.log("🔑 Token:", data.access_token.substring(0, 20) + "...");
      return data;
    } else {
      console.log("⚠️ Login API error:", data);
      return null;
    }
  } catch (error) {
    console.error("❌ Login API failed:", error.message);
    return null;
  }
}

// Test Onboarding Complete API
async function testOnboardingCompleteAPI(token) {
  console.log("\n🧪 Testing Onboarding Complete API...");
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/onboarding/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        siteName: "Test Site",
        ipAddress: "192.168.1.100",
        port: "8080",
        domainName: "test.com",
        serverType: "linux",
        installToken: "sv_test123",
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Onboarding Complete API works!");
      console.log("📝 Response:", data);
      return data;
    } else {
      console.log("⚠️ Onboarding Complete API error:", data);
      return null;
    }
  } catch (error) {
    console.error("❌ Onboarding Complete API failed:", error.message);
    return null;
  }
}

// Test Validate Connectivity API
async function testValidateConnectivityAPI(token) {
  console.log("\n🧪 Testing Validate Connectivity API...");
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/onboarding/validate-connectivity`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Validate Connectivity API works!");
      console.log("📝 Response:", data);
      return data;
    } else {
      console.log("⚠️ Validate Connectivity API error:", data);
      return null;
    }
  } catch (error) {
    console.error("❌ Validate Connectivity API failed:", error.message);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Starting Backend Integration Tests");
  console.log("=" .repeat(50));
  
  // Test 1: Connection
  const isConnected = await testBackendConnection();
  if (!isConnected) {
    console.log("\n❌ Backend is not accessible. Please check:");
    console.log("1. Backend is deployed and running");
    console.log("2. CORS is configured to allow frontend domain");
    console.log("3. URL is correct:", BACKEND_URL);
    return;
  }
  
  // Test 2: Register
  await testRegisterAPI();
  
  // Test 3: Login
  const loginResult = await testLoginAPI();
  
  if (loginResult && loginResult.access_token) {
    // Test 4: Onboarding Complete
    await testOnboardingCompleteAPI(loginResult.access_token);
    
    // Test 5: Validate Connectivity
    await testValidateConnectivityAPI(loginResult.access_token);
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("✨ All tests completed!");
  console.log("\n💡 If all tests passed, frontend can connect to backend ✅");
}

// Export for manual testing
window.backendTest = {
  connection: testBackendConnection,
  register: testRegisterAPI,
  login: testLoginAPI,
  onboardingComplete: testOnboardingCompleteAPI,
  validateConnectivity: testValidateConnectivityAPI,
  runAll: runAllTests,
};

console.log(`
🔧 Backend Connection Test Functions:

Backend URL: ${BACKEND_URL}

1. Test Connection:
   backendTest.connection()

2. Test Register API:
   backendTest.register()

3. Test Login API:
   backendTest.login()

4. Test Onboarding Complete (needs token):
   backendTest.onboardingComplete("your-token")

5. Test Validate Connectivity (needs token):
   backendTest.validateConnectivity("your-token")

6. Run All Tests:
   backendTest.runAll()

Example:
  backendTest.runAll()
`);
