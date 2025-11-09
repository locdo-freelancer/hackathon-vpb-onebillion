import React from "react";
import {
  InstallationTabs,
  CommandDisplay,
  ConnectionStatus,
  TroubleshootingSection,
} from "@/components/agent-install";
import type { ConnectionPhase } from "./ConnectionStatus";

interface AgentInstallContentProps {
  currentTab: "linux" | "windows" | "mac";
  onTabChange: (tab: "linux" | "windows" | "mac") => void;
  connectionPhase: ConnectionPhase;
  heartbeatTime?: string;
  onCopyCommand: (command: string) => void;
  installToken?: string;
}

export const AgentInstallContent: React.FC<AgentInstallContentProps> = ({
  currentTab,
  onTabChange,
  connectionPhase,
  heartbeatTime,
  onCopyCommand,
  installToken,
}) => {
  return (
    <>
      {/* Tabs Section */}
      <div className="mb-8">
        <InstallationTabs currentTab={currentTab} onTabChange={onTabChange} />
      </div>

      {/* Installation Commands Section */}
      <div className="mb-8">
        <CommandDisplay
          currentTab={currentTab}
          onCopy={onCopyCommand}
          installToken={installToken}
        />
      </div>

      {/* Connection Status Section */}
      <div className="mb-8">
        <ConnectionStatus
          phase={connectionPhase}
          heartbeatTime={heartbeatTime}
        />
      </div>

      {/* Troubleshooting Section */}
      <div className="mb-8">
        <TroubleshootingSection />
      </div>
    </>
  );
};
