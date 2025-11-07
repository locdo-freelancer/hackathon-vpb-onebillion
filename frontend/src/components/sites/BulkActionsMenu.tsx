import React, { useState, useRef, useEffect } from "react";

interface BulkAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: () => void;
}

interface BulkActionsMenuProps {
  selectedCount: number;
  onEnableSelected: () => void;
  onDisableSelected: () => void;
  onDeleteSelected: () => void;
}

export const BulkActionsMenu: React.FC<BulkActionsMenuProps> = ({
  selectedCount,
  onEnableSelected,
  onDisableSelected,
  onDeleteSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const actions: BulkAction[] = [
    {
      id: "enable",
      label: "Enable Selected",
      icon: "fas fa-check-circle",
      color: "text-green-400",
      action: () => {
        onEnableSelected();
        setIsOpen(false);
      },
    },
    {
      id: "disable",
      label: "Disable Selected",
      icon: "fas fa-times-circle",
      color: "text-yellow-400",
      action: () => {
        onDisableSelected();
        setIsOpen(false);
      },
    },
    {
      id: "delete",
      label: "Delete Selected",
      icon: "fas fa-trash",
      color: "text-red-400",
      action: () => {
        onDeleteSelected();
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={selectedCount === 0}
        className={`px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg transition-colors flex items-center gap-2 ${
          selectedCount === 0
            ? "text-gray-600 cursor-not-allowed"
            : "text-gray-400 hover:text-white hover:border-cyan-500/50"
        }`}
      >
        <i className="fas fa-layer-group" />
        <span>Bulk Actions</span>
        {selectedCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full">
            {selectedCount}
          </span>
        )}
        <i className="fas fa-chevron-down text-xs ml-1" />
      </button>

      {isOpen && selectedCount > 0 && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className={`w-full px-4 py-3 text-left text-sm hover:bg-slate-800/50 transition-colors flex items-center gap-3 ${action.color} ${
                action.id === "delete" ? "border-t border-slate-800" : ""
              }`}
            >
              <i className={action.icon} />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
