# Type System Alignment - Frontend & Backend

## 📋 Overview

This document explains how Frontend TypeScript types are aligned with Backend API responses to ensure type safety and consistency across the application.

## 🎯 Design Principles

### 1. **Services are Source of Truth**
All API-related types are defined in their respective service files (`*.service.ts`), not in separate type files. This ensures:
- Types match exactly what the API returns
- Single source of truth for API contracts
- Easier to maintain and update

### 2. **UI Types in Separate Files**
The `types/*.types.ts` files contain:
- UI-specific types and interfaces
- Extended types with computed/derived fields
- Component prop types
- Re-exports from services for convenience

### 3. **Optional vs Required Fields**
Fields are marked optional (`?`) based on Backend API behavior:
- `field?: type` - May not be present in all API responses
- `field: type` - Always present in API responses

---

## 🔄 Type Alignment Changes

### **Sites Types** (`sites.types.ts`)

**Changes Made:**
```typescript
// ✅ BEFORE (Incorrect)
domains: string[];  // Required

// ✅ AFTER (Correct)
domains?: string[];  // Optional - BE may not return this
port?: string;       // Added - BE returns this
createdAt?: number;  // Added - BE returns this
updatedAt?: number;  // Added - BE returns this
```

**Reasoning:**
- Backend doesn't always return `domains` array
- Backend returns `port`, `createdAt`, `updatedAt` that weren't typed

---

### **Agents Types** (`agents.types.ts`)

**Changes Made:**
```typescript
// ✅ BEFORE (Incorrect)
export type OSType = "linux" | "windows" | "macos" | "other";
siteId?: string;   // Optional
siteName?: string; // Optional

// ✅ AFTER (Correct)
export type OSType = "linux" | "windows" | "docker" | "macos"; // Added "docker"
siteId: string;    // Required - BE always returns this
siteName: string;  // Required - BE always returns this
createdAt?: number;
updatedAt?: number;
```

**Reasoning:**
- Backend supports `docker` as OSType
- Backend always includes `siteId` and `siteName` in Agent responses
- Added timestamp fields returned by BE

---

### **Incidents Types** (`incidents.types.ts`)

**Changes Made:**
```typescript
// ✅ BEFORE (Incorrect)
export type IncidentType =
  | "data-breach"        // Wrong format
  | "policy-violation"   // Wrong format
  
export interface Incident {
  description: string;   // Required
  aiSummary: string;     // UI-only field
  dateUpdated: string;   // UI-only field
  assignee: {            // Always required
    id: string;
    name: string;
    avatar: string;      // Required
  } | null;
}

// ✅ AFTER (Correct)
export type IncidentType =
  | "breach"             // Matches BE
  | "policy_violation"   // Matches BE (underscore)
  
export interface Assignee {
  id: string;
  name: string;
  avatar?: string;       // Optional
}

export interface Incident {
  description?: string;  // Optional - only in detail view
  assignee?: Assignee;   // Optional - may be unassigned
  timeline?: TimelineEvent[];      // Only in detail view
  mitreAttack?: string[];          // Only in detail view
  aiRecommendations?: string[];    // Only in detail view
  relatedIncidents?: string[];     // Only in detail view
  // Removed: aiSummary, dateUpdated (UI-only)
}
```

**Reasoning:**
- Backend uses underscores in enum values, not hyphens
- Many fields are only returned in detailed incident view
- `avatar` is optional in BE response
- Removed UI-only fields that don't come from API

---

### **Threats Types** (`threats.types.ts`)

**Changes Made:**
```typescript
// ✅ BEFORE (Incorrect)
export type ThreatStatus = "active" | "blocked" | "flagged" | "monitoring";

export interface ThreatIndicator {
  country: string;     // Required
  countryCode: string; // Required
  countryFlag: string; // Required
  // Missing fields
}

// ✅ AFTER (Correct)
export type ThreatStatus = "active" | "blocked" | "expired" | "investigating";

export interface ThreatIndicator {
  country?: string;       // Optional - may not have geo data
  countryCode?: string;   // Optional
  countryFlag?: string;   // Optional
  malwareFamily?: string; // Added - BE returns this
  tags?: string[];        // Added - BE returns this
  sources?: string[];     // Added - BE returns this
}

export type Threat = ThreatIndicator; // Alias for compatibility
```

**Reasoning:**
- Backend uses `expired` and `investigating`, not `flagged` and `monitoring`
- Geo-location fields are optional (not all IPs have geo data)
- Added missing fields that Backend returns

---

## 📦 Import Strategy

### **Recommended Pattern**

```typescript
// ✅ GOOD: Import from services (source of truth)
import { 
  SitesService, 
  type Site, 
  type SitesResponse 
} from "@/lib/services";

// ✅ ALSO GOOD: Import from centralized index
import { SitesService } from "@/lib/services";
import type { Site } from "@/types/sites.types";

// ❌ AVOID: Defining types locally
interface MySite {
  id: string;
  name: string;
  // ... duplicating types
}
```

### **For UI-Only Extensions**

```typescript
// types/sites.types.ts
import type { Site } from "@/lib/services/sites.service";

// Extend API type with UI-specific fields
export interface SiteWithUI extends Site {
  isSelected: boolean;     // UI state
  displayColor: string;    // Computed UI property
  formattedDate: string;   // Derived from lastChecked
}
```

