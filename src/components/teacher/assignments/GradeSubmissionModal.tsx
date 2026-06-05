import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { X, AlertCircle } from "lucide-react";
import { useToast } from "@/providers/toast-provider";

interface GradeSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: {
    id: string;
    studentName: string;
    assignmentTitle: string;
    maxScore: number;
  } | null;
}

export const GradeSubmissionModal: React.FC<GradeSubmissionModalProps> = ({
  isOpen,
  onClose,
  submission,
}) => {
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [termId, setTermId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const gradeSubmissionMutation = useMutation({
    mutationFn: async () => {
      if (!submission) return;

      const scoreNum = parseFloat(score);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > submission.maxScore) {
        throw new Error(`Score must be between 0 and ${submission.maxScore}`);
      }

      const response = await apiClient("/api/v1/grades/submissions/" + submission.id + "/grade", {
        method: "PATCH",
        body: JSON.stringify({
          score: scoreNum,
          feedback: feedback.trim(),
          termId: termId || undefined,
        }),
      });

      return response;
    },
    onSuccess: () => {
      addToast(
        `Grade of ${score}% posted for ${submission?.studentName}!`,
        "success"
      );
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["submissions"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
        refetchType: "all",
      });
      handleClose();
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to grade submission";
      setErrors({ submit: errorMsg });
      addToast(errorMsg, "error");
    },
  });

  const handleClose = () => {
    setScore("");
    setFeedback("");
    setTermId("");
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Record<string, string> = {};
    if (!score.trim()) newErrors.score = "Score is required";
    if (!termId.trim()) newErrors.termId = "Term is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await gradeSubmissionMutation.mutateAsync();
  };

  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Grade Submission</h2>
            <p className="text-sm text-gray-500 mt-1">{submission.studentName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Assignment Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-900">{submission.assignmentTitle}</p>
            </div>
          </div>

          {/* Term */}
          <div>
            <label htmlFor="termId" className="block text-sm font-medium text-gray-700 mb-2">
              Term <span className="text-red-500">*</span>
            </label>
            <input
              id="termId"
              type="text"
              value={termId}
              onChange={(e) => setTermId(e.target.value)}
              placeholder="e.g., Term 1, Fall 2024"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                errors.termId ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.termId && (
              <p className="text-red-600 text-sm mt-1">{errors.termId}</p>
            )}
          </div>

          {/* Score */}
          <div>
            <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-2">
              Score <span className="text-red-500">*</span>
              <span className="text-gray-500 font-normal ml-1">
                (0 - {submission.maxScore})
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="score"
                type="number"
                min="0"
                max={submission.maxScore}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="0"
                step="0.5"
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.score ? "border-red-500" : "border-gray-300"
                }`}
              />
              <span className="text-gray-600 font-medium">/</span>
              <span className="text-gray-600 font-medium w-12">{submission.maxScore}</span>
            </div>
            {errors.score && (
              <p className="text-red-600 text-sm mt-1">{errors.score}</p>
            )}
          </div>

          {/* Feedback */}
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Feedback (Optional)
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add constructive feedback for the student..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={gradeSubmissionMutation.isPending}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {gradeSubmissionMutation.isPending ? "Submitting..." : "Submit Grade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
