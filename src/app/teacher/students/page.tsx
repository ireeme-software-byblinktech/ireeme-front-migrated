"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Users, AlertTriangle, Award, CheckCircle, Eye, BookOpen, TrendingUp, TrendingDown, Minus, MessageSquare, Phone, ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from "lucide-react";
import { StatCard } from "@/components/ui";
import { apiClient } from "@/lib/api/client";

interface Subject {
  name: string;
  score: number;
  trend: "up" | "down" | "flat";
}

interface Student {
  id: string;
  name: string;
  studentId: string;
  grade: string;
  overall: number;
  attendance: number;
  subjects: Subject[];
  support: string | null;
  avatar: string;
}

interface StudentsResponse {
  students: Student[];
}

type SortField = "name" | "overall" | "attendance" | "studentId" | "grade";
type SortOrder = "asc" | "desc" | null;

interface Filters {
  gradeLevel: string | null;
  performanceLevel: string | null;
  attendanceLevel: string | null;
  supportLevel: string | null;
}

export default function TeacherStudentsPage() {
  const [viewMode, setViewMode] = useState<"Grid" | "Table">("Grid");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<Filters>({
    gradeLevel: null,
    performanceLevel: null,
    attendanceLevel: null,
    supportLevel: null,
  });

  const { data: studentsData, isLoading } = useQuery<StudentsResponse>({
    queryKey: ["teachers", "students"],
    queryFn: async () => {
      const response = await apiClient("/teachers/students");
      return response as StudentsResponse;
    },
    staleTime: 1000 * 60 * 5,
  });

  const students = studentsData?.students || [];

  const handleMessage = (name: string) => {
    alert(`Opening messages for ${name}`);
  };

  const handleCall = (name: string) => {
    alert(`Initiating call with ${name}`);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  const appliedFilters = filteredStudents.filter(student => {
    if (filters.gradeLevel && !student.grade.includes(filters.gradeLevel)) return false;
    if (filters.performanceLevel) {
      if (filters.performanceLevel === "excellent" && student.overall < 80) return false;
      if (filters.performanceLevel === "good" && (student.overall < 70 || student.overall >= 80)) return false;
      if (filters.performanceLevel === "average" && (student.overall < 60 || student.overall >= 70)) return false;
      if (filters.performanceLevel === "poor" && student.overall >= 60) return false;
    }
    if (filters.attendanceLevel) {
      if (filters.attendanceLevel === "excellent" && student.attendance < 90) return false;
      if (filters.attendanceLevel === "good" && (student.attendance < 75 || student.attendance >= 90)) return false;
      if (filters.attendanceLevel === "poor" && student.attendance >= 75) return false;
    }
    if (filters.supportLevel) {
      if (filters.supportLevel === "none" && student.support !== null) return false;
      if (filters.supportLevel === "critical" && student.support !== "Critical Support Needed") return false;
      if (filters.supportLevel === "moderate" && student.support !== "Moderate Support Needed") return false;
      if (filters.supportLevel === "minimal" && student.support !== "Minimal Support Needed") return false;
    }
    return true;
  });

  const uniqueGrades = [...new Set(students.map(s => s.grade.split("-")[0]))].sort();

  const handleFilterChange = (filterType: keyof Filters, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      gradeLevel: null,
      performanceLevel: null,
      attendanceLevel: null,
      supportLevel: null,
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== null).length;

  const sortedStudents = [...appliedFilters].sort((a, b) => {
    if (!sortField || !sortOrder) return 0;
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortOrder(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-gray-400" />;
    if (sortOrder === "asc") return <ArrowUp size={14} className="text-black" />;
    if (sortOrder === "desc") return <ArrowDown size={14} className="text-black" />;
    return <ArrowUpDown size={14} className="text-gray-400" />;
  };

  // Apply pagination
  const totalPages = Math.ceil(sortedStudents.length / pageSize);
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const avgGrade = students.length > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.overall, 0) / students.length) 
    : 0;

  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)
    : 0;

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
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 relative">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-[28px] font-bold mb-2">My Students</h1>
        <p className="text-gray-500 font-medium text-sm sm:text-base">Monitor student performance across all your classes and subjects</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 items-stretch sm:items-center sm:justify-between">
        <div className="flex items-center bg-white border-[1.5px] border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 flex-1 sm:w-[350px]">
          <Search size={18} className="text-gray-400 mr-2 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Search students..."
            className="w-full bg-transparent outline-none text-sm sm:text-[14px] text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-[14px] font-bold transition-colors whitespace-nowrap ${
              showFilters || activeFilterCount > 0
                ? "bg-black text-white"
                : "bg-white border-[1.5px] border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-white text-black px-2 py-0.5 rounded-full text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button className="bg-black text-white px-3 sm:px-6 py-2.5 rounded-lg text-xs sm:text-[14px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap">
            <Download size={16} /> <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white border-[1.5px] border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-4">
            <h3 className="font-bold text-base sm:text-[16px] text-black">Filters</h3>
            {activeFilterCount > 0 && (
              <button 
                onClick={clearAllFilters}
                className="text-xs sm:text-[13px] font-bold text-gray-600 hover:text-black transition-colors flex items-center gap-1 justify-start sm:justify-end"
              >
                <X size={14} /> Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-3">Grade Level</label>
              <div className="space-y-2">
                {uniqueGrades.map(grade => (
                  <label key={grade} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={filters.gradeLevel === grade}
                      onChange={() => handleFilterChange("gradeLevel", grade)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-[13px] text-gray-600">{grade}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-3">Performance</label>
              <div className="space-y-2">
                {[
                  { value: "excellent", label: "Excellent (≥80%)" },
                  { value: "good", label: "Good (70-79%)" },
                  { value: "average", label: "Average (60-69%)" },
                  { value: "poor", label: "Poor (<60%)" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={filters.performanceLevel === option.value}
                      onChange={() => handleFilterChange("performanceLevel", option.value)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-xs sm:text-[13px] text-gray-600">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-3">Attendance</label>
              <div className="space-y-2">
                {[
                  { value: "excellent", label: "Excellent (≥90%)" },
                  { value: "good", label: "Good (75-89%)" },
                  { value: "poor", label: "Poor (<75%)" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={filters.attendanceLevel === option.value}
                      onChange={() => handleFilterChange("attendanceLevel", option.value)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-[13px] text-gray-600">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-3">Support Needed</label>
              <div className="space-y-2">
                {[
                  { value: "none", label: "No Support" },
                  { value: "critical", label: "Critical" },
                  { value: "moderate", label: "Moderate" },
                  { value: "minimal", label: "Minimal" }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={filters.supportLevel === option.value}
                      onChange={() => handleFilterChange("supportLevel", option.value)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-[13px] text-gray-600">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
        <span className="text-xs sm:text-[14px] text-gray-500 font-medium">Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedStudents.length)} of {sortedStudents.length} students</span>
        <div className="flex items-center bg-[#F3F4F6] rounded-full p-1 border border-gray-200 w-fit">
          <button 
            onClick={() => setViewMode("Grid")}
            className={`px-4 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs sm:text-[13px] font-bold shadow-sm transition-colors ${viewMode === "Grid" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setViewMode("Table")}
            className={`px-4 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs sm:text-[13px] font-bold shadow-sm transition-colors ${viewMode === "Table" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
          >
            Table
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-[#374151]">
        <StatCard
          label="Total Students"
          value={String(students.length)}
          progress={100}
          icon={<Users size={24} />}
          trend={{ value: "3.6%", direction: "up", label: "Across all classes" }}
        />
        <StatCard
          label="Need Support"
          value={String(students.filter(s => s.support).length)}
          progress={students.length > 0 ? Math.round((students.filter(s => s.support).length / students.length) * 100) : 0}
          icon={<AlertTriangle size={24} />}
          trend={{ value: "2.3%", direction: "up", label: "from last term" }}
        />
        <StatCard
          label="Class Average"
          value={`${avgGrade}%`}
          progress={avgGrade}
          icon={<Award size={24} />}
          trend={{ value: "", direction: "up", label: "Overall performance" }}
        />
        <StatCard
          label="Avg Attendance"
          value={`${avgAttendance}%`}
          progress={avgAttendance}
          icon={<CheckCircle size={24} />}
          trend={{ value: "", direction: "up", label: "Across all students" }}
        />
      </div>

      {viewMode === "Grid" ? (
        <>
          {paginatedStudents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {paginatedStudents.map(student => (
                <div key={student.id} className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-6 flex flex-col hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-[50px] h-[50px] bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {student.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-[18px] text-[#111827] leading-tight mb-0.5">{student.name}</h3>
                        <p className="text-[13px] text-gray-500">{student.studentId} <br/> <span className="text-[12px]">{student.grade}</span></p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-black transition-colors p-2">
                      <Eye size={20} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 mb-6">
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-gray-500 font-medium">Overall Grade:</span>
                      <span className={`font-bold ${student.overall >= 80 ? "text-blue-500" : "text-black"}`}>{student.overall}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-gray-500 font-medium">Attendance:</span>
                      <span className="font-bold text-black">{student.attendance}%</span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1">
                    <h4 className="font-bold text-[13px] mb-3 text-black">Subject Performance:</h4>
                    <div className="flex flex-col gap-3 mb-4">
                      {student.subjects.map((sub, i) => (
                        <div key={i} className="flex items-center justify-between bg-[#FAFAFA] rounded-md px-3 py-2 border border-gray-100">
                          <div className="flex items-center gap-2 text-[13px] font-semibold text-black">
                            <BookOpen size={14} /> {sub.name} 
                            {sub.trend === "up" && <TrendingUp size={14} className="text-gray-400 ml-1" />}
                            {sub.trend === "down" && <TrendingDown size={14} className="text-gray-400 ml-1" />}
                            {sub.trend === "flat" && <Minus size={14} className="text-gray-400 ml-1" />}
                          </div>
                          <span className="font-bold text-[14px] text-black">{sub.score}%</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto mb-5 h-[28px]">
                      {student.support && (
                        <span className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-[12px] font-bold">
                          {student.support}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <button 
                      onClick={() => handleMessage(student.name)}
                      className="flex-1 bg-black text-white hover:opacity-90 py-3 rounded-xl flex items-center justify-center gap-2 text-[14px] font-bold transition-opacity"
                    >
                      <MessageSquare size={16} /> Message
                    </button>
                    <button 
                      onClick={() => handleCall(student.name)}
                      className="w-[50px] h-[48px] bg-black text-white hover:opacity-90 rounded-xl flex items-center justify-center transition-opacity"
                    >
                      <Phone size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                {search && !activeFilterCount ? (
                  <>
                    <Search size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-[18px] font-bold text-gray-700 mb-2">No students found</h3>
                    <p className="text-gray-500 mb-6">No students match your search "<span className="font-semibold">{search}</span>"</p>
                    <button 
                      onClick={() => setSearch("")}
                      className="px-4 py-2 bg-black text-white rounded-lg text-[14px] font-bold hover:opacity-90 transition-opacity"
                    >
                      Clear Search
                    </button>
                  </>
                ) : activeFilterCount > 0 && !search ? (
                  <>
                    <Filter size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-[18px] font-bold text-gray-700 mb-2">No students match these filters</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filter criteria to find students</p>
                    <button 
                      onClick={clearAllFilters}
                      className="px-4 py-2 bg-black text-white rounded-lg text-[14px] font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <X size={16} /> Clear All Filters
                    </button>
                  </>
                ) : search && activeFilterCount > 0 ? (
                  <>
                    <AlertTriangle size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-[18px] font-bold text-gray-700 mb-2">No results found</h3>
                    <p className="text-gray-500 mb-6">No students match both your search and filters</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSearch("")}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-[14px] font-bold hover:bg-gray-300 transition-colors"
                      >
                        Clear Search
                      </button>
                      <button 
                        onClick={clearAllFilters}
                        className="px-4 py-2 bg-black text-white rounded-lg text-[14px] font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <X size={16} /> Clear Filters
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Users size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-[18px] font-bold text-gray-700 mb-2">No students yet</h3>
                    <p className="text-gray-500">You don't have any students assigned to your classes</p>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {paginatedStudents.length > 0 ? (
            <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left whitespace-nowrap">
                      <button 
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-2 text-[12px] font-bold text-gray-700 hover:text-black transition-colors"
                      >
                        Student Name
                        {getSortIcon("name")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">
                      <button 
                        onClick={() => handleSort("studentId")}
                        className="flex items-center gap-2 text-[12px] font-bold text-gray-700 hover:text-black transition-colors"
                      >
                        Student ID
                        {getSortIcon("studentId")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">
                      <button 
                        onClick={() => handleSort("grade")}
                        className="flex items-center gap-2 text-[12px] font-bold text-gray-700 hover:text-black transition-colors"
                      >
                        Class
                        {getSortIcon("grade")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">
                      <button 
                        onClick={() => handleSort("overall")}
                        className="flex items-center justify-center gap-2 text-[12px] font-bold text-gray-700 hover:text-black transition-colors w-full"
                      >
                        Grade
                        {getSortIcon("overall")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-center whitespace-nowrap">
                      <button 
                        onClick={() => handleSort("attendance")}
                        className="flex items-center justify-center gap-2 text-[12px] font-bold text-gray-700 hover:text-black transition-colors w-full"
                      >
                        Attend.
                        {getSortIcon("attendance")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left whitespace-nowrap text-[12px] font-bold text-gray-700">Subjects</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap text-[12px] font-bold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-center whitespace-nowrap text-[12px] font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student, idx) => (
                    <tr key={student.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-[32px] h-[32px] bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {student.avatar}
                          </div>
                          <span className="font-semibold text-[12px] text-black truncate">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-gray-600 whitespace-nowrap">{student.studentId}</td>
                      <td className="px-4 py-3 text-[12px] text-gray-600 whitespace-nowrap">{student.grade}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className={`font-bold text-[12px] ${student.overall >= 80 ? "text-blue-600" : student.overall >= 70 ? "text-green-600" : "text-red-600"}`}>
                          {student.overall}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className={`font-bold text-[12px] ${student.attendance >= 90 ? "text-green-600" : student.attendance >= 75 ? "text-yellow-600" : "text-red-600"}`}>
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          {student.subjects.map((sub, i) => (
                            <div key={i} className="flex items-center gap-1 text-[11px]">
                              <span className="text-gray-600 truncate">{sub.name}:</span>
                              <span className="font-semibold text-black whitespace-nowrap">{sub.score}%</span>
                              {sub.trend === "up" && <TrendingUp size={10} className="text-green-600 flex-shrink-0" />}
                              {sub.trend === "down" && <TrendingDown size={10} className="text-red-600 flex-shrink-0" />}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {student.support ? (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {student.support === "Critical Support Needed" ? "Critical" : student.support === "Moderate Support Needed" ? "Moderate" : "Minimal"}
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            On Track
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => handleMessage(student.name)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Send message"
                          >
                            <MessageSquare size={14} className="text-gray-600" />
                          </button>
                          <button 
                            onClick={() => handleCall(student.name)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Call student"
                          >
                            <Phone size={14} className="text-gray-600" />
                          </button>
                          <button 
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View profile"
                          >
                            <Eye size={14} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                {search && !activeFilterCount ? (
                  <>
                    <Search size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-[18px] font-bold text-gray-700 mb-2">No students found</h3>
                    <p className="text-gray-500 mb-6">No students match your search "<span className="font-semibold">{search}</span>"</p>
                    <button 
                      onClick={() => setSearch("")}
                      className="px-4 py-2 bg-black text-white rounded-lg text-[14px] font-bold hover:opacity-90 transition-opacity"
                    >
                      Clear Search
                    </button>
                  </>
                ) : activeFilterCount > 0 && !search ? (
                  <>
                    <Filter size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-[18px] font-bold text-gray-700 mb-2">No students match these filters</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filter criteria to find students</p>
                    <button 
                      onClick={clearAllFilters}
                      className="px-4 py-2 bg-black text-white rounded-lg text-[14px] font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <X size={16} /> Clear All Filters
                    </button>
                  </>
                ) : search && activeFilterCount > 0 ? (
                  <>
                    <AlertTriangle size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-[18px] font-bold text-gray-700 mb-2">No results found</h3>
                    <p className="text-gray-500 mb-6">No students match both your search and filters</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSearch("")}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-[14px] font-bold hover:bg-gray-300 transition-colors"
                      >
                        Clear Search
                      </button>
                      <button 
                        onClick={clearAllFilters}
                        className="px-4 py-2 bg-black text-white rounded-lg text-[14px] font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <X size={16} /> Clear Filters
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Users size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-[18px] font-bold text-gray-700 mb-2">No students yet</h3>
                    <p className="text-gray-500">You don't have any students assigned to your classes</p>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{" "}
            <span className="font-semibold">{Math.min(currentPage * pageSize, sortedStudents.length)}</span> of{" "}
            <span className="font-semibold">{sortedStudents.length}</span> students
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

