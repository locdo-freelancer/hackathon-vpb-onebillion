"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  AgentInstallHeader,
  AgentInstallPageHeader,
  AgentInstallContent,
  AgentInstallActions,
} from "@/components/agent-install";
import { useAgentInstallFlow } from "@/hooks/useAgentInstallFlow";

/**
 * Agent Install Page - SOLID Principles Applied
 * 
 * Single Responsibility: Only handles page composition and routing
 * Open/Closed: Extended by adding new components, not modifying existing
 * Liskov Substitution: Components can be replaced with compatible implementations
 * Interface Segregation: Each component has focused, minimal props
 * Dependency Inversion: Depends on abstractions (hooks/components), not concrete implementations
 */
export default function AgentInstallPage() {
  const router = useRouter();
  
  // Dependency Injection: Business logic injected via hook
  const {
    currentTab,
    connectionPhase,
    heartbeatTime,
    isRegistered,
    handleTabChange,
    handleCopyCommand,
  } = useAgentInstallFlow();

  const handleContinue = () => {
    if (isRegistered) router.push("/dashboard");
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  // Single Responsibility: Page only composes components
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Interface Segregation: Header only needs connection phase */}
        <AgentInstallHeader connectionPhase={connectionPhase} />

        {/* Main Content Container */}
        <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
          {/* Open/Closed: Page header can be extended without modification */}
          <AgentInstallPageHeader />

          {/* Liskov Substitution: Content can be replaced with compatible implementation */}
          <AgentInstallContent
            currentTab={currentTab}
            onTabChange={handleTabChange}
            connectionPhase={connectionPhase}
            heartbeatTime={heartbeatTime}
            onCopyCommand={handleCopyCommand}
          />

          {/* Dependency Inversion: Actions depend on abstract callbacks */}
          <AgentInstallActions
            isRegistered={isRegistered}
            onContinue={handleContinue}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
