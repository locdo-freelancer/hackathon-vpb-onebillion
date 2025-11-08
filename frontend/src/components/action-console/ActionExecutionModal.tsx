import React from "react";
import { useActionForm } from "@/hooks/useActionForm";
import type { ActionModalData } from "@/types/action-console.types";
import { getButtonColor, getWarningColor } from "@/utils/color.util";

interface ActionExecutionModalProps {
  modalData: ActionModalData | null;
  isOpen: boolean;
  onClose: () => void;
  onExecute: (data: Record<string, string>) => void;
}

export const ActionExecutionModal: React.FC<ActionExecutionModalProps> = ({
  modalData,
  isOpen,
  onClose,
  onExecute,
}) => {
  // Dependency Injection: Form state management via hook
  const { formData, handleChange, resetForm, getFieldValue } = useActionForm();

  if (!isOpen || !modalData) return null;

  const handleSubmit = () => {
    onExecute(formData);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const warningColors = getWarningColor(modalData.warningType);
  const buttonColor = getButtonColor(modalData);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-lg w-full mx-4 shadow-xl shadow-cyan-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-14 h-14 ${warningColors.bg} rounded-lg flex items-center justify-center`}
          >
            <i
              className={`fas ${modalData.icon} ${warningColors.text} text-2xl`}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{modalData.title}</h3>
            <p className="text-sm text-gray-400">{modalData.description}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {modalData.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  placeholder={field.placeholder}
                  rows={field.rows || 3}
                  value={getFieldValue(field.name)}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={getFieldValue(field.name)}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              )}
            </div>
          ))}

          <div
            className={`${warningColors.bg} border ${warningColors.border} rounded-lg p-4`}
          >
            <div className="flex items-start gap-3">
              <i
                className={`fas fa-exclamation-triangle ${warningColors.text} mt-0.5`}
              />
              <div>
                <p className={`text-sm font-medium ${warningColors.text} mb-1`}>
                  {modalData.warningType.charAt(0).toUpperCase() +
                    modalData.warningType.slice(1)}{" "}
                  Action
                </p>
                <p className="text-xs text-gray-400">
                  {modalData.warningMessage}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 px-4 py-2.5 ${buttonColor} text-white rounded-lg transition-colors font-medium`}
          >
            <i className="fas fa-bolt mr-2" />
            Execute Now
          </button>
        </div>
      </div>
    </div>
  );
};
