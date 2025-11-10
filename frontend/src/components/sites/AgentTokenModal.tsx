"use client";

import React, { useEffect, useState } from "react";
import type { Site } from "@/types/sites.types";
import { SitesService } from "@/lib/services/sites.service";

interface AgentTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site | null;
}

interface TokenData {
  siteId: string;
  siteName: string;
  agentToken: string;
  installCommand: string;
}

export const AgentTokenModal: React.FC<AgentTokenModalProps> = ({
  isOpen,
  onClose,
  site,
}) => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  useEffect(() => {
    if (isOpen && site) {
      fetchToken();
    }
  }, [isOpen, site]);

  const fetchToken = async () => {
    if (!site) return;

    setLoading(true);
    try {
      const response = await SitesService.getAgentToken(site.id);
      console.log("Token response:", response);
      // API already unwrapped, response IS the data
      const data = response.data || response;
      setTokenData(data);
    } catch (error) {
      console.error("Failed to fetch token:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: "token" | "command") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "token") {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopiedCommand(true);
        setTimeout(() => setCopiedCommand(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <i className="fas fa-key text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Agent Token</h2>
              <p className="text-sm text-gray-400">
                {site?.name || "Unknown Site"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <i className="fas fa-times text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
            </div>
          ) : tokenData ? (
            <>
              {/* Token Section */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Agent Token
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={tokenData.agentToken}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm pr-12"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(tokenData.agentToken, "token")
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  >
                    {copied ? (
                      <>
                        <i className="fas fa-check text-green-400 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <i className="fas fa-copy text-gray-400 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* PowerShell Installation Command */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <i className="fab fa-windows text-cyan-400 mr-2" />
                  Windows Installation (PowerShell)
                </label>
                <div className="relative">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                    <code>
                      # Download agent
                      <br />
                      Invoke-WebRequest -Uri "http://localhost:3001/agents/install.sh" -OutFile "C:\Users\Admin\agent.py"
                      <br />
                      <br />
                      # Run agent
                      <br />
                      python "C:\Users\Admin\agent.py" --server http://localhost:3001 --token {tokenData.agentToken}
                    </code>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `# Download agent\nInvoke-WebRequest -Uri "http://localhost:3001/agents/install.sh" -OutFile "C:\\Users\\Admin\\agent.py"\n\n# Run agent\npython "C:\\Users\\Admin\\agent.py" --server http://localhost:3001 --token ${tokenData.agentToken}`,
                        "command"
                      )
                    }
                    className="absolute top-2 right-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  >
                    {copiedCommand ? (
                      <>
                        <i className="fas fa-check text-green-400 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <i className="fas fa-copy text-gray-400 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Command */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <i className="fas fa-bolt text-yellow-400 mr-2" />
                  Quick Start (if agent.py already exists)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={`python C:\\Users\\Admin\\agent.py --server http://localhost:3001 --token ${tokenData.agentToken}`}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm pr-12"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `python C:\\Users\\Admin\\agent.py --server http://localhost:3001 --token ${tokenData.agentToken}`,
                        "command"
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  >
                    <i className="fas fa-copy text-gray-400 mr-1" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <i className="fas fa-exclamation-triangle text-yellow-500 mt-0.5" />
                  <div className="text-sm text-yellow-200">
                    <p className="font-semibold mb-1">Security Warning</p>
                    <p className="text-yellow-300/80">
                      Keep this token secure. Anyone with this token can connect agents to your site. Do not share it publicly.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Failed to load token
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
