# Backend Architecture Documentation

## 📦 Project Structure

````
backend/
├── src/
│   ├── config/              # Configuration modules
│   │   └── database.module.ts
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication module
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── sites/           # Site management module
│   │   ├── agents/          # Agent management module (NEW)
│   │   ├── users/           # User management module
│   │   ├── agent-comm/      # Agent communication module
│   │   ├── agent-install/   # Agent installation module (NEW)
│   │   ├── onboarding/      # User onboarding module (NEW)
│   │   ├── incidents/         # Security incident management (NEW)
│   │   ├── threats/           # Threat intelligence indicators (NEW)
│   │   ├── vulnerabilities/   # Vulnerability management (NEW)
│   │   ├── remediation-actions/ # Remediation action tracking (NEW)
│   │   ├── security-metrics/ # Security metrics and reporting (NEW)
│   │   ├── notifications/    # Notification and alert management (NEW)
│   │   └── tasks/            # Background tasks module
│   ├── app.module.ts        # Root module
│   ├── app.provider.ts      # Global providers
│   └── main.ts              # Application entry point
├── libs/                    # Shared libraries
│   ├── entities/            # TypeORM entities
│   ├── shared/              # Shared utilities (BaseEntity)
│   ├── decorators/          # Custom decorators
│   ├── interceptors/        # Global interceptors
│   ├── middlewares/         # Custom middlewares
│   ├── guards/              # Custom guards
│   ├── constant/            # Constants (enums, types)
│   └── helper/              # Helper functions
└── infrastructure/          # AWS CDK stacks

## 🏗️ Architecture Layers

### 1. Application Layer (app.module.ts)
- Global configuration (ConfigModule, TypeORM, Schedule)
- Module imports and registration
- Global middleware configuration

### 2. Provider Layer (app.provider.ts)
- **Global Guard**: JwtAuthGuard - JWT authentication for all routes
- **Global Interceptor**: ResponseLoggingInterceptor - Standardized response format and logging

### 3. Middleware Layer
- **LoggingMiddleware**: Request logging with timestamps
- **IpFilterMiddleware**: Origin/IP filtering (available but not enabled by default)

### 4. Module Layer

#### Auth Module
**Endpoints:**
- `POST /api/auth/register` - User registration (Public)
- `POST /api/auth/login` - User authentication (Public)
- `GET /api/auth/profile` - Get user profile (Protected)

**Features:**
- JWT token generation and validation
- Password hashing with bcrypt (12 rounds)
- Public routes using @Public() decorator
- Custom @UserReq() decorator for user extraction

#### Sites Module
**Endpoints:**
- `POST /api/sites` - Create new site
- `GET /api/sites` - Get all user sites with statistics
- `GET /api/sites/:id` - Get site by ID
- `PATCH /api/sites/:id` - Update site
- `DELETE /api/sites/:id` - Delete site

**Features:**
- Automatic agent token generation (32-byte secure random)
- Owner-based authorization
- Site status monitoring
- Frontend-compatible data format with stats
- Icon gradient mapping by server type
- Last checked timestamp formatting
- Relationship with Agent entity

**Response Format:**
```json
{
  "sites": [
    {
      "id": "uuid",
      "name": "Production Web Server",
      "hostname": "web-prod-01",
      "ipAddress": "192.168.1.100",
      "domains": ["example.com"],
      "agentCount": 1,
      "status": "active",
      "icon": "fas fa-globe",
      "iconGradient": "from-cyan-500 to-cyan-600",
      "lastChecked": "2 minutes ago"
    }
  ],
  "totalSites": 5,
  "activeSites": 3,
  "inactiveSites": 1,
  "warningSites": 1
}
```

#### Agents Module (NEW)
**Endpoints:**
- `GET /api/agents` - List all agents with filtering
- `GET /api/agents/stats` - Get agent statistics and metrics
- `GET /api/agents/os-distribution` - Get OS distribution chart data
- `GET /api/agents/:id` - Get agent details
- `GET /api/agents/:id/metrics` - Get detailed agent metrics

**Features:**
- Agent status filtering (online/offline/updating/all)
- Site-based filtering
- OS type detection and icon mapping
- Heartbeat timestamp formatting
- Performance metrics aggregation
- Frontend-compatible data format

**Query Parameters:**
- `status` - Filter by agent status (online|offline|updating|all)
- `siteId` - Filter agents by specific site

**Response Format:**
```json
[
  {
    "id": "uuid",
    "hostname": "web-prod-01",
    "ipAddress": "192.168.1.100",
    "os": "Ubuntu 22.04",
    "osType": "linux",
    "osIcon": "fab fa-linux",
    "version": "v2.1.5",
    "status": "online",
    "lastHeartbeat": "2s ago",
    "siteId": "site-uuid",
    "siteName": "Production Web Server",
    "iconGradient": "from-blue-500 to-cyan-500"
  }
]
```

