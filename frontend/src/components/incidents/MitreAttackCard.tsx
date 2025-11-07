import React from "react";
import type { MitreTechnique } from "@/types/incidents.types";

interface MitreAttackCardProps {
  techniques: MitreTechnique[];
}

export const MitreAttackCard: React.FC<MitreAttackCardProps> = ({ techniques }) => {
  const getTacticColor = (tactic: string) => {
    const tacticColors: Record<string, { border: string; bg: string; text: string }> = {
      "Initial Access": {
        border: "border-red-500/30",
        bg: "bg-red-500",
        text: "text-red-400",
      },
      "Execution": {
        border: "border-orange-500/30",
        bg: "bg-orange-500",
        text: "text-orange-400",
      },
      "Persistence": {
        border: "border-yellow-500/30",
        bg: "bg-yellow-500",
        text: "text-yellow-400",
      },
      "Command and Control": {
        border: "border-blue-500/30",
        bg: "bg-blue-500",
        text: "text-blue-400",
      },
    };

    return tacticColors[tactic] || tacticColors["Execution"];
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">MITRE ATT&CK Mapping</h3>
      <div className="grid grid-cols-3 gap-4">
        {techniques.map((technique) => {
          const colors = getTacticColor(technique.tactic);
          return (
            <div
              key={technique.id}
              className={`bg-slate-950/50 border ${colors.border} rounded-lg p-4`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 ${colors.bg} rounded-full`} />
                <span className={`text-sm font-medium ${colors.text}`}>
                  {technique.tactic}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{technique.id}</p>
              <p className="text-sm text-white">{technique.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
