// Step 2: Server Type Selection - Single Responsibility
"use client";

import React from "react";
import { SiteConfigData } from "@/types/onboarding.types";

interface Step2AccountTypeProps {
  data: SiteConfigData;
  onChange: (updates: Partial<SiteConfigData>) => void;
}

interface ServerTypeOption {
  id: "linux" | "windows" | "docker";
  name: string;
  icon: string;
  description: string;
}

const SERVER_TYPES: ServerTypeOption[] = [
  {
    id: "linux",
    name: "Linux Server",
    icon: "fa-brands fa-linux",
    description: "Ubuntu, CentOS, RHEL, Debian",
  },
  {
    id: "windows",
    name: "Windows Server",
    icon: "fa-brands fa-windows",
    description: "Windows Server 2016, 2019, 2022",
  },
  {
    id: "docker",
    name: "Docker Container",
    icon: "fa-brands fa-docker",
    description: "Containerized deployment",
  },
];

export const Step2AccountType: React.FC<Step2AccountTypeProps> = ({
  data,
  onChange,
}) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Select Server Type
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
                  <h4 className="font-semibold text-white">{type.name}</h4>
                  <p className="text-sm text-gray-400">{type.description}</p>
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
            <p className="text-white font-medium mb-1">Server Compatibility</p>
            <p className="text-gray-300">
              Different server types require different monitoring approaches.
              Our agents support most modern operating systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