#### Onboarding Module (NEW)
**Endpoints:**
- `POST /api/onboarding/progress` - Save onboarding step progress
- `POST /api/onboarding/complete` - Complete onboarding and create site
- `POST /api/onboarding/validate-ip` - Validate IP address reachability
- `POST /api/onboarding/generate-token` - Generate agent installation token
- `GET /api/onboarding/validate-connectivity` - Validate network connectivity

**Features:**
- Multi-step onboarding process
- IP address validation using DNS lookup
- Automatic site and agent creation
- Installation token generation
- Connectivity validation simulation

**Onboarding Flow:**
1. **Step 1**: Site Details (name, IP, port, domain)
2. **Step 2**: Server Type (linux/windows/docker)
3. **Step 3**: Agent Installation (token generation)
4. **Step 4**: Validation (connectivity checks)

#### Agent Installation Module (NEW)
**Endpoints:**
- `GET /api/agent-install/commands/:platform` - Get platform-specific install commands
- `GET /api/agent-install/status` - Check agent installation status

**Features:**
- Platform-specific installation commands (Linux, Windows, Docker)
- Dynamic token injection in commands
- Installation status monitoring
- Download URL generation

**Supported Platforms:**
- **Linux**: wget + shell script installation
- **Windows**: PowerShell + executable installation
- **Docker**: Container-based deployment

**Command Examples:**
```bash
# Linux
wget http://localhost:3001/downloads/securevault-agent-linux.sh
chmod +x securevault-agent-linux.sh
./securevault-agent-linux.sh --token=abc123 --server=http://localhost:3001

# Windows
Invoke-WebRequest -Uri "http://localhost:3001/downloads/securevault-agent-windows.exe" -OutFile "securevault-agent.exe"
./securevault-agent.exe /S

# Docker
docker pull securevault/agent:latest
docker run -d --name securevault-agent \
  -e TOKEN=abc123 \
  -e SERVER_URL=http://localhost:3001 \
  --restart unless-stopped \
  securevault/agent:latest
```

#### Incidents Module (NEW)
**Endpoints:**
- `POST /api/incidents` - Create new security incident
- `GET /api/incidents` - List all incidents with filtering
- `GET /api/incidents/stats` - Get incident statistics by status/severity
- `GET /api/incidents/:id` - Get incident details with timeline and analysis
- `GET /api/incidents/incident/:incidentId` - Get incident by display ID (INC-001)
- `PATCH /api/incidents/:id` - Update incident information
- `DELETE /api/incidents/:id` - Delete incident
- `POST /api/incidents/bulk-action` - Bulk operations (close, assign, export)
- `POST /api/incidents/:id/resolve` - Mark incident as resolved
- `POST /api/incidents/:id/close` - Mark incident as closed
- `POST /api/incidents/:id/assign` - Assign incident to user

**Features:**
- Auto-generated incident IDs (INC-001, INC-002, etc.)
- MITRE ATT&CK framework integration
- Timeline tracking with detailed events
- AI recommendations and analysis
- File hash and IP reputation analysis
- Related incidents correlation
- Evidence management
- Bulk operations for efficiency

**Incident Types:**
- Malware detection
- Phishing campaigns
- DDoS attacks
- Data breaches
- Policy violations
- Vulnerability exploitation
- Ransomware attempts
- Intrusion attempts

**Response Format:**
```json
{
  "incidents": [
    {
      "id": "uuid",
      "incidentId": "INC-001",
      "title": "Advanced Persistent Threat Detected",
      "severity": "critical",
      "status": "investigating",
      "type": "malware",
      "dateCreated": "2024-01-15 14:32",
      "assignee": {
        "id": "user-id",
        "name": "Alex Chen",
        "avatar": "avatar-url"
      },
      "affectedSystems": ["web-prod-01", "db-mysql-01"],
      "tags": ["apt", "state-sponsored", "critical"]
    }
  ],
  "stats": {
    "total": 8,
    "open": 2,
    "investigating": 3,
    "resolved": 2,
    "closed": 1,
    "critical": 3,
    "high": 2,
    "medium": 2,
    "low": 1
  }
}
```

#### Threats Module (NEW)
**Endpoints:**
- `POST /api/threats` - Create new threat indicator
- `GET /api/threats` - List all threat indicators with filtering
- `GET /api/threats/stats` - Get threat statistics by severity/status
- `GET /api/threats/:id` - Get threat indicator details with enrichment
- `PATCH /api/threats/:id` - Update threat indicator
- `DELETE /api/threats/:id` - Delete threat indicator
- `POST /api/threats/:id/block` - Block threat indicator
- `POST /api/threats/:id/unblock` - Unblock threat indicator
- `POST /api/threats/bulk/block` - Bulk block multiple indicators
- `POST /api/threats/bulk/delete` - Bulk delete multiple indicators
- `GET /api/threats/export/csv` - Export threats to CSV
- `GET /api/threats/enrichment/:indicator` - Get enrichment data

