"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatCard, Card, CardBody } from "@/components/ui/Card";
import { DataTable, Column, Pagination } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/FormElements";
import { Modal } from "@/components/ui/Modal";
import { Briefcase, Award, Filter, Users, Calendar, CheckCircle2, Clock, ChevronRight, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Stats data array
const statsData = [
  {
    label: "Active Projects",
    value: 4,
    icon: <Briefcase size={18} />,
    progress: 45,
    trend: { value: "1", direction: "up" as const, label: "This month" }
  },
  {
    label: "Pending Reviews", 
    value: 2,
    icon: <Clock size={18} />,
    progress: 20,
    trend: { value: "1", direction: "down" as const, label: "This month" }
  },
  {
    label: "Completed",
    value: 12, 
    icon: <Award size={18} />,
    progress: 85,
    trend: { value: "3", direction: "up" as const, label: "This month" }
  },
  {
    label: "Group Projects",
    value: 5,
    icon: <Users size={18} />,
    progress: 60,
    trend: { value: "2", direction: "up" as const, label: "This month" }
  }
];

// Project data
interface Project {
  id: string;
  subject: string;
  title: string;
  deadline: string;
  term: string;
  status: "Completed" | "In Progress" | "Pending" | "Overdue";
  type: "Individual" | "Group";
  grade?: string;
  description?: string;
}

const projectsData: Project[] = [
  {
    id: "1",
    subject: "Computer Science",
    title: "Full-Stack Web App",
    deadline: "15-Dec-2025",
    term: "Term 1",
    status: "In Progress",
    type: "Group",
    description: "Develop a functional marketplace prototype using Next.js, Node.js, and a Postgres database."
  },
  {
    id: "2",
    subject: "Business Studies", 
    title: "Market Analysis Report",
    deadline: "10-Nov-2025",
    term: "Term 1",
    status: "Completed",
    type: "Individual",
    grade: "A",
    description: "Analyze the current trends in the EV market and project growth for the next decade."
  },
  {
    id: "3",
    subject: "Physics",
    title: "Bridge Logistics Simulation",
    deadline: "20-Dec-2025",
    term: "Term 1",
    status: "In Progress",
    type: "Group",
    description: "Construct a physical or virtual simulation demonstrating tension and compression on suspension bridges."
  },
  {
    id: "4",
    subject: "English Literature",
    title: "Modernism Presentation",
    deadline: "05-Nov-2025",
    term: "Term 1",
    status: "Completed",
    type: "Individual",
    grade: "A-",
    description: "A 15-minute presentation dissecting the influence of the World Wars on modernist poetry."
  },
  {
    id: "5",
    subject: "Chemistry",
    title: "Chemical Reaction Portfolio",
    deadline: "25-Nov-2025",
    term: "Term 1",
    status: "Pending",
    type: "Individual",
    description: "Document and journal 10 separate experiments conducted in the chemistry lab."
  },
  {
    id: "6",
    subject: "History",
    title: "Industrial Revolution Expo",
    deadline: "10-Dec-2025",
    term: "Term 1",
    status: "In Progress",
    type: "Group",
    description: "Create an interactive exhibit that displays key inventions driving the industrial revolution."
  },
  {
    id: "7",
    subject: "Art & Design",
    title: "UI/UX Case Study",
    deadline: "01-Nov-2025",
    term: "Term 1",
    status: "Completed",
    type: "Individual",
    grade: "B+",
    description: "Redesign an existing bad application interface and document the user persona logic."
  },
  {
    id: "8",
    subject: "Mathematics",
    title: "Statistical Modeling",
    deadline: "12-Dec-2025",
    term: "Term 1",
    status: "Overdue",
    type: "Group",
    description: "Collect localized climate data and build predictive statistical models using standard deviations and regressions."
  }
];

export default function ProjectsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const itemsPerPage = 8;

  // Filter data based on filters
  const filteredData = projectsData.filter(project => {
    const matchesTitle = titleFilter === "" || project.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesStatus = statusFilter === "" || project.status === statusFilter;
    const matchesType = typeFilter === "" || project.type === typeFilter;
    
    return matchesTitle && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const columns: Column<Project>[] = [
    {
      key: "select",
      header: "",
      width: "50px",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(row.id)}
          onChange={(e) => handleSelectItem(row.id, e.target.checked)}
          className="w-4 h-4 rounded border-gray-300"
        />
      )
    },
    {
      key: "title",
      header: "Project",
      render: (_, row) => (
        <div>
          <div className="font-bold text-gray-900">{row.title}</div>
          <div className="text-xs text-gray-500 mt-0.5">{row.subject}</div>
        </div>
      )
    },
    {
      key: "deadline",
      header: "Deadline",
      render: (_, row) => (
        <div className="text-sm font-medium text-gray-700">{row.deadline}</div>
      )
    },
    {
      key: "type",
      header: "Type",
      render: (_, row) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border",
          row.type === "Group" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-teal-50 text-teal-700 border-teal-200"
        )}>
          {row.type === "Group" ? <Users size={12} /> : <User size={12} />}
          {row.type}
        </div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <div className={`text-sm font-bold tracking-wide ${
          row.status === "Completed" ? "text-emerald-600" :
          row.status === "In Progress" ? "text-blue-600" :
          row.status === "Overdue" ? "text-red-600" : "text-amber-500"
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
            setSelectedProject(row);
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold tracking-wide hover:bg-gray-800 transition-colors shadow-sm active:scale-95"
        >
          View
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects Workspace</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Manage and track your coursework projects</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide hover:bg-gray-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2 max-w-fit"
        >
          <Plus size={18} />
          Create Project
        </button>
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
            onClick={() => {
              if (stat.label === "Total Assignments") router.push("/student/assignments");
              else if (stat.label === "Total Notes") router.push("/student/notes");
              else if (stat.label.toLowerCase() === "total reports") router.push("/student/report-card");
              else if (stat.label === "Total Subjects") router.push("/student/timetable");
            }}
          />
        ))}
      </div>

      {/* Projects Overview Section */}
      <Card>
        <CardBody>
          {/* Header and Filters on same row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-lg font-bold text-gray-900">Project Directory</h2>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <Filter size={16} strokeWidth={2.5} className="text-gray-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Filter By</span>
              </div>
              
              <Select
                placeholder="Title Search"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                options={[
                  { value: "", label: "All Projects" },
                  { value: "Report", label: "Reports" },
                  { value: "Lab", label: "Labs" },
                  { value: "App", label: "Applications" },
                  { value: "Analysis", label: "Analysis" },
                  { value: "Presentation", label: "Presentations" }
                ]}
                className="w-36 shadow-sm border-gray-200 bg-white"
              />
              
              <Select
                placeholder="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "Completed", label: "Completed" },
                  { value: "In Progress", label: "In Progress" },
                  { value: "Pending", label: "Pending" },
                  { value: "Overdue", label: "Overdue" }
                ]}
                className="w-36 shadow-sm border-gray-200 bg-white"
              />
              
              <Select
                placeholder="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: "", label: "All Types" },
                  { value: "Individual", label: "Individual" },
                  { value: "Group", label: "Group" }
                ]}
                className="w-32 shadow-sm border-gray-200 bg-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="mb-6">
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={paginatedData as unknown as Record<string, unknown>[]}
              keyField="id"
              className="projects-table border hover:border-gray-300 rounded-xl overflow-hidden"
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

      <ViewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
      />
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

// User placeholder component to avoid heavy icons import
const User = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// View Project Modal Component
function ViewProjectModal({ isOpen, onClose, project }: { isOpen: boolean, onClose: () => void, project: Project | null }) {
  if (!project) return null;

  const isGraded = !!project.grade;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Project details"
      size="md"
      className="p-0 overflow-hidden"
    >
      <div className="space-y-6 bg-white">
        {/* Header Section */}
        <div className="flex items-center gap-4 bg-gray-50/80 p-5 border-b border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/10 relative z-10">
            <Briefcase size={28} className="text-white" />
          </div>
          <div className="pr-4 relative z-10">
            <h3 className="text-lg font-black text-gray-900 leading-tight tracking-tight">{project.title}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">{project.subject}</p>
          </div>
        </div>

        {/* Dynamic Details Grid */}
        <div className="grid grid-cols-2 gap-4 px-6">
          <div className="space-y-1.5 p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col justify-center gap-1.5 hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-2">
               <Calendar size={14} className="text-gray-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Deadline</span>
            </div>
            <p className="text-[13px] font-bold text-gray-900">{project.deadline}</p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col justify-center gap-1.5 hover:border-gray-200 transition-colors">
            <div className="flex items-center gap-2">
               {project.type === "Group" ? <Users size={14} className="text-gray-400" /> : <User size={14} />}
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Project Type</span>
            </div>
            <p className="text-[13px] font-bold text-gray-900">{project.type}</p>
          </div>
        </div>

        {/* Description Segment */}
        <div className="space-y-3 px-6">
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-black rounded-full"></div> Scope & Objective
          </h4>
          <p className="text-[13.5px] text-gray-700 font-medium bg-gray-50 p-5 rounded-xl border border-gray-100 leading-relaxed italic shadow-inner">
            "{project.description}"
          </p>
        </div>

        {/* Status / Grade Banner */}
        <div className="mx-6 relative">
          <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-black text-white px-6 py-5 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="space-y-1 relative z-10">
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Phase</div>
              <div className="flex items-center gap-2">
                {project.status === "Completed" ? (
                  <CheckCircle2 size={18} className="text-emerald-400" />
                ) : project.status === "Overdue" ? (
                  <AlertCircle /> 
                ) : (
                  <Clock size={16} className="text-blue-400" />
                )}
                <span className="text-sm font-black uppercase tracking-wide">{project.status}</span>
              </div>
            </div>
            
            <div className="relative z-10 text-right">
              {isGraded ? (
                <>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Awarded Score</div>
                  <div className="text-3xl font-black text-white">{project.grade}</div>
                </>
              ) : (
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10 shadow-inner">
                  <Clock size={14} className="text-gray-300" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-gray-300">Pending Eval</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-[24px] px-6 py-4">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Project Record</span>
          <button 
            onClick={onClose}
            className="bg-black text-white px-8 py-3 rounded-xl text-[11px] uppercase tracking-widest font-black hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
          >
            Close Preview
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Inline alert circle placeholder
const AlertCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

// Create Project Modal Component
function CreateProjectModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Create Workspace"
      size="md"
      className="p-0 overflow-hidden"
    >
      <div className="space-y-6 bg-white">
        <div className="bg-black p-8 text-white relative overflow-hidden flex flex-col items-center text-center">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
           
           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-inner">
             <Plus size={32} />
           </div>
           
           <div className="relative z-10 space-y-1 mt-2">
             <h2 className="text-2xl font-black tracking-tight">New Project</h2>
             <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed max-w-[250px] mx-auto">
               Initialize a new academic project workspace.
             </p>
           </div>
        </div>

        <div className="px-8 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Project Title</label>
            <input type="text" placeholder="e.g. Market Analysis Report" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-black focus:ring-1 focus:ring-black text-sm font-bold transition-all" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Course / Subject</label>
              <input type="text" placeholder="e.g. Accounting" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-black focus:ring-1 focus:ring-black text-sm font-bold transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Deadline</label>
              <input type="date" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-black focus:ring-1 focus:ring-black text-sm font-bold transition-all text-gray-500" />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Project Type</label>
            <div className="flex gap-2 bg-gray-50 p-1 border border-gray-100 rounded-xl">
              <button className="flex-1 py-2.5 rounded-lg border border-black bg-black text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm">
                 <User size={14} /> Individual
              </button>
              <button className="flex-1 py-2.5 rounded-lg border border-transparent bg-transparent text-gray-500 hover:text-black font-bold text-xs transition-all flex items-center justify-center gap-2">
                 <Users size={14} /> Group
              </button>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Description / Objectives</label>
            <textarea rows={3} placeholder="Briefly describe the project goals..." className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none focus:border-black focus:ring-1 focus:ring-black text-sm font-medium transition-all resize-none"></textarea>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-[24px] px-6 py-4">
           <button 
             onClick={onClose}
             className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-4 hover:text-black transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={onClose}
             className="bg-black text-white px-8 py-3 rounded-xl text-[11px] uppercase tracking-widest font-black hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center gap-2"
           >
             Initialize Project
           </button>
        </div>
      </div>
    </Modal>
  );
}