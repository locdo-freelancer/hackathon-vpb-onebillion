"use client";

import { useState } from "react";
import { useSitesData } from "@/hooks/useSitesData";
import type { Site, SiteFormData, SitesFilter } from "@/types/sites.types";

export const useSitesFlow = () => {
  const {
    data,
    isLoading,
    error,
    filteredSites,
    applyFilter,
    selectedSites,
    toggleSiteSelection,
    toggleAllSites,
    clearSelection,
  } = useSitesData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [currentFilter, setCurrentFilter] = useState<SitesFilter>({
    status: "all",
    agentCount: "any",
    searchQuery: "",
  });

  // Modal handlers
  const handleAddSite = () => {
    setEditingSite(null);
    setIsModalOpen(true);
  };

  const handleEditSite = (site: Site) => {
    setEditingSite(site);
    setIsModalOpen(true);
  };

  const handleViewSite = (site: Site) => {
    alert(`Viewing details for: ${site.name}`);
  };

  const handleDeleteSite = (site: Site) => {
    if (confirm(`Are you sure you want to delete ${site.name}?`)) {
      alert(`Deleted site: ${site.name}`);
    }
  };

  const handleSaveSite = (formData: SiteFormData) => {
    if (editingSite) {
      alert(`Updated site: ${formData.name}`);
    } else {
      alert(`Created new site: ${formData.name}`);
    }
  };

  // Bulk actions
  const handleEnableSelected = () => {
    alert(`Enabling ${selectedSites.length} sites`);
    clearSelection();
  };
  const handleDisableSelected = () => {
    alert(`Disabling ${selectedSites.length} sites`);
    clearSelection();
  };
  const handleDeleteSelected = () => {
    if (confirm(`Are you sure you want to delete ${selectedSites.length} sites?`)) {
      alert(`Deleted ${selectedSites.length} sites`);
      clearSelection();
    }
  };

  // Filter
  const handleApplyFilter = (filter: SitesFilter) => {
    setCurrentFilter(filter);
    applyFilter(filter);
  };

  // Export
  const handleExport = () => {
    alert("Exporting sites data...");
  };

  return {
    data,
    isLoading,
    error,
    filteredSites,
    selectedSites,
    currentFilter,
    isModalOpen,
    editingSite,
    handleAddSite,
    handleEditSite,
    handleViewSite,
    handleDeleteSite,
    handleSaveSite,
    handleEnableSelected,
    handleDisableSelected,
    handleDeleteSelected,
    handleApplyFilter,
    handleExport,
    toggleSiteSelection,
    toggleAllSites,
    setIsModalOpen,
  };
};
