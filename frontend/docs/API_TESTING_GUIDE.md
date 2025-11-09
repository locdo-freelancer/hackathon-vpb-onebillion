# API Testing Guide

## 🔗 Swagger Documentation

**URL:** https://hackathon-vpb-onebillion.vercel.app/api/docs

Swagger UI cung cấp interactive documentation cho tất cả APIs.

---

## 🧪 Testing APIs với Swagger

### 1. **Authentication APIs**

#### Register User
```bash
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "Test123!@#",
  "full_name": "Test User",
  "company_name": "Test Company"
}
```

#### Login
```bash
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "Test123!@#"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Get Profile (Protected)
```bash
GET /api/auth/profile
Headers:
  Authorization: Bearer {access_token}
```

---

### 2. **Sites APIs**

#### Get All Sites
```bash
GET /api/sites
Headers:
  Authorization: Bearer {access_token}
```

#### Create Site
```bash
POST /api/sites
Headers:
  Authorization: Bearer {access_token}
Body:
{
  "name": "Production Server",
  "hostname": "web-prod-01",
  "ipAddress": "192.168.1.100",
  "port": "8080",
  "domains": ["example.com"],
  "serverType": "linux"
}
```

---

### 3. **Agents APIs**

#### Get All Agents
```bash
GET /api/agents?status=online&siteId={siteId}
Headers:
  Authorization: Bearer {access_token}
```

#### Get Agent Stats
```bash
GET /api/agents/stats
Headers:
  Authorization: Bearer {access_token}
```

---

### 4. **Onboarding APIs**

#### Complete Onboarding
```bash
POST /api/onboarding/complete
Headers:
  Authorization: Bearer {access_token}
Body:
{
  "siteName": "My Site",
  "ipAddress": "192.168.1.100",
  "port": "8080",
  "serverType": "linux",
  "installToken": "sv_abc123"
}
```

#### Validate Connectivity
```bash
GET /api/onboarding/validate-connectivity
Headers:
  Authorization: Bearer {access_token}
```

---

### 5. **Incidents APIs**

#### Get All Incidents
```bash
GET /api/incidents?severity=critical&status=open
Headers:
  Authorization: Bearer {access_token}
```

#### Create Incident
```bash
POST /api/incidents
Headers:
  Authorization: Bearer {access_token}
Body:
{
  "title": "Critical Security Breach",
  "severity": "critical",
  "type": "breach",
  "description": "Unauthorized access detected",
  "affectedSystems": ["web-prod-01"],
  "tags": ["security", "urgent"]
}
```

#### Resolve Incident
```bash
POST /api/incidents/{id}/resolve
Headers:
  Authorization: Bearer {access_token}
```

---

### 6. **Threats APIs**

#### Get All Threats
```bash
GET /api/threats?severity=critical&type=ip
Headers:
  Authorization: Bearer {access_token}
```

#### Create Threat
```bash
POST /api/threats
Headers:
  Authorization: Bearer {access_token}
Body:
{
  "indicator": "185.220.102.8",
  "description": "Malicious IP from Russia",
  "type": "ip",
  "severity": "critical",
  "confidence": 95,
  "malwareFamily": "APT28"
}
```

#### Block Threat
```bash
POST /api/threats/{id}/block
Headers:
  Authorization: Bearer {access_token}
```

#### Export to CSV
```bash
GET /api/threats/export/csv?severity=critical
Headers:
  Authorization: Bearer {access_token}
```

---

### 7. **Vulnerabilities APIs**

#### Get All Vulnerabilities
```bash
GET /api/vulnerabilities?severity=Critical&minCvss=9.0
Headers:
  Authorization: Bearer {access_token}
```

#### Scan Site
```bash
POST /api/vulnerabilities/scan/{siteId}
Headers:
  Authorization: Bearer {access_token}
```

---

### 8. **Agent Install APIs**

#### Get Install Commands
```bash
GET /api/agent-install/commands/linux?token=sv_abc123
Headers:
  Authorization: Bearer {access_token}
```

#### Get Install Status
```bash
GET /api/agent-install/status?siteId={siteId}
Headers:
  Authorization: Bearer {access_token}
```

---

### 9. **Security Metrics APIs**

#### Get Latest Metrics
```bash
GET /api/security-metrics/latest?siteId={siteId}
Headers:
  Authorization: Bearer {access_token}
```

#### Get Historical Data
```bash
GET /api/security-metrics/historical/{siteId}/security_score?startDate=1699545600000
Headers:
  Authorization: Bearer {access_token}
```

#### Create Metric
```bash
POST /api/security-metrics
Headers:
  Authorization: Bearer {access_token}