**Features:**
- Multi-type indicator support (IP, Domain, URL, Hash)
- Confidence scoring (0-100)
- Geolocation and ASN information
- Malware family classification
- Intelligence correlation
- Time-based filtering
- Bulk operations
- CSV export functionality

**Threat Types:**
- IP addresses (malicious IPs, C2 servers)
- Domains (phishing, malware distribution)
- URLs (phishing links, exploit kits)
- File hashes (malware samples)

**Response Format:**
```json
{
  "indicators": [
    {
      "id": "uuid",
      "indicator": "185.220.102.8",
      "description": "Known malware C&C server",
      "type": "ip",
      "severity": "critical",
      "confidence": 95,
      "country": "Russia",
      "countryCode": "RU",
      "countryFlag": "🇷🇺",
      "firstSeen": "2 hours ago",
      "lastSeen": "1 minute ago",
      "status": "active",
      "icon": "fas fa-exclamation-triangle",
      "iconColor": "text-red-400"
    }
  ],
  "stats": {
    "total": 156,
    "critical": 23,
    "high": 45,
    "medium": 67,
    "low": 21,
    "blocked": 89,
    "active": 67
  }
}
```

#### Vulnerabilities Module (NEW)
**Endpoints:**
- `POST /api/vulnerabilities` - Create new vulnerability (CVE)
- `GET /api/vulnerabilities` - List all vulnerabilities with filtering
- `GET /api/vulnerabilities/stats` - Get vulnerability statistics
- `GET /api/vulnerabilities/:id` - Get vulnerability details
- `PATCH /api/vulnerabilities/:id` - Update vulnerability
- `DELETE /api/vulnerabilities/:id` - Delete vulnerability
- `POST /api/vulnerabilities/assign` - Assign vulnerability to site
- `GET /api/vulnerabilities/sites/:siteId` - Get site-specific vulnerabilities
- `PATCH /api/vulnerabilities/sites/:siteId/:vulnId` - Update site vulnerability status
- `DELETE /api/vulnerabilities/sites/:siteId/:vulnId` - Remove vulnerability from site
- `GET /api/vulnerabilities/top` - Get top vulnerabilities by impact
- `POST /api/vulnerabilities/scan/:siteId` - Scan site for vulnerabilities

**Features:**
- CVE database management
- Site-specific vulnerability tracking
- CVSS score filtering
- Severity-based categorization
- Remediation information
- Vulnerability scanning simulation
- Top vulnerabilities by affected sites
- Resolution tracking

**CVE Integration:**
- CVE identifier support (CVE-2023-12345)
- CVSS score integration
- Severity mapping (Critical, High, Medium, Low)
- Published date tracking
- Remediation guidance

**Response Format:**
```json
{
  "vulnerabilities": [
    {
      "id": "uuid",
      "cveId": "CVE-2023-12345",
      "title": "Remote Code Execution in Apache Log4j",
      "severity": "Critical",
      "cvssScore": "9.8",
      "publishedDate": "2023-12-01T00:00:00Z",
      "affectedSites": 3,
      "sites": [
        {
          "id": "site-uuid",
          "name": "Production Web Server",
          "status": "Active",
          "detectedAt": "2023-12-02T10:30:00Z",
          "lastScanned": "2023-12-03T14:15:00Z"
        }
      ]
    }
  ],
  "stats": {
    "total": 1247,
    "bySeverity": {
      "critical": 89,
      "high": 234,
      "medium": 567,
      "low": 357
    },
    "byStatus": {
      "active": 456,
      "resolved": 678,
      "mitigated": 113
    }
  }
}
```

#### Remediation Actions Module (NEW)
**Endpoints:**
- `POST /api/remediation-actions` - Create new remediation action
- `GET /api/remediation-actions` - List all remediation actions with filtering
- `GET /api/remediation-actions/statistics` - Get remediation statistics
- `GET /api/remediation-actions/by-source/:sourceType/:sourceId` - Get actions by source
- `GET /api/remediation-actions/:id` - Get remediation action details
- `PATCH /api/remediation-actions/:id` - Update remediation action
- `DELETE /api/remediation-actions/:id` - Delete remediation action
- `PATCH /api/remediation-actions/bulk/status` - Bulk update status

**Features:**
- Cross-reference tracking for incidents, threats, and vulnerabilities
- Progress tracking with percentage completion
- Effectiveness scoring (0-100)
- Cost estimation and tracking
- Due date management with overdue alerts
- Priority-based assignment
- Automated vs manual remediation types
- Bulk status updates for efficiency

**Remediation Types:**
- Manual remediation actions
- Automated security responses
- Semi-automated workflows
- Policy enforcement actions
- Patch management activities
- Configuration changes
- Access control updates

