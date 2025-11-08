"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useIncidentsData } from "@/hooks/useIncidentsData";

export interface IncidentsFlow {
  searchQuery: string;
  filteredIncidents: ReturnType<typeof useIncidentsData>["filteredIncidents"];
  filter: ReturnType<typeof useIncidentsData>["filter"];
  selectedIncidents: string[];
  stats: ReturnType<typeof useIncidentsData>["stats"];
  handleSearch: (query: string) => void;
  handleIncidentClick: (id: string) => void;
  handleNewIncident: () => void;
  handleBulkAction: (action: "close" | "assign" | "export") => void;
  setFilter: (f: any) => void;
  applyFilters: () => void;
  toggleIncidentSelection: (id: string) => void;
  toggleAllIncidents: () => void;
}

export const useIncidentsFlow = (): IncidentsFlow => {
  const router = useRouter();
  const {
    filteredIncidents,
    filter,
    setFilter,
    applyFilters,
    selectIncident,
    selectedIncidents,
    toggleIncidentSelection,
    toggleAllIncidents,
    stats,
  } = useIncidentsData();

  const [searchQuery, setSearchQuery] = useState("");

  const handleIncidentClick = (id: string) => {
    router.push(`/incidents/${id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilter({ searchQuery: query });
    applyFilters();
  };

  const handleNewIncident = () => {
    console.log("Create new incident");
  };

  const handleBulkAction = (action: "close" | "assign" | "export") => {
    console.log("Bulk action:", action, "for incidents:", selectedIncidents);
  };

  return {
    searchQuery,
    filteredIncidents,
    filter,
    selectedIncidents,
    stats,
    handleSearch,
    handleIncidentClick,
    handleNewIncident,
    handleBulkAction,
    setFilter,
    applyFilters,
    toggleIncidentSelection,
    toggleAllIncidents,
  };
};
