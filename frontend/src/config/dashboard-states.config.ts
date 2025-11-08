/**
 * Dashboard States Configuration
 * 
 * Single Responsibility Principle (SRP):
 * - Only defines state UI configurations (loading, error, empty)
 * 
 * Open/Closed Principle (OCP):
 * - New state types can be added without modifying existing code
 */

export interface StateConfig {
  icon: string;
  iconBg: string;
  iconColor: string;
  title?: string;
  message?: string;
  animation?: string;
}

/**
 * Loading state configuration
 */
export const LOADING_STATE_CONFIG: StateConfig = {
  icon: "fas fa-shield-halved",
  iconBg: "bg-linear-to-br from-cyan-500 to-purple-500",
  iconColor: "text-white",
  title: "Loading Dashboard...",
  animation: "animate-pulse",
};

/**
 * Error state configuration
 */
export const ERROR_STATE_CONFIG: StateConfig = {
  icon: "fas fa-exclamation-triangle",
  iconBg: "bg-red-500/20",
  iconColor: "text-red-400",
  title: "Failed to Load Dashboard",
};

/**
 * Empty state configuration
 */
export const EMPTY_STATE_CONFIG: StateConfig = {
  icon: "fas fa-inbox",
  iconBg: "bg-slate-800/50",
  iconColor: "text-gray-400",
  title: "No Data Available",
  message: "Dashboard data is currently unavailable. Please try again later.",
};

/**
 * Background effects configuration for dashboard
 */
export const DASHBOARD_BG_EFFECTS = {
  gradientOverlay: "bg-linear-to-br from-cyan-500/5 via-transparent to-purple-500/5",
  topLeftBlur: {
    position: "top-20 left-20",
    size: "w-96 h-96",
    color: "bg-cyan-500/10",
    blur: "blur-3xl",
  },
  bottomRightBlur: {
    position: "bottom-20 right-20",
    size: "w-96 h-96",
    color: "bg-purple-500/10",
    blur: "blur-3xl",
  },
};

/**
 * Get loading state configuration
 */
export const getLoadingConfig = (): StateConfig => LOADING_STATE_CONFIG;

/**
 * Get error state configuration
 */
export const getErrorConfig = (): StateConfig => ERROR_STATE_CONFIG;

/**
 * Get empty state configuration
 */
export const getEmptyConfig = (): StateConfig => EMPTY_STATE_CONFIG;

/**
 * Get dashboard background effects
 */
export const getDashboardBgEffects = () => DASHBOARD_BG_EFFECTS;