**Response Format:**
```json
{
  "data": [
    {
      "id": "uuid",
      "actionType": "Patch Critical Vulnerability",
      "description": "Apply security patch for CVE-2023-12345",
      "priority": "critical",
      "status": "in_progress",
      "remediationType": "manual",
      "progressPercentage": 75,
      "assignedTo": "admin-user-id",
      "dueDate": 1699545600000,
      "costEstimate": 500.00,
      "effectivenessScore": 85,
      "site": {
        "id": "site-uuid",
        "name": "Production Web Server"
      },
      "incident": {
        "id": "incident-uuid",
        "incidentId": "INC-001",
        "title": "Critical Vulnerability Detected"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

#### Security Metrics Module (NEW)
**Endpoints:**
- `POST /api/security-metrics` - Create new security metric
- `POST /api/security-metrics/bulk` - Create multiple metrics
- `GET /api/security-metrics` - List all metrics with filtering
- `GET /api/security-metrics/statistics` - Get comprehensive statistics
- `GET /api/security-metrics/alerts` - Get alert count by severity
- `GET /api/security-metrics/latest` - Get latest metrics for each type
- `GET /api/security-metrics/historical/:siteId/:metricType` - Get time-series data
- `GET /api/security-metrics/site/:siteId` - Get metrics by site
- `GET /api/security-metrics/:id` - Get metric details
- `PATCH /api/security-metrics/:id` - Update metric
- `DELETE /api/security-metrics/:id` - Delete metric

**Features:**
- Real-time and historical metrics storage
- Automatic alert level calculation based on thresholds
- Trend analysis with percentage change tracking
- Multi-category metrics (Security, Performance, Compliance, Operational)
- Time-series data for dashboard visualization
- Threshold-based alerting system
- Bulk metric ingestion for high-volume data

**Metric Types:**
- Attack count monitoring
- Vulnerability count tracking
- Threat level assessment
- Security score calculation
- Incident count analysis
- Remediation rate tracking
- System uptime monitoring
- Compliance score evaluation

**Alert Thresholds:**
- Low: Initial warning level
- Medium: Elevated concern level
- High: Urgent attention required
- Critical: Immediate action needed

**Response Format:**
```json
{
  "data": [
    {
      "id": "uuid",
      "siteName": "Production Web Server",
      "metricName": "Security Score",
      "metricType": "security_score",
      "category": "security",
      "metricValue": 87.5,
      "unit": "percentage",
      "recordedAt": 1699545600000,
      "currentAlertLevel": "medium",
      "changePercentage": -2.3,
      "previousValue": 89.6,
      "thresholds": {
        "low": 80,
        "medium": 70,
        "high": 60,
        "critical": 50
      }
    }
  ],
  "statistics": {
    "total": 1247,
    "active": 1156,
    "byType": {
      "security_score": 234,
      "attack_count": 456,
      "vulnerability_count": 557
    },
    "trends": {
      "improving": 567,
      "degrading": 234,
      "stable": 446
    }
  }
}
```

#### Notifications Module (NEW)
**Endpoints:**
- `POST /api/notifications` - Create new notification
- `POST /api/notifications/bulk` - Create multiple notifications
- `GET /api/notifications` - List all notifications with filtering
- `GET /api/notifications/statistics` - Get notification statistics
- `GET /api/notifications/high-priority` - Get high priority notifications
- `GET /api/notifications/user/:userId` - Get user-specific notifications
- `GET /api/notifications/by-source/:sourceType/:sourceId` - Get notifications by source
- `GET /api/notifications/:id` - Get notification details
- `PATCH /api/notifications/:id` - Update notification
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/user/:userId/read-all` - Mark all as read for user
- `PATCH /api/notifications/bulk/read` - Bulk mark as read
- `DELETE /api/notifications/cleanup-expired` - Clean up expired notifications
- `DELETE /api/notifications/:id` - Delete notification

**Features:**
- Multi-source notification support (incidents, threats, metrics, sites)
- Priority-based notification routing
- Multiple delivery channels (in-app, email, SMS, webhook, Slack)
- Expiration management with automatic cleanup
- Read/unread status tracking
- Bulk operations for efficiency
- Tag-based categorization and filtering
- High-priority notification separation

**Notification Types:**
- Incident alerts and updates
- Threat detection warnings
- Vulnerability notifications
- Security metric alerts
- Remediation action updates
- System status notifications
- Compliance warnings
- General information messages

**Delivery Channels:**
- In-app notifications (default)
- Email notifications
- SMS alerts for critical issues
- Webhook integrations
- Slack channel notifications

