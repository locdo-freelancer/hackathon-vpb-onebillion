import React from "react";

export type TabType = "linux" | "windows" | "mac";

interface InstallationTabsProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const InstallationTabs: React.FC<InstallationTabsProps> = ({
  currentTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "linux" as TabType, icon: "fab fa-linux", label: "Linux" },
    { id: "windows" as TabType, icon: "fab fa-windows", label: "Windows" },
    { id: "mac" as TabType, icon: "fab fa-apple", label: "macOS" },
  ];

  return (
    <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            currentTab === tab.id
              ? "bg-cyan-500 text-slate-900"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <i className={tab.icon} />
          {tab.label}
        </button>
      ))}
    </div>
  );
};
