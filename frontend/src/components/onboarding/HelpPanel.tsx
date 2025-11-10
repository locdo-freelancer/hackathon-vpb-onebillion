// Help Panel - Single Responsibility: Display contextual help
import React from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface HelpContent {
  titleKey: string;
  descriptionKey: string;
}

interface HelpPanelProps {
  currentStep: number;
}

const HELP_CONTENT: Record<number, HelpContent[]> = {
  1: [
    {
      titleKey: "siteNameHelp",
      descriptionKey: "siteNameHelpText",
    },
    {
      titleKey: "ipAddressHelp",
      descriptionKey: "ipAddressHelpText",
    },
    {
      titleKey: "domainNameHelp",
      descriptionKey: "domainNameHelpText",
    },
  ],
  2: [
    {
      titleKey: "serverTypeHelp",
      descriptionKey: "serverTypeHelpText",
    },
    {
      titleKey: "windowsCompatibility",
      descriptionKey: "windowsCompatibilityText",
    },
    {
      titleKey: "systemRequirements",
      descriptionKey: "systemRequirementsText",
    },
  ],
  3: [
    {
      titleKey: "installationCommand",
      descriptionKey: "installationCommandText",
    },
    {
      titleKey: "firewallConfiguration",
      descriptionKey: "firewallConfigurationText",
    },
    {
      titleKey: "installationTime",
      descriptionKey: "installationTimeText",
    },
  ],
  4: [
    {
      titleKey: "validationSteps",
      descriptionKey: "validationStepsText",
    },
    {
      titleKey: "troubleshooting",
      descriptionKey: "troubleshootingText",
    },
    {
      titleKey: "nextSteps",
      descriptionKey: "nextStepsText",
    },
  ],
};

export const HelpPanel: React.FC<HelpPanelProps> = ({ currentStep }) => {
  const { t } = useTranslations("onboarding");
  const content = HELP_CONTENT[currentStep] || [];

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <i className="fas fa-lightbulb text-cyber-accent" />
        {t("helpAndTips")}
      </h3>

      <div className="space-y-4">
        {content.map((item, index) => (
          <div key={index} className="bg-cyber-dark/50 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">{t(item.titleKey)}</h4>
            <p className="text-sm text-gray-400">{t(item.descriptionKey)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-cyber-border">
        <a
          href="#"
          className="text-sm text-cyber-accent hover:text-cyan-400 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-book" />
          View Documentation
        </a>
      </div>
    </div>
  );
};
