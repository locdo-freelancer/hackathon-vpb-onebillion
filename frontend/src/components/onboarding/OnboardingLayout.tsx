// Onboarding Layout - Single Responsibility: Layout structure
import React from "react";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  helpPanel?: React.ReactNode;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  helpPanel,
}) => {
  return (
    <div className="min-h-screen flex relative overflow-hidden bg-cyber-darker">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-linear-to-br from-cyber-accent/5 via-transparent to-cyber-purple/5" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyber-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl" />

      <div className="flex-1 relative z-10 flex flex-col">
        {/* Header */}
        <header className="border-b border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
          <div className="px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-linear-to-br from-cyber-accent to-cyber-purple rounded-lg shadow-glow-cyan">
                <i className="fas fa-shield-halved text-lg text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SecureVault</h1>
                <p className="text-xs text-gray-400">Setup Wizard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                <i className="fas fa-save text-cyber-accent mr-1" />
                Auto-saved 2 min ago
              </div>
              <button className="text-gray-400 hover:text-white transition-colors">
                <i className="fas fa-question-circle text-lg" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Main Content */}
          <div className="flex-1 p-8">{children}</div>

          {/* Help Panel */}
          {helpPanel && (
            <div className="w-80 bg-cyber-card/50 border-l border-cyber-border backdrop-blur-xl">
              {helpPanel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
