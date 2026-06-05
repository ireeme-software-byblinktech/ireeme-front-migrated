import React from "react";
import { TransformedAssignment, Assignment } from "./types";
import { cn } from "@/lib/utils";

interface AssignmentCardProps {
  assignment: TransformedAssignment;
  originalAssignment: Assignment;
  onView: (assignment: Assignment) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (assignmentId: string) => void;
  onViewSubmissions: (assignment: Assignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  originalAssignment,
  onView,
  onEdit,
  onDelete,
  onViewSubmissions,
}) => {
  return (
    <div className="assignment-card-full">
      <div className="assignment-tags-container">
        <span className="assignment-tag-v2">{assignment.type}</span>
        <span className="assignment-tag-v2">{assignment.status.toUpperCase()}</span>
      </div>

      <div className="assignment-details-v2">
        <h3 className="assignment-title-v2">{assignment.title}</h3>
        <p className="assignment-subtitle-v2">{assignment.subject} - {assignment.class}</p>
        <p className="assignment-due-v2">Due: {assignment.dueDate}</p>
      </div>

      <div className="assignment-progress-section">
        <div className="assignment-progress-item">
          <div className="assignment-progress-header">
            <span className="assignment-progress-label">Submissions</span>
            <span className="assignment-progress-count">
              {assignment.submitted}/{assignment.totalSubmissions}
            </span>
          </div>
          <div className="assignment-progress-bar-bg">
            <div
              className="assignment-progress-bar-fill"
              style={{
                width: `${
                  assignment.totalSubmissions > 0
                    ? (assignment.submitted / assignment.totalSubmissions) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>

        {assignment.status !== "Draft" && (
          <div className="assignment-progress-item">
            <div className="assignment-progress-header">
              <span className="assignment-progress-label">Graded</span>
              <span className="assignment-progress-count">
                {assignment.graded}/{assignment.totalGraded}
              </span>
            </div>
            <div className="assignment-progress-bar-bg">
              <div
                className="assignment-progress-bar-fill"
                style={{
                  width: `${
                    assignment.totalGraded > 0
                      ? (assignment.graded / assignment.totalGraded) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="assignment-actions-v2">
        {assignment.status === "Draft" ? (
          <>
            <div
              onClick={() => onEdit(originalAssignment)}
              className="assignment-action-btn primary"
            >
              Edit
            </div>
            <div
              onClick={() => onDelete(assignment.id)}
              className="assignment-action-btn secondary"
              style={{ color: "#dc2626" }}
            >
              Delete
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => onView(originalAssignment)}
              className="assignment-action-btn primary"
            >
              View
            </div>
            <div
              onClick={() => onViewSubmissions(originalAssignment)}
              className="assignment-action-btn secondary"
            >
              Submissions
            </div>
          </>
        )}
      </div>
    </div>
  );
};

