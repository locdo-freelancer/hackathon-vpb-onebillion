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

  const handleDeleteSite = async (site: Site) => {
    if (confirm(`Are you sure you want to delete ${site.name}?`)) {
      try {
        const { SitesService } = await import("@/lib/services");
        await SitesService.deleteSite(site.id);
        alert(`Deleted site: ${site.name}`);
        // Refetch data
        window.location.reload();
      } catch (error: any) {
        alert(`Failed to delete site: ${error.message}`);
      }
    }
  };

  const handleSaveSite = async (formData: SiteFormData) => {
    try {
      const { SitesService } = await import("@/lib/services");
      
      if (editingSite) {
        // Update existing site
        await SitesService.updateSite(editingSite.id, {
          name: formData.name,
          hostname: formData.hostname,
          ipAddress: formData.ipAddress,
          port: formData.port,
          domains: formData.domains,
        });
        alert(`Updated site: ${formData.name}`);
      } else {
        // Create new site
        await SitesService.createSite({
          name: formData.name,
          hostname: formData.hostname || "",
          ipAddress: formData.ipAddress,
          port: formData.port,
          domains: formData.domains,
          serverType: formData.serverType || "linux",
        });
        alert(`Created new site: ${formData.name}`);
      }
      
      setIsModalOpen(false);
      // Refetch data
      window.location.reload();
    } catch (error: any) {
      alert(`Failed to save site: ${error.message}`);
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
