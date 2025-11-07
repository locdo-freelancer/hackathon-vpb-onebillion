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
- Grouped by tags (auth, users, sites, agents, agent, agent-install, onboarding)

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
│                      └─── (n) SiteVulnerability
│                      └─── (n) Threat
│                      └─── (n) RemediationAction
│
└─── (n) Notification

Vulnerability (1) ─────── (n) SiteVulnerability
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

### Backwards Compatibility

- API endpoints remain the same
- Response formats enhanced but compatible
- Authentication flow unchanged