**Response Format:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Critical Security Alert",
      "message": "High-severity incident INC-001 requires immediate attention",
      "notificationType": "incident",
      "priority": "critical",
      "channel": "in_app",
      "isRead": false,
      "createdAt": "2023-11-07T10:30:00Z",
      "expiresAt": 1699632000000,
      "actionUrl": "/incidents/INC-001",
      "actionText": "View Incident",
      "tags": ["security", "critical", "incident"],
      "source": {
        "type": "incident",
        "id": "incident-uuid",
        "name": "Advanced Persistent Threat Detected"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 89,
    "totalPages": 9,
    "unreadCount": 23
  }
}
```

#### Users Module
**Endpoints:**
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

#### Agent Communication Module
**Endpoints:**
- `POST /api/agent/check-in` - Agent heartbeat (Bearer token auth)

**Features:**
- Custom AgentAuthGuard using Bearer token strategy
- Updates agent last_checkin timestamp
- Updates site connection status

#### Tasks Module
**Features:**
- Cron job running every 5 minutes
- Monitors stale agents (>10 minutes since last check-in)
- Automatically updates agent and site status

## 🎨 Decorators

### Custom Decorators (@lib/decorators)

#### @Public()
Marks routes as public, bypassing JWT authentication
```typescript
@Public()
@Post('login')
async login(@Body() dto: LoginUserDto) { }
````

#### @UserReq()

Extracts authenticated user from request

```typescript
@Get('profile')
async getProfile(@UserReq() user: User) { }
```

#### @ApiOperationDecorator()

Combines multiple Swagger decorators for consistent API documentation

```typescript
@ApiOperationDecorator({
  summary: 'Create new site',
  description: 'Register a new site for monitoring',
})
```

#### @Roles()

Define required roles for endpoints (for future RBAC implementation)

```typescript
@Roles(Role.ADMIN)
@Delete(':id')
async remove(@Param('id') id: string) { }
```

## 🔒 Guards

### JwtAuthGuard

- Global guard applied via APP_GUARD provider
- Validates JWT tokens from Authorization header
- Respects @Public() decorator to allow unauthenticated access
- Injects user object into request

### AgentAuthGuard

- Bearer token authentication for agent endpoints
- Validates against site entity_token field
- Used specifically for agent communication routes

## 🔄 Interceptors

### ResponseLoggingInterceptor

Applied globally, provides:

- Standardized response format:
  ```json
  {
    "success": true,
    "data": { ... },
    "timestamp": "2025-01-07T10:30:00.000Z"
  }
  ```
- Request execution time logging
- HTTP status code logging

## 🌐 Middlewares

### LoggingMiddleware

- Applied to all routes (`*`)
- Logs request method, URL, and formatted timestamp
- Helps with debugging and monitoring

### IpFilterMiddleware (Available)

- Origin-based access control
- Configurable via ALLOWED_ORIGINS environment variable
- Can be enabled if IP/origin filtering is needed

## 📊 Database Layer

### BaseEntity (@lib/shared)

All entities extend BaseEntity which provides:

```typescript
- id: UUID (auto-generated)
- createdAt: timestamp (auto-set)
- updatedAt: timestamp (auto-updated)
- deletedAt: timestamp (soft delete support)
```

### Entities (@lib/entities)

1. **User** - User accounts and authentication
2. **Site** - Monitored websites/servers
3. **AgentEntity** - Agent instances on monitored sites
4. **Vulnerability** - CVE database
5. **SiteVulnerability** - Junction table (composite PK)
6. **Threat** - Security threats detected
7. **RemediationAction** - Enhanced remediation action tracking with progress, effectiveness, and multi-source relationships
8. **SecurityMetric** - Real-time and historical security metrics with threshold-based alerting
9. **Notification** - Multi-source notification system with priority routing and delivery channels
10. **Incident** - Security incident management with MITRE ATT&CK
11. **ThreatIndicator** - Threat intelligence indicators (IP/Domain/URL/Hash)

## 🔐 Authentication Flow

1. User registers via `/api/auth/register`
2. Password is hashed with bcrypt (12 rounds)
3. User logs in via `/api/auth/login`
4. JWT token is generated and returned
5. Client includes token in Authorization header: `Bearer <token>`
6. JwtAuthGuard validates token on protected routes
7. User object is injected into request via JwtStrategy
8. Controllers access user via @UserReq() decorator

## 📝 API Documentation

Swagger documentation available at: `http://localhost:3001/api/docs`

Features:

- Interactive API testing
- Request/response schemas
- Authentication support (JWT Bearer token)
- Grouped by tags (auth, users, sites, agents, agent, agent-install, onboarding, incidents, threats, vulnerabilities, remediation-actions, security-metrics, notifications)

## 🚀 Running the Application

### Prerequisites

```bash
# Install dependencies
npm install

# Setup environment variables (.env)
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=onebillion
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

### Development

```bash
npm run dev
# or
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

## 🧪 Path Aliases

TypeScript path aliases for clean imports:

```typescript
@lib/entities      -> libs/entities
@lib/shared        -> libs/shared/src
@lib/decorators    -> libs/decorators/src
@lib/interceptors  -> libs/interceptors/src
@lib/middlewares   -> libs/middlewares/src
@lib/guards        -> libs/guards/src
@lib/constant      -> libs/constant/src
@lib/helper        -> libs/helper/src
```

