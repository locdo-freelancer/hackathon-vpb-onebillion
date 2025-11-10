import React, { useEffect } from "react";
import type { ThreatDetail } from "@/types/threats.types";
import { SeverityBadge, Badge } from "@/components/shared";

interface ThreatDetailDrawerProps {
  threat: ThreatDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ThreatDetailDrawer: React.FC<ThreatDetailDrawerProps> = ({
  threat,
  isOpen,
  onClose,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Don't render if drawer is closed or threat is null
  if (!isOpen || !threat) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-[600px] bg-slate-900 border-l border-slate-800 transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Threat Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-xl" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Main Info Card */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <SeverityBadge severity={(threat.severity || 'low').toUpperCase() as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"} />
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <i className="fas fa-clock" />
                  <span>{threat.firstSeen || 'Unknown'}</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2 break-all">
                {threat.indicator || 'N/A'}
              </h4>
              <p className="text-sm text-gray-400">{threat.description || 'No description available'}</p>
            </div>

            {/* Enrichment Data */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                Enrichment Data
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-sm text-gray-400">Type</span>
                  <Badge 
                    label={
                      threat.type === "ip" ? "IP Address" :
                      threat.type === "domain" ? "Domain" :
                      threat.type === "url" ? "URL" :
                      threat.type === "hash" ? "File Hash" : threat.type
                    }
                    variant={
                      threat.type === "ip" ? "info" :
                      threat.type === "domain" ? "success" :
                      threat.type === "url" ? "info" :
                      threat.type === "hash" ? "default" : "default"
                    }
                  />
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-sm text-gray-400">Country</span>
                  <span className="text-sm text-white font-medium">
                    {threat.countryFlag || '🌐'} {threat.country || 'Unknown'}
                  </span>
                </div>
                {threat.enrichment?.isp && (
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-sm text-gray-400">ISP</span>
                    <span className="text-sm text-white font-medium">
                      {threat.enrichment.isp}
                    </span>
                  </div>
                )}
                {threat.enrichment?.asn && (
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-sm text-gray-400">ASN</span>
                    <span className="text-sm text-white font-medium">
                      {threat.enrichment.asn}
                    </span>
                  </div>
                )}
                {threat.enrichment?.organization && (
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-sm text-gray-400">Organization</span>
                    <span className="text-sm text-white font-medium">
                      {threat.enrichment.organization}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-sm text-gray-400">Confidence Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-900 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          (threat.confidence || 0) >= 80
                            ? "bg-red-400"
                            : (threat.confidence || 0) >= 60
                              ? "bg-orange-400"
                              : "bg-yellow-400"
                        }`}
                        style={{ width: `${threat.confidence || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-white font-medium">
                      {threat.confidence || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Threat Intelligence */}
            {threat.intelligence && threat.intelligence.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">
                  Threat Intelligence
                </h4>
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 space-y-3">
                  {threat.intelligence.map((intel, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <i className={`${intel.icon} ${intel.iconColor} mt-1`} />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {intel.category}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {intel.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {threat.enrichment?.tags && threat.enrichment.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {threat.enrichment.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-xs text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Indicators */}
            {threat.relatedIndicators && threat.relatedIndicators.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">
                  Related Indicators ({threat.relatedIndicators.length})
                </h4>
                <div className="space-y-2">
                  {threat.relatedIndicators.map((indicator) => (
                    <div
                      key={indicator.id}
                      className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 hover:border-cyan-500 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white font-medium truncate">
                          {indicator.indicator}
                        </span>
                        <Badge 
                          label={
                            indicator.type === "ip" ? "IP Address" :
                            indicator.type === "domain" ? "Domain" :
                            indicator.type === "url" ? "URL" :
                            indicator.type === "hash" ? "File Hash" : indicator.type
                          }
                          variant={
                            indicator.type === "ip" ? "info" :
                            indicator.type === "domain" ? "success" :
                            indicator.type === "url" ? "info" :
                            indicator.type === "hash" ? "default" : "default"
                          }
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <i className="fas fa-ban mr-2" />
                Block Indicator
              </button>
              <button className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
                <i className="fas fa-flag mr-2" />
                Create Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
