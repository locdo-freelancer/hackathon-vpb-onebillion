import { useState, useEffect } from "react";
import type {
  Incident,
  IncidentsData,
  IncidentsFilter,
  IncidentDetail,
  IncidentsStats,
} from "@/types/incidents.types";
import { IncidentsService } from "@/lib/services";

export interface UseIncidentsDataReturn {
  data: IncidentsData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  incidents: Incident[];
  filteredIncidents: Incident[];
  filter: IncidentsFilter;
  setFilter: (filter: Partial<IncidentsFilter>) => void;
  applyFilters: () => void;
  selectedIncident: IncidentDetail | null;
  selectIncident: (id: string | null) => Promise<void>;
  selectedIncidents: string[];
  toggleIncidentSelection: (id: string) => void;
  toggleAllIncidents: () => void;
  stats: IncidentsStats;
}

export const useIncidentsData = (): UseIncidentsDataReturn => {
  const [data, setData] = useState<IncidentsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetail | null>(null);
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);

  const [filter, setFilterState] = useState<IncidentsFilter>({
    severity: "all",
    status: "all",
    type: "all",
    dateFrom: "",
    dateTo: "",
    assignee: "",
    searchQuery: "",
  });

  const [appliedFilter, setAppliedFilter] = useState<IncidentsFilter>(filter);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch incidents from API (already unwrapped by apiClient)
      const response = await IncidentsService.getAllIncidents().catch(() => ({
        incidents: [],
        stats: {
          total: 0,
          open: 0,
          investigating: 0,
          resolved: 0,
          closed: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        },
      }));

      const incidentsData: IncidentsData = {
        incidents: (response.incidents || []).map((incident: any) => ({
          id: incident.id,
          incidentId: incident.incidentId || `INC-${incident.id.slice(0, 6)}`,
          title: incident.title,
          severity: incident.severity,
          status: incident.status,
          type: incident.type,
          dateCreated: incident.dateCreated || incident.createdAt,
          assignee: incident.assignee,
          affectedSystems: incident.affectedSystems || [],
          tags: incident.tags || [],
          description: incident.description,
          timeline: incident.timeline,
          mitreAttack: incident.mitreAttack,
          aiRecommendations: incident.aiRecommendations,
          relatedIncidents: incident.relatedIncidents,
        })),
        stats: response.stats || {
          total: 0,
          open: 0,
          investigating: 0,
          resolved: 0,
          closed: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        },
      };

      setData(incidentsData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch incidents data")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter incidents based on applied filters
  const filteredIncidents =
    data?.incidents.filter((incident) => {
      // Severity filter
      if (appliedFilter.severity !== "all" && incident.severity !== appliedFilter.severity) {
        return false;
      }

      // Status filter
      if (appliedFilter.status !== "all" && incident.status !== appliedFilter.status) {
        return false;
      }

      // Type filter
      if (appliedFilter.type !== "all" && incident.type !== appliedFilter.type) {
        return false;
      }

      // Assignee filter
      if (appliedFilter.assignee && incident.assignee?.id !== appliedFilter.assignee) {
        return false;
      }

      // Search query filter
      if (appliedFilter.searchQuery) {
        const query = appliedFilter.searchQuery.toLowerCase();
        return (
          incident.incidentId.toLowerCase().includes(query) ||
          incident.title.toLowerCase().includes(query) ||
          incident.description?.toLowerCase().includes(query)
        );
      }

      return true;
    }) || [];

  const setFilter = (partialFilter: Partial<IncidentsFilter>) => {
    setFilterState((prev) => ({ ...prev, ...partialFilter }));
  };

  const applyFilters = () => {
    setAppliedFilter(filter);
  };

  const selectIncident = async (id: string | null) => {
    if (!id) {
      setSelectedIncident(null);
      return;
    }

    try {
      const incident: any = await IncidentsService.getIncidentById(id);
      
      // Transform to IncidentDetail format
      const detail: IncidentDetail = {
        id: incident.id,
        incidentId: incident.incidentId,
        title: incident.title,
        severity: incident.severity,
        status: incident.status,
        type: incident.type,
        dateCreated: incident.dateCreated,
        assignee: incident.assignee,
        affectedSystems: incident.affectedSystems,
        tags: incident.tags,
        description: incident.description,
        sourceIP: incident.sourceIP,
        destinationIP: incident.destinationIP,
        protocol: incident.protocol,
        timeline: (incident.timeline || []).map((event: any) => ({
          id: `${event.timestamp}-${Math.random()}`,
          timestamp: event.timestamp,
          event: event.event,
          user: event.user || "System",
          details: event.details || event.description,
          action: event.event.toLowerCase().includes("created") ? "created" :
                  event.event.toLowerCase().includes("assigned") ? "assigned" :
                  event.event.toLowerCase().includes("updated") ? "updated" :
                  event.event.toLowerCase().includes("resolved") ? "resolved" : "updated",
        })),
        mitreAttack: (incident.mitreAttack || []).map((tech: any) => ({
          id: tech.id || tech.technique || tech,
          name: tech.technique || tech.name || tech,
          tactic: tech.tactic || "Unknown",
          description: tech.description || "",
        })),
        relatedIncidents: (incident.relatedIncidents || []).map((relId: any) => {
          if (typeof relId === 'string') {
            return {
              id: relId,
              title: `Related Incident ${relId}`,
              severity: "Medium" as const,
              date: new Date().toISOString(),
            };
          }
          return relId;
        }),
        aiRecommendations: (incident.aiRecommendations || []).map((rec: any, idx: number) => {
          if (typeof rec === 'string') {
            return {
              id: `rec-${idx}`,
              title: rec,
              description: rec,
              confidence: 0.85,
            };
          }
          return {
            id: rec.id || `rec-${idx}`,
            title: rec.action || rec.title || rec,
            description: rec.description || rec,
            confidence: 0.85,
          };
        }),
        relatedIndicators: incident.relatedIndicators || [],
        recommendations: incident.recommendations || [],
        rawLogs: incident.rawLogs || [],
        externalReferences: incident.externalReferences || [],
        evidence: incident.evidence || [],
        fileHash: incident.fileHash,
        ipReputation: incident.ipReputation,
      };
      
      setSelectedIncident(detail);
    } catch (err) {
      console.error("Failed to fetch incident detail:", err);
    }
  };

  const toggleIncidentSelection = (id: string) => {
    setSelectedIncidents((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllIncidents = () => {
    if (selectedIncidents.length === filteredIncidents.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(filteredIncidents.map((i) => i.id));
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    incidents: data?.incidents || [],
    filteredIncidents,
    filter,
    setFilter,
    applyFilters,
    selectedIncident,
    selectIncident,
    selectedIncidents,
    toggleIncidentSelection,
    toggleAllIncidents,
    stats: data?.stats || {
      total: 0,
      open: 0,
      investigating: 0,
      resolved: 0,
      closed: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
  };
};
