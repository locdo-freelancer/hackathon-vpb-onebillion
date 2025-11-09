# Quick Start Guide - Using Integrated APIs

## 🚀 Quick Integration Examples

### 1. Login & Authentication

```typescript
// app/(auth)/login/page.tsx
"use client";

import { AuthService } from "@/lib/services";

export default function LoginPage() {
  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await AuthService.login({ email, password });
      
      if (result.success) {
        // Token automatically stored
        window.location.href = "/dashboard";
      } else {
        alert(result.message);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(email, password);
    }}>
      {/* form fields */}
    </form>
  );
}
```

---

### 2. Display Sites List

```typescript
// app/sites/page.tsx
"use client";

import { useEffect, useState } from "react";
import { SitesService, type Site } from "@/lib/services";

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSites() {
      try {
        const { sites } = await SitesService.getAllSites();
        setSites(sites);
      } catch (error) {
        console.error("Failed to load sites:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadSites();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Total Sites: {sites.length}</h1>
      {sites.map(site => (
        <div key={site.id}>
          <h2>{site.name}</h2>
          <p>{site.ipAddress}</p>
          <span>Status: {site.status}</span>
        </div>
      ))}
    </div>
  );
}
```

---

### 3. Create New Site

```typescript
// components/CreateSiteForm.tsx
import { SitesService } from "@/lib/services";

export function CreateSiteForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const site = await SitesService.createSite({
        name: formData.get("name") as string,
        hostname: formData.get("hostname") as string,
        ipAddress: formData.get("ipAddress") as string,
        port: formData.get("port") as string,
        serverType: "linux",
      });

      alert(`Site created: ${site.id}`);
      window.location.reload();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Site Name" required />
      <input name="hostname" placeholder="Hostname" required />
      <input name="ipAddress" placeholder="IP Address" required />
      <input name="port" placeholder="Port" />
      <button type="submit">Create Site</button>
    </form>
  );
}
```

---

### 4. Dashboard Stats

```typescript
// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  SitesService, 
  AgentsService, 
  IncidentsService 
} from "@/lib/services";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    sites: 0,
    agents: 0,
    incidents: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const [sitesData, agentsData, incidentsData] = await Promise.all([
        SitesService.getAllSites(),
        AgentsService.getAgentStats(),
        IncidentsService.getIncidentStats(),
      ]);

      setStats({
        sites: sitesData.totalSites,
        agents: agentsData.totalAgents,
        incidents: incidentsData.total,
      });
    }

    loadStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>Sites: {stats.sites}</div>
      <div>Agents: {stats.agents}</div>
      <div>Incidents: {stats.incidents}</div>
    </div>
  );
}
```

---

### 5. Incidents List with Filtering

```typescript
// app/incidents/page.tsx
import { IncidentsService } from "@/lib/services";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);

  const loadIncidents = async (severity?: string) => {
    const { incidents } = await IncidentsService.getAllIncidents({
      severity: severity as any,
      status: "open",
    });
    setIncidents(incidents);
  };

  return (
    <div>
      <button onClick={() => loadIncidents()}>All</button>
      <button onClick={() => loadIncidents("critical")}>Critical</button>
      <button onClick={() => loadIncidents("high")}>High</button>
      
      {incidents.map(incident => (
        <div key={incident.id}>
          <h3>{incident.title}</h3>
          <span>{incident.severity}</span>
        </div>
      ))}
    </div>
  );
}
```

---

### 6. Threats Management

```typescript
// app/threats/page.tsx
import { ThreatsService } from "@/lib/services";

export function ThreatsManagement() {
  const blockThreat = async (threatId: string) => {
    try {
      await ThreatsService.blockThreat(threatId);
      alert("Threat blocked!");
      // Reload list
    } catch (error: any) {
      alert(error.message);
    }
  };

  const exportToCSV = async () => {
    try {
      const blob = await ThreatsService.exportThreatsToCSV({
        severity: "critical"
      });
      
      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "threats.csv";
      a.click();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <button onClick={exportToCSV}>Export CSV</button>
      {/* threats list */}
    </div>
  );
}
```

---

### 7. Agent Installation Monitoring

```typescript
// app/agent-install/page.tsx
import { AgentInstallService } from "@/lib/services";

export function AgentInstallPage({ siteId }: { siteId: string }) {
  const [status, setStatus] = useState("waiting");
  const [commands, setCommands] = useState<any>(null);

  useEffect(() => {
    // Get install commands
    async function getCommands() {
      const cmds = await AgentInstallService.getLinuxCommands(token);
      setCommands(cmds);
    }
    
    getCommands();

    // Poll installation status
    AgentInstallService.pollInstallStatus(
      siteId,
      (installStatus) => {
        setStatus(installStatus.status);
      },
      5000, // Check every 5s
      60    // Max 5 minutes
    );
  }, [siteId]);

  return (
    <div>
      <h2>Installation Commands:</h2>
      <pre>{commands?.fullScript}</pre>
      
      <div>Status: {status}</div>
    </div>
  );
}
```

