import React from "react";

export interface ExternalReference {
  name: string;
  icon: string;
  url: string;
}

interface ExternalReferencesCardProps {
  references: ExternalReference[];
}

export const ExternalReferencesCard: React.FC<ExternalReferencesCardProps> = ({ references }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <i className="fas fa-external-link-alt text-cyan-500" />
        External References
      </h3>
      <div className="space-y-2">
        {references.map((ref, index) => (
          <a
            key={index}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-800 rounded-lg hover:bg-slate-950 hover:border-cyan-500/30 transition-colors"
          >
            <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <i className={`${ref.icon} text-cyan-500 text-sm`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{ref.name}</p>
            </div>
            <i className="fas fa-external-link-alt text-gray-500 text-xs" />
          </a>
        ))}
      </div>
    </div>
  );
};
