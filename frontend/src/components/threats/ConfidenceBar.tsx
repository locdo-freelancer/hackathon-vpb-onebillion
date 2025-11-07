import React from "react";

interface ConfidenceBarProps {
  confidence: number; // 0-100
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidence }) => {
  const getColor = () => {
    if (confidence >= 80) return "bg-red-400";
    if (confidence >= 60) return "bg-orange-400";
    if (confidence >= 40) return "bg-yellow-400";
    return "bg-gray-400";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-900 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getColor()}`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className="text-xs text-white w-10 text-right">{confidence}%</span>
    </div>
  );
};
