import React from "react";
import { TroubleshootingItem } from "./TroubleshootingItem";
import { getTroubleshootingItems } from "@/config/troubleshooting.config";

export const TroubleshootingSection: React.FC = () => {
  const items = getTroubleshootingItems();
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <i className="fas fa-tools text-cyan-400" />
        Troubleshooting
      </h3>

      <div className="space-y-4">
        {items.map((item, index) => (
          <TroubleshootingItem
            key={index}
            title={item.title}
            solutions={item.solutions}
          />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800">
        <a
          href="#"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-external-link-alt" />
          View Complete Documentation
        </a>
      </div>
    </div>
  );
};
