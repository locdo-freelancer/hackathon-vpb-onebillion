import { useState, useEffect } from "react";
import type {
  ActionConsoleData,
  ActionModalData,
} from "@/types/action-console.types";
import { fetchActionConsoleData } from "@/data/mock-action-console";
import { getModalData } from "@/data/modal-configs";

export interface UseActionConsoleReturn {
  data: ActionConsoleData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  selectedAction: ActionModalData | null;
  isModalOpen: boolean;
  openActionModal: (actionId: string) => void;
  closeActionModal: () => void;
  executeAction: (formData: Record<string, string>) => void;
}

export const useActionConsole = (): UseActionConsoleReturn => {
  const [data, setData] = useState<ActionConsoleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionModalData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const actionData = await fetchActionConsoleData();
      setData(actionData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch action console data")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openActionModal = (actionId: string) => {
    const action = data?.availableActions.find((a) => a.id === actionId);
    if (action) {
      const modalData = getModalData(action.type);
      setSelectedAction(modalData);
      setIsModalOpen(true);
    }
  };

  const closeActionModal = () => {
    setIsModalOpen(false);
    setSelectedAction(null);
  };

  const executeAction = (formData: Record<string, string>) => {
    console.log("Executing action:", selectedAction?.type, formData);
    // In real app, this would call an API
    closeActionModal();
    // Optionally refetch data to update stats and history
    fetchData();
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    selectedAction,
    isModalOpen,
    openActionModal,
    closeActionModal,
    executeAction,
  };
};
