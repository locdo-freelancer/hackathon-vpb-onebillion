import React from "react";

interface ActionStatsCardProps {
  icon: string;
  iconColor: string;
  iconBg: string;
  value: number;
  label: string;
  sublabel: string;
}

export const ActionStatsCard: React.FC<ActionStatsCardProps> = ({
  icon,
  iconColor,
  iconBg,
  value,
  label,
  sublabel,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
          <i className={`fas ${icon} ${iconColor} text-xl`} />
        </div>
        <span className="text-xs text-gray-400">{sublabel}</span>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
};
