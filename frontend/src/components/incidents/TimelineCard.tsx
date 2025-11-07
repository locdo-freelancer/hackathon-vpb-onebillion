import React from "react";
import type { IncidentTimelineEvent } from "@/types/incidents.types";

interface TimelineCardProps {
  events: IncidentTimelineEvent[];
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ events }) => {
  const getEventTypeColor = (action: string) => {
    if (action.toLowerCase().includes("detected") || action.toLowerCase().includes("malicious")) {
      return {
        badge: "bg-red-500/20 text-red-400",
        dot: "bg-red-500",
      };
    }
    if (action.toLowerCase().includes("blocked") || action.toLowerCase().includes("connection")) {
      return {
        badge: "bg-orange-500/20 text-orange-400",
        dot: "bg-orange-500",
      };
    }
    if (action.toLowerCase().includes("modification") || action.toLowerCase().includes("registry")) {
      return {
        badge: "bg-yellow-500/20 text-yellow-400",
        dot: "bg-yellow-500",
      };
    }
    return {
      badge: "bg-blue-500/20 text-blue-400",
      dot: "bg-blue-500",
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Timeline & Events</h3>
      <div className="space-y-4">
        {events.map((event, index) => {
          const classes = getEventTypeColor(event.action);
          const isLast = index === events.length - 1;

          return (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 ${classes.dot} rounded-full border-2 border-slate-900`}
                />
                {!isLast && <div className="w-0.5 h-16 bg-slate-800" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-white">{event.action}</p>
                  <span className="text-xs text-gray-400">{event.timestamp}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{event.details}</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${classes.badge}`}>
                    {event.user}
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
