"use client";

import { useState } from "react";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/FormElements";
import { GraduationCap, BookOpen, FileText, BarChart2, Filter } from "lucide-react";
import { ViewSubmissionModal } from "@/components/ui/ViewSubmissionModal";
import { useStudentAssignments } from "@/hooks/api/useStudentAPI";

interface Assignment {
  id: string;
  subject: string;
  title: string;
  date: string;
  term: string;
  status: "Completed" | "In Progress" | "Pending" | "Late";
  grade?: string;
}

export default function AssignmentsPage() {
  const { data: realAssignmentsData, isLoading } = useStudentAssignments();

  const assignmentsData: Assignment[] = (realAssignmentsData || []).map(a => {
    let status: "Completed" | "In Progress" | "Pending" | "Late" = "Pending";
    const now = new Date();
    const dueAt = new Date(a.dueAt);
    const hasSubmission = a.submissions && a.submissions.length > 0;

    if (hasSubmission) {
      status = "Completed";
    } else if (now > dueAt) {
      status = "Late";
    } else {
      status = "Pending";
    }

    return {
      id: a.id,
      subject: a.subject?.name || "Unknown",
      title: a.title,
      date: new Date(a.dueAt).toLocaleDateString(),
      term: "Current Term",
      status,
      grade: a.submissions?.[0]?.grade?.score ? `${a.submissions?.[0]?.grade?.score}` : undefined
    };
  });

  const [titleFilter, setTitleFilter] = useState("");
  const [termFilter, setTermFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Assignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = assignmentsData.filter(assignment => {
    const matchesTitle = titleFilter === "" || assignment.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesTerm = termFilter === "" || assignment.term === termFilter;
    const matchesGrade = gradeFilter === "" || assignment.grade === gradeFilter;

    return matchesTitle && matchesTerm && matchesGrade;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const columns: Column<Assignment>[] = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={filteredData.length > 0 && selectedItems.length === filteredData.length}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300"
        />
      ),
      width: "50px",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(row.id)}
          onChange={(e) => {
            e.stopPropagation();
            handleSelectItem(row.id, e.target.checked);
          }}
          className="w-4 h-4 rounded border-gray-300"
        />
      )
    },
    {
      key: "subject",
      header: "Subject",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.subject}</div>
      )
    },
    {
      key: "title",
      header: "Title",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.title}</div>
      )
    },
    {
      key: "date",
      header: "Date",
      render: (_, row) => (
        <div className="text-gray-600">{row.date}</div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <div className={`font-medium ${row.status === "Completed" ? "text-green-600" :
          row.status === "In Progress" ? "text-blue-600" :
            row.status === "Late" ? "text-red-600" : "text-gray-600"
          }`}>
          {row.status}
        </div>
      )
    },
    {
      key: "action",
      header: "Action",
      align: "right",
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedSubmission(row);
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          View
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Assignments"
          value={assignmentsData.length.toString()}
          icon={<BookOpen size={18} />}
          progress={80}
          trend={{ value: "3.6", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Total Subjects"
          value={Array.from(new Set(assignmentsData.map(a => a.subject))).length.toString()}
          icon={<GraduationCap size={18} />}
          progress={75}
          trend={{ value: "3.6", direction: "up", label: "This month" }}
        />
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Assignment overview</h2>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter By</span>
              </div>

              <Select
                placeholder="Title"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                options={[
                  { value: "", label: "All Titles" },
                  { value: "lab", label: "Lab Reports" },
                  { value: "quiz", label: "Quizzes" },
                  { value: "essay", label: "Essays" },
                  { value: "problem", label: "Problem Sets" }
                ]}
                className="w-32"
              />

              <Select
                placeholder="Term"
                value={termFilter}
                onChange={(e) => setTermFilter(e.target.value)}
                options={[
                  { value: "", label: "All Terms" },
                  { value: "Term 1", label: "Term 1" },
                  { value: "Term 2", label: "Term 2" },
                  { value: "Term 3", label: "Term 3" }
                ]}
                className="w-32"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : (
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={filteredData as unknown as Record<string, unknown>[]}
              keyField="id"
              className="assignments-table"
              pageSize={10}
              paginationClassName="pagination-rounded"
            />
          )}
        </CardBody>
      </Card>

      <ViewSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={selectedSubmission ? {
          ...selectedSubmission,
          teacher: "Subject Teacher",
          submittedDate: selectedSubmission.status === "Completed" ? "Submitted" : undefined,
          fileName: selectedSubmission.status === "Completed" ? `${selectedSubmission.title.replace(/\s+/g, '_')}.pdf` : undefined,
          fileSize: "1.2 MB",
          comments: selectedSubmission.status === "Completed" ? "Excellent work." : undefined
        } as any : null}
      />
    </div>
  );
}
