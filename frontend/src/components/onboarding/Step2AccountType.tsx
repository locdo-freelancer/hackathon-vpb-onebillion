// Step 2: Server Type Selection - Single Responsibility
"use client";

import React from "react";
import { SiteConfigData } from "@/types/onboarding.types";
import { useTranslations } from "@/hooks/useTranslations";

interface Step2AccountTypeProps {
  data: SiteConfigData;
  onChange: (updates: Partial<SiteConfigData>) => void;
}

interface ServerTypeOption {
  id: "windows";
  nameKey: string;
  icon: string;
  descriptionKey: string;
}

export const Step2AccountType: React.FC<Step2AccountTypeProps> = ({
  data,
  onChange,
}) => {
  const { t } = useTranslations("onboarding");
  
  const SERVER_TYPES: ServerTypeOption[] = [
    {
      id: "windows",
      nameKey: "windowsServer",
      icon: "fa-brands fa-windows",
      descriptionKey: "windowsDescription",
    },
  ];
  
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {t("selectServerType")}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {SERVER_TYPES.map((type) => (
            <div
              key={type.id}
              onClick={() => onChange({ serverType: type.id })}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                data.serverType === type.id
                  ? "border-cyber-accent bg-cyber-accent/10"
                  : "border-cyber-border hover:border-cyber-accent"
              }`}
            >
              <div className="flex items-center gap-3">
                <i className={`${type.icon} text-2xl text-cyber-accent`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{t(type.nameKey)}</h4>
                  <p className="text-sm text-gray-400">{t(type.descriptionKey)}</p>
                </div>
                {data.serverType === type.id && (
                  <i className="fas fa-check-circle text-cyber-accent text-xl" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-cyber-accent/10 border border-cyber-accent/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <i className="fas fa-info-circle text-cyber-accent mt-1" />
          <div className="text-sm">
            <p className="text-white font-medium mb-1">{t("windowsServerSupport")}</p>
            <p className="text-gray-300">
              {t("windowsSupportText")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
