"use client";

import { useState } from "react";
import { 
  StatCard, 
  Card, 
  CardBody, 
  DataTable, 
  Column, 
  StatusBadge,
  SearchInput,
  Select
} from "@/components/ui";
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Filter,
  FileText
} from "lucide-react";
import { ViewSubmissionModal } from "@/components/ui/ViewSubmissionModal";

// Project interface matching the portal's needs
interface Project {
  id: string;
  title: string;
  subject: string;
  mentor: string;
  deadline: string;
  status: "Completed" | "In Progress" | "Pending" | "Late";
  progress: number;
  description: string;
}

// Mock project data
const projectsData: Project[] = [
  {
    id: "1",
    title: "Eco-Friendly School Garden",
    subject: "Environmental Science",
    mentor: "Dr. Sarah Wilson",
    deadline: "20-Dec-2025",
    status: "In Progress",
    progress: 65,
    description: "Designing and implementing a sustainable garden in the school backyard using organic composting and native plant species."
  },
  {
    id: "2",
    title: "Robotics: Autonomous Maze Solver",
    subject: "Computer Science",
    mentor: "Prof. Alex Kumar",
    deadline: "15-Nov-2025",
    status: "Completed",
    progress: 100,
    description: "Building and programming a robot that can navigate and solve any rectangular maze using ultrasonic sensors and Dijkstra's algorithm."
  },
  {
    id: "3",
    title: "Modern Rwandan History Analysis",
    subject: "History",
    mentor: "Mr. Mujesha Jean",
    deadline: "05-Jan-2026",
    status: "Pending",
    progress: 0,
    description: "A comprehensive research paper analyzing the socio-economic transformations in Rwanda over the last three decades."
  },
  {
    id: "4",
    title: "Quantum Mechanics Simulation",
    subject: "Physics",
    mentor: "Dr. Anais Kamal",
    deadline: "10-Nov-2025",
    status: "Late",
    progress: 40,
    description: "Developing a Python-based simulation to visualize electron probability density in hydrogen-like atoms."
  },
  {
    id: "5",
    title: "Chemistry: Bio-plastic Synthesis",
    subject: "Chemistry",
    mentor: "Dr. Robert Johnson",
    deadline: "25-Dec-2025",
    status: "In Progress",
    progress: 25,
    description: "Experimenting with different starch-based materials to create a biodegradable alternative to single-use plastics."
  },
  {
    id: "6",
    title: "English: Shakespearean Modernization",
    subject: "English",
    mentor: "Mrs. Emily Clark",
    deadline: "12-Dec-2025",
    status: "Completed",
    progress: 100,
    description: "Adapting 'Hamlet' into a modern-day corporate drama script while maintaining the original themes and motifs."
  }
];

// Stats calculation
const stats = [
  {
    label: "Total Projects",
    value: projectsData.length.toString(),
    icon: <FolderKanban size={18} />,
    progress: 100,
    trend: { value: "12", direction: "up" as const, label: "vs last term" }
  },
  {
    label: "Completed",
    value: projectsData.filter(p => p.status === "Completed").length.toString(),
    icon: <CheckCircle2 size={18} className="text-green-500" />,
    progress: Math.round((projectsData.filter(p => p.status === "Completed").length / projectsData.length) * 100),
    trend: { value: "5", direction: "up" as const, label: "this month" }
  },
  {
    label: "In Progress",
    value: projectsData.filter(p => p.status === "In Progress").length.toString(),
    icon: <Clock size={18} className="text-blue-500" />,
    progress: Math.round((projectsData.filter(p => p.status === "In Progress").length / projectsData.length) * 100),
  },
  {
    label: "Pending/Late",
    value: projectsData.filter(p => p.status === "Pending" || p.status === "Late").length.toString(),
    icon: <AlertCircle size={18} className="text-orange-500" />,
    progress: Math.round((projectsData.filter(p => p.status === "Pending" || p.status === "Late").length / projectsData.length) * 100),
  }
];

export default function StudentProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter logic
  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "" || project.status === statusFilter;
    const matchesSubject = subjectFilter === "" || project.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const subjects = Array.from(new Set(projectsData.map(p => p.subject)));

  const columns: Column<Project>[] = [
    {
      key: "title",
      header: "Project Title",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black/5 rounded-lg flex items-center justify-center text-black">
            <FileText size={16} />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.title}</div>
            <div className="text-xs text-gray-500 truncate max-w-[250px]">{row.description}</div>
          </div>
        </div>
      )
    },
    {
      key: "subject",
      header: "Subject",
      render: (_, row) => (
        <div className="text-gray-600">{row.subject}</div>
      )
    },
    {
      key: "mentor",
      header: "Mentor",
      render: (_, row) => (
        <div className="text-gray-600">{row.mentor}</div>
      )
    },
    {
      key: "deadline",
      header: "Deadline",
      render: (_, row) => (
        <div className="text-gray-600">{row.deadline}</div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <StatusBadge status={row.status} />
      )
    },
    {
      key: "action",
      header: "Action",
      align: "right",
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedProject(row);
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
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
        <h1 className="text-2xl font-bold text-gray-900">Academic Projects</h1>
        <p className="text-gray-500 text-sm">Manage your long-term projects and research assignments.</p>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            progress={stat.progress}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Projects Table Card */}
      <Card>
        <CardBody className="p-6">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="w-full md:w-96">
              <SearchInput
                placeholder="Search projects by title or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-500 mr-2">
                <Filter size={16} />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              
              <Select
                placeholder="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "Completed", label: "Completed" },
                  { value: "In Progress", label: "In Progress" },
                  { value: "Pending", label: "Pending" },
                  { value: "Late", label: "Late" }
                ]}
                className="w-36"
              />
              
              <Select
                placeholder="Subject"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                options={[
                  { value: "", label: "All Subjects" },
                  ...subjects.map(s => ({ value: s, label: s }))
                ]}
                className="w-44"
              />
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns as any}
            data={filteredProjects as any}
            keyField="id"
            className="projects-table"
            pageSize={5}
            paginationClassName="pagination-rounded"
          />
        </CardBody>
      </Card>

      {/* Project Detail Modal - Reusing ViewSubmissionModal for consistency */}
      <ViewSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={selectedProject ? {
          id: selectedProject.id,
          title: selectedProject.title,
          subject: selectedProject.subject,
          teacher: selectedProject.mentor,
          status: selectedProject.status === "Completed" ? "Submitted" : 
                  selectedProject.status === "Late" ? "Late" : "Pending",
          dueDate: selectedProject.deadline,
          submittedDate: selectedProject.status === "Completed" ? "12-Nov-2025, 02:30 PM" : undefined,
          fileName: selectedProject.status === "Completed" ? `${selectedProject.title.replace(/\s+/g, '_')}_Final_Report.pdf` : undefined,
          fileSize: "2.4 MB",
          comments: selectedProject.status === "Completed" ? "Great progress on your project. The methodology section is particularly strong." : "Please ensure you update your progress regularly."
        } as any : null}
      />
    </div>
  );
}