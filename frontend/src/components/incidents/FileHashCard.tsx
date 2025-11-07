import React from "react";

export interface FileHashAnalysis {
  hash: string;
  algorithm: string;
  threatScore: number;
  firstSeen: string;
  malwareFamily: string;
  detectionCount: number;
}

interface FileHashCardProps {
  fileHash: FileHashAnalysis;
}

export const FileHashCard: React.FC<FileHashCardProps> = ({ fileHash }) => {
  const scoreColor =
    fileHash.threatScore >= 7
      ? "text-red-400 bg-red-500/20"
      : fileHash.threatScore >= 4
      ? "text-orange-400 bg-orange-500/20"
      : "text-yellow-400 bg-yellow-500/20";

  const scoreBarColor =
    fileHash.threatScore >= 7
      ? "bg-red-500"
      : fileHash.threatScore >= 4
      ? "bg-orange-500"
      : "bg-yellow-500";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <i className="fas fa-fingerprint text-cyan-500" />
        File Hash Analysis
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">{fileHash.algorithm}</label>
          <p className="text-sm font-mono text-white break-all bg-slate-950 p-2 rounded border border-slate-800">
            {fileHash.hash}
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-500">Threat Score</label>
            <span className={`text-sm font-semibold px-2 py-0.5 rounded ${scoreColor}`}>
              {fileHash.threatScore}/10
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${scoreBarColor}`}
              style={{ width: `${fileHash.threatScore * 10}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">First Seen</label>
            <p className="text-sm text-white">{fileHash.firstSeen}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Detections</label>
            <p className="text-sm text-white">{fileHash.detectionCount}/70</p>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Malware Family</label>
          <span className="inline-block px-2 py-1 bg-red-500/20 text-red-400 text-sm rounded">
            {fileHash.malwareFamily}
          </span>
        </div>
      </div>
    </div>
  );
};