Body:
{
  "siteId": "site-uuid",
  "metricName": "Security Score",
  "metricType": "security_score",
  "category": "security",
  "metricValue": 87.5,
  "unit": "percentage"
}
```

---

### 10. **Notifications APIs**

#### Get User Notifications
```bash
GET /api/notifications/user/{userId}?isRead=false
Headers:
  Authorization: Bearer {access_token}
```

#### Mark as Read
```bash
PATCH /api/notifications/{id}/read
Headers:
  Authorization: Bearer {access_token}
```

#### Mark All as Read
```bash
PATCH /api/notifications/user/{userId}/read-all
Headers:
  Authorization: Bearer {access_token}
```

---

## 🔐 Authentication Flow

### Step 1: Register/Login
```javascript
// 1. Register new user
const registerResponse = await fetch('https://hackathon-vpb-onebillion.vercel.app/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test123!@#',
    full_name: 'Test User'
  })
});

// 2. Login to get token
const loginResponse = await fetch('https://hackathon-vpb-onebillion.vercel.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test123!@#'
  })
});

const { access_token } = await loginResponse.json();
```

### Step 2: Use Token for Protected Routes
```javascript
// 3. Call protected API
const sitesResponse = await fetch('https://hackathon-vpb-onebillion.vercel.app/api/sites', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});

const sites = await sitesResponse.json();
```

---

## 🧪 Quick Test Script

Copy and paste vào browser console:

```javascript
// Test full flow
(async () => {
  const BASE_URL = 'https://hackathon-vpb-onebillion.vercel.app/api';
  
  // 1. Register
  console.log('1. Registering user...');
  const registerRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `test${Date.now()}@example.com`,
      password: 'Test123!@#',
      full_name: 'Test User'
    })
  });
  const registerData = await registerRes.json();
  console.log('✅ Register:', registerData);
  
  // 2. Login
  console.log('\n2. Logging in...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: registerData.user.email,
      password: 'Test123!@#'
    })
  });
  const loginData = await loginRes.json();
  console.log('✅ Login:', loginData);
  
  const token = loginData.access_token;
  
  // 3. Get Profile
  console.log('\n3. Getting profile...');
  const profileRes = await fetch(`${BASE_URL}/auth/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const profileData = await profileRes.json();
  console.log('✅ Profile:', profileData);
  
  // 4. Get Sites
  console.log('\n4. Getting sites...');
  const sitesRes = await fetch(`${BASE_URL}/sites`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const sitesData = await sitesRes.json();
  console.log('✅ Sites:', sitesData);
  
  console.log('\n✨ All tests passed!');
  return { token, user: profileData };
})();
```

---

## 📊 Test Coverage

### Authentication
- ✅ Register new user
- ✅ Login with credentials
- ✅ Get user profile
- ✅ JWT token validation

### Sites
- ✅ List all sites
- ✅ Create new site
- ✅ Update site
- ✅ Delete site

### Agents
- ✅ List agents with filtering
- ✅ Get agent statistics
- ✅ Get agent metrics
- ✅ OS distribution

### Incidents
- ✅ CRUD operations
- ✅ Bulk actions
- ✅ Resolve/Close/Assign
- ✅ Statistics

### Threats
- ✅ CRUD operations
- ✅ Block/Unblock
- ✅ Bulk operations
- ✅ Enrichment data
- ✅ CSV export

### Vulnerabilities
- ✅ CRUD operations
- ✅ Site assignment
- ✅ Vulnerability scanning
- ✅ Top vulnerabilities

### Notifications
- ✅ CRUD operations
- ✅ Mark as read
- ✅ Bulk operations
- ✅ User notifications

---

## 🎯 Frontend Service Usage

All services are ready to use:

```typescript
import { 
  AuthService,
  SitesService,
  AgentsService,
  IncidentsService,
  ThreatsService
} from "@/lib/services";

// Login
const auth = await AuthService.login({ email, password });

// Get data
const sites = await SitesService.getAllSites();
const agents = await AgentsService.getOnlineAgents();
const incidents = await IncidentsService.getAllIncidents();
const threats = await ThreatsService.getAllThreats();
```

---

## 🔗 Useful Links

- **Swagger UI**: https://hackathon-vpb-onebillion.vercel.app/api/docs
- **Backend Architecture**: See `backend/BACKEND_ARCHITECTURE.md`
- **Frontend Integration**: See `frontend/docs/API_INTEGRATION_SUMMARY.md`

---

## 💡 Tips

1. **Always include Authorization header** cho protected routes
2. **Check response status** trước khi parse JSON
3. **Use Swagger UI** để test APIs interactively
4. **Frontend services** đã handle authentication tự động
5. **Xem documentation** trong code cho examples chi tiết

Happy testing! 🚀
