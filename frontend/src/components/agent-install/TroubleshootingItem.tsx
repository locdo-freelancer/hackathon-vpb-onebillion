import React from "react";

interface TroubleshootingItemProps {
  title: string;
  solutions: string[];
}

export const TroubleshootingItem: React.FC<TroubleshootingItemProps> = ({
  title,
  solutions,
}) => {
  return (
    <details className="group">
      <summary className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg cursor-pointer hover:bg-slate-950 transition-colors">
        <span className="text-white font-medium">{title}</span>
        <i className="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform" />
      </summary>
      <div className="mt-3 p-4 bg-slate-950/30 rounded-lg">
        <ul className="space-y-2 text-sm text-gray-300">
          {solutions.map((solution, index) => (
            <li key={index} className="flex items-start gap-2">
              <i className="fas fa-circle text-cyan-400 text-xs mt-2" />
              <span>{solution}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
};