---

## 🔍 Type Validation Checklist

When adding new features or updating APIs:

- [ ] Check Swagger documentation for exact field names
- [ ] Verify required vs optional fields in API response
- [ ] Check enum values match Backend exactly (case-sensitive!)
- [ ] Test with real API calls, not mock data
- [ ] Update service types first, then component types
- [ ] Remove UI-only fields from API types
- [ ] Add JSDoc comments for complex types

---

## 📚 Type Definitions by Module

### **Authentication**
- **Location**: `lib/services/auth.service.ts`
- **Types**: `AuthResponse`, `LoginCredentials`, `SignupCredentials`, `User`

### **Sites**
- **Location**: `lib/services/sites.service.ts`
- **Types**: `Site`, `SiteStats`, `SitesResponse`, `CreateSiteDto`, `UpdateSiteDto`

### **Agents**
- **Location**: `lib/services/agents.service.ts`
- **Types**: `Agent`, `AgentStats`, `AgentMetrics`, `AgentQueryParams`, `OSType`, `AgentStatus`

### **Incidents**
- **Location**: `lib/services/incidents.service.ts`
- **Types**: `Incident`, `IncidentStats`, `Assignee`, `TimelineEvent`, `IncidentSeverity`, `IncidentStatus`, `IncidentType`

### **Threats**
- **Location**: `lib/services/threats.service.ts`
- **Types**: `Threat`, `ThreatStats`, `ThreatEnrichment`, `ThreatSeverity`, `ThreatType`, `ThreatStatus`

### **Vulnerabilities**
- **Location**: `lib/services/vulnerabilities.service.ts`
- **Types**: `Vulnerability`, `VulnerabilityStats`, `SiteVulnerability`, `VulnerabilitySeverity`, `VulnerabilityStatus`

### **Security Metrics**
- **Location**: `lib/services/security-metrics.service.ts`
- **Types**: `SecurityMetric`, `MetricType`, `AlertLevel`, `SecurityMetricsStats`

### **Notifications**
- **Location**: `lib/services/notifications.service.ts`
- **Types**: `Notification`, `NotificationPriority`, `NotificationChannel`, `NotificationStats`

---

## 🛠️ Common Type Patterns

### **API Response Wrappers**

```typescript
// List response
export interface SitesResponse {
  sites: Site[];
  totalSites: number;
  activeSites: number;
  inactiveSites: number;
  warningSites: number;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
```

### **Query Parameters**

```typescript
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AgentQueryParams extends QueryParams {
  status?: AgentStatus | "all";
  siteId?: string;
}
```

### **DTOs (Data Transfer Objects)**

```typescript
// Create DTO - required fields only
export interface CreateSiteDto {
  name: string;
  hostname: string;
  ipAddress: string;
  port?: string;
}

// Update DTO - all fields optional
export interface UpdateSiteDto {
  name?: string;
  hostname?: string;
  ipAddress?: string;
  port?: string;
  status?: SiteStatus;
}
```

---

## 🧪 Testing Type Alignment

### **Browser Console Test**

```javascript
// Test real API response structure
const response = await fetch('https://hackathon-vpb-onebillion.vercel.app/api/sites', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
console.log('Fields:', Object.keys(data.sites[0]));
console.log('Sample:', data.sites[0]);
```

### **TypeScript Validation**

```typescript
// This will cause compile error if types don't match
const site: Site = await SitesService.getSiteById("123");

// Check all required fields are present
console.assert(site.id, "id is required");
console.assert(site.name, "name is required");
console.assert(site.siteId, "siteId is required");
```

---

## 📊 Type Alignment Status

| Module | Service Types | UI Types | Status |
|--------|--------------|----------|--------|
| Auth | ✅ Aligned | ✅ Aligned | Complete |
| Sites | ✅ Aligned | ✅ Aligned | Complete |
| Agents | ✅ Aligned | ✅ Aligned | Complete |
| Incidents | ✅ Aligned | ✅ Aligned | Complete |
| Threats | ✅ Aligned | ✅ Aligned | Complete |
| Vulnerabilities | ✅ Aligned | ⚠️ Partial | In Progress |
| Metrics | ✅ Aligned | ⚠️ Partial | In Progress |
| Notifications | ✅ Aligned | ⚠️ Partial | In Progress |

---

## 🚀 Next Steps

1. **Add Runtime Validation**: Use Zod or Yup to validate API responses
2. **Generate Types from OpenAPI**: Auto-generate types from Swagger schema
3. **API Mocking**: Create mock factories that match exact type structure
4. **Documentation**: Add JSDoc comments to all exported types

---

## 📖 References

- **Swagger Documentation**: https://hackathon-vpb-onebillion.vercel.app/api/docs
- **API Integration Guide**: `frontend/docs/API_INTEGRATION_SUMMARY.md`
- **Testing Guide**: `frontend/docs/API_TESTING_GUIDE.md`
- **Service Index**: `frontend/src/lib/services/index.ts`

---

**Last Updated**: November 9, 2025  
**Maintained By**: Development Team
