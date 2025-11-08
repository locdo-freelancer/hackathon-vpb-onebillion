import React from "react";
import { TabButton } from "@/components/shared";
import { getTabsConfig } from "@/config/tabs.config";

export type TabType = "linux" | "windows" | "mac";

interface InstallationTabsProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const InstallationTabs: React.FC<InstallationTabsProps> = ({
  currentTab,
  onTabChange,
}) => {
  const tabs = getTabsConfig();

  return (
    <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          label={tab.label}
          icon={tab.icon}
          isActive={currentTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
};
