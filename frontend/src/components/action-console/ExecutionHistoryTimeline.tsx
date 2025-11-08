import React from "react";
import type { ExecutionHistoryItem } from "@/types/action-console.types";
import { getStatusStyle } from "@/utils/color.util";

interface ExecutionHistoryTimelineProps {
  history: ExecutionHistoryItem[];
}

export const ExecutionHistoryTimeline: React.FC<ExecutionHistoryTimelineProps> = ({ history }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="space-y-4">
        {history.map((item, index) => {
          const isLast = index === history.length - 1;
          const statusStyle = getStatusStyle(item.status);

          return (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 ${statusStyle.iconBg} rounded-full flex items-center justify-center border-2 ${statusStyle.iconBorder} ${statusStyle.animate ? "animate-pulse" : ""}`}
                >
                  <i className={`fas ${statusStyle.icon} ${statusStyle.iconColor} text-sm`} />
                </div>
                {!isLast && <div className="w-0.5 h-20 bg-slate-800 mt-2" />}
              </div>
              <div className={`flex-1 ${!isLast ? "pb-6" : ""}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <span className="text-xs text-gray-500">{item.timestamp}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${statusStyle.badgeBg} ${statusStyle.badgeText}`}
                  >
                    <i className={`fas ${statusStyle.badgeIcon} mr-1`} />
                    {statusStyle.label}
                  </span>
                  {item.duration && (
                    <span className="text-xs text-gray-500">Duration: {item.duration}</span>
                  )}
                  {item.elapsed && (
                    <span className="text-xs text-gray-500">Elapsed: {item.elapsed}</span>
                  )}
                  {item.error && (
                    <span className="text-xs text-gray-500">Error: {item.error}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={item.executedBy.avatar}
                    alt={item.executedBy.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-xs text-gray-400">
                    Executed by {item.executedBy.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
