import React from "react";
import { FilterState, ASSIGNMENT_TYPES, ASSIGNMENT_STATUSES, Subject } from "./types";

interface AssignmentFiltersProps {
  isOpen: boolean;
  selectedFilters: FilterState;
  subjects: Subject[];
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
  onApply: () => void;
}

export const AssignmentFilters: React.FC<AssignmentFiltersProps> = ({
  isOpen,
  selectedFilters,
  subjects,
  onFilterChange,
  onClearAll,
  onApply,
}) => {
  if (!isOpen) return null;

  const handleTypeChange = (type: string, checked: boolean) => {
    onFilterChange({
      ...selectedFilters,
      type: checked
        ? [...(selectedFilters.type || []), type]
        : (selectedFilters.type || []).filter((t) => t !== type),
    });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    onFilterChange({
      ...selectedFilters,
      status: checked
        ? [...(selectedFilters.status || []), status]
        : (selectedFilters.status || []).filter((s) => s !== status),
    });
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    onFilterChange({
      ...selectedFilters,
      subject: checked
        ? [...(selectedFilters.subject || []), subject]
        : (selectedFilters.subject || []).filter((s) => s !== subject),
    });
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Type Filter */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Type</h3>
          <div className="space-y-2">
            {ASSIGNMENT_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.type?.includes(type) || false}
                  onChange={(e) => handleTypeChange(type, e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Status</h3>
          <div className="space-y-2">
            {ASSIGNMENT_STATUSES.map((status) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.status?.includes(status) || false}
                  onChange={(e) => handleStatusChange(status, e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Subject Filter */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Subject</h3>
          <div className="space-y-2">
            {subjects.map((subject) => (
              <label key={subject.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.subject?.includes(subject.name) || false}
                  onChange={(e) => handleSubjectChange(subject.name, e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-700">{subject.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={onClearAll}
          className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={onApply}
          className="px-4 py-2 rounded-lg bg-black text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

