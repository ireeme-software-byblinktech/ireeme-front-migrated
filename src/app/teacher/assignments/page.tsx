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
  SubmissionsModal,
} from "@/components/teacher/assignments";

export default function TeacherAssignmentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    classId: "", // NEW: Class selection
    type: "HOMEWORK",
    maxScore: 100,
    weight: 1,
    dueAt: "",
    allowLate: false,
    externalLink: "",
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftAssignments, setDraftAssignments] = useState<Set<string>>(new Set());

  // Question handlers
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: "MULTIPLE_CHOICE",
        text: "",
        order: questions.length + 1,
        marks: 1,
        options: [],
        correctAnswer: "",
        rubric: "",
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, updatedQuestion: any) => {
    const updated = [...questions];
    updated[index] = updatedQuestion;
    setQuestions(updated);
  };

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

  // Fetch teacher's classes
  const { data: classesData, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/teachers/classes/assigned");
      return response as { classes: Array<{ id: string; name: string }> };
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch teacher's subjects
  const { data: subjectsData, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["teacher-subjects"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/teachers/subjects/taught");
      return response as { subjects: Array<{ id: string; name: string; code: string }> };
    },
    staleTime: 1000 * 60 * 5,
  });

  const assignments = Array.isArray(assignmentsData) ? assignmentsData : [];
  const teacherClasses = classesData?.classes || [];
  const teacherSubjects = subjectsData?.subjects || [];

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
      classId: "",
      type: "HOMEWORK",
      maxScore: 100,
      weight: 1,
      dueAt: "",
      allowLate: false,
      externalLink: "",
    });
    setQuestions([]);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.subjectId) errors.subjectId = "Subject is required";
    if (!formData.classId) errors.classId = "Class is required"; // NEW: Class is mandatory
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
      classId: assignment.classId || "",
      type: assignment.type,
      maxScore: assignment.maxScore,
      weight: assignment.weight || 1,
      dueAt: assignment.dueAt ? new Date(assignment.dueAt).toISOString().slice(0, 16) : "",
      allowLate: assignment.allowLate || false,
      externalLink: assignment.externalLink || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    setSelectedAssignment(assignment);
    setIsDeleteModalOpen(true);
  };

  const handleViewAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsViewModalOpen(true);
  };

  const handleViewSubmissions = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsSubmissionsModalOpen(true);
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
              onView={handleViewAssignment}
              onViewSubmissions={handleViewSubmissions}
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
          onView={handleViewAssignment}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewSubmissions={handleViewSubmissions}
        />
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto mr-20">
            <h2 className="text-2xl font-bold mb-2">Create Assignment</h2>
            <p className="text-gray-600 mb-6">Create a new assignment with questions or an external link</p>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!validateForm()) return;
              setIsSubmitting(true);
              try {
                const payload: any = {
                  title: formData.title,
                  description: formData.description || undefined,
                  subjectId: formData.subjectId,
                  classId: formData.classId, // NEW: Now mandatory
                  type: formData.type.toUpperCase(),
                  maxScore: formData.maxScore,
                  weight: formData.weight,
                  allowLate: formData.allowLate,
                };
                if (formData.dueAt) {
                  payload.dueAt = new Date(formData.dueAt).toISOString();
                }
                if (formData.externalLink) {
                  payload.externalLink = formData.externalLink;
                }
                if (questions.length > 0) {
                  payload.questions = questions;
                }
                await createAssignmentMutation.mutateAsync(payload);
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-6">
              {formErrors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                  {formErrors.submit}
                </div>
              )}
              
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none"
                  placeholder="e.g., Algebraic Equations Assignment"
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
                  {isLoadingSubjects ? (
                    <option disabled>Loading subjects...</option>
                  ) : (
                    teacherSubjects.map(subj => (
                      <option key={subj.id} value={subj.id}>
                        {subj.name}
                      </option>
                    ))
                  )}
                </select>
                {formErrors.subjectId && <p className="text-red-600 text-xs mt-1">{formErrors.subjectId}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Class *</label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none"
                >
                  <option value="">Select class</option>
                  {isLoadingClasses ? (
                    <option disabled>Loading classes...</option>
                  ) : (
                    teacherClasses.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))
                  )}
                </select>
                {formErrors.classId && <p className="text-red-600 text-xs mt-1">{formErrors.classId}</p>}
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
                  placeholder="Add assignment instructions or details..."
                />
              </div>

              {/* External Link Option */}
              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-gray-900 mb-3">Assignment Source</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="internal"
                      name="source"
                      checked={!formData.externalLink}
                      onChange={() => setFormData({ ...formData, externalLink: '' })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="internal" className="text-sm text-gray-700">Create questions in this system</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="external"
                      name="source"
                      checked={!!formData.externalLink}
                      onChange={() => setFormData({ ...formData, externalLink: 'https://' })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="external" className="text-sm text-gray-700">Use external link (Google Forms, etc.)</label>
                  </div>
                </div>

                {formData.externalLink && (
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-gray-900 mb-2">External Link *</label>
                    <input
                      type="url"
                      value={formData.externalLink}
                      onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none"
                      placeholder="https://forms.google.com/..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste Google Forms, Docs, or any assignment link</p>
                  </div>
                )}
              </div>

              {/* Questions Builder - Only show if internal assignment */}
              {!formData.externalLink && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-bold text-gray-900">Questions</label>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      + Add Question
                    </button>
                  </div>

                  {questions.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No questions yet. Add one to get started.</p>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((q, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-sm font-semibold text-gray-900">Question {idx + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeQuestion(idx)}
                              className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-bold text-gray-600 uppercase">Type</label>
                              <select
                                value={q.type}
                                onChange={(e) => updateQuestion(idx, { ...q, type: e.target.value as any })}
                                className="w-full mt-1 px-3 py-2 rounded border border-gray-300 text-sm"
                              >
                                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                <option value="OPEN_ENDED">Open Ended</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-xs font-bold text-gray-600 uppercase">Question Text</label>
                              <textarea
                                value={q.text}
                                onChange={(e) => updateQuestion(idx, { ...q, text: e.target.value })}
                                rows={2}
                                className="w-full mt-1 px-3 py-2 rounded border border-gray-300 text-sm"
                                placeholder="Enter the question..."
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-bold text-gray-600 uppercase">Marks</label>
                                <input
                                  type="number"
                                  value={q.marks}
                                  onChange={(e) => updateQuestion(idx, { ...q, marks: parseFloat(e.target.value) })}
                                  className="w-full mt-1 px-3 py-2 rounded border border-gray-300 text-sm"
                                  step="0.5"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-gray-600 uppercase">Order</label>
                                <input
                                  type="number"
                                  value={q.order}
                                  onChange={(e) => updateQuestion(idx, { ...q, order: parseInt(e.target.value) })}
                                  className="w-full mt-1 px-3 py-2 rounded border border-gray-300 text-sm"
                                />
                              </div>
                            </div>

                            {q.type === 'MULTIPLE_CHOICE' && (
                              <>
                                <div>
                                  <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Options</label>
                                  <div className="space-y-2">
                                    {q.options && q.options.length > 0 ? (
                                      q.options.map((option: string, optIdx: number) => (
                                        <div key={optIdx} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                                          <input
                                            type="radio"
                                            id={`correct-${idx}-${optIdx}`}
                                            name={`correct-answer-${idx}`}
                                            value={optIdx.toString()}
                                            checked={q.correctAnswer === optIdx.toString()}
                                            onChange={(e) => updateQuestion(idx, { ...q, correctAnswer: e.target.value })}
                                            className="w-4 h-4"
                                          />
                                          <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => {
                                              const newOptions = [...q.options];
                                              newOptions[optIdx] = e.target.value;
                                              updateQuestion(idx, { ...q, options: newOptions });
                                            }}
                                            className="flex-1 px-2 py-1 text-sm rounded border border-gray-200"
                                            placeholder={`Option ${optIdx + 1}`}
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newOptions = q.options.filter((_: string, i: number) => i !== optIdx);
                                              updateQuestion(idx, { ...q, options: newOptions });
                                            }}
                                            className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-xs text-gray-500">No options yet</p>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => updateQuestion(idx, { ...q, options: [...(q.options || []), ''] })}
                                    className="text-xs mt-2 px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                  >
                                    + Add Option
                                  </button>
                                </div>
                              </>
                            )}

                            {q.type === 'OPEN_ENDED' && (
                              <div>
                                <label className="text-xs font-bold text-gray-600 uppercase">Grading Rubric</label>
                                <textarea
                                  value={q.rubric || ''}
                                  onChange={(e) => updateQuestion(idx, { ...q, rubric: e.target.value })}
                                  rows={2}
                                  className="w-full mt-1 px-3 py-2 rounded border border-gray-300 text-sm"
                                  placeholder="Describe what a good answer should include..."
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
                    setIsCreateModalOpen(false);
                    resetForm();
                    setQuestions([]);
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
                  {isSubmitting ? "Creating..." : "Create Assignment"}
                </button>
              </div>
            </form>
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

      {/* View Assignment Modal */}
      {isViewModalOpen && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedAssignment.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedAssignment.subject?.name || "N/A"}</p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Assignment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Type</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedAssignment.type}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Max Score</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedAssignment.maxScore}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Due Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedAssignment.dueAt ? new Date(selectedAssignment.dueAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Submissions</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedAssignment.submissions?.length || 0} / 26
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedAssignment.description && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Description</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedAssignment.description}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">Pending Grading</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {(selectedAssignment.submissions?.filter((s: any) => !s.grade) || []).length}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium">Graded</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {(selectedAssignment.submissions?.filter((s: any) => s.grade) || []).length}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleViewSubmissions(selectedAssignment);
                  }}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  View Submissions & Grade
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {selectedAssignment && (
        <SubmissionsModal
          isOpen={isSubmissionsModalOpen}
          onClose={() => setIsSubmissionsModalOpen(false)}
          assignmentTitle={selectedAssignment.title}
          assignmentId={selectedAssignment.id}
          maxScore={selectedAssignment.maxScore}
          submissions={selectedAssignment.submissions || []}
        />
      )}
    </div>
  );
}
