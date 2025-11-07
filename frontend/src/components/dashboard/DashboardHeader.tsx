import React from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  notificationCount?: number;
  onSearch?: (query: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  notificationCount = 0,
  onSearch,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
      <div className="px-8 py-6 flex items-center justify-between">
        {/* Title Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-64 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-bell text-xl" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
