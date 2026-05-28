import React from "react";
import { cn } from "@/lib/utils";
import { ViewMode } from "./types";

interface AssignmentViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const AssignmentViewToggle: React.FC<AssignmentViewToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange("grid")}
        className={cn(
          "px-4 py-2 rounded-md font-semibold text-sm transition-colors",
          viewMode === "grid"
            ? "bg-white text-black shadow-sm"
            : "text-gray-600 hover:text-black"
        )}
      >
        Grid
      </button>
      <button
        onClick={() => onViewModeChange("table")}
        className={cn(
          "px-4 py-2 rounded-md font-semibold text-sm transition-colors",
          viewMode === "table"
            ? "bg-white text-black shadow-sm"
            : "text-gray-600 hover:text-black"
        )}
      >
        Table
      </button>
    </div>
  );
};