## 📋 Next Steps

1. **Install Swagger package**:

   ```bash
   npm install @nestjs/swagger --save
   ```

2. **Run migrations** (if using TypeORM migrations):

   ```bash
   npm run migration:run
   ```

3. **Start the server**:

   ```bash
   npm run dev
   ```

4. **Access Swagger docs**:
   ```
   http://localhost:3001/api/docs
   ```

## 🎯 Key Features Implemented

✅ Global JWT authentication with @Public() decorator support
✅ Response logging and standardization
✅ Request logging middleware
✅ Custom decorators for cleaner code
✅ Swagger API documentation with comprehensive tags
✅ BaseEntity pattern for DRY code
✅ TypeScript path aliases
✅ Role-based access control foundation (Roles decorator)
✅ Agent Bearer token authentication
✅ Background cron jobs for agent monitoring
✅ Secure password hashing
✅ Soft delete support
✅ **NEW**: Frontend-compatible API responses
✅ **NEW**: Agent management with OS detection
✅ **NEW**: Multi-step onboarding process
✅ **NEW**: Platform-specific agent installation
✅ **NEW**: Real-time connectivity validation
✅ **NEW**: Site statistics and metrics aggregation
✅ **NEW**: Agent heartbeat monitoring with formatting
✅ **NEW**: Icon gradient mapping for UI consistency
✅ **NEW**: Security incident management with MITRE ATT&CK
✅ **NEW**: Threat intelligence with multi-type indicators
✅ **NEW**: CVE vulnerability management and tracking
✅ **NEW**: Site-specific vulnerability assignments
✅ **NEW**: Incident timeline and evidence management
✅ **NEW**: Threat indicator blocking and enrichment
✅ **NEW**: Bulk operations for efficiency
✅ **NEW**: Advanced filtering and statistics
✅ **NEW**: Enhanced remediation action tracking with progress and effectiveness
✅ **NEW**: Real-time security metrics with threshold-based alerting
✅ **NEW**: Multi-source notification system with priority routing
✅ **NEW**: Cross-reference tracking between incidents, threats, and vulnerabilities
✅ **NEW**: Cost estimation and ROI tracking for remediation actions
✅ **NEW**: Time-series data collection for trend analysis
✅ **NEW**: Automated alert level calculation based on configurable thresholds
✅ **NEW**: Multi-channel notification delivery (in-app, email, SMS, webhook, Slack)
✅ **NEW**: Expiration management with automatic cleanup
✅ **NEW**: Comprehensive analytics and reporting capabilities

## � Frontend Integration

### API Compatibility

The backend is fully compatible with frontend hooks and components:

#### Sites Integration (`useSitesData` hook)

```typescript
// GET /api/sites returns format compatible with:
interface SitesData {
  sites: Site[];
  totalSites: number;
  activeSites: number;
  inactiveSites: number;
  warningSites: number;
}
```

#### Agents Integration (`useAgentsData` hook)

```typescript
// GET /api/agents returns format compatible with:
interface Agent {
  id: string;
  hostname: string;
  ipAddress: string;
  os: string;
  osType: "linux" | "windows" | "macos" | "other";
  osIcon: string;
  version: string;
  status: "online" | "offline" | "updating";
  lastHeartbeat: string;
  iconGradient: string;
  siteId?: string;
  siteName?: string;
}
```

#### Onboarding Integration (`useOnboarding` hook)

```typescript
// POST /api/onboarding/complete creates site and agent
// GET /api/onboarding/validate-connectivity returns validation status
```

#### Agent Install Integration (`useAgentInstall` hook)

```typescript
// GET /api/agent-install/commands/:platform returns installation commands
// GET /api/agent-install/status returns connection status
```

#### Incidents Integration (`useIncidentsData` hook)

```typescript
// GET /api/incidents returns format compatible with:
interface IncidentsData {
  incidents: Incident[];
  stats: IncidentsStats;
}

interface Incident {
  id: string;
  incidentId: string; // INC-001
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "investigating" | "resolved" | "closed";
  type: "malware" | "phishing" | "ddos" | "intrusion" | "data-breach";
  dateCreated: string;
  assignee: { id: string; name: string; avatar: string } | null;
  affectedSystems: string[];
  tags: string[];
}
```

#### Threats Integration (`useThreatsData` hook)

```typescript
// GET /api/threats returns format compatible with:
interface ThreatsData {
  indicators: ThreatIndicator[];
  stats: ThreatsStats;
}

interface ThreatIndicator {
  id: string;
  indicator: string; // IP, domain, URL, hash
  type: "ip" | "domain" | "url" | "hash";
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "blocked" | "flagged" | "monitoring";
  confidence: number; // 0-100
  country: string;
  firstSeen: string;
  lastSeen: string;
}
```

