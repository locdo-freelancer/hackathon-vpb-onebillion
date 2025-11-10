import React from "react";
import type { Agent } from "@/types/agents.types";
import { getBorderColor } from "@/config/agent-status.config";
import { StatusIndicator } from "./StatusIndicator";
import { AgentInfoRow } from "./AgentInfoRow";
import { CPUUsageBar } from "./CPUUsageBar";
import { UpdateProgressBar } from "./UpdateProgressBar";

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  // Get heartbeat label and value based on status
  const getHeartbeatLabel = () =>
    agent.status === "updating" ? "Progress" : "Heartbeat";
  const getHeartbeatValue = () =>
    agent.status === "updating"
      ? `${agent.updateProgress}%`
      : agent.lastHeartbeat;

  return (
    <div
      onClick={() => onClick(agent)}
      className={`bg-slate-900 border ${getBorderColor(agent.status)} rounded-xl p-4 transition-colors cursor-pointer`}
    >
      {/* Header: Icon, Hostname, IP, Status (SRP - Layout only) */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 bg-linear-to-br ${agent.iconGradient} rounded-lg flex items-center justify-center`}
          >
            <i className={`${agent.osIcon} text-white`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              {agent.hostname}
            </h4>
            <p className="text-xs text-gray-400">{agent.ipAddress}</p>
          </div>
        </div>
        <StatusIndicator status={agent.status} />
      </div>

      {/* Agent Info Section (LSP - AgentInfoRow components) */}
      <div className="space-y-2">
        <AgentInfoRow label="OS" value={agent.os} />
        <AgentInfoRow
          label="Version"
          value={agent.version}
          status={agent.status}
        />
        <AgentInfoRow
          label={getHeartbeatLabel()}
          value={getHeartbeatValue()}
          status={agent.status}
          highlightStatus
        />
      </div>

      {/* Footer: CPU or Update Progress (OCP - Different render based on status) */}
      <div className="mt-3 pt-3 border-t border-slate-800">
        {agent.status === "updating" ? (
          <UpdateProgressBar progress={agent.updateProgress} />
        ) : agent.status === "offline" ? (
          <AgentInfoRow
            label="Status"
            value="Offline"
            status={agent.status}
            highlightStatus
          />
        ) : (
          <CPUUsageBar cpuUsage={agent.cpuUsage} />
        )}
      </div>
    </div>
  );
};
