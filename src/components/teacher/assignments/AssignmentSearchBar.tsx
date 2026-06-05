import React from "react";
import { Search } from "lucide-react";
import { FilterState } from "./types";

interface AssignmentSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterToggle: () => void;
  selectedFilters: FilterState;
}

export const AssignmentSearchBar: React.FC<AssignmentSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onFilterToggle,
  selectedFilters,
}) => {
  const activeFilterCount = Object.values(selectedFilters).reduce(
    (sum, v) => sum + (v?.length || 0),
    0
  );

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search assignments..."
          className="w-full pl-12 pr-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white focus:border-black focus:outline-none text-sm"
        />
      </div>

      <button
        onClick={onFilterToggle}
        className="px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 font-semibold text-sm transition-colors flex items-center gap-2"
      >
        Filter
        {activeFilterCount > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-black text-white text-xs font-bold">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
};

