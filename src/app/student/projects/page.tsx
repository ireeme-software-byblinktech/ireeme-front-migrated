"use client";

import { useState, useMemo } from "react";
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
import { useStudentAssignments, useStudentProfile, useStudentDashboard } from "@/hooks/api/useStudentAPI";
import { formatDate } from "@/lib/utils";

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

export default function StudentProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: profile } = useStudentProfile();
  const { data: dashboardData } = useStudentDashboard(profile?.id);
  const { data: assignmentsData, isLoading } = useStudentAssignments();

  // Filter for PROJECT type assignments
  const projectsData: Project[] = useMemo(() => {
    if (!assignmentsData) return [];
    
    return assignmentsData
      .filter(assignment => assignment.type === "PROJECT")
      .map(assignment => {
        const dueDate = new Date(assignment.dueAt);
        const now = new Date();
        const hasSubmission = assignment.submissions && assignment.submissions.length > 0;
        
        let status: Project['status'] = "Pending";
        let progress = 0;
        
        if (hasSubmission) {
          status = "Completed";
          progress = 100;
        } else if (dueDate < now) {
          status = "Late";
          progress = 40;
        } else {
          status = "In Progress";
          progress = 25;
        }

        return {
          id: assignment.id,
          title: assignment.title,
          subject: assignment.subject?.name || "General",
          mentor: `${assignment.teacher?.user.firstName} ${assignment.teacher?.user.lastName}`,
          deadline: formatDate(assignment.dueAt),
          status,
          progress,
          description: assignment.description || "Project assignment"
        };
      });
  }, [assignmentsData]);

  // Stats calculation
  const stats = useMemo(() => [
    {
      label: "Total Projects",
      value: projectsData.length.toString(),
      icon: <FolderKanban size={18} />,
      progress: 100,
      trend: { value: projectsData.length.toString(), direction: "up" as const, label: "active" }
    },
    {
      label: "Completed",
      value: projectsData.filter(p => p.status === "Completed").length.toString(),
      icon: <CheckCircle2 size={18} className="text-green-500" />,
      progress: projectsData.length > 0 ? Math.round((projectsData.filter(p => p.status === "Completed").length / projectsData.length) * 100) : 0,
      trend: { value: projectsData.filter(p => p.status === "Completed").length.toString(), direction: "up" as const, label: "finished" }
    },
    {
      label: "In Progress",
      value: projectsData.filter(p => p.status === "In Progress").length.toString(),
      icon: <Clock size={18} className="text-blue-500" />,
      progress: projectsData.length > 0 ? Math.round((projectsData.filter(p => p.status === "In Progress").length / projectsData.length) * 100) : 0,
    },
    {
      label: "Pending/Late",
      value: projectsData.filter(p => p.status === "Pending" || p.status === "Late").length.toString(),
      icon: <AlertCircle size={18} className="text-orange-500" />,
      progress: projectsData.length > 0 ? Math.round((projectsData.filter(p => p.status === "Pending" || p.status === "Late").length / projectsData.length) * 100) : 0,
    }
  ], [projectsData]);

  // Filter logic
  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         project.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "" || project.status === statusFilter;
    const matchesSubject = subjectFilter === "" || project.subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const subjects = useMemo(() => 
    Array.from(new Set(projectsData.map(p => p.subject))),
    [projectsData]
  );

  if (isLoading && !projectsData.length) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

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
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FolderKanban size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No projects found</p>
              {projectsData.length === 0 && (
                <p className="text-sm mt-2">Projects will appear here when teachers assign them</p>
              )}
            </div>
          ) : (
            <DataTable
              columns={columns as any}
              data={filteredProjects as any}
              keyField="id"
              className="projects-table"
              pageSize={5}
              paginationClassName="pagination-rounded"
            />
          )}
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
