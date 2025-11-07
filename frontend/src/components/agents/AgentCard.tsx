import React from "react";
import type { Agent } from "@/types/agents.types";

interface AgentCardProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick }) => {
  const getStatusColor = () => {
    switch (agent.status) {
      case "online":
        return "bg-green-400 shadow-lg shadow-green-400/20";
      case "offline":
        return "bg-red-400";
      case "updating":
        return "bg-yellow-400 animate-pulse";
      default:
        return "bg-gray-400";
    }
  };

  const getBorderColor = () => {
    switch (agent.status) {
      case "offline":
        return "border-red-500/30 hover:border-red-500/50";
      case "updating":
        return "border-yellow-500/30 hover:border-yellow-500/50";
      default:
        return "border-slate-800 hover:border-cyan-500/50";
    }
  };

  const getCPUColor = (usage: number) => {
    if (usage < 30) return "bg-green-400";
    if (usage < 70) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div
      onClick={() => onClick(agent)}
      className={`bg-slate-900 border ${getBorderColor()} rounded-xl p-4 transition-colors cursor-pointer`}
    >
      {/* Header */}
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
        <span className={`w-3 h-3 ${getStatusColor()} rounded-full`} />
      </div>

      {/* Agent Info */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">OS</span>
          <span className="text-gray-300">{agent.os}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Version</span>
          <span
            className={
              agent.status === "updating" ? "text-yellow-400" : "text-gray-300"
            }
          >
            {agent.version}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">
            {agent.status === "updating" ? "Progress" : "Heartbeat"}
          </span>
          <span
            className={
              agent.status === "offline"
                ? "text-red-400"
                : agent.status === "updating"
                  ? "text-yellow-400"
                  : "text-green-400"
            }
          >
            {agent.status === "updating"
              ? `${agent.updateProgress}%`
              : agent.lastHeartbeat}
          </span>
        </div>
      </div>

      {/* CPU Usage or Update Progress */}
      <div className="mt-3 pt-3 border-t border-slate-800">
        {agent.status === "updating" ? (
          <div className="w-full bg-slate-950 rounded-full h-1">
            <div
              className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
              style={{ width: `${agent.updateProgress}%` }}
            />
          </div>
        ) : agent.status === "offline" ? (
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Status</span>
            <span className="text-red-400">Offline</span>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">CPU</span>
              <span className="text-gray-300">{agent.cpuUsage}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1 mt-1">
              <div
                className={`${getCPUColor(agent.cpuUsage || 0)} h-1 rounded-full`}
                style={{ width: `${agent.cpuUsage}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
