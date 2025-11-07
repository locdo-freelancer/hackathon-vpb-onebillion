import React from "react";

interface TroubleshootingItem {
  title: string;
  solutions: string[];
}

const TROUBLESHOOTING_ITEMS: TroubleshootingItem[] = [
  {
    title: "Agent not connecting",
    solutions: [
      "Check outbound HTTPS (443) connectivity to *.securevault.com",
      "Verify firewall allows outbound connections",
      "Ensure installation ran with proper privileges",
    ],
  },
  {
    title: "Installation failed",
    solutions: [
      "Check if curl/wget is installed on your system",
      "Verify you have administrator/root privileges",
      "Check system compatibility and requirements",
    ],
  },
  {
    title: "Authentication issues",
    solutions: [
      "Verify the installation token is correct and active",
      "Check if token has expired or been revoked",
      "Ensure system clock is synchronized (NTP)",
    ],
  },
];

export const TroubleshootingSection: React.FC = () => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <i className="fas fa-tools text-cyan-400" />
        Troubleshooting
      </h3>

      <div className="space-y-4">
        {TROUBLESHOOTING_ITEMS.map((item, index) => (
          <details key={index} className="group">
            <summary className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg cursor-pointer hover:bg-slate-950 transition-colors">
              <span className="text-white font-medium">{item.title}</span>
              <i className="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-3 p-4 bg-slate-950/30 rounded-lg">
              <ul className="space-y-2 text-sm text-gray-300">
                {item.solutions.map((solution, sIndex) => (
                  <li key={sIndex} className="flex items-start gap-2">
                    <i className="fas fa-circle text-cyan-400 text-xs mt-2" />
                    {solution}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800">
        <a
          href="#"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-external-link-alt" />
          View Complete Documentation
        </a>
      </div>
    </div>
  );
};