---

### 8. Notifications Bell

```typescript
// components/NotificationsBell.tsx
import { NotificationsService } from "@/lib/services";

export function NotificationsBell({ userId }: { userId: string }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function loadNotifications() {
      const { data, pagination } = await NotificationsService.getUserNotifications(
        userId,
        { isRead: false, limit: 10 }
      );
      
      setNotifications(data);
      setUnreadCount(pagination.unreadCount);
    }

    loadNotifications();
    
    // Refresh every minute
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  const markAllAsRead = async () => {
    await NotificationsService.markAllAsRead(userId);
    setUnreadCount(0);
  };

  return (
    <div>
      <button>
        🔔 {unreadCount > 0 && <span>{unreadCount}</span>}
      </button>
      
      <div className="dropdown">
        <button onClick={markAllAsRead}>Mark all as read</button>
        {notifications.map(notif => (
          <div key={notif.id}>
            <h4>{notif.title}</h4>
            <p>{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 9. Security Metrics Chart

```typescript
// components/SecurityScoreChart.tsx
import { SecurityMetricsService } from "@/lib/services";

export function SecurityScoreChart({ siteId }: { siteId: string }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function loadMetrics() {
      const endDate = Date.now();
      const startDate = endDate - (7 * 24 * 60 * 60 * 1000); // 7 days ago

      const history = await SecurityMetricsService.getHistoricalData(
        siteId,
        "security_score",
        startDate,
        endDate
      );

      setChartData(history);
    }

    loadMetrics();
  }, [siteId]);

  return (
    <div>
      {/* Render chart with chartData */}
      {chartData.map(point => (
        <div key={point.timestamp}>
          {new Date(point.timestamp).toLocaleDateString()}: {point.value}
        </div>
      ))}
    </div>
  );
}
```

---

### 10. Vulnerability Scanner

```typescript
// components/VulnerabilityScanner.tsx
import { VulnerabilitiesService } from "@/lib/services";

export function VulnerabilityScanner({ siteId }: { siteId: string }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startScan = async () => {
    setScanning(true);
    try {
      const scanResult = await VulnerabilitiesService.scanSiteVulnerabilities(siteId);
      setResult(scanResult);
      alert(`Found ${scanResult.vulnerabilitiesFound} vulnerabilities`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div>
      <button onClick={startScan} disabled={scanning}>
        {scanning ? "Scanning..." : "Start Scan"}
      </button>
      
      {result && (
        <div>
          <h3>Scan Results</h3>
          <p>Vulnerabilities Found: {result.vulnerabilitiesFound}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Common Patterns

### Pattern: Protected Route
```typescript
// middleware.ts or layout.tsx
import { AuthService } from "@/lib/services";

export function ProtectedLayout({ children }) {
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      window.location.href = "/login";
    }
  }, []);

  return <>{children}</>;
}
```

### Pattern: Optimistic Update
```typescript
const deleteSite = async (siteId: string) => {
  // 1. Update UI immediately
  setSites(sites.filter(s => s.id !== siteId));
  
  // 2. Call API
  try {
    await SitesService.deleteSite(siteId);
  } catch (error) {
    // 3. Revert on error
    setSites(originalSites);
    alert("Failed to delete");
  }
};
```

### Pattern: Infinite Scroll
```typescript
const [page, setPage] = useState(1);
const [incidents, setIncidents] = useState([]);

const loadMore = async () => {
  const { incidents: newIncidents } = await IncidentsService.getAllIncidents({
    page: page + 1,
    limit: 20
  });
  
  setIncidents([...incidents, ...newIncidents]);
  setPage(page + 1);
};
```

---

## 📚 Available Services

All services are imported from `@/lib/services`:

```typescript
import {
  // Auth
  AuthService,
  
  // Resources
  SitesService,
  AgentsService,
  AgentInstallService,
  
  // Security
  IncidentsService,
  ThreatsService,
  VulnerabilitiesService,
  RemediationActionsService,
  
  // Monitoring
  SecurityMetricsService,
  NotificationsService,
  
  // Onboarding
  OnboardingService,
} from "@/lib/services";
```

---

## 🔧 Configuration

### .env.local
```bash
NEXT_PUBLIC_API_URL=https://hackathon-vpb-onebillion.vercel.app
```

### Authentication
All API calls automatically include JWT token from localStorage.

---

## 🚨 Error Handling

All services throw errors with meaningful messages:

```typescript
try {
  const data = await Service.getData();
} catch (error: any) {
  console.error(error.message);
  // Show toast/alert to user
}
```

---

## 📖 Documentation

- **Full API Docs**: `frontend/docs/API_INTEGRATION_SUMMARY.md`
- **Testing Guide**: `frontend/docs/API_TESTING_GUIDE.md`
- **Component Integration**: `frontend/docs/COMPONENTS_INTEGRATION_SUMMARY.md`

---

**Ready to build! 🚀**
