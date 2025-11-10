"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard";
import {
  ActionConsolePageHeader,
  ActionConsoleStatsGrid,
  ActionConsoleContent,
  ActionExecutionModal,
} from "@/components/action-console";
import { useActionConsole } from "@/hooks/useActionConsole";
import { getNavItems, getDefaultUser } from "@/config/navigation.config";
import { useAuthProtection } from "@/hooks/useAuthProtection";

/**
 * Action Console Page - SOLID Principles Applied
 * 
 * Single Responsibility: Only handles page composition
 * Open/Closed: Extended by adding new components, not modifying existing
 * Liskov Substitution: Components can be replaced with compatible implementations
 * Interface Segregation: Each component has focused, minimal props
 * Dependency Inversion: Depends on abstractions (hooks/components), not concrete implementations
 */
export default function ActionConsolePage() {
  useAuthProtection();
  // Dependency Injection: Business logic injected via hook
  const {
    data,
    isLoading,
    selectedAction,
    isModalOpen,
    openActionModal,
    closeActionModal,
    executeAction,
  } = useActionConsole();

  // Dependency Injection: Navigation config injected
  const user = getDefaultUser();
  const navItems = getNavItems("/action-console");

  // Loading State - Early Return Pattern
  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-950">
        <DashboardSidebar navItems={navItems} user={user} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-cyan-500 text-4xl mb-4" />
            <p className="text-gray-400">Loading action console...</p>
          </div>
        </div>
      </div>
    );
  }

  // Guard Clause - Ensure data exists
  if (!data) return null;

  // Single Responsibility: Page only composes components
  return (
    <div className="flex h-screen bg-slate-950">
      {/* Interface Segregation: Sidebar only needs nav items and user */}
      <DashboardSidebar navItems={navItems} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Open/Closed: Header component can be extended without modification */}
        <ActionConsolePageHeader systemStatus="operational" />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Liskov Substitution: Stats grid can be replaced with compatible implementation */}
          <ActionConsoleStatsGrid stats={data.stats} />

          {/* Dependency Inversion: Content component depends on abstract interfaces */}
          <ActionConsoleContent
            availableActions={data.availableActions}
            executionHistory={data.executionHistory}
            onExecuteAction={openActionModal}
          />
        </div>
      </div>

      {/* Interface Segregation: Modal only needs minimal props */}
      <ActionExecutionModal
        modalData={selectedAction}
        isOpen={isModalOpen}
        onClose={closeActionModal}
        onExecute={executeAction}
      />
    </div>
  );
}
