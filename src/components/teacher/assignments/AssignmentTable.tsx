import React from "react";
import { TransformedAssignment, Assignment, SortField, SortDirection } from "./types";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface AssignmentTableProps {
  assignments: TransformedAssignment[];
  originalAssignments: Assignment[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onView: (assignment: Assignment) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignmentId: string) => void;
  onViewSubmissions: (assignment: Assignment) => void;
}

export const AssignmentTable: React.FC<AssignmentTableProps> = ({
  assignments,
  originalAssignments,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  onViewSubmissions,
}) => {
  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return "";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getOriginalAssignment = (id: string) => {
    return originalAssignments.find((a) => a.id === id);
  };

  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-[18px] font-bold text-gray-700 mb-2">No assignments yet</h3>
        <p className="text-gray-500">Create your first assignment to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th
                onClick={() => onSort("title")}
                className="px-6 py-4 text-left text-sm font-bold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Title {getSortIndicator("title")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Subject</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Type</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
              <th
                onClick={() => onSort("dueDate")}
                className="px-6 py-4 text-left text-sm font-bold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                Due Date {getSortIndicator("dueDate")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Submissions</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => {
              const original = getOriginalAssignment(a.id);
              return (
                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{a.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{a.subject}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium text-xs">
                      {a.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full font-medium text-xs",
                        a.status === "Draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : a.status === "Active"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      )}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{a.dueDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {a.submitted}/{a.totalSubmissions}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {a.status === "Draft" ? (
                        <>
                          <button
                            onClick={() => original && onEdit(original)}
                            className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(a.id)}
                            className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => original && onView(original)}
                            className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => original && onViewSubmissions(original)}
                            className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-semibold text-xs transition-colors"
                          >
                            Submissions
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
