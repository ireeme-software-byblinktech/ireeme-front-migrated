"use client";

import { useState } from "react";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui";
import { DataTable, Column, Pagination } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/FormElements";
import { GraduationCap, BookOpen, FileText, BarChart2, Filter } from "lucide-react";
import { ViewSubmissionModal } from "@/components/ui/ViewSubmissionModal";

// Stats data array
const statsData = [
  {
    label: "Total Subjects",
    value: 15,
    icon: <GraduationCap size={18} />,
    progress: 75,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Assignments",
    value: 30,
    icon: <BookOpen size={18} />,
    progress: 80,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Notes",
    value: 30,
    icon: <FileText size={18} />,
    progress: 65,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  },
  {
    label: "Total Reports",
    value: 30,
    icon: <BarChart2 size={18} />,
    progress: 90,
    trend: { value: "3.6", direction: "up" as const, label: "This month" }
  }
];

// Assignment data
interface Assignment {
  id: string;
  subject: string;
  title: string;
  date: string;
  term: string;
  status: "Completed" | "In Progress" | "Pending" | "Late";
  grade?: string;
}

const assignmentsData: Assignment[] = [
  {
    id: "1",
    subject: "Mathematics",
    title: "Algebra Problem Set 1",
    date: "10-Nov-2025",
    term: "Term 1",
    status: "Completed",
    grade: "A"
  },
  {
    id: "2",
    subject: "Mathematics",
    title: "Geometry Assignment",
    date: "10-Nov-2025",
    term: "Term 1",
    status: "Completed",
    grade: "B+"
  },
  {
    id: "3",
    subject: "Physics",
    title: "Lab Report: Motion",
    date: "12-Nov-2025",
    term: "Term 1",
    status: "In Progress"
  },
  {
    id: "4",
    subject: "Chemistry",
    title: "Chemical Reactions Essay",
    date: "15-Nov-2025",
    term: "Term 1",
    status: "Pending"
  },
  {
    id: "5",
    subject: "English",
    title: "Literature Analysis",
    date: "08-Nov-2025",
    term: "Term 1",
    status: "Late"
  },
  {
    id: "6",
    subject: "History",
    title: "World War II Research",
    date: "20-Nov-2025",
    term: "Term 1",
    status: "Completed",
    grade: "A-"
  },
  {
    id: "7",
    subject: "Biology",
    title: "Cell Structure Diagram",
    date: "18-Nov-2025",
    term: "Term 1",
    status: "In Progress"
  },
  {
    id: "8",
    subject: "Mathematics",
    title: "Calculus Problem Set",
    date: "25-Nov-2025",
    term: "Term 1",
    status: "Pending"
  },
  {
    id: "9",
    subject: "Physics",
    title: "Energy Conservation Lab",
    date: "22-Nov-2025",
    term: "Term 1",
    status: "Completed",
    grade: "A+"
  },
  {
    id: "10",
    subject: "Chemistry",
    title: "Periodic Table Quiz",
    date: "14-Nov-2025",
    term: "Term 1",
    status: "Completed",
    grade: "B"
  },
  {
    id: "11",
    subject: "English",
    title: "Poetry Interpretation",
    date: "28-Nov-2025",
    term: "Term 1",
    status: "Pending"
  },
  {
    id: "12",
    subject: "History",
    title: "Ancient Civilizations Essay",
    date: "30-Nov-2025",
    term: "Term 1",
    status: "Pending"
  },
  {
    id: "13",
    subject: "Biology",
    title: "Genetics Problem Set",
    date: "16-Nov-2025",
    term: "Term 1",
    status: "In Progress"
  },
  {
    id: "14",
    subject: "Mathematics",
    title: "Statistics Assignment",
    date: "05-Dec-2025",
    term: "Term 1",
    status: "Pending"
  },
  {
    id: "15",
    subject: "Physics",
    title: "Waves and Sound Lab",
    date: "03-Dec-2025",
    term: "Term 1",
    status: "Pending"
  }
];

export default function AssignmentsPage() {
  const [titleFilter, setTitleFilter] = useState("");
  const [termFilter, setTermFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Assignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter data based on filters
  const filteredData = assignmentsData.filter(assignment => {
    const matchesTitle = titleFilter === "" || assignment.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesTerm = termFilter === "" || assignment.term === termFilter;
    const matchesGrade = gradeFilter === "" || assignment.grade === gradeFilter;

    return matchesTitle && matchesTerm && matchesGrade;
  });

  // Handle checkbox selection
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
      key: "date",
      header: "Date",
      render: (_, row) => (
        <div className="text-gray-600">{row.date}</div>
      )
    },
    {
      key: "term",
      header: "Term",
      render: (_, row) => (
        <div className="text-gray-600">{row.term}</div>
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
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value.toString()}
            icon={stat.icon}
            progress={stat.progress}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Assignment Overview Section */}
      <Card>
        <CardBody>
          {/* Header and Filters on same row */}
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

              <Select
                placeholder="Grade"
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                options={[
                  { value: "", label: "All Grades" },
                  { value: "A+", label: "A+" },
                  { value: "A", label: "A" },
                  { value: "A-", label: "A-" },
                  { value: "B+", label: "B+" },
                  { value: "B", label: "B" },
                  { value: "B-", label: "B-" }
                ]}
                className="w-32"
              />
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            data={filteredData as unknown as Record<string, unknown>[]}
            keyField="id"
            className="assignments-table"
            pageSize={10}
            paginationClassName="pagination-rounded"
          />
        </CardBody>
      </Card>

      <ViewSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={selectedSubmission ? {
          ...selectedSubmission,
          teacher: "Dr. Anais Kamal", 
          submittedDate: "Today, 10:45 AM", 
          fileName: selectedSubmission.status === "Completed" ? `${selectedSubmission.title.replace(/\s+/g, '_')}.pdf` : undefined,
          fileSize: "1.2 MB",
          comments: selectedSubmission.status === "Completed" ? "Excellent work on this assignment. Your methodology is clear and well-documented." : undefined
        } : null}
      />
    </div>
  );
}


