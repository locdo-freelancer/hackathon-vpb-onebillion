// Step 1: Site Details - Single Responsibility
"use client";

import React from "react";
import { SiteConfigData } from "@/types/onboarding.types";
import { useTranslations } from "@/hooks/useTranslations";

interface Step1PersonalInfoProps {
  data: SiteConfigData;
  onChange: (updates: Partial<SiteConfigData>) => void;
}

export const Step1PersonalInfo: React.FC<Step1PersonalInfoProps> = ({
  data,
  onChange,
}) => {
  const { t } = useTranslations("onboarding");
  
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {t("basicInformation")}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t("siteName")} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.siteName}
              onChange={(e) => onChange({ siteName: e.target.value })}
              className="w-full bg-cyber-dark border border-cyber-border text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all duration-200"
              placeholder="e.g., Production Server"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t("ipAddress")} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={data.ipAddress}
                onChange={(e) => onChange({ ipAddress: e.target.value })}
                className="w-full bg-cyber-dark border border-cyber-border text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all duration-200"
                placeholder="192.168.1.100"
                pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t("port")} <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={data.port}
                onChange={(e) => onChange({ port: e.target.value })}
                className="w-full bg-cyber-dark border border-cyber-border text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all duration-200"
                placeholder="22"
                min="1"
                max="65535"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t("domainName")} <span className="text-gray-500">({t("optional")})</span>
            </label>
            <input
              type="text"
              value={data.domainName}
              onChange={(e) => onChange({ domainName: e.target.value })}
              className="w-full bg-cyber-dark border border-cyber-border text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyber-accent focus:border-transparent transition-all duration-200"
              placeholder="e.g., server.company.com"
            />
          </div>
        </div>
      </div>

      <div className="bg-cyber-accent/10 border border-cyber-accent/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-info-circle text-cyber-accent mt-1" />
          <div className="text-sm">
            <p className="text-white font-medium mb-1">{t("configurationHelp")}</p>
            <p className="text-gray-300">
              {t("configurationHelpText")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
