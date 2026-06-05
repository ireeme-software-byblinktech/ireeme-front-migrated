"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { StatCard, Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { SearchInput, Select } from "@/components/ui/FormElements";
import {
  GraduationCap,
  BookOpen,
  FileText,
  BarChart2,
  FolderOpen,
  ChevronRight,
  Sparkles,
  X,
  MessageSquareText,
  HelpCircle,
  PenTool,
  ChevronDown,
  Type
} from "lucide-react";
import { useStudentProfile, useStudentDashboard, useStudentAssignments } from "@/hooks/api/useStudentAPI";
import { formatDate } from "@/lib/utils";

// --- Types ---
interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  teacher: string;
  date: string;
}

type AIViewType = 'content' | 'summary' | 'quiz' | 'explain';
type FontScaleType = 'sm' | 'base' | 'lg' | 'xl';

// --- Sub-components ---

/**
 * Dropdown item for the Neural Menu
 */
const NeuralDropdownItem = ({ icon, title, onClick }: { icon: any, title: string, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 hover:bg-white transition-all rounded-sm text-left group"
  >
    <div className="shrink-0 w-7 h-7 rounded-sm bg-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all text-white/60">
      {icon}
    </div>
    <span className="font-black text-[9px] uppercase tracking-widest text-white group-hover:text-black transition-colors">
      {title}
    </span>
  </button>
);

/**
 * High-fidelity Note Viewing Portal with AI capabilities
 */
function NoteViewModal({ isOpen, onClose, note }: { isOpen: boolean; onClose: () => void; note: Note | null }) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAIView, setActiveAIView] = useState<AIViewType>('content');
  const [fontScale, setFontScale] = useState<FontScaleType>('base');

  // Style maps for typography scaling
  const fontSizes: Record<FontScaleType, string> = {
    sm: 'text-sm md:text-base leading-relaxed',
    base: 'text-base md:text-lg leading-relaxed',
    lg: 'text-lg md:text-xl leading-relaxed',
    xl: 'text-xl md:text-2xl leading-snug font-bold'
  };

  const leadSizes: Record<FontScaleType, string> = {
    sm: 'text-lg font-bold',
    base: 'text-xl font-bold',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black'
  };

  // Reset state on open/close
  useEffect(() => {
    if (!isOpen) {
      setIsActionsOpen(false);
      setActiveAIView('content');
    }
  }, [isOpen]);

  if (!isOpen || !note) return null;

  const handleAIAction = (viewType: AIViewType | 'chat') => {
    setIsAnalyzing(true);
    setIsActionsOpen(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      if (viewType === 'chat') {
        alert("Neural Assistant Opening... Context: " + note.title);
      } else {
        setActiveAIView(viewType);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex pointer-events-none overflow-hidden">
      {/* Sidebar Area - Clear zone to exit */}
      <div
        className="w-64 h-full bg-black/40 pointer-events-auto cursor-zoom-out transition-colors hover:bg-black/50"
        onClick={onClose}
      />

      {/* Main Portal Body - ALLOW OVERFLOW FOR DROPDOWN */}
      <div className="flex-1 bg-white flex flex-col pointer-events-auto shadow-2xl animate-in slide-in-from-right duration-500 relative">

        {/* Click-out detector for dropdown overlay */}
        {isActionsOpen && (
          <div
            className="absolute inset-0 z-[100] cursor-default"
            onClick={() => setIsActionsOpen(false)}
          />
        )}

        {/* Elite Neural Header - High Priority Layer */}
        <header className="bg-black text-white p-6 md:p-8 flex items-center justify-between relative shrink-0 z-[200]">
          {/* Decorative geometric background */}
          <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-12 -mr-20 pointer-events-none"></div>

          <div className="flex items-center gap-6 relative z-10 font-black">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shadow-lg group">
              <FileText size={24} className="group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl tracking-tight leading-none mb-1.5 uppercase font-[900]">
                {note.title}
              </h2>
              <div className="flex items-center gap-3 text-gray-400 font-semibold text-xs">
                <span>{note.subject}</span>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span>{note.teacher}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-[210]">
            {/* Neural Action Hub */}
            <div className="relative">
              <button
                onClick={() => setIsActionsOpen(!isActionsOpen)}
                className={cn(
                  "flex items-center gap-3 px-5 py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all border",
                  isActionsOpen
                    ? "bg-white text-black border-white shadow-xl"
                    : "bg-white/5 text-white border-white/10 hover:bg-white/15 hover:border-white/30"
                )}
              >
                <Sparkles size={14} className={cn(isActionsOpen && "animate-pulse")} />
                Neural Operations
                <ChevronDown size={14} className={cn("transition-transform duration-300", isActionsOpen && "rotate-180")} />
              </button>

              {/* Neural Context Menu - Maximum Priority */}
              {isActionsOpen && (
                <div className="absolute top-full right-0 mt-4 w-72 bg-black border border-white/20 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300 z-[250] shadow-[0_25px_60px_rgba(0,0,0,0.6)] rounded-sm">
                  <div className="p-3 space-y-1">
                    <NeuralDropdownItem icon={<MessageSquareText size={16} />} title="Generate Summary" onClick={() => handleAIAction("summary")} />
                    <NeuralDropdownItem icon={<HelpCircle size={16} />} title="Build Neural Quiz" onClick={() => handleAIAction("quiz")} />
                    <NeuralDropdownItem icon={<Sparkles size={16} />} title="Contextual Deep-Dive" onClick={() => handleAIAction("explain")} />

                    <div className="h-px bg-white/10 my-3 mx-1" />

                    <NeuralDropdownItem icon={<FileText size={16} />} title="Restore Raw Material" onClick={() => { setActiveAIView('content'); setIsActionsOpen(false); }} />

                    <div className="h-px bg-white/10 my-3 mx-1" />

                    {/* Typography Scaling Controls */}
                    <div className="px-3 pb-2 space-y-3">
                      <div className="flex items-center gap-2 text-white/40 mb-3">
                        <Type size={12} />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Scale Workspace</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => setFontScale(size)}
                            className={cn(
                              "h-8 flex items-center justify-center text-[9px] font-black uppercase border transition-all rounded-none",
                              fontScale === size
                                ? "bg-white text-black border-white"
                                : "bg-transparent text-white/40 border-white/5 hover:border-white/20 hover:text-white"
                            )}
                          >
                            {size === 'base' ? 'STD' : size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-white/10 my-3 mx-1" />
                    <NeuralDropdownItem icon={<PenTool size={16} />} title="Ask AI Companion" onClick={() => handleAIAction("chat")} />
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-white/10 mx-1"></div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all group border border-white/5"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </header>

        {/* Content Environment */}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-white relative">
          {/* Neural Analysis Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 z-[150] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent animate-pulse"></div>
                <Sparkles size={40} className="text-white relative z-10 animate-bounce" />
              </div>
              <div className="text-center space-y-4">
                <p className="text-[11px] font-black text-black uppercase tracking-[0.5em] animate-pulse">Neural Reconfiguration in Progress</p>
                <div className="flex gap-2 justify-center">
                  <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          <section className="max-w-4xl mx-auto p-6 md:p-12 space-y-12">
            {/* Context Breadcrumb */}
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <h3 className="text-md font-semibold text-gray-400">
                  {activeAIView === 'content' ? 'Authenticated Study Material' : `AI Context Agent: ${activeAIView}`}
                </h3>
                <div className="flex items-center gap-6">
                  {activeAIView !== 'content' && (
                    <button
                      onClick={() => setActiveAIView('content')}
                      className="text-[9px] font-black text-black hover:tracking-[0.2em] transition-all uppercase underline underline-offset-4"
                    >
                      Return to Source
                    </button>
                  )}
                  <span className="text-[9px] font-black text-gray-300 tracking-[0.3em] uppercase">Ref. {note.id.padStart(4, '0')}</span>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                {activeAIView === 'content' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <p className={cn("text-black leading-[1.3] mb-12 tracking-tight transition-all duration-500 font-bold", leadSizes[fontScale])}>
                      {note.description}. This documentation represents the high-level conceptual mapping for current academic modules.
                    </p>

                    <div className={cn("text-gray-700 space-y-8 transition-all duration-500 font-medium", fontSizes[fontScale])}>
                      <p>
                        Core information structures are being reformatted through our neural engine for maximum retention.
                        By utilizing high-contrast typography and removing peripheral distractions, we optimize focus cycles.
                      </p>

                      <div className="p-10 bg-gray-50 border border-gray-100 border-l-8 border-l-black my-16 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={60} /></div>
                        <p className={cn("italic text-black font-medium transition-all duration-500 leading-snug", leadSizes[fontScale])}>
                          "Innovation is the bridge between knowledge and transformation. Study deep, iterate often."
                        </p>
                      </div>

                      {[1, 2, 3].map((i) => (
                        <p key={i} className="mb-6 leading-relaxed">
                          Structural point {i} continues the investigative analysis, providing industrial-grade context to the subject material.
                          Neural operations remain a single operation away in the unified header navigation.
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {activeAIView === 'summary' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="p-12 bg-black text-white rounded-sm shadow-3xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-6 text-gray-500">Neural Executive Summary</h4>
                      <p className={cn("font-bold transition-all duration-500 leading-tight", leadSizes[fontScale])}>
                        Key Objective: Synthesizing {note.title} into tactical knowledge units. Focus on the core derivatives of the {note.subject} module.
                      </p>
                    </div>
                    <div className={cn("space-y-8 text-gray-800 font-bold transition-all duration-500", fontSizes[fontScale])}>
                      {[
                        "Strategic shift in foundational lecture points.",
                        "Mapping derivative relationships to active assignments.",
                        "Integration of automated testing for long-term retention."
                      ].map((point, idx) => (
                        <div key={idx} className="flex gap-6 items-start group">
                          <div className="w-2 h-2 bg-black shrink-0 mt-3 group-hover:scale-150 transition-transform"></div>
                          <p className="tracking-tight">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeAIView === 'quiz' && (
                  <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-8 border-b border-gray-100 pb-12 last:border-0">
                        <div className="flex gap-4 items-center">
                          <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">{i}</span>
                          <p className={cn("text-black font-black uppercase tracking-tight transition-all duration-500", fontSizes[fontScale])}>
                            Critical analysis point: what are the primary implications of the material?
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-12">
                          {['Analysis A', 'Analysis B', 'Inversion C', 'Synthesis D'].map((opt) => (
                            <button key={opt} className="p-5 border-2 border-gray-100 text-[10px] font-black uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all text-left">
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button className="w-full bg-black text-white py-6 font-black text-[12px] uppercase tracking-[0.5em] shadow-2xl hover:bg-gray-800 transition-all">Submit Neural Assessment</button>
                  </div>
                )}

                {activeAIView === 'explain' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="p-12 border-4 border-black border-double flex items-center gap-10 text-black">
                      <div className="w-20 h-20 bg-black text-white rounded flex items-center justify-center shrink-0">
                        <Sparkles size={40} className="animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-[900] uppercase tracking-tighter">Deep Synthesis Logic V4</h4>
                        <p className="text-gray-500 text-xs font-black uppercase tracking-widest leading-relaxed">Deconstructing complex frameworks into industrial-grade analogies.</p>
                      </div>
                    </div>
                    <div className={cn("text-gray-900 transition-all duration-500 space-y-10 font-bold leading-snug", leadSizes[fontScale])}>
                      <p>Paradigm A: Think of the {note.subject} framework not as static data, but as a <span className="underline decoration-black decoration-4 underline-offset-8 italic">live operating system</span>.</p>
                      <p className="text-gray-500">Every lecture point is a core service, and your mastery of it determines the system's uptime during final assessments.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Global Action Footer */}
        <footer className="p-8 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0 px-12">
          <button
            onClick={onClose}
            className="bg-black text-white px-12 py-4 rounded-sm font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all text-[11px] shadow-lg active:scale-95"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function StudentNotesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAll, setFilterAll] = useState("All");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: profile } = useStudentProfile();
  const { data: dashboardData } = useStudentDashboard(profile?.id);
  const { data: assignmentsData, isLoading } = useStudentAssignments();

  // Transform assignments to notes format
  const notesData: Note[] = useMemo(() => {
    if (!assignmentsData) return [];
    
    return assignmentsData.map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description || "Study material for this assignment",
      subject: assignment.subject?.name || "General",
      teacher: `${assignment.teacher?.user.firstName} ${assignment.teacher?.user.lastName}`,
      date: formatDate(assignment.createdAt)
    }));
  }, [assignmentsData]);

  // Derive stats from real data
  const statsData = useMemo(() => [
    { 
      label: "Total Subjects", 
      value: dashboardData?.overview.totalSubjects || 0, 
      icon: <GraduationCap size={18} />, 
      progress: 75, 
      trend: { value: "3.6", direction: "up" as const, label: "This month" } 
    },
    { 
      label: "Total Assignments", 
      value: dashboardData?.overview.totalAssignments || 0, 
      icon: <BookOpen size={18} />, 
      progress: dashboardData?.overview.assignmentsProgress || 80, 
      trend: { value: "2.1", direction: "up" as const, label: "This month" } 
    },
    { 
      label: "Total Notes", 
      value: notesData.length, 
      icon: <FileText size={18} />, 
      progress: Math.min(100, notesData.length * 3), 
      trend: { value: notesData.length.toString(), direction: "up" as const, label: "Available" } 
    },
    { 
      label: "Avg. Attendance", 
      value: `${dashboardData?.overview.averageAttendance || 0}%`, 
      icon: <BarChart2 size={18} />, 
      progress: dashboardData?.overview.averageAttendance || 0, 
      trend: { value: "0.5", direction: "up" as const, label: "This month" } 
    }
  ], [dashboardData, notesData.length]);

  // Search logic
  const filteredData = notesData.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && !notesData.length) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  const columns: Column<Note>[] = [
    {
      key: "title",
      header: "DOCUMENT DESCRIPTION",
      render: (_, row) => (
        <div className="flex items-center gap-4 py-1">
          <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-all">
            <FolderOpen size={18} />
          </div>
          <div>
            <div className="font-black text-gray-900 text-[13px] uppercase tracking-tight">{row.title}</div>
            <div className="text-[11px] text-gray-400 mt-1 font-medium">{row.description}</div>
          </div>
        </div>
      )
    },
    {
      key: "subject",
      header: "CLASSIFICATION",
      render: (_, row) => (
        <span className="bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest">
          {row.subject}
        </span>
      )
    },
    {
      key: "teacher",
      header: "FACULTY",
      render: (_, row) => <div className="text-[12px] font-bold text-gray-600 uppercase tracking-tight">{row.teacher}</div>
    },
    {
      key: "date",
      header: "TIMESTAMP",
      render: (_, row) => <div className="text-[12px] font-bold text-gray-400">{row.date}</div>
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (_, row) => (
        <button
          onClick={() => { setSelectedNote(row); setIsModalOpen(true); }}
          className="bg-gray-50 border border-gray-200 p-2.5 hover:bg-black hover:text-white hover:border-black transition-all group"
        >
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-10 p-2">
      {/* Page Signature */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-[900] text-gray-900 mb-2">Note Archive</h1>
          <p className="text-md text-gray-400 font-medium">Central Intelligence • Academic Information Center</p>
        </div>
        <div className="hidden md:block">
          <div className="flex gap-2 text-[9px] font-black uppercase tracking-widest text-gray-300">
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> System Active</span>
            <span className="flex items-center gap-1 border-l border-gray-200 pl-2 ml-2">Neural Engine V3.0</span>
          </div>
        </div>
      </div>

      {/* Operational Stats */}
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

      {/* Control Interface */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 border border-gray-100 shadow-sm">
        <div className="flex-1 w-full max-w-xl">
          <SearchInput
            placeholder="Search, Filter, ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-gray-200 focus:border-black transition-colors font-medium text-sm placeholder:text-gray-300"
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <Select
            value={filterAll}
            onChange={(e) => setFilterAll(e.target.value)}
            options={[
              { value: "All", label: "All Documents" },
              { value: "Recent", label: "Recently Accessed" },
              { value: "Favorites", label: "Starred Files" }
            ]}
            className="w-full md:w-56 font-medium text-sm border-gray-200"
          />
        </div>
      </div>

      {/* Document Registry */}
      <Card className="border-gray-100 shadow-xl overflow-hidden rounded-none">
        <CardBody className="p-0">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No study materials found</p>
            </div>
          ) : (
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={filteredData as unknown as Record<string, unknown>[]}
              keyField="id"
              className="notes-industrial-table"
              pageSize={8}
              paginationClassName="pagination-industrial p-8 border-t border-gray-50 flex justify-center bg-gray-50/30"
            />
          )}
        </CardBody>
      </Card>

      {/* High-Fidelity Viewing Portal */}
      <NoteViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={selectedNote}
      />
    </div>
  );
}

