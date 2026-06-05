"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StatCard } from "@/components/ui";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";

import {
  AssignmentCard,
  AssignmentFilters,
  AssignmentSearchBar,
  AssignmentTabs,
  AssignmentViewToggle,
  AssignmentTable,
  AssignmentPagination,
  CreateAssignmentModal,
  EditAssignmentModal,
  ViewAssignmentModal,
  DeleteConfirmationModal,
  SubmissionsModal,
  Assignment,
  TransformedAssignment,
  CreateAssignmentInput,
  FormData,
  Question,
  Subject,
  AssignmentVariant,
  ViewMode,
  SortField,
  SortDirection,
  FilterState,
  AssignmentStats,
  MOCK_SUBJECTS,
} from "@/components/teacher/assignments";

type AssignmentResponse = Assignment[];

export default function TeacherAssignmentsPage() {
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Tab and view states
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formData, setFormData] = useState<FormData>({
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

  // Assignment variant and questions
  const [assignmentVariant, setAssignmentVariant] = useState<AssignmentVariant>("MCQ");
  const [questions, setQuestions] = useState<Question[]>([]);

  // Selected assignments
  const [selectedAssignmentForView, setSelectedAssignmentForView] = useState<Assignment | null>(null);
  const [selectedAssignmentForEdit, setSelectedAssignmentForEdit] = useState<Assignment | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Draft assignments tracking
  const [draftAssignments, setDraftAssignments] = useState<Set<string>>(new Set());

  // Load draft assignments from localStorage
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

  // Save draft assignments to localStorage
  const saveDraftToStorage = (assignmentId: string) => {
    const updated = new Set(draftAssignments);
    updated.add(assignmentId);
    setDraftAssignments(updated);
    localStorage.setItem("draftAssignments", JSON.stringify(Array.from(updated)));
  };

  // Fetch assignments from API
  const queryClient = useQueryClient();

  const { data: assignmentsData, isLoading } = useQuery<AssignmentResponse>({
    queryKey: ["assignments"],
    queryFn: async () => {
      const response = await apiClient("/assignments");
      return response as AssignmentResponse;
    },
    staleTime: 1000 * 60 * 5,
  });

  const assignments = assignmentsData || [];

  // Create assignment mutation
  const createAssignmentMutation = useMutation({
    mutationFn: async (data: CreateAssignmentInput) => {
      const response = await apiClient("/assignments", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data: any) => {
      if (!data.dueAt) {
        saveDraftToStorage(data.id);
      }
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

  // Delete assignment mutation
  const deleteAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      const response = await apiClient(`/assignments/${assignmentId}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
        refetchType: "all",
      });
      setSelectedAssignmentForView(null);
      setIsViewModalOpen(false);
      setIsDeleteConfirmOpen(false);
    },
    onError: (error: any) => {
      alert(`Failed to delete assignment: ${error.message}`);
    },
  });

  // Update assignment mutation
  const updateAssignmentMutation = useMutation({
    mutationFn: async (data: { id: string; payload: CreateAssignmentInput }) => {
      const response = await apiClient(`/assignments/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.payload),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
        refetchType: "all",
      });
      setIsEditModalOpen(false);
      setSelectedAssignmentForEdit(null);
      resetForm();
    },
    onError: (error: any) => {
      setFormErrors({ submit: error.message || "Failed to update assignment" });
    },
  });

  // Form handlers
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
    setAssignmentVariant("MCQ");
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.subjectId) errors.subjectId = "Subject is required";
    if (!formData.dueAt) errors.dueAt = "Due date is required";
    if (formData.maxScore <= 0) errors.maxScore = "Max score must be greater than 0";
    if (formData.weight <= 0) errors.weight = "Weight must be greater than 0";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignmentForView(assignment);
    setIsViewModalOpen(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignmentForEdit(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description || "",
      subjectId: assignment.subjectId || "",
      type: assignment.type,
      maxScore: assignment.maxScore,
      weight: assignment.weight || 1,
      dueAt: assignment.dueAt
        ? new Date(assignment.dueAt).toISOString().slice(0, 16)
        : "",
      allowLate: assignment.allowLate || false,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    setAssignmentToDelete(assignment || null);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (assignmentToDelete) {
      deleteAssignmentMutation.mutate(assignmentToDelete.id);
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
        const dueAtDate = new Date(formData.dueAt);
        payload.dueAt = dueAtDate.toISOString();
      }

      await updateAssignmentMutation.mutateAsync({
        id: selectedAssignmentForEdit!.id,
        payload,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent, isDraft: boolean = false) => {
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
        const dueAtDate = new Date(formData.dueAt);
        payload.dueAt = dueAtDate.toISOString();
      }

      await createAssignmentMutation.mutateAsync(payload as CreateAssignmentInput);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Question handlers
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: "",
      type: assignmentVariant,
      options:
        assignmentVariant === "MCQ"
          ? [
              { id: "A", value: "", isCorrect: true },
              { id: "B", value: "", isCorrect: false },
              { id: "C", value: "", isCorrect: false },
              { id: "D", value: "", isCorrect: false },
            ]
          : undefined,
    };
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
            options: q.options.map((o) => (o.id === optionId ? { ...o, value } : o)),
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
            options: q.options.map((o) => ({ ...o, isCorrect: o.id === optionId })),
          };
        }
        return q;
      })
    );
  };

  // Transform API data to match UI format
  const transformedAssignments = assignments.map((a) => {
    const submitted = (a.submissions || []).filter(
      (s) => s.status === "SUBMITTED" || s.status === "LATE"
    ).length;
    const graded = (a.submissions || []).filter((s) => s.status === "GRADED").length;

    const isDraft = draftAssignments.has(a.id);

    let status: "Active" | "Graded" | "Draft" = "Active";
    if (isDraft) {
      status = "Draft";
    } else {
      const dueDate = new Date(a.dueAt);
      const now = new Date();
      status = dueDate < now ? "Graded" : "Active";
    }

    const dueDate = new Date(a.dueAt);

    return {
      id: a.id,
      title: a.title,
      class: "Class",
      subject: a.subject.name,
      dueDate: dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      submitted,
      totalSubmissions: (a.submissions || []).length,
      graded,
      totalGraded: submitted,
      status,
      type: a.type,
    } as TransformedAssignment;
  });

  // Filter assignments
  const filteredAssignments =
    activeTab === "All"
      ? transformedAssignments
      : transformedAssignments.filter((a) => a.status === activeTab);

  let processedAssignments = filteredAssignments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedFilters.type && selectedFilters.type.length > 0) {
    processedAssignments = processedAssignments.filter((a) =>
      selectedFilters.type!.includes(a.type)
    );
  }

  if (selectedFilters.status && selectedFilters.status.length > 0) {
    processedAssignments = processedAssignments.filter((a) =>
      selectedFilters.status!.includes(a.status)
    );
  }

  if (selectedFilters.subject && selectedFilters.subject.length > 0) {
    processedAssignments = processedAssignments.filter((a) =>
      selectedFilters.subject!.includes(a.subject)
    );
  }

  // Apply sorting
  processedAssignments = [...processedAssignments].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === "dueDate") {
      aVal = new Date(a.dueDate).getTime();
      bVal = new Date(b.dueDate).getTime();
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Apply pagination
  const totalPages = Math.ceil(processedAssignments.length / pageSize);
  const paginatedAssignments = processedAssignments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate stats
  const stats: AssignmentStats = {
    total: transformedAssignments.length,
    active: transformedAssignments.filter((a) => a.status === "Active").length,
    graded: transformedAssignments.filter((a) => a.status === "Graded").length,
    drafts: transformedAssignments.filter((a) => a.status === "Draft").length,
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
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Header */}
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

      {/* Stats Grid */}
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
          value="20"
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

      {/* Search and Filter Bar */}
      <AssignmentSearchBar
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery(query);
          setCurrentPage(1);
        }}
        onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
        selectedFilters={selectedFilters}
      />

      {/* Filter Panel */}
      <AssignmentFilters
        isOpen={isFilterOpen}
        selectedFilters={selectedFilters}
        subjects={MOCK_SUBJECTS}
        onFilterChange={setSelectedFilters}
        onClearAll={() => {
          setSelectedFilters({});
          setCurrentPage(1);
        }}
        onApply={() => setIsFilterOpen(false)}
      />

      {/* Tabs Layout with View Toggle */}
      <div className="flex items-center justify-start gap-4 mb-6">
        <AssignmentTabs
          activeTab={activeTab}
          stats={stats}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentPage(1);
          }}
        />

        <div className="ml-auto">
          <AssignmentViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      {/* Assignments List */}
      {viewMode === "grid" ? (
        <div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {paginatedAssignments.length > 0 ? (
              paginatedAssignments.map((a) => {
                const original = assignments.find((x) => x.id === a.id);
                return (
                  <AssignmentCard
                    key={a.id}
                    assignment={a}
                    originalAssignment={original!}
                    onView={handleViewAssignment}
                    onEdit={handleEditAssignment}
                    onDelete={handleDeleteAssignment}
                    onViewSubmissions={(assignment) => {
                      setSelectedAssignment(assignment);
                      setIsSubmissionsModalOpen(true);
                    }}
                  />
                );
              })
            ) : (
              <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-12 text-center">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-[18px] font-bold text-gray-700 mb-2">No assignments yet</h3>
                <p className="text-gray-500 mb-6">Create your first assignment to get started</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-black text-white px-6 py-2 rounded-lg text-[14px] font-bold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <Plus size={16} /> Create Assignment
                </button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {paginatedAssignments.length > 0 && totalPages > 1 && (
            <AssignmentPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={processedAssignments.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      ) : (
        <div>
          <AssignmentTable
            assignments={paginatedAssignments}
            originalAssignments={assignments}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={(field) => {
              if (sortField === field) {
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
              } else {
                setSortField(field);
                setSortDirection("asc");
              }
            }}
            onView={handleViewAssignment}
            onEdit={handleEditAssignment}
            onDelete={handleDeleteAssignment}
            onViewSubmissions={(assignment) => {
              setSelectedAssignment(assignment);
              setIsSubmissionsModalOpen(true);
            }}
          />

          {/* Pagination Controls */}
          {paginatedAssignments.length > 0 && totalPages > 1 && (
            <AssignmentPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={processedAssignments.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}

      {/* Modals */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        formData={formData}
        formErrors={formErrors}
        subjects={MOCK_SUBJECTS}
        assignmentVariant={assignmentVariant}
        questions={questions}
        isSubmitting={isSubmitting}
        onFormChange={(data) => setFormData({ ...formData, ...data })}
        onVariantChange={setAssignmentVariant}
        onAddQuestion={addQuestion}
        onRemoveQuestion={removeQuestion}
        onUpdateQuestionText={updateQuestionText}
        onUpdateQuestionOption={updateQuestionOption}
        onSetCorrectOption={setQuestionCorrectOption}
        onSubmit={handleSubmitForm}
      />

      <EditAssignmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAssignmentForEdit(null);
          resetForm();
        }}
        formData={formData}
        formErrors={formErrors}
        subjects={MOCK_SUBJECTS}
        assignmentVariant={assignmentVariant}
        questions={questions}
        isSubmitting={isSubmitting}
        onFormChange={(data) => setFormData({ ...formData, ...data })}
        onVariantChange={setAssignmentVariant}
        onAddQuestion={addQuestion}
        onRemoveQuestion={removeQuestion}
        onUpdateQuestionText={updateQuestionText}
        onUpdateQuestionOption={updateQuestionOption}
        onSetCorrectOption={setQuestionCorrectOption}
        onSubmit={handleSubmitEdit}
      />

      <ViewAssignmentModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedAssignmentForView(null);
        }}
        assignment={selectedAssignmentForView}
        onEdit={handleEditAssignment}
        onDelete={handleDeleteAssignment}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        assignmentTitle={assignmentToDelete?.title}
        isLoading={deleteAssignmentMutation.isPending}
      />

      <SubmissionsModal
        isOpen={isSubmissionsModalOpen}
        onClose={() => setIsSubmissionsModalOpen(false)}
        assignmentTitle={selectedAssignment?.title}
      />
    </div>
  );
}

