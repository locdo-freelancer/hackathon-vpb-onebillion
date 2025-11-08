import React from "react";
import type { AvailableAction } from "@/types/action-console.types";
import { getCategoryColor, getImpactColor } from "@/utils/color.util";

interface AvailableActionCardProps {
  action: AvailableAction;
  onExecute: (actionId: string) => void;
}

export const AvailableActionCard: React.FC<AvailableActionCardProps> = ({
  action,
  onExecute,
}) => {
  const impactColors = getImpactColor(action.impact);
  const categoryColors = getCategoryColor(action.category);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 ${impactColors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            <i className={`fas ${action.icon} ${impactColors.text} text-xl`} />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-1">
              {action.title}
            </h4>
            <p className="text-sm text-gray-400 mb-3">{action.description}</p>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${impactColors.bg} ${impactColors.text}`}
              >
                {action.impact.charAt(0).toUpperCase() + action.impact.slice(1)}{" "}
                Impact
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${categoryColors.bg} ${categoryColors.text}`}
              >
                {action.category.charAt(0).toUpperCase() +
                  action.category.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => onExecute(action.id)}
        className={`w-full px-4 py-2.5 ${impactColors.btnBg} ${impactColors.text} border ${impactColors.border} rounded-lg ${impactColors.btnHover} transition-colors font-medium`}
      >
        <i className="fas fa-play mr-2" />
        Execute Action
      </button>
    </div>
  );
};
