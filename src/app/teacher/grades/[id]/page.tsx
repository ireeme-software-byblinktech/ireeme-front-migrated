"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Filter, Search } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

export default function GradebookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const className = searchParams.get("class") || "General";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | "grade">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<"all" | "passing" | "at-risk">("all");
  const [filterGrade, setFilterGrade] = useState<"all" | "A" | "B" | "C" | "F">("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Fetch students for this class
  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["teacher-students", className],
    queryFn: async () => {
      const response = await apiClient("/api/v1/teachers/students");
      const students = (response as any)?.students || [];
      
      // Filter students by class
      return students.filter((s: any) => s.class === className || className === "General");
    },
    staleTime: 1000 * 60 * 5,
  });

  const students = studentsData || [];

  // Filter and sort students
  const filteredStudents = students
    .filter((s: any) => {
      // Search filter
      const matchesSearch = 
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Status filter
      const grade = s.overall || 0;
      if (filterStatus === "passing" && grade < 70) return false;
      if (filterStatus === "at-risk" && grade >= 70) return false;

      // Grade filter
      if (filterGrade !== "all") {
        const gradeLabel = 
          grade >= 90 ? "A" :
          grade >= 80 ? "B" :
          grade >= 70 ? "C" : "F";
        if (gradeLabel !== filterGrade) return false;
      }

      return true;
    })
    .sort((a: any, b: any) => {
      let aVal = sortField === "name" ? a.name : a.overall;
      let bVal = sortField === "name" ? b.name : b.overall;
      
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field: "name" | "grade") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIndicator = (field: "name" | "grade") => {
    if (sortField !== field) return "";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "bg-green-100 text-green-700";
    if (grade >= 80) return "bg-blue-100 text-blue-700";
    if (grade >= 70) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getGradeLabel = (grade: number) => {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    return "F";
  };

  if (isLoading) {
    return (
      <div className="pb-10">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-100 rounded-lg w-96 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-[32px] font-bold text-black mb-1">Gradebook</h1>
          <p className="text-[#64748B] text-base">{className}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Students</p>
          <p className="text-3xl font-bold text-black">{students.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Class Average</p>
          <p className="text-3xl font-bold text-black">
            {students.length > 0
              ? Math.round(
                  (students.reduce((sum: number, s: any) => sum + (s.overall || 0), 0) /
                    students.length) *
                    10
                ) / 10
              : 0}
            %
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Highest Grade</p>
          <p className="text-3xl font-bold text-green-600">
            {students.length > 0 ? Math.max(...students.map((s: any) => s.overall || 0)) : 0}%
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Lowest Grade</p>
          <p className="text-3xl font-bold text-red-600">
            {students.length > 0 ? Math.min(...students.map((s: any) => s.overall || 0)) : 0}%
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, student ID, or email..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none"
          />
        </div>
        <button 
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors relative"
        >
          <Filter size={20} className="text-gray-600" />
          {(filterStatus !== "all" || filterGrade !== "all") && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></span>
          )}
        </button>
        <button className="p-3 bg-black text-white hover:opacity-90 rounded-lg transition-opacity flex items-center gap-2">
          <Download size={20} />
          Export
        </button>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Filter by Status</h3>
              <div className="space-y-2">
                {[
                  { value: "all", label: "All Students" },
                  { value: "passing", label: "Passing (≥70%)" },
                  { value: "at-risk", label: "At Risk (<70%)" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={filterStatus === option.value}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Grade Filter */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Filter by Grade</h3>
              <div className="space-y-2">
                {[
                  { value: "all", label: "All Grades" },
                  { value: "A", label: "A (90-100%)" },
                  { value: "B", label: "B (80-89%)" },
                  { value: "C", label: "C (70-79%)" },
                  { value: "F", label: "F (<70%)" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="grade"
                      value={option.value}
                      checked={filterGrade === option.value}
                      onChange={(e) => setFilterGrade(e.target.value as any)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterGrade("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Results Counter */}
      <div className="mb-4 text-sm text-gray-600">
        Showing <span className="font-bold text-gray-900">{filteredStudents.length}</span> of{" "}
        <span className="font-bold text-gray-900">{students.length}</span> students
        {(searchQuery || filterStatus !== "all" || filterGrade !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterStatus("all");
              setFilterGrade("all");
            }}
            className="ml-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Gradebook Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  <button
                    onClick={() => handleSort("name")}
                    className="hover:text-black transition-colors"
                  >
                    Student Name {getSortIndicator("name")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Student ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  <button
                    onClick={() => handleSort("grade")}
                    className="hover:text-black transition-colors"
                  >
                    Overall Grade {getSortIndicator("grade")}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Grade</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Attendance</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student: any) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.studentId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.email || "N/A"}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{student.overall || 0}%</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-sm ${getGradeColor(
                          student.overall || 0
                        )}`}
                      >
                        {getGradeLabel(student.overall || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.attendance || 0}%
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full font-medium text-xs ${
                          (student.overall || 0) >= 70
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {(student.overall || 0) >= 70 ? "Passing" : "At Risk"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-500 font-medium">No students found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Grade Distribution</h3>
          <div className="space-y-3">
            {[
              { label: "A (90-100%)", count: students.filter((s: any) => (s.overall || 0) >= 90).length },
              { label: "B (80-89%)", count: students.filter((s: any) => (s.overall || 0) >= 80 && (s.overall || 0) < 90).length },
              { label: "C (70-79%)", count: students.filter((s: any) => (s.overall || 0) >= 70 && (s.overall || 0) < 80).length },
              { label: "F (<70%)", count: students.filter((s: any) => (s.overall || 0) < 70).length },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="font-bold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Passing Rate</span>
              <span className="font-bold text-green-600">
                {students.length > 0
                  ? Math.round(
                      ((students.filter((s: any) => (s.overall || 0) >= 70).length / students.length) *
                        100)
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">At Risk</span>
              <span className="font-bold text-red-600">
                {students.length > 0
                  ? Math.round(
                      ((students.filter((s: any) => (s.overall || 0) < 70).length / students.length) *
                        100)
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Attendance</span>
              <span className="font-bold text-gray-900">
                {students.length > 0
                  ? Math.round(
                      (students.reduce((sum: number, s: any) => sum + (s.attendance || 0), 0) /
                        students.length) *
                        10
                    ) / 10
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-black text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
              Export Grades
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
              Email Report
            </button>
            <Link
              href="/teacher/grades"
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors text-center"
            >
              Back to Grades
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
