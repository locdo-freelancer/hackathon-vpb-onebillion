"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useIncidentsData } from "@/hooks/useIncidentsData";

export interface AIRecommendation {
  id: string;
  action: string; // Backend format
  priority: "critical" | "high" | "medium" | "low"; // Backend format
  description: string;
  reasoning?: string; // Backend format (optional)
  approved?: boolean;
}

export interface IncidentFlow {
  incidentId: string
  selectedIncident: ReturnType<typeof useIncidentsData>["selectedIncident"];
  aiRecommendations: AIRecommendation[];
  handleApproveRecommendation: (id: string) => void;
  handleDenyRecommendation: (id: string) => void;
  handleEdit: () => void;
  handleResolve: () => void;
}

export const useIncidentFlow = (): IncidentFlow => {
  const params = useParams();
  const incidentId = params.id as string;
  const { selectIncident, selectedIncident } = useIncidentsData();
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);

  useEffect(() => {
    if (incidentId) selectIncident(incidentId);
  }, [incidentId]);

  useEffect(() => {
    if (selectedIncident?.aiRecommendations) {
      // Map backend format to frontend format
      const mappedRecommendations = selectedIncident.aiRecommendations.map((rec: any, index: number) => ({
        id: rec.id || `rec-${index}`,
        action: rec.action || rec.title || "Unknown Action", // Support both formats
        priority: rec.priority || "medium",
        description: rec.description || "",
        reasoning: rec.reasoning,
        approved: rec.approved,
      }));
      setAIRecommendations(mappedRecommendations);
    }
  }, [selectedIncident]);

  const handleApproveRecommendation = (id: string) => {
    setAIRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, approved: true } : rec))
    );
    // TODO: Call API to save approval status
    console.log("Approved recommendation:", id);
  };

  const handleDenyRecommendation = (id: string) => {
    setAIRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, approved: false } : rec))
    );
    // TODO: Call API to save denial status
    console.log("Denied recommendation:", id);
  };

  const handleEdit = () => {
    console.log("Edit incident:", selectedIncident?.incidentId);
  };

  const handleResolve = () => {
    console.log("Resolve incident:", selectedIncident?.incidentId);
  };

  return {
    incidentId,
    selectedIncident,
    aiRecommendations,
    handleApproveRecommendation,
    handleDenyRecommendation,
    handleEdit,
    handleResolve,
  };
};
