"use client";

import { useState } from "react";
import { StatCard, Card, CardBody } from "@/components/ui/Card";
import { DataTable, Column, Pagination } from "@/components/ui/DataTable";
import { SearchInput, Select } from "@/components/ui/FormElements";
import { GraduationCap, BookOpen, FileText, BarChart2, FolderOpen, ChevronRight } from "lucide-react";

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

// Notes data
interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  teacher: string;
  date: string;
}

const notesData: Note[] = [
  {
    id: "1",
    title: "Introduction to Calculus - Derivatives",
    description: "Derivatives and integrals are fundamental concepts in...",
    subject: "Mathematics",
    teacher: "Prof. Johnson",
    date: "Nov 20"
  },
  {
    id: "2",
    title: "Newton's Laws of Motion",
    description: "Newton's three laws form the foundation of classical me...",
    subject: "Physics", 
    teacher: "Dr. Smith",
    date: "Nov 19"
  },
  {
    id: "3",
    title: "Chemical Bonding and Molecular Struct...",
    description: "Chemical bonds are forces that hold atoms together in...",
    subject: "Chemistry",
    teacher: "Prof. Williams",
    date: "Nov 18"
  },
  {
    id: "4",
    title: "World War II - Major Events and Impact",
    description: "World War II was a global conflict that lasted from...",
    subject: "History",
    teacher: "Mr. Brown",
    date: "Nov 17"
  },
  {
    id: "5",
    title: "Photosynthesis Process",
    description: "Photosynthesis is the process by which plants convert...",
    subject: "Biology",
    teacher: "Dr. Davis",
    date: "Nov 16"
  },
  {
    id: "6",
    title: "Shakespeare's Literary Techniques",
    description: "William Shakespeare employed various literary devices...",
    subject: "English",
    teacher: "Ms. Wilson",
    date: "Nov 15"
  }
];

export default function StudentNotesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAll, setFilterAll] = useState("All");
  
  const itemsPerPage = 10;

  // Filter data based on search
  const filteredData = notesData.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<Note>[] = [
    {
      key: "title",
      header: "NOTES TITLE",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
            <FolderOpen size={16} className="text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm">{row.title}</div>
            <div className="text-xs text-gray-500 mt-1">{row.description}</div>
          </div>
        </div>
      )
    },
    {
      key: "subject",
      header: "SUBJECT",
      render: (_, row) => (
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
          {row.subject}
        </span>
      )
    },
    {
      key: "teacher",
      header: "TEACHER",
      render: (_, row) => (
        <div className="text-sm text-gray-600">{row.teacher}</div>
      )
    },
    {
      key: "date",
      header: "DATE",
      render: (_, row) => (
        <div className="text-sm text-gray-600">{row.date}</div>
      )
    },
    {
      key: "actions",
      header: "ACTIONS",
      align: "right",
      render: () => (
        <button className="text-gray-400 hover:text-gray-600 p-2">
          <ChevronRight size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Notes</h1>
        <p className="text-sm text-gray-500">All your class notes organized in one place</p>
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

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          placeholder="Search notes by title, content, or teacher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          containerClassName="flex-1 max-w-md"
        />
        
        <Select
          value={filterAll}
          onChange={(e) => setFilterAll(e.target.value)}
          options={[
            { value: "All", label: "All" },
            { value: "Recent", label: "Recent" },
            { value: "Favorites", label: "Favorites" }
          ]}
          className="w-32"
        />
      </div>

      {/* Notes Table */}
      <Card>
        <CardBody>
          {/* Table */}
          <div className="mb-6">
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={paginatedData as unknown as Record<string, unknown>[]}
              keyField="id"
              className="assignments-table"
            />
          </div>

          {/* Centered Pagination */}
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredData.length}
              pageSize={itemsPerPage}
              className="pagination-rounded"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}