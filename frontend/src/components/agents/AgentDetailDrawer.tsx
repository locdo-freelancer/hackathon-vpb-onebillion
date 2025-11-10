import React, { useEffect } from "react";
import type { Agent } from "@/types/agents.types";
import { useTranslations } from "@/hooks/useTranslations";

interface AgentDetailDrawerProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AgentDetailDrawer: React.FC<AgentDetailDrawerProps> = ({
  agent,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslations();
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!agent) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-800 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{t("agents.agentDetails")}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full pb-24">
          {/* Agent Header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-16 h-16 bg-linear-to-br ${agent.iconGradient} rounded-xl flex items-center justify-center`}
            >
              <i className={`${agent.osIcon} text-white text-2xl`} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">
                {agent.hostname}
              </h4>
              <p className="text-sm text-gray-400">{agent.ipAddress}</p>
            </div>
          </div>

          {/* Status */}
          <div className="bg-slate-950/50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">{t("sites.status")}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  agent.status === "online"
                    ? "bg-green-500/20 text-green-400"
                    : agent.status === "offline"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {agent.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-3 mb-6">
            <h5 className="text-sm font-semibold text-white">
              {t("agents.basicInformation")}
            </h5>
            <div className="bg-slate-950/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">{t("agents.operatingSystem")}</span>
                <span className="text-sm text-white">{agent.os}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">{t("agents.version")}</span>
                <span className="text-sm text-white">{agent.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">{t("agents.lastSeen")}</span>
                <span className="text-sm text-white">{agent.lastHeartbeat}</span>
              </div>
              {agent.siteName && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">{t("common.site")}</span>
                  <span className="text-sm text-white">{agent.siteName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          {agent.status === "online" && agent.cpuUsage !== undefined && (
            <div className="space-y-3 mb-6">
              <h5 className="text-sm font-semibold text-white">
                {t("agents.performance")}
              </h5>
              <div className="bg-slate-950/50 rounded-lg p-4 space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">{t("agents.cpuUsage")}</span>
                    <span className="text-sm text-white">{agent.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        agent.cpuUsage < 30
                          ? "bg-green-400"
                          : agent.cpuUsage < 70
                            ? "bg-yellow-400"
                            : "bg-red-400"
                      }`}
                      style={{ width: `${agent.cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">{t("agents.memoryUsage")}</span>
                    <span className="text-sm text-white">45%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-400"
                      style={{ width: "45%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">{t("agents.diskUsage")}</span>
                    <span className="text-sm text-white">67%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-cyan-400"
                      style={{ width: "67%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Update Progress */}
          {agent.status === "updating" && agent.updateProgress !== undefined && (
            <div className="space-y-3 mb-6">
              <h5 className="text-sm font-semibold text-white">
                {t("agents.updateProgress")}
              </h5>
              <div className="bg-slate-950/50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">{t("common.progress")}</span>
                  <span className="text-sm text-yellow-400">
                    {agent.updateProgress}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${agent.updateProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-white">{t("common.actions")}</h5>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-slate-950/50 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-white text-sm rounded-lg transition-colors flex items-center gap-3">
                <i className="fas fa-sync-alt" />
                {t("agents.restartAgent")}
              </button>
              <button className="w-full px-4 py-3 bg-slate-950/50 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-white text-sm rounded-lg transition-colors flex items-center gap-3">
                <i className="fas fa-download" />
                {t("agents.updateAgent")}
              </button>
              <button className="w-full px-4 py-3 bg-slate-950/50 hover:bg-slate-950 border border-slate-800 hover:border-red-500/50 text-red-400 text-sm rounded-lg transition-colors flex items-center gap-3">
                <i className="fas fa-trash" />
                {t("agents.removeAgent")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
