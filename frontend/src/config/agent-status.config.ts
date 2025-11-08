/**
 * Agent Status Configuration
 * 
 * Single Responsibility Principle (SRP):
 * - Only defines status-related styling and thresholds
 * 
 * Open/Closed Principle (OCP):
 * - New status types or CPU thresholds can be added without modifying components
 */

import type { AgentStatus } from "@/types/agents.types";

/**
 * Status indicator color configuration
 */
export const STATUS_COLORS: Record<AgentStatus, string> = {
  online: "bg-green-400 shadow-lg shadow-green-400/20",
  offline: "bg-red-400",
  updating: "bg-yellow-400 animate-pulse",
};

/**
 * Card border color configuration by status
 */
export const BORDER_COLORS: Record<AgentStatus, string> = {
  online: "border-slate-800 hover:border-cyan-500/50",
  offline: "border-red-500/30 hover:border-red-500/50",
  updating: "border-yellow-500/30 hover:border-yellow-500/50",
};

/**
 * Text color configuration by status
 */
export const TEXT_COLORS: Record<AgentStatus, string> = {
  online: "text-green-400",
  offline: "text-red-400",
  updating: "text-yellow-400",
};

/**
 * CPU usage thresholds and corresponding colors
 */
export const CPU_THRESHOLDS = {
  low: { max: 30, color: "bg-green-400" },
  medium: { max: 70, color: "bg-yellow-400" },
  high: { max: 100, color: "bg-red-400" },
};

/**
 * Get status indicator color class
 * @param status - Agent status
 * @returns Tailwind color class string
 */
export const getStatusColor = (status: AgentStatus): string => {
  return STATUS_COLORS[status] || "bg-gray-400";
};

/**
 * Get border color class based on status
 * @param status - Agent status
 * @returns Tailwind border color class string
 */
export const getBorderColor = (status: AgentStatus): string => {
  return BORDER_COLORS[status] || "border-slate-800 hover:border-cyan-500/50";
};

/**
 * Get text color class based on status
 * @param status - Agent status
 * @returns Tailwind text color class string
 */
export const getTextColor = (status: AgentStatus): string => {
  return TEXT_COLORS[status] || "text-gray-300";
};

/**
 * Get CPU usage color based on percentage
 * @param usage - CPU usage percentage (0-100)
 * @returns Tailwind color class string
 */
export const getCPUColor = (usage: number): string => {
  if (usage < CPU_THRESHOLDS.low.max) return CPU_THRESHOLDS.low.color;
  if (usage < CPU_THRESHOLDS.medium.max) return CPU_THRESHOLDS.medium.color;
  return CPU_THRESHOLDS.high.color;
};
