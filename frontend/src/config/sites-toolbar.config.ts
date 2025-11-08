/**
 * Sites Toolbar Configuration
 * Single Responsibility: Manages toolbar actions and button configurations
 */

export interface ToolbarActionConfig {
  id: string;
  label: string;
  icon: string;
  variant: "primary" | "secondary" | "success" | "warning" | "danger";
  requiresSelection?: boolean;
}

/**
 * Bulk action configurations
 */
export const bulkActionsConfig: ToolbarActionConfig[] = [
  {
    id: "enable",
    label: "Enable Selected",
    icon: "fa-check-circle",
    variant: "success",
    requiresSelection: true,
  },
  {
    id: "disable",
    label: "Disable Selected",
    icon: "fa-ban",
    variant: "warning",
    requiresSelection: true,
  },
  {
    id: "delete",
    label: "Delete Selected",
    icon: "fa-trash",
    variant: "danger",
    requiresSelection: true,
  },
];

/**
 * Primary action configurations
 */
export const primaryActionsConfig: ToolbarActionConfig[] = [
  {
    id: "add",
    label: "Add New Site",
    icon: "fa-plus",
    variant: "primary",
    requiresSelection: false,
  },
  {
    id: "export",
    label: "Export",
    icon: "fa-download",
    variant: "secondary",
    requiresSelection: false,
  },
];

/**
 * Get button variant styles
 */
export const getButtonVariantStyles = (
  variant: ToolbarActionConfig["variant"]
): string => {
  const styles: Record<ToolbarActionConfig["variant"], string> = {
    primary:
      "bg-linear-to-r from-cyan-500 to-cyan-600 text-white hover:shadow-lg hover:shadow-cyan-500/20",
    secondary:
      "bg-slate-900 border border-slate-800 text-gray-300 hover:border-cyan-500/50",
    success:
      "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30",
    warning:
      "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30",
    danger:
      "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30",
  };
  return styles[variant];
};
