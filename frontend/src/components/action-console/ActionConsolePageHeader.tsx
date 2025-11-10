"use client";

import React from "react";
import { LanguageSwitcher } from "@/components/shared";
import { useTranslations } from "@/hooks/useTranslations";

interface ActionConsolePageHeaderProps {
  systemStatus?: "operational" | "warning" | "error";
}

export const ActionConsolePageHeader: React.FC<ActionConsolePageHeaderProps> = ({
  systemStatus = "operational",
}) => {
  const { t } = useTranslations();
  
  const getStatusConfig = () => {
    switch (systemStatus) {
      case "error":
        return { color: "bg-red-500", text: t("common.systemError"), textColor: "text-red-400" };
      case "warning":
        return { color: "bg-yellow-500", text: t("common.systemWarning"), textColor: "text-yellow-400" };
      default:
        return { color: "bg-green-500", text: t("common.allSystemsOperational"), textColor: "text-gray-400" };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{t("actionConsole.title")}</h2>
            <p className="text-sm text-gray-400">
              {t("common.executePlaybooks")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg">
              <div className={`w-2 h-2 ${statusConfig.color} rounded-full animate-pulse`} />
              <span className={`text-sm ${statusConfig.textColor}`}>{statusConfig.text}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
