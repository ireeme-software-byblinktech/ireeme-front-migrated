"use client";

import { useState } from "react";
import { StatCard } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import {
  ClipboardList, Plus, Clock, CheckCircle, FileText,
  BookOpen, Award, Layers, Search, X, ChevronDown,
  Bold, Italic, Underline, AlignLeft, AlignCenter, List
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const SUBMISSIONS_MOCK = [
  { id: 1, student: "John Smith", class: "Year 1A", date: "oct,12,2026, 09:12 AM", status: "Pending", file: "PDF" },
  { id: 2, student: "Alice Johnson", class: "Year 1A", date: "oct,12,2026, 09:15 AM", status: "Graded", file: "PDF", grade: "A" },
  { id: 3, student: "Bob Williams", class: "Year 1A", date: "oct,12,2026, 09:30 AM", status: "Submitted", file: "PDF" },
  { id: 4, student: "Emma Brown", class: "Year 1A", date: "-", status: "Not Submitted", file: "-" },
];

const ASSIGNMENTS = [
  {
    id: 1,
    title: "Homework #4 - Algebraic Equations",
    class: "Grade 5B",
    subject: "Mathematics",
    dueDate: "Tomorrow, 10:00 AM",
    submitted: 20,
    totalSubmissions: 26,
    graded: 15,
    totalGraded: 20,
    status: "Active",
    type: "HOMEWORK"
  },
  {
    id: 2,
    title: "Quiz 5 - Geometry Basics",
    class: "Grade 5A",
    subject: "Mathematics",
    dueDate: "Dec 20, 2024",
    submitted: 24,
    totalSubmissions: 24,
    graded: 24,
    totalGraded: 24,
    status: "Graded",
    type: "QUIZ"
  },
  {
    id: 3,
    title: "Midterm Project - Math in Real Life",
    class: "Grade 6B",
    subject: "Mathematics",
    dueDate: "Dec 25, 2024",
    submitted: 15,
    totalSubmissions: 28,
    graded: 0,
    totalGraded: 15,
    status: "Active",
    type: "PROJECT"
  },
  {
    id: 4,
    title: "Chapter 5 Review Questions",
    class: "Grade 5B",
    subject: "Mathematics",
    dueDate: "Dec 18, 2024",
    submitted: 26,
    totalSubmissions: 26,
    graded: 26,
    totalGraded: 26,
    status: "Graded",
    type: "HOMEWORK"
  },
  {
    id: 5,
    title: "Practice Problems Set 3",
    class: "Grade 5A",
    subject: "Mathematics",
    dueDate: "Not published",
    submitted: 0,
    totalSubmissions: 24,
    graded: 0,
    totalGraded: 0,
    status: "Drafts",
    type: "HOMEWORK"
  },
];

export default function TeacherAssignmentsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [assignmentVariant, setAssignmentVariant] = useState<"MCQ" | "Open-Ended">("MCQ");
  const [selectedSubmissions, setSelectedSubmissions] = useState<number[]>([]);
  const [mcqOptions, setMcqOptions] = useState([
    { id: "A", value: "", isCorrect: true },
    { id: "B", value: "", isCorrect: false },
    { id: "C", value: "", isCorrect: false },
    { id: "D", value: "", isCorrect: false },
  ]);

  const updateOption = (id: string, value: string) => {
    setMcqOptions(prev => prev.map(o => o.id === id ? { ...o, value } : o));
  };

  const setCorrectOption = (id: string) => {
    setMcqOptions(prev => prev.map(o => ({ ...o, isCorrect: o.id === id })));
  };
  const [selectedAssignment, setSelectedAssignment] = useState<typeof ASSIGNMENTS[0] | null>(null);
  const [classes, setClasses] = useState<string[]>(["Year 1A", "Year 1B"]);
  const [classInput, setClassInput] = useState("");
  const [showClassInput, setShowClassInput] = useState(false);

  const addClassTag = () => {
    const trimmed = classInput.trim();
    if (trimmed && !classes.includes(trimmed)) {
      setClasses(prev => [...prev, trimmed]);
    }
    setClassInput("");
    setShowClassInput(false);
  };

  const removeClassTag = (cls: string) => {
    setClasses(prev => prev.filter(c => c !== cls));
  };

  const filteredAssignments = activeTab === "All"
    ? ASSIGNMENTS
    : ASSIGNMENTS.filter(a => a.status === activeTab);

  const stats = {
    total: ASSIGNMENTS.length,
    active: ASSIGNMENTS.filter(a => a.status === "Active").length,
    graded: ASSIGNMENTS.filter(a => a.status === "Graded").length,
    drafts: ASSIGNMENTS.filter(a => a.status === "Drafts").length
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("ALL");
  const [selectedSubmissionRows, setSelectedSubmissionRows] = useState<number[]>([]);

  const filteredSubmissions = SUBMISSIONS_MOCK.filter(sub => {
    // Search
    if (searchQuery && !sub.student.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    // Tabs
    if (filterTab === "ALL") return true;
    if (filterTab === "Submitted") return sub.status === "Submitted" || sub.status === "Pending" || sub.status === "Graded";
    if (filterTab === "Graded") return sub.status === "Graded";
    if (filterTab === "Not Submitted") return sub.status === "Not Submitted";
    return true;
  });

  const toggleSubmissionRow = (id: number) => {
    setSelectedSubmissionRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const toggleAllSubmissions = () => {
    if (selectedSubmissionRows.length === filteredSubmissions.length) {
      setSelectedSubmissionRows([]);
    } else {
      setSelectedSubmissionRows(filteredSubmissions.map(s => s.id));
    }
  };

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
          icon={<Layers size={24} />}
          progress={60}
          trend={{ value: "5", label: "2 completed", direction: "up" }}
        />
        <StatCard
          label="pending Grading"
          value="20"
          icon={<Award size={24} />}
          progress={45}
          trend={{ value: "-12", label: "from yesterday", direction: "down" }}
        />
        <StatCard
          label="Drafts"
          value={stats.drafts}
          icon={<CheckCircle size={24} />}
          progress={20}
          trend={{ value: "1", label: "+3 this week", direction: "up" }}
        />
      </div>

      {/* Tabs Layout */}
      <div className="assignments-tabs-container">
        {["All", "Active", "Graded", "Drafts"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "assignments-tab",
              activeTab === tab && "active"
            )}
          >
            {tab} ({
              tab === "All" ? stats.total :
                tab === "Active" ? stats.active :
                  tab === "Graded" ? stats.graded :
                    stats.drafts
            })
          </div>
        ))}
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-2 gap-6">
        {filteredAssignments.map((a) => (
          <div key={a.id} className="assignment-card-full">
            <div className="assignment-tags-container">
              <span className="assignment-tag-v2">{a.type}</span>
              <span className="assignment-tag-v2">{a.status.toUpperCase()}</span>
            </div>

            <div className="assignment-details-v2">
              <h3 className="assignment-title-v2">{a.title}</h3>
              <p className="assignment-subtitle-v2">{a.subject} - {a.class}</p>
              <p className="assignment-due-v2">Due: {a.dueDate}</p>
            </div>

            <div className="assignment-progress-section">
              <div className="assignment-progress-item">
                <div className="assignment-progress-header">
                  <span className="assignment-progress-label">Submissions</span>
                  <span className="assignment-progress-count">{a.submitted}/{a.totalSubmissions}</span>
                </div>
                <div className="assignment-progress-bar-bg">
                  <div
                    className="assignment-progress-bar-fill"
                    style={{ width: `${(a.submitted / a.totalSubmissions) * 100}%` }}
                  ></div>
                </div>
              </div>

              {a.status !== "Drafts" && (
                <div className="assignment-progress-item">
                  <div className="assignment-progress-header">
                    <span className="assignment-progress-label">Graded</span>
                    <span className="assignment-progress-count">{a.graded}/{a.totalGraded}</span>
                  </div>
                  <div className="assignment-progress-bar-bg">
                    <div
                      className="assignment-progress-bar-fill"
                      style={{ width: `${a.totalGraded > 0 ? (a.graded / a.totalGraded) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="assignment-actions-v2">
              {a.status === "Drafts" ? (
                <>
                  <div className="assignment-action-btn primary">Publish</div>
                  <div className="assignment-action-btn secondary">Edit</div>
                </>
              ) : (
                <>
                  <div 
                    onClick={() => {
                      setSelectedAssignment(a);
                      setIsSubmissionsModalOpen(true);
                    }}
                    className="assignment-action-btn primary"
                  >
                    View Submissions
                  </div>
                  <div className="assignment-action-btn secondary">Grade</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Assignment Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Assignment"
        className="modal--premium"
        size="lg"
      >
        <div className="modal-section-grid">
          <div className="form-group-v2">
            <label className="form-label-v2">Assignment Title</label>
            <input type="text" className="form-input-v2" placeholder="Enter Assignment title" />
          </div>
          <div className="form-group-v2">
            <label className="form-label-v2">Status</label>
            <div className="relative">
              <select className="form-select-v2 appearance-none">
                <option>Active</option>
                <option>Draft</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          <div className="form-group-v2">
            <label className="form-label-v2">Grade *</label>
            <input type="text" className="form-input-v2" placeholder="Your first name" />
          </div>
          <div className="form-group-v2">
            <label className="form-label-v2">Class(Select multiple)</label>
            <div className="form-input-v2 flex items-center gap-2 flex-wrap min-h-[46px] py-1">
              {classes.map(cls => (
                <div key={cls} className="bg-[#e3e3e3] px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2">
                  {cls}
                  <X size={12} className="cursor-pointer" onClick={() => removeClassTag(cls)} />
                </div>
              ))}
              {showClassInput ? (
                <input
                  autoFocus
                  type="text"
                  value={classInput}
                  onChange={e => setClassInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addClassTag(); if (e.key === "Escape") { setShowClassInput(false); setClassInput(""); } }}
                  onBlur={addClassTag}
                  placeholder="e.g. Year 2A"
                  style={{ border: "none", outline: "none", fontSize: 13, width: 100 }}
                />
              ) : (
                <Plus
                  size={20}
                  className="text-gray-400 cursor-pointer ml-1"
                  onClick={() => setShowClassInput(true)}
                />
              )}
            </div>
          </div>
          <div className="form-group-v2">
            <label className="form-label-v2">Subject*</label>
            <input type="text" className="form-input-v2" placeholder="Subject" />
          </div>
          <div className="form-group-v2">
            <label className="form-label-v2">Due Date*</label>
            <input type="text" className="form-input-v2" placeholder="Select deadline" />
          </div>
        </div>

        <div className="toggle-container-v2">
          <button
            onClick={() => setAssignmentVariant("MCQ")}
            className={cn("toggle-btn-v2", assignmentVariant === "MCQ" && "active")}
          >
            Multiple Choice (MCQ)
          </button>
          <button
            onClick={() => setAssignmentVariant("Open-Ended")}
            className={cn("toggle-btn-v2", assignmentVariant === "Open-Ended" && "active")}
          >
            Open-Ended
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="text-[14px] font-bold text-gray-500">Create it Locally!</p>
        </div>

        {assignmentVariant === "MCQ" ? (
          <div className="mcq-section">
            <div className="form-group-v2 mb-6">
              <label className="form-label-v2">Question Text</label>
              <input type="text" className="form-input-v2" placeholder="Enter Question Text..." />
            </div>
            
            <div className="mcq-options-container">
              {mcqOptions.map((opt) => (
                <div key={opt.id} className="mcq-option-row">
                  {/* Left: pill with radio + editable input */}
                  <div
                    style={{ flex: "0 0 55%", display: "flex", alignItems: "center", gap: "12px", padding: "10px 20px", border: "1.5px solid #000000", borderRadius: "100px", background: "#FFFFFF", cursor: "pointer" }}
                    onClick={() => setCorrectOption(opt.id)}
                  >
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {opt.isCorrect && <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#000" }} />}
                    </div>
                    <input
                      type="text"
                      className="mcq-option-input"
                      placeholder={`Option ${opt.id}`}
                      value={opt.value}
                      onChange={e => { e.stopPropagation(); updateOption(opt.id, e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      style={{ fontWeight: 500, fontSize: 14, color: "#374151" }}
                    />
                  </div>

                  {/* Right: checkbox + label */}
                  <div className="flex items-center gap-2" style={{ cursor: "pointer" }} onClick={() => setCorrectOption(opt.id)}>
                    <div style={{ width: 20, height: 20, border: "2px solid #000", borderRadius: 4, background: opt.isCorrect ? "#000" : "#FFF", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>Set as Correct Answer</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="open-ended-section">
            <div className="form-group-v2">
              <label className="form-label-v2">Question Text</label>
              <div className="border-[1.5px] border-gray-300 rounded-xl overflow-hidden">
                <div className="flex items-center gap-4 px-4 py-3 border-b-[1.5px] border-gray-300">
                  <Bold size={18} className="cursor-pointer" />
                  <Italic size={18} className="cursor-pointer" />
                  <Underline size={18} className="cursor-pointer" />
                  <div className="w-[1px] h-6 bg-gray-300"></div>
                  <AlignLeft size={18} className="cursor-pointer" />
                  <AlignCenter size={18} className="cursor-pointer" />
                  <div className="w-[1px] h-6 bg-gray-300"></div>
                  <List size={18} className="cursor-pointer" />
                </div>
                <div className="p-4 min-h-[150px]"></div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button className="bg-black text-white px-10 py-3 rounded-lg font-semibold text-sm min-w-[140px] hover:opacity-90">
            + Add Another Question
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 mt-12 pb-4">
          <button className="bg-black text-white px-12 py-3 rounded-xl font-semibold text-base min-w-[200px] hover:opacity-90">
            Create
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(false)}
            className="bg-white text-black border-[1.5px] border-gray-300 px-12 py-3 rounded-xl font-medium text-base min-w-[200px] hover:bg-gray-50"
          >
            cancel
          </button>
        </div>
      </Modal>

      {/* View Submissions Modal */}
      <Modal
        open={isSubmissionsModalOpen}
        onClose={() => setIsSubmissionsModalOpen(false)}
        title={`View Submissions - ${selectedAssignment?.title ?? ""}`}
        className="modal--premium"
        size="xl"
      >
        {/* Row 1: Select Class + Stats */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <div className="relative" style={{ minWidth: 160 }}>
            <select className="form-select-v2 appearance-none pr-10 py-2.5 border-gray-300 text-sm" style={{ minWidth: 160 }}>
              <option>Select Class</option>
              <option>Year 1A</option>
              <option>Year 1B</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          </div>

          <div className="flex items-center gap-4 bg-[#F3F4F6] rounded-xl px-6 py-2.5 text-sm font-medium text-gray-600 flex-1 justify-center" style={{ minWidth: 0 }}>
            <span>Total: <strong className="text-black font-semibold">26</strong></span>
            <span className="text-gray-300">|</span>
            <span>Submitted: <strong className="text-black font-semibold">24</strong></span>
            <span className="text-gray-300">|</span>
            <span>Graded: <strong className="text-black font-semibold">19</strong></span>
            <span className="text-gray-300">|</span>
            <span>Pending: <strong className="text-black font-semibold">1</strong></span>
          </div>
        </div>

        {/* Row 2: Search + Filter tabs */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative" style={{ flex: "0 0 42%" }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="submissions-search-input pl-12 w-full"
              placeholder="Search Students"
              style={{ borderRadius: "100px", padding: "10px 16px 10px 44px" }}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {["ALL", "Submitted", "Graded", "Not Submitted"].map(tab => (
              <button 
                key={tab} 
                onClick={() => setFilterTab(tab)}
                className={cn("submissions-filter-btn", filterTab === tab && "active")} 
                style={{ borderRadius: "100px" }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="submissions-table">
            <thead>
              <tr>
                <th className="w-10 cursor-pointer" onClick={toggleAllSubmissions}>
                  <div className={cn("w-5 h-5 border-2 rounded flex items-center justify-center transition-colors", 
                    selectedSubmissionRows.length === filteredSubmissions.length && filteredSubmissions.length > 0 ? "border-black bg-black" : "border-gray-300"
                  )}>
                    {selectedSubmissionRows.length === filteredSubmissions.length && filteredSubmissions.length > 0 && <Check size={14} className="text-white" />}
                  </div>
                </th>
                <th>STUDENT</th>
                <th>CLASS</th>
                <th>SUBMISSION DATE</th>
                <th>ATTACHED FILES</th>
                <th>STATUS</th>
                <th>GRADE</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((sub) => {
                const isSelected = selectedSubmissionRows.includes(sub.id);
                return (
                  <tr key={sub.id} className={cn("transition-colors", isSelected && "bg-gray-50")}>
                    <td className="cursor-pointer" onClick={() => toggleSubmissionRow(sub.id)}>
                      <div className={cn("w-5 h-5 border-2 rounded flex items-center justify-center transition-colors", 
                        isSelected ? "border-black bg-black" : "border-gray-300 bg-white"
                      )}>
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                    </td>
                    <td className="font-bold">{sub.student}</td>
                    <td>
                      <span className="class-tag-v2">{sub.class}</span>
                    </td>
                    <td>{sub.date}</td>
                    <td>
                      {sub.file !== "-" ? (
                        <div className="file-btn-v2" style={{ display: "inline-flex" }}>
                          <FileText size={14} />
                          <span>{sub.file}</span>
                        </div>
                      ) : <span className="text-gray-400">-</span>}
                    </td>
                    <td>
                      <div className="status-badge-v2">
                        <Clock size={14} className="text-gray-400" />
                        <span>{sub.status}</span>
                      </div>
                    </td>
                    <td className="font-semibold">{/* @ts-ignore */} {sub.grade || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pagination-v2">
          <div className="pagination-btn-v2">{"<"}</div>
          <div className="pagination-btn-v2 active">1</div>
          <div className="pagination-btn-v2">2</div>
          <div className="text-gray-400 px-2">....</div>
          <div className="pagination-btn-v2">5</div>
          <div className="pagination-btn-v2">{">"}</div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-10 pb-4">
          <button className="bg-black text-white px-10 py-3 rounded-xl font-semibold text-sm min-w-[180px] hover:opacity-90">
            Grade Selected
          </button>
          <button 
            onClick={() => setIsSubmissionsModalOpen(false)}
            className="bg-white text-black border-[1.5px] border-gray-300 px-10 py-3 rounded-xl font-medium text-sm min-w-[180px] hover:bg-gray-50"
          >
            cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