#### Remediation Actions Integration (`useRemediationData` hook)

```typescript
// GET /api/remediation-actions returns format compatible with:
interface RemediationData {
  data: RemediationAction[];
  pagination: PaginationInfo;
}

interface RemediationAction {
  id: string;
  actionType: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "completed" | "failed" | "cancelled";
  remediationType: "manual" | "automated" | "semi_automated";
  progressPercentage: number; // 0-100
  assignedTo: string;
  dueDate: number;
  costEstimate: number;
  effectivenessScore: number; // 0-100
  site: { id: string; name: string };
  incident?: { id: string; incidentId: string; title: string };
  threatIndicator?: { id: string; indicator: string; type: string };
  siteVulnerability?: { id: string; cveId: string };
}
```

#### Security Metrics Integration (`useSecurityMetrics` hook)

```typescript
// GET /api/security-metrics returns format compatible with:
interface SecurityMetricsData {
  data: SecurityMetric[];
  statistics: MetricsStatistics;
}

interface SecurityMetric {
  id: string;
  siteName: string;
  metricName: string;
  metricType:
    | "attack_count"
    | "vulnerability_count"
    | "threat_level"
    | "security_score";
  category: "security" | "performance" | "compliance" | "operational";
  metricValue: number;
  unit: string;
  recordedAt: number;
  currentAlertLevel: "low" | "medium" | "high" | "critical";
  changePercentage: number;
  previousValue: number;
}
```

#### Notifications Integration (`useNotifications` hook)

```typescript
// GET /api/notifications returns format compatible with:
interface NotificationsData {
  data: Notification[];
  pagination: PaginationInfo & { unreadCount: number };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  notificationType: "incident" | "threat" | "vulnerability" | "security_metric";
  priority: "low" | "medium" | "high" | "critical";
  channel: "in_app" | "email" | "sms" | "webhook" | "slack";
  isRead: boolean;
  createdAt: string;
  expiresAt: number;
  actionUrl: string;
  actionText: string;
  tags: string[];
  source: {
    type: string;
    id: string;
    name: string;
  };
}
```

### Response Format Standardization

All API responses follow this format (via ResponseLoggingInterceptor):

```json
{
  "success": true,
  "data": {
    /* actual data */
  },
  "timestamp": "2025-11-07T10:30:00.000Z"
}
```

### Authentication Flow

1. Frontend calls `/api/auth/login`
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. All subsequent requests include `Authorization: Bearer <token>`
5. Backend validates token via JwtAuthGuard
6. User object available via `@UserReq()` decorator

## �🔧 Configuration

All global configurations are centralized in:

- `app.provider.ts` - Global guards and interceptors
- `app.module.ts` - Module imports and middleware setup
- `main.ts` - Application bootstrap and Swagger setup
- `database.module.ts` - Entity registration and TypeORM config

## 📊 Database Schema Updates

### Entity Relationships

```
User (1) ─────── (n) Site (1) ─────── (1) AgentEntity
│                      │
│                      ├─── (n) SiteVulnerability
│                      ├─── (n) Threat
│                      ├─── (n) Incident (NEW)
│                      ├─── (n) RemediationAction (Enhanced)
│                      ├─── (n) SecurityMetric (NEW)
│                      └─── (n) Notification (Enhanced)
│
├─── (n) Notification (Enhanced)
└─── (n) Incident (assignee)

Vulnerability (1) ─────── (n) SiteVulnerability
ThreatIndicator (NEW) ─── (n) Site (optional)
                      └─── (n) RemediationAction (NEW)
                      └─── (n) Notification (NEW)

SiteVulnerability (1) ─── (n) RemediationAction (NEW)

Incident (1) ─────── (n) RemediationAction (Enhanced)
Incident (1) ─────── (n) Notification (Enhanced)

SecurityMetric (1) ──── (n) Notification (NEW)
SecurityMetric (n) ──── (1) Site

RemediationAction relationships:
├─── (n) Incident
├─── (n) ThreatIndicator
├─── (n) SiteVulnerability
└─── (1) Site

Notification relationships:
├─── (1) User
├─── (n) Incident
├─── (n) Site
├─── (n) ThreatIndicator
└─── (n) SecurityMetric
```

### BaseEntity Integration

All entities now extend BaseEntity which provides:

- UUID primary keys (except junction tables)
- Automatic timestamps (createdAt, updatedAt)
- Soft delete support (deletedAt)
- BeforeUpdate hooks

## 🔄 Migration Notes

### Breaking Changes

1. All entities now use UUID instead of text-based IDs
2. Timestamps changed from bigint to proper timestamp columns
3. BaseEntity fields added to all entities
4. **NEW**: Incident entity with MITRE ATT&CK framework support
5. **NEW**: ThreatIndicator entity with multi-type indicator support
6. **NEW**: Enhanced SiteVulnerability with last_scanned and context fields
7. **NEW**: Enhanced RemediationAction entity with progress tracking and multi-source relationships
8. **NEW**: Enhanced SecurityMetric entity with threshold-based alerting and trend analysis
9. **NEW**: Enhanced Notification entity with multi-source support and priority routing

