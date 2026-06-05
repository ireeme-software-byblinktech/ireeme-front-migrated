import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Assignment } from "./types";
import { CheckCircle, ClipboardList, Layers, X } from "lucide-react";

interface ViewAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignmentId: string) => void;
}

export const ViewAssignmentModal: React.FC<ViewAssignmentModalProps> = ({
  isOpen,
  onClose,
  assignment,
  onEdit,
  onDelete,
}) => {
  if (!assignment) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={assignment.title || "View Assignment"}
      className="modal--premium"
      size="sm"
    >
      <div className="space-y-3">
        {/* Header with Status Badge */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-600 font-semibold">{assignment.subject?.name}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
            {assignment.type}
          </span>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <label className="block text-xs font-bold text-gray-600 mb-1">Max Score</label>
            <p className="text-lg font-bold text-gray-900">{assignment.maxScore}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <label className="block text-xs font-bold text-gray-600 mb-1">Due Date</label>
            <p className="text-xs font-semibold text-gray-900">
              {assignment.dueAt
                ? new Date(assignment.dueAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "No due date"}
            </p>
          </div>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <CheckCircle size={16} className="text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600">Late Submissions</p>
              <p className="text-xs font-bold text-gray-900">
                {assignment.allowLate ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <ClipboardList size={16} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600">Submissions</p>
              <p className="text-xs font-bold text-gray-900">{assignment.submissions?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {assignment.description && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-700 leading-relaxed">{assignment.description}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onEdit(assignment);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <Layers size={14} /> Edit
          </button>
          <button
            onClick={() => {
              onDelete(assignment.id);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-xs hover:bg-red-700 transition-colors flex items-center gap-1"
          >
            <X size={14} /> Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

