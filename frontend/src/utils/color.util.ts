import { ActionModalData } from "@/types/action-console.types";

export const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical":
        return { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", btnBg: "bg-orange-500/20", btnHover: "hover:bg-orange-500/30" };
      case "high":
        return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", btnBg: "bg-red-500/20", btnHover: "hover:bg-red-500/30" };
      case "medium":
        return { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30", btnBg: "bg-yellow-500/20", btnHover: "hover:bg-yellow-500/30" };
      case "low":
        return { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", btnBg: "bg-blue-500/20", btnHover: "hover:bg-blue-500/30" };
      default:
        return { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30", btnBg: "bg-gray-500/20", btnHover: "hover:bg-gray-500/30" };
    }
  };

export const getCategoryColor = (category: string) => {
    switch (category) {
      case "network":
        return { bg: "bg-purple-500/20", text: "text-purple-400" };
      case "endpoint":
        return { bg: "bg-blue-500/20", text: "text-blue-400" };
      case "identity":
        return { bg: "bg-green-500/20", text: "text-green-400" };
      case "malware":
        return { bg: "bg-purple-500/20", text: "text-purple-400" };
      default:
        return { bg: "bg-gray-500/20", text: "text-gray-400" };
    }
  };

export const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return {
          iconBg: "bg-green-500/20",
          iconBorder: "border-green-500/50",
          icon: "fa-check",
          iconColor: "text-green-400",
          badgeBg: "bg-green-500/20",
          badgeText: "text-green-400",
          badgeIcon: "fa-check-circle",
          label: "Completed",
        };
      case "in-progress":
        return {
          iconBg: "bg-orange-500/20",
          iconBorder: "border-orange-500/50",
          icon: "fa-spinner fa-spin",
          iconColor: "text-orange-400",
          badgeBg: "bg-orange-500/20",
          badgeText: "text-orange-400",
          badgeIcon: "fa-clock",
          label: "In Progress",
          animate: true,
        };
      case "failed":
        return {
          iconBg: "bg-red-500/20",
          iconBorder: "border-red-500/50",
          icon: "fa-times",
          iconColor: "text-red-400",
          badgeBg: "bg-red-500/20",
          badgeText: "text-red-400",
          badgeIcon: "fa-exclamation-triangle",
          label: "Failed",
        };
      case "pending":
        return {
          iconBg: "bg-yellow-500/20",
          iconBorder: "border-yellow-500/50",
          icon: "fa-clock",
          iconColor: "text-yellow-400",
          badgeBg: "bg-yellow-500/20",
          badgeText: "text-yellow-400",
          badgeIcon: "fa-clock",
          label: "Pending",
        };
      default:
        return {
          iconBg: "bg-gray-500/20",
          iconBorder: "border-gray-500/50",
          icon: "fa-circle",
          iconColor: "text-gray-400",
          badgeBg: "bg-gray-500/20",
          badgeText: "text-gray-400",
          badgeIcon: "fa-info-circle",
          label: "Unknown",
        };
    }
  };

export const getWarningColor = (type: string) => {
    switch (type) {
      case "critical":
        return { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400" };
      case "high":
        return { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400" };
      case "medium":
        return { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400" };
      default:
        return { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-400" };
    }
  };

export const getButtonColor = (modalData: ActionModalData) => {
    const colors: Record<string, string> = {
      "fa-ban": "bg-red-500 hover:bg-red-600",
      "fa-network-wired": "bg-orange-500 hover:bg-orange-600",
      "fa-key": "bg-yellow-500 hover:bg-yellow-600",
      "fa-file-shield": "bg-purple-500 hover:bg-purple-600",
    };
    return colors[modalData.icon] || "bg-cyan-500 hover:bg-cyan-600";
  };