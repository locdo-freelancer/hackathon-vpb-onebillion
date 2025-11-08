import React from "react";

interface AgentInstallActionsProps {
  isRegistered: boolean;
  onContinue: () => void;
  onCancel?: () => void;
}

export const AgentInstallActions: React.FC<AgentInstallActionsProps> = ({
  isRegistered,
  onContinue,
  onCancel,
}) => {
  return (
    <div className="flex justify-between">
      {onCancel && (
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-slate-900 border border-slate-800 text-gray-400 rounded-lg hover:text-white hover:border-gray-600 transition-colors font-medium"
        >
          Skip for Now
        </button>
      )}

      <button
        onClick={onContinue}
        disabled={!isRegistered}
        className={`ml-auto px-6 py-3 rounded-lg font-medium transition-all ${
          isRegistered
            ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            : "bg-slate-900 border border-slate-800 text-gray-600 cursor-not-allowed"
        }`}
      >
        {isRegistered ? (
          <>
            <i className="fas fa-arrow-right mr-2" />
            Continue to Dashboard
          </>
        ) : (
          <>
            <i className="fas fa-lock mr-2" />
            Waiting for Agent Registration
          </>
        )}
      </button>
    </div>
  );
};
