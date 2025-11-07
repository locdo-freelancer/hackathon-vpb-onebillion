"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AgentInstallHeader,
  InstallationTabs,
  CommandDisplay,
  ConnectionStatus,
  TroubleshootingSection,
} from "@/components/agent-install";
import type { TabType } from "@/components/agent-install";
import { useAgentInstall } from "@/hooks/useAgentInstall";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

// This page can be accessed after completing onboarding
// It guides users through installing the SecureVault monitoring agent

export default function AgentInstallPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<TabType>("linux");
  
  // Custom hooks for agent installation logic
  const { connectionPhase, heartbeatTime, isRegistered } = useAgentInstall();
  const { copyToClipboard } = useCopyToClipboard();

  const handleContinue = () => {
    if (isRegistered) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <AgentInstallHeader connectionPhase={connectionPhase} />

        {/* Main Content */}
        <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Install SecureVault Agent
            </h2>
            <p className="text-gray-400">
              Deploy our monitoring agent to start securing your infrastructure
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <InstallationTabs
              currentTab={currentTab}
              onTabChange={setCurrentTab}
            />
          </div>

          {/* Installation Commands */}
          <div className="mb-8">
            <CommandDisplay currentTab={currentTab} onCopy={copyToClipboard} />
          </div>

          {/* Connection Status */}
          <div className="mb-8">
            <ConnectionStatus
              phase={connectionPhase}
              heartbeatTime={heartbeatTime}
            />
          </div>

          {/* Troubleshooting */}
          <div className="mb-8">
            <TroubleshootingSection />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white rounded-lg transition-all duration-200"
            >
              <i className="fas fa-arrow-left mr-2" />
              Back to Setup
            </button>

            <button
              onClick={handleContinue}
              disabled={!isRegistered}
              className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
                isRegistered
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-slate-900 shadow-lg shadow-cyan-500/20"
                  : "bg-slate-800 text-gray-500 cursor-not-allowed opacity-50"
              }`}
            >
              Continue to Dashboard
              <i className="fas fa-arrow-right ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
