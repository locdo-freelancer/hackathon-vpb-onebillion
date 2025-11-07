import React from "react";

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  approved?: boolean;
}

interface AIRecommendationsCardProps {
  recommendations: AIRecommendation[];
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

export const AIRecommendationsCard: React.FC<AIRecommendationsCardProps> = ({
  recommendations,
  onApprove,
  onDeny,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-slate-950/50 border border-slate-800 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mt-1">
                <i className="fas fa-robot text-cyan-500 text-sm" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white mb-2">{rec.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{rec.description}</p>
                <div className="flex items-center gap-2">
                  {rec.approved === undefined ? (
                    <>
                      <button
                        onClick={() => onApprove(rec.id)}
                        className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded hover:bg-green-500/30 transition-colors text-sm"
                      >
                        <i className="fas fa-check mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => onDeny(rec.id)}
                        className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors text-sm"
                      >
                        <i className="fas fa-times mr-1" />
                        Deny
                      </button>
                    </>
                  ) : rec.approved ? (
                    <span className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-sm">
                      <i className="fas fa-check mr-1" />
                      Approved
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-sm">
                      <i className="fas fa-times mr-1" />
                      Denied
                    </span>
                  )}
                  <span className="text-xs text-gray-500 ml-2">
                    Confidence: {rec.confidence}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
