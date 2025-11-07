import React, { useState, useEffect } from "react";
import type { Site, SiteFormData } from "@/types/sites.types";

interface SiteModalProps {
  isOpen: boolean;
  site: Site | null;
  onClose: () => void;
  onSave: (data: SiteFormData) => void;
}

export const SiteModal: React.FC<SiteModalProps> = ({
  isOpen,
  site,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<SiteFormData>({
    name: "",
    ipAddress: "",
    domains: [],
    hostname: "",
  });
  const [newDomain, setNewDomain] = useState("");

  useEffect(() => {
    if (site) {
      setFormData({
        name: site.name,
        ipAddress: site.ipAddress,
        domains: site.domains,
        hostname: site.hostname,
      });
    } else {
      setFormData({
        name: "",
        ipAddress: "",
        domains: [],
        hostname: "",
      });
    }
  }, [site, isOpen]);

  const handleAddDomain = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newDomain.trim()) {
      e.preventDefault();
      if (!formData.domains.includes(newDomain.trim())) {
        setFormData({
          ...formData,
          domains: [...formData.domains, newDomain.trim()],
        });
      }
      setNewDomain("");
    }
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    setFormData({
      ...formData,
      domains: formData.domains.filter((d) => d !== domainToRemove),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            {site ? `Edit Site: ${site.name}` : "Add New Site"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Site Name */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Site Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter site name"
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Hostname */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Hostname (Optional)
              </label>
              <input
                type="text"
                value={formData.hostname}
                onChange={(e) =>
                  setFormData({ ...formData, hostname: e.target.value })
                }
                placeholder="e.g., web-prod-01"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* IP Address */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                IP Address *
              </label>
              <input
                type="text"
                value={formData.ipAddress}
                onChange={(e) =>
                  setFormData({ ...formData, ipAddress: e.target.value })
                }
                placeholder="192.168.1.100"
                required
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
              />
            </div>

            {/* Domain Aliases */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Domain Aliases
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-950 border border-slate-800 rounded-lg min-h-12">
                {formData.domains.map((domain, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full flex items-center gap-2"
                  >
                    {domain}
                    <button
                      type="button"
                      onClick={() => handleRemoveDomain(domain)}
                      className="hover:text-white"
                    >
                      <i className="fas fa-times text-xs" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  onKeyDown={handleAddDomain}
                  placeholder="Add domain..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none min-w-[120px]"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Press Enter to add domain
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-950 text-gray-300 rounded-lg hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-linear-to-r from-cyan-500 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
            >
              {site ? "Update Site" : "Save Site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
