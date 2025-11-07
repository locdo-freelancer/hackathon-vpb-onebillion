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
│   │   ├── incidents/       # Security incident management (NEW)
│   │   ├── threats/         # Threat intelligence indicators (NEW)
│   │   ├── vulnerabilities/ # Vulnerability management (NEW)
│   │   └── tasks/           # Background tasks module
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
7. **RemediationAction** - Actions taken to remediate issues
8. **SecurityMetric** - Security metrics over time
9. **Notification** - User notifications
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
- Grouped by tags (auth, users, sites, agents, agent, agent-install, onboarding, incidents, threats, vulnerabilities)

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
│                      └─── (n) RemediationAction
│
├─── (n) Notification
└─── (n) Incident (assignee)

Vulnerability (1) ─────── (n) SiteVulnerability
ThreatIndicator (NEW) ─── (n) Site (optional)
Incident (1) ─────── (n) RemediationAction
Incident (1) ─────── (n) Notification
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

### Backwards Compatibility

- API endpoints remain the same
- Response formats enhanced but compatible
- Authentication flow unchanged
- **NEW**: Incident-Vulnerability-Management modules fully integrated
- **NEW**: Frontend hooks compatibility maintained
- **NEW**: MITRE ATT&CK and threat intelligence capabilities added

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
