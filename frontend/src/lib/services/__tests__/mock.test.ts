// Quick test script for mock services
// Run in browser console or Node.js

import { MockAuthService } from "../auth.service.mock";
import { MockOnboardingService } from "../onboarding.service.mock";

async function testMockServices() {
  console.log("🧪 Testing Mock Services...\n");

  // Test 1: Signup
  console.log("1️⃣ Testing Signup...");
  const signupResult = await MockAuthService.signup({
    email: "test@example.com",
    password: "Test123!@#",
    confirmPassword: "Test123!@#",
  });
  console.log("Signup Result:", signupResult);

  // Test 2: Login with wrong password
  console.log("\n2️⃣ Testing Login (wrong password)...");
  const wrongLoginResult = await MockAuthService.login({
    email: "demo@onebillion.vn",
    password: "wrongpassword",
  });
  console.log("Wrong Login Result:", wrongLoginResult);

  // Test 3: Login with correct credentials
  console.log("\n3️⃣ Testing Login (correct)...");
  const loginResult = await MockAuthService.login({
    email: "demo@onebillion.vn",
    password: "Demo123!@#",
  });
  console.log("Login Result:", loginResult);

  // Test 4: MFA verification
  console.log("\n4️⃣ Testing MFA Verification...");
  const mfaResult = await MockAuthService.verifyMFA({
    code: "123456",
    userId: "1",
  });
  console.log("MFA Result:", mfaResult);

  // Test 5: Generate Install Token
  console.log("\n5️⃣ Testing Generate Install Token...");
  const tokenResult = await MockOnboardingService.generateInstallToken("linux");
  console.log("Token Result:", tokenResult);

  // Test 6: Validate IP Address
  console.log("\n6️⃣ Testing Validate IP...");
  const ipResult = await MockOnboardingService.validateIP("192.168.1.100");
  console.log("IP Validation Result:", ipResult);

  // Test 7: Save Progress
  console.log("\n7️⃣ Testing Save Progress...");
  const progressResult = await MockOnboardingService.saveProgress(
    {
      siteName: "Test Server",
      ipAddress: "192.168.1.100",
      port: "22",
    },
    1
  );
  console.log("Progress Result:", progressResult);

  console.log("\n✅ All tests completed!");
}

// Uncomment to run tests
// testMockServices();

export { testMockServices };
