#!/bin/bash

# Script để tạo user test và test API

API_URL="http://localhost:3001/api"

echo "🔐 Creating test user and testing API..."
echo ""

# 1. Register user
echo "📝 Step 1: Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@onebillion.com",
    "password": "Test@123456",
    "full_name": "Test User",
    "company_name": "One Billion Security"
  }')

echo "Register response:"
echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# 2. Login
echo "🔑 Step 2: Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@onebillion.com",
    "password": "Test@123456"
  }')

echo "Login response:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token' 2>/dev/null)

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token"
  exit 1
fi

echo "✅ Token received: ${TOKEN:0:20}..."
echo ""

# 3. Test /sites API
echo "🏢 Step 3: Testing /sites API..."
SITES_RESPONSE=$(curl -s -X GET "$API_URL/sites" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "Sites response:"
echo "$SITES_RESPONSE" | jq '.' 2>/dev/null || echo "$SITES_RESPONSE"
echo ""

# 4. Create a test site
echo "➕ Step 4: Creating test site..."
CREATE_SITE_RESPONSE=$(curl -s -X POST "$API_URL/sites" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Server",
    "ip_address": "192.168.1.100",
    "domain_name": "test.example.com",
    "server_type": "web"
  }')

echo "Create site response:"
echo "$CREATE_SITE_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_SITE_RESPONSE"
echo ""

# 5. Get sites again
echo "📋 Step 5: Getting sites list..."
SITES_RESPONSE_2=$(curl -s -X GET "$API_URL/sites" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "Sites response:"
echo "$SITES_RESPONSE_2" | jq '.' 2>/dev/null || echo "$SITES_RESPONSE_2"
echo ""

# Save token to file for frontend use
echo "$TOKEN" > /tmp/onebillion_token.txt
echo "✅ Token saved to /tmp/onebillion_token.txt"
echo ""
echo "🎉 Test completed!"
echo ""
echo "To use this token in your browser console:"
echo "localStorage.setItem('token', '$TOKEN');"
