import React from "react";

export interface IPReputation {
  address?: string;
  score?: number;
  threatScore?: number;
  country?: string;
  asn?: string;
  threat_level?: string;
  blacklisted?: boolean;
  tags?: string[];
}

interface IPReputationCardProps {
  ipReputation: IPReputation;
}

export const IPReputationCard: React.FC<IPReputationCardProps> = ({ ipReputation }) => {
  // Backend returns: { score, country, asn, threat_level, blacklisted }
  // Map to frontend format
  const threatScore = ipReputation.score ? ipReputation.score / 10 : (ipReputation.threatScore || 5);
  const ipAddress = ipReputation.address || "Unknown";
  const country = ipReputation.country || "Unknown";
  const asn = ipReputation.asn || "Unknown";
  
  const scoreColor =
    threatScore >= 7
      ? "text-red-400 bg-red-500/20"
      : threatScore >= 4
      ? "text-orange-400 bg-orange-500/20"
      : "text-yellow-400 bg-yellow-500/20";

  const scoreBarColor =
    threatScore >= 7
      ? "bg-red-500"
      : threatScore >= 4
      ? "bg-orange-500"
      : "bg-yellow-500";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <i className="fas fa-globe text-cyan-500" />
        IP Reputation
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">IP Address</label>
          <p className="text-sm font-mono text-white bg-slate-950 p-2 rounded border border-slate-800">
            {ipAddress}
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-500">Threat Score</label>
            <span className={`text-sm font-semibold px-2 py-0.5 rounded ${scoreColor}`}>
              {threatScore.toFixed(1)}/10
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${scoreBarColor}`}
              style={{ width: `${threatScore * 10}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Country</label>
            <p className="text-sm text-white">{country}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">ASN</label>
            <p className="text-sm text-white">{asn}</p>
          </div>
        </div>

        {ipReputation.blacklisted !== undefined && (
          <div>
            <label className="text-xs text-gray-500 block mb-1">Status</label>
            <span className={`inline-flex items-center px-2 py-1 text-xs rounded ${ipReputation.blacklisted ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
              {ipReputation.blacklisted ? '⚠️ Blacklisted' : '✓ Clean'}
            </span>
          </div>
        )}

        {ipReputation.tags && ipReputation.tags.length > 0 && (
          <div>
            <label className="text-xs text-gray-500 block mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {ipReputation.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
