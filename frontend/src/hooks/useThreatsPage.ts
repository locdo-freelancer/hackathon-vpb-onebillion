"use client";

import { useState } from "react";
import { useThreatsData } from "./useThreatsData";

/**
 * Custom hook for Threats Page logic
 * Single Responsibility: Manages threats page state and interactions
 */
export const useThreatsPage = () => {
  const threatsData = useThreatsData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleThreatClick = async (id: string) => {
    await threatsData.selectThreat(id);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setTimeout(() => threatsData.selectThreat(null), 300);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    threatsData.setFilter({ searchQuery: query });
    threatsData.applyFilters();
  };

  const handleExport = () => {
    console.log("Exporting threats data...");
    // TODO: Implement export logic via service
  };

  return {
    // Data
    threats: threatsData.filteredIndicators,
    selectedThreat: threatsData.selectedThreat,
    selectedIndicators: threatsData.selectedIndicators,
    stats: threatsData.stats,
    filter: threatsData.filter,
    
    // UI State
    isDrawerOpen,
    searchQuery,
    
    // Actions
    handleThreatClick,
    handleDrawerClose,
    handleSearch,
    handleExport,
    setFilter: threatsData.setFilter,
    applyFilters: threatsData.applyFilters,
    toggleIndicatorSelection: threatsData.toggleIndicatorSelection,
    toggleAllIndicators: threatsData.toggleAllIndicators,
  };
};