### Backwards Compatibility

- API endpoints remain the same
- Response formats enhanced but compatible
- Authentication flow unchanged
- **NEW**: Incident-Vulnerability-Management modules fully integrated
- **NEW**: Remediation-Reporting modules fully integrated
- **NEW**: Frontend hooks compatibility maintained
- **NEW**: MITRE ATT&CK and threat intelligence capabilities added
- **NEW**: Comprehensive remediation action tracking capabilities
- **NEW**: Real-time security metrics and alerting system
- **NEW**: Advanced notification and alert management system

## 🛡️ Security & Compliance Features

### Incident Response Capabilities

- **MITRE ATT&CK Integration**: Map incidents to attack techniques and tactics
- **Timeline Tracking**: Detailed event timeline for forensic analysis
- **Evidence Management**: Structured evidence collection and storage
- **AI Recommendations**: Machine learning-powered response suggestions
- **Bulk Operations**: Efficient handling of multiple incidents

### Threat Intelligence Platform

- **Multi-Source Indicators**: IP addresses, domains, URLs, file hashes
- **Confidence Scoring**: 0-100 confidence levels for threat indicators
- **Geolocation Data**: ASN and country information for threat attribution
- **Enrichment APIs**: External threat intelligence integration ready
- **Blocking Capabilities**: Automated threat indicator blocking

### Vulnerability Management

- **CVE Integration**: Complete CVE database with CVSS scoring
- **Site-Specific Tracking**: Track vulnerabilities per monitored site
- **Remediation Workflow**: Status tracking from detection to resolution
- **Scanning Simulation**: Mock vulnerability scanning capabilities
- **Impact Analysis**: Top vulnerabilities by affected sites

### Remediation & Reporting Platform

- **Action Tracking**: Comprehensive remediation action management across all security domains
- **Progress Monitoring**: Real-time progress tracking with percentage completion
- **Effectiveness Scoring**: 0-100 effectiveness rating for completed actions
- **Cost Management**: Estimation and actual cost tracking for ROI analysis
- **Cross-Reference Support**: Link actions to incidents, threats, and vulnerabilities
- **Priority Management**: Critical, High, Medium, Low priority assignment
- **Automation Support**: Manual, automated, and semi-automated action types

### Security Metrics & Analytics

- **Real-Time Monitoring**: Live security metric collection and analysis
- **Historical Tracking**: Time-series data for trend analysis and reporting
- **Threshold Alerting**: Configurable thresholds with automatic alert generation
- **Multi-Category Support**: Security, Performance, Compliance, Operational metrics
- **Change Analysis**: Percentage change tracking with previous value comparison
- **Bulk Data Ingestion**: High-volume metric ingestion for scalability

### Notification & Alert System

- **Multi-Source Integration**: Notifications from incidents, threats, metrics, and sites
- **Priority Routing**: Critical, High, Medium, Low priority-based routing
- **Multi-Channel Delivery**: In-app, Email, SMS, Webhook, Slack integration
- **Expiration Management**: Automatic cleanup of expired notifications
- **Bulk Operations**: Efficient handling of multiple notifications
- **Read/Unread Tracking**: Status management with timestamp recording

## 📈 Performance & Scalability

### Database Optimization

- **Indexed Queries**: Optimized database queries for large datasets
- **Pagination Support**: Efficient data loading for large result sets
- **Bulk Operations**: Batch processing for multiple records
- **Relationship Optimization**: Proper JOIN strategies for complex queries

### API Performance

- **Response Caching**: Cached responses for frequently accessed data
- **Filtering Optimization**: Advanced filtering without performance impact
- **Background Processing**: Async operations for time-consuming tasks
- **Connection Pooling**: Efficient database connection management

## 🔍 Advanced Features

### Analytics & Reporting

- **Statistical Analysis**: Comprehensive stats by severity, status, type
- **Trend Analysis**: Time-based analysis of security metrics
- **Export Capabilities**: CSV export for external analysis
- **Dashboard Metrics**: Real-time metrics for security dashboards

### Integration Ready

- **External TI Feeds**: Ready for VirusTotal, AlienVault OTX integration
- **SIEM Integration**: Structured logging for SIEM platforms
- **Webhook Support**: Event-driven notifications and integrations
- **API-First Design**: RESTful APIs for third-party integrations
- **Remediation Orchestration**: API endpoints for external remediation tools
- **Metrics Collection**: Bulk metric ingestion for monitoring platforms
- **Notification Channels**: Multi-channel delivery system (Email, SMS, Slack, Webhook)
- **Cost Management**: Integration with financial systems for ROI tracking
- **Compliance Reporting**: Structured data for compliance dashboard integration
