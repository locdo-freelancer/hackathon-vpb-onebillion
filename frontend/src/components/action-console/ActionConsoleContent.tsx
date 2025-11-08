import React from "react";
import { AvailableActionCard } from "./AvailableActionCard";
import { ExecutionHistoryTimeline } from "./ExecutionHistoryTimeline";
import type { AvailableAction, ExecutionHistoryItem } from "@/types/action-console.types";

interface ActionConsoleContentProps {
  availableActions: AvailableAction[];
  executionHistory: ExecutionHistoryItem[];
  onExecuteAction: (actionId: string) => void;
}

/**
 * Presentational component for Action Console main content
 * Open/Closed Principle: Can extend layout without modification
 */
export const ActionConsoleContent: React.FC<ActionConsoleContentProps> = ({
  availableActions,
  executionHistory,
  onExecuteAction,
}) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Available Actions Section */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Available Actions</h3>
        <div className="space-y-4">
          {availableActions.map((action) => (
            <AvailableActionCard
              key={action.id}
              action={action}
              onExecute={onExecuteAction}
            />
          ))}
        </div>
      </div>

      {/* Execution History Section */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Execution History</h3>
        <ExecutionHistoryTimeline history={executionHistory} />
      </div>
    </div>
  );
};
