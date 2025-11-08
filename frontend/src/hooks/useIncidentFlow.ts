"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useIncidentsData } from "@/hooks/useIncidentsData";

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
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
      setAIRecommendations(selectedIncident.aiRecommendations);
    }
  }, [selectedIncident]);

  const handleApproveRecommendation = (id: string) => {
    setAIRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, approved: true } : rec))
    );
  };

  const handleDenyRecommendation = (id: string) => {
    setAIRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, approved: false } : rec))
    );
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
