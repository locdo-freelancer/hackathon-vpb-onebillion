import React from "react";
import type { NavItem, User } from "@/types/dashboard.types";

interface DashboardSidebarProps {
  navItems: NavItem[];
  user: User;
  onNavItemClick?: (href: string) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  navItems,
  user,
  onNavItemClick,
}) => {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col">
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg shadow-lg shadow-cyan-500/20">
            <i className="fas fa-shield-halved text-lg text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SecureVault</h1>
            <p className="text-xs text-gray-400">Cybersecurity</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => {
                if (onNavItemClick) {
                  e.preventDefault();
                  onNavItemClick(item.href);
                }
              }}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                  : "text-gray-400 hover:text-white hover:bg-slate-950/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <i className={`${item.icon} w-5`} />
                <span className={item.active ? "font-medium" : ""}>
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>
      </div>

      {/* User Section */}
      <div className="mt-auto p-6">
        <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.role}</p>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-ellipsis-v" />
          </button>
        </div>
      </div>
    </aside>
  );
};
