"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, FileText } from "lucide-react";
import { StatCard } from "@/components/ui";
import { apiClient } from "@/lib/api/client";
import {
  AssignmentCard,
  AssignmentTable,
  AssignmentViewToggle,
} from "@/components/teacher/assignments";

export default function TeacherAssignmentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    type: "HOMEWORK",
    maxScore: 100,
    weight: 1,
    dueAt: "",
    allowLate: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionFormat, setQuestionFormat] = useState<"MCQ" | "OPEN">("MCQ");
  const [questions, setQuestions] = useState<any[]>([]);
  const [draftAssignments, setDraftAssignments] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("draftAssignments");
    if (stored) {
      try {
        setDraftAssignments(new Set(JSON.parse(stored)));
      } catch (e) {
        console.error("Failed to load draft assignments:", e);
      }
    }
  }, []);

  const saveDraftToStorage = (assignmentId: string) => {
    const updated = new Set(draftAssignments);
    updated.add(assignmentId);
    setDraftAssignments(updated);
    localStorage.setItem("draftAssignments", JSON.stringify(Array.from(updated)));
  };

  const queryClient = useQueryClient();

  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/assignments");
      return response as any[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const assignments = Array.isArray(assignmentsData) ? assignmentsData : [];

  const deleteAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      await apiClient(`/api/v1/assignments/${assignmentId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
        refetchType: "all",
      });
      setIsDeleteModalOpen(false);
      setSelectedAssignment(null);
    },
    onError: (error: any) => {
      alert(`Failed to delete assignment: ${error.message}`);
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient("/api/v1/assignments", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
        refetchType: "all",
      });
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      setFormErrors({ submit: error.message || "Failed to create assignment" });
    },
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: async (data: { id: string; payload: any }) => {
      await apiClient(`/api/v1/assignments/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
        refetchType: "all",
      });
      setIsEditModalOpen(false);
      setSelectedAssignment(null);
      resetForm();
    },
    onError: (error: any) => {
      setFormErrors({ submit: error.message || "Failed to update assignment" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subjectId: "",
      type: "HOMEWORK",
      maxScore: 100,
      weight: 1,
      dueAt: "",
      allowLate: false,
    });
    setFormErrors({});
    setQuestions([]);
    setQuestionFormat("MCQ");
  };

  const addQuestion = () => {
    const newQuestion: any = {
      id: `q-${Date.now()}`,
      text: "",
      type: questionFormat,
    };
    if (questionFormat === "MCQ") {
      newQuestion.options = [
        { id: "A", value: "", isCorrect: true },
        { id: "B", value: "", isCorrect: false },
        { id: "C", value: "", isCorrect: false },
        { id: "D", value: "", isCorrect: false },
      ];
    }
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const updateQuestionText = (questionId: string, text: string) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, text } : q)));
  };

  const updateQuestionOption = (questionId: string, optionId: string, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          return {
            ...q,
            options: q.options.map((o: any) => (o.id === optionId ? { ...o, value } : o)),
          };
        }
        return q;
      })
    );
  };

  const setQuestionCorrectOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          return {
            ...q,
            options: q.options.map((o: any) => ({ ...o, isCorrect: o.id === optionId })),
          };
        }
        return q;
      })
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.subjectId) errors.subjectId = "Subject is required";
    if (!formData.dueAt) errors.dueAt = "Due date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEdit = (assignment: any) => {
    setSelectedAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description || "",
      subjectId: assignment.subjectId || "",
      type: assignment.type,
      maxScore: assignment.maxScore,
      weight: assignment.weight || 1,
      dueAt: assignment.dueAt ? new Date(assignment.dueAt).toISOString().slice(0, 16) : "",
      allowLate: assignment.allowLate || false,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    setSelectedAssignment(assignment);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitCreate = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();

    if (isDraft) {
      if (!formData.title.trim()) {
        setFormErrors({ title: "Title is required" });
        return;
      }
      if (!formData.subjectId) {
        setFormErrors({ subjectId: "Subject is required" });
        return;
      }
    } else {
      if (!validateForm()) return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description || undefined,
        subjectId: formData.subjectId,
        type: formData.type.toUpperCase(),
        maxScore: formData.maxScore,
        weight: formData.weight,
        allowLate: formData.allowLate,
      };
      if (formData.dueAt) {
        payload.dueAt = new Date(formData.dueAt).toISOString();
      }
      const response: any = await createAssignmentMutation.mutateAsync(payload);
      if (!isDraft && response?.id) {
        saveDraftToStorage(response.id);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description || undefined,
        subjectId: formData.subjectId,
        type: formData.type.toUpperCase(),
        maxScore: formData.maxScore,
        weight: formData.weight,
        allowLate: formData.allowLate,
      };
      if (formData.dueAt) {
        payload.dueAt = new Date(formData.dueAt).toISOString();
      }
      await updateAssignmentMutation.mutateAsync({
        id: selectedAssignment.id,
        payload,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: assignments.length,
    active: Math.max(0, assignments.length - 2),
    graded: 20,
    drafts: draftAssignments.size,
  };

  if (isLoading) {
    return (
      <div className="pb-10">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-100 rounded-lg w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
              <div className="h-2 bg-gray-100 rounded-full w-full"></div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-black animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium">Loading assignments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-black mb-1">Assignments</h1>
          <p className="text-[#64748B] text-base">Create and manage assignments across all classes</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-black text-white px-6 py-4 rounded-lg font-semibold text-md hover:opacity-90 flex items-center gap-2"
        >
          Create Assignment <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Assignments"
          value={stats.total}
          icon={<FileText size={24} />}
          progress={75}
          trend={{ value: "3.6k", label: "Across 3 classes", direction: "up" }}
        />
        <StatCard
          label="Active"
          value={stats.active}
          icon={<FileText size={24} />}
          progress={60}
          trend={{ value: "5", label: "2 completed", direction: "up" }}
        />
        <StatCard
          label="pending Grading"
          value={stats.graded}
          icon={<FileText size={24} />}
          progress={45}
          trend={{ value: "-12", label: "from yesterday", direction: "down" }}
        />
        <StatCard
          label="Drafts"
          value={stats.drafts}
          icon={<FileText size={24} />}
          progress={20}
          trend={{ value: "1", label: "+3 this week", direction: "up" }}
        />
      </div>

      <div className="flex items-center gap-2 mb-6">
        <AssignmentViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-[18px] font-bold text-gray-700 mb-2">No assignments yet</h3>
          <p className="text-gray-500">Create your first assignment to get started</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-6">
          {assignments.map((assignment: any) => (
            <AssignmentCard
              key={assignment.id}
              assignment={{
                id: assignment.id,
                title: assignment.title,
                class: "All Classes",
                subject: assignment.subject?.name || "N/A",
                dueDate: assignment.dueAt ? new Date(assignment.dueAt).toLocaleDateString() : "N/A",
                submitted: assignment.submissions?.length || 0,
                totalSubmissions: 26,
                graded: 0,
                totalGraded: 0,
                status: draftAssignments.has(assignment.id) ? "Draft" : "Active",
                type: assignment.type,
              }}
              originalAssignment={assignment}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={() => {}}
              onViewSubmissions={() => {}}
            />
          ))}
        </div>
      ) : (
        <AssignmentTable
          assignments={assignments.map((a: any) => ({
            id: a.id,
            title: a.title,
            class: "All Classes",
            subject: a.subject?.name || "N/A",
            dueDate: a.dueAt ? new Date(a.dueAt).toLocaleDateString() : "N/A",
            submitted: a.submissions?.length || 0,
            totalSubmissions: 26,
            graded: 0,
            totalGraded: 0,
            status: draftAssignments.has(a.id) ? "Draft" : "Active",
            type: a.type,
          }))}
          originalAssignments={assignments}
          sortField="title"
          sortDirection="asc"
          onSort={() => {}}
          onView={() => {}}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewSubmissions={() => {}}
        />
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create Assignment</h2>
            <p className="text-gray-600 mb-6">Use the form below to create a new assignment</p>
            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              className="mt-6 px-4 py-2 bg-black text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2">Edit Assignment</h2>
            <p className="text-gray-600 mb-6">Update the assignment details below</p>
            
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              {formErrors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                  {formErrors.submit}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none"
                />
                {formErrors.title && <p className="text-red-600 text-xs mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Subject *</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none"
                >
                  <option value="">Select subject</option>
                  <option value="subj-math">Mathematics</option>
                  <option value="subj-english">English</option>
                  <option value="subj-science">Science</option>
                  <option value="subj-history">History</option>
                  <option value="subj-geography">Geography</option>
                </select>
                {formErrors.subjectId && <p className="text-red-600 text-xs mt-1">{formErrors.subjectId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none"
                  >
                    <option value="HOMEWORK">Homework</option>
                    <option value="CAT">CAT</option>
                    <option value="EXAM">Exam</option>
                    <option value="PROJECT">Project</option>
                    <option value="QUIZ">Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Max Score</label>
                  <input
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Due Date *</label>
                <input
                  type="datetime-local"
                  value={formData.dueAt}
                  onChange={(e) => setFormData({ ...formData, dueAt: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none"
                />
                {formErrors.dueAt && <p className="text-red-600 text-xs mt-1">{formErrors.dueAt}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowLate"
                  checked={formData.allowLate}
                  onChange={(e) => setFormData({ ...formData, allowLate: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="allowLate" className="text-sm text-gray-700">
                  Allow late submissions
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedAssignment(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7a2 2 0 012-2h2.586a1 1 0 00.707-.293l2.414-2.414a1 1 0 00-.707-1.707H9.414a1 1 0 00-.707.293L6.293 2.293A1 1 0 005.586 2H3a2 2 0 00-2 2v2.586a1 1 0 00.293.707l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 00.293-.707V4h8v2.586a1 1 0 00.293.707l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 00.293-.707V4a2 2 0 00-2-2h-2.586a1 1 0 00-.707.293L12.707 2.293a1 1 0 00-1.414 0L8.879 4.707a1 1 0 00-.293.707V7a2 2 0 002 2h2.586a1 1 0 00.707-.293l2.414-2.414a1 1 0 00.293-.707V7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delete Assignment</h2>
            </div>
            <p className="text-gray-600 mb-2">Are you sure you want to delete this assignment?</p>
            <p className="text-gray-900 font-semibold mb-6">"{selectedAssignment.title}"</p>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedAssignment(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteAssignmentMutation.mutate(selectedAssignment.id);
                }}
                disabled={deleteAssignmentMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteAssignmentMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
