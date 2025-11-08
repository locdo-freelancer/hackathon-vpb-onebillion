import { useState, useEffect } from "react";
import type {
  Incident,
  IncidentsData,
  IncidentsFilter,
  IncidentDetail,
  IncidentsStats,
} from "@/types/incidents.types";
import { fetchIncidentsData } from "@/data/mock-incident";
import { fetchIncidentDetail } from "@/data/mock-incident-detail";

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
      const incidentsData = await fetchIncidentsData();
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
          incident.description.toLowerCase().includes(query) ||
          incident.aiSummary.toLowerCase().includes(query)
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
      const detail = await fetchIncidentDetail(id);
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
