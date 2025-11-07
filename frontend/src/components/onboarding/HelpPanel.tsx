// Help Panel - Single Responsibility: Display contextual help
import React from "react";

interface HelpContent {
  title: string;
  description: string;
}

interface HelpPanelProps {
  currentStep: number;
}

const HELP_CONTENT: Record<number, HelpContent[]> = {
  1: [
    {
      title: "Site Name",
      description:
        "Choose a descriptive name to easily identify this server in your monitoring dashboard.",
    },
    {
      title: "IP Address",
      description:
        "Enter the primary IP address of your server. This will be used to establish monitoring connection.",
    },
    {
      title: "Domain Name",
      description:
        "Optional: If your server has a domain name, you can provide it for easier reference.",
    },
  ],
  2: [
    {
      title: "Server Types",
      description:
        "Select the operating system or platform. This ensures the correct agent is installed with proper configurations.",
    },
    {
      title: "Linux Servers",
      description:
        "Supports Ubuntu, CentOS, Debian, RHEL and other major Linux distributions.",
    },
    {
      title: "Docker Containers",
      description:
        "For container-based deployments, we provide a Docker image for easy installation.",
    },
  ],
  3: [
    {
      title: "Installation Command",
      description:
        "Copy the command and run it on your server with root privileges. The agent will auto-configure and connect.",
    },
    {
      title: "Firewall Configuration",
      description:
        "Ensure your server can reach *.securevault.com on port 443 for secure communication.",
    },
    {
      title: "Installation Time",
      description:
        "The installation typically takes 30-60 seconds. You'll see confirmation when it's complete.",
    },
  ],
  4: [
    {
      title: "Validation Steps",
      description:
        "We automatically verify network connectivity, agent authentication, and data synchronization.",
    },
    {
      title: "Troubleshooting",
      description:
        "If validation fails, check your firewall settings and ensure the agent installation completed successfully.",
    },
    {
      title: "Next Steps",
      description:
        "Once validation is complete, you can access your monitoring dashboard and start tracking server metrics.",
    },
  ],
};

export const HelpPanel: React.FC<HelpPanelProps> = ({ currentStep }) => {
  const content = HELP_CONTENT[currentStep] || [];

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <i className="fas fa-lightbulb text-cyber-accent" />
        Help & Tips
      </h3>

      <div className="space-y-4">
        {content.map((item, index) => (
          <div key={index} className="bg-cyber-dark/50 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">{item.title}</h4>
            <p className="text-sm text-gray-400">{item.description}</p>
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
