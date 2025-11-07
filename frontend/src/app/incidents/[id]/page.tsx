"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard";
import {
  IncidentDetailHeader,
  IncidentOverviewCard,
  MitreAttackCard,
  TimelineCard,
  RawLogsCard,
  AIRecommendationsCard,
  FileHashCard,
  IPReputationCard,
  RelatedIncidentsCard,
  ExternalReferencesCard,
} from "@/components/incidents";
import { useIncidentsData } from "@/hooks/useIncidentsData";

export default function IncidentDetailPage() {
  const params = useParams();
  const incidentId = params.id as string;
  const { selectIncident, selectedIncident } = useIncidentsData();
  const [aiRecommendations, setAIRecommendations] = useState<
    Array<{ id: string; title: string; description: string; confidence: number; approved?: boolean }>
  >([]);

  const user = {
    name: "Alex Chen",
    avatar: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    role: "Security Analyst",
  };

  const navItems = [
    { icon: "fas fa-gauge-high", label: "Dashboard", href: "/dashboard" },
    { icon: "fas fa-shield-virus", label: "Threats", href: "/threats" },
    { icon: "fas fa-server", label: "Sites", href: "/sites" },
    { icon: "fas fa-desktop", label: "Agents", href: "/agents" },
    {
      icon: "fas fa-exclamation-triangle",
      label: "Incidents",
      href: "/incidents",
      active: true,
    },
    { icon: "fas fa-chart-line", label: "Reports", href: "#" },
    { icon: "fas fa-cog", label: "Settings", href: "#" },
  ];

  useEffect(() => {
    if (incidentId) {
      selectIncident(incidentId);
    }
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

  if (!selectedIncident) {
    return (
      <div className="flex h-screen bg-slate-950">
        <DashboardSidebar navItems={navItems} user={user} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-cyan-500 text-4xl mb-4" />
            <p className="text-gray-400">Loading incident details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar navItems={navItems} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <IncidentDetailHeader
            incidentId={selectedIncident.incidentId}
            title={selectedIncident.title}
            severity={
              selectedIncident.severity.charAt(0).toUpperCase() +
              selectedIncident.severity.slice(1) as "Critical" | "High" | "Medium" | "Low"
            }
            status={
              selectedIncident.status.charAt(0).toUpperCase() +
              selectedIncident.status.slice(1) as "Open" | "Investigating" | "Resolved" | "Closed"
            }
            createdAt={selectedIncident.dateCreated}
            onEdit={handleEdit}
            onResolve={handleResolve}
          />

          <div className="grid grid-cols-3 gap-6">
            {/* Main Content Column (2/3) */}
            <div className="col-span-2 space-y-6">
              {/* Overview */}
              <IncidentOverviewCard
                assignee={
                  selectedIncident.assignee
                    ? {
                        name: selectedIncident.assignee.name,
                        avatar: selectedIncident.assignee.avatar,
                      }
                    : undefined
                }
                incidentType={selectedIncident.type}
                sourceIP={selectedIncident.sourceIP}
                destinationIP={selectedIncident.destinationIP}
                protocol={selectedIncident.protocol}
                lastUpdated={selectedIncident.dateUpdated}
              />

              {/* MITRE ATT&CK */}
              {selectedIncident.mitreAttack && selectedIncident.mitreAttack.length > 0 && (
                <MitreAttackCard techniques={selectedIncident.mitreAttack} />
              )}

              {/* Timeline */}
              {selectedIncident.timeline && selectedIncident.timeline.length > 0 && (
                <TimelineCard events={selectedIncident.timeline} />
              )}

              {/* Raw Logs */}
              {selectedIncident.rawLogs && selectedIncident.rawLogs.length > 0 && (
                <RawLogsCard logs={selectedIncident.rawLogs} />
              )}

              {/* AI Recommendations */}
              {aiRecommendations.length > 0 && (
                <AIRecommendationsCard
                  recommendations={aiRecommendations}
                  onApprove={handleApproveRecommendation}
                  onDeny={handleDenyRecommendation}
                />
              )}
            </div>

            {/* Threat Intelligence Sidebar (1/3) */}
            <div className="col-span-1 space-y-6">
              {/* File Hash Analysis */}
              {selectedIncident.fileHash && (
                <FileHashCard fileHash={selectedIncident.fileHash} />
              )}

              {/* IP Reputation */}
              {selectedIncident.ipReputation && (
                <IPReputationCard ipReputation={selectedIncident.ipReputation} />
              )}

              {/* Related Incidents */}
              {selectedIncident.relatedIncidents &&
                selectedIncident.relatedIncidents.length > 0 && (
                  <RelatedIncidentsCard incidents={selectedIncident.relatedIncidents} />
                )}

              {/* External References */}
              {selectedIncident.externalReferences &&
                selectedIncident.externalReferences.length > 0 && (
                  <ExternalReferencesCard references={selectedIncident.externalReferences} />
                )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
