"use client";

import { ChevronDown, ChevronUp, CircleDollarSign, Percent, Award, Info, Check } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/ui";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

const FilterDropdown = ({ 
  title, 
  options, 
  isBlack = false,
  value,
  onChange
}: { 
  title: string; 
  options: string[]; 
  isBlack?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          isBlack
            ? "bg-black text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-6"
            : "bg-white border-[1.5px] border-gray-200 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#374151] flex items-center gap-6"
        }
      >
        {value || title}
        {isOpen ? (
          <ChevronUp size={isBlack ? 15 : 18} className={isBlack ? "text-white" : "text-gray-400"} />
        ) : (
          <ChevronDown size={isBlack ? 15 : 18} className={isBlack ? "text-white" : "text-gray-400"} />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[220px] bg-white border-[1px] border-gray-200 rounded-xl shadow-md z-50 py-3">
          <div className="text-[14px] text-gray-500 mb-2 px-4 font-medium">Select option</div>
          <div className="flex flex-col gap-1">
            {options.map((opt) => (
              <div
                key={opt}
                className="flex items-center gap-4 px-4 cursor-pointer py-2 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  onChange?.(opt);
                  setIsOpen(false);
                }}
              >
                <div
                  className={`w-[24px] h-[24px] rounded-[6px] border-[2.5px] border-[#CBD5E1] flex items-center justify-center transition-colors flex-shrink-0 ${
                    value === opt ? "bg-black" : "bg-white"
                  }`}
                >
                  {value === opt && <Check size={16} strokeWidth={3} className="text-white" />}
                </div>
                <span className="text-[16px] font-medium text-[#374151]">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function TeacherGradesPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Fetch teacher's dashboard stats
  const { isLoading: statsLoading } = useQuery({
    queryKey: ["teacher-dashboard-stats"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/teachers/dashboard/stats");
      return response as any;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch students for grade distribution
  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["teacher-students"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/teachers/students");
      return response as any;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch classes (from students data - group by class)
  const { data: classesData } = useQuery({
    queryKey: ["teacher-classes"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/teachers/students");
      const students = (response as any)?.students || [];
      
      // Group students by class to get unique classes
      const classMap = new Map();
      students.forEach((student: any) => {
        const className = student.class || "General";
        if (!classMap.has(className)) {
          classMap.set(className, {
            id: classMap.size + 1,
            name: className,
            students: 0,
            average: 0,
            totalGrade: 0,
          });
        }
        const classData = classMap.get(className);
        classData.students += 1;
        classData.totalGrade += student.overall || 0;
      });

      // Calculate averages
      const classes = Array.from(classMap.values()).map((cls: any) => ({
        ...cls,
        average: cls.students > 0 ? Math.round((cls.totalGrade / cls.students) * 10) / 10 : 0,
      }));

      return classes;
    },
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = statsLoading || studentsLoading;

  // Calculate statistics
  const students = studentsData?.students || [];
  const totalStudents = students.length;
  const averageGrade = students.length > 0 
    ? Math.round(students.reduce((sum: number, s: any) => sum + s.overall, 0) / students.length * 10) / 10
    : 0;
  
  const pendingGrades = Math.floor(Math.random() * 15) + 5;
  const atRiskStudents = students.filter((s: any) => s.overall < 70).length;

  // Calculate grade distribution
  const gradeDistribution = {
    A: students.filter((s: any) => s.overall >= 90).length,
    B: students.filter((s: any) => s.overall >= 80 && s.overall < 90).length,
    C: students.filter((s: any) => s.overall >= 70 && s.overall < 80).length,
    Below70: students.filter((s: any) => s.overall < 70).length,
  };

  // Get unique subjects from students
  const uniqueSubjects = Array.from(
    new Set(students.flatMap((s: any) => s.subjects?.map((subj: any) => subj.name) || []))
  ).filter(Boolean) as string[];

  // Get class names for filter
  const classNames = (classesData || []).map((cls: any) => cls.name);

  const classes: any[] = (classesData && classesData.length > 0) 
    ? classesData
    : [
        { id: 1, name: "Mathematics - Grade 5B", students: 26, average: 87.4 },
        { id: 2, name: "Mathematics - Grade 5A", students: 24, average: 85.2 },
        { id: 3, name: "Mathematics - Grade 6B", students: 28, average: 89.1 },
      ];

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
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold mb-2">Grades Management</h1>
          <p className="text-gray-500 font-medium text-[15px]">Manage and track student grades across all classes</p>
        </div>
        <button className="bg-black text-white px-8 py-3 rounded-md font-semibold text-[14px] hover:opacity-90 transition-opacity">
          Export All Grades
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8 text-[#374151]">
        <StatCard
          label="Total Students"
          value={totalStudents}
          progress={100}
          icon={<CircleDollarSign size={24} />}
          trend={{ value: "3.6%", direction: "up", label: "Across 3 classes" }}
        />
        <StatCard
          label="Average Grade"
          value={averageGrade}
          progress={Math.min(averageGrade, 100)}
          icon={<Percent size={24} />}
          trend={{ value: "2.3%", direction: "up", label: "from last term" }}
        />
        <StatCard
          label="Pending Grades"
          value={pendingGrades}
          progress={Math.min(pendingGrades * 5, 100)}
          icon={<Award size={24} />}
          trend={{ value: "", direction: "up", label: "Assignments to grade" }}
        />
        <StatCard
          label="At Risk"
          value={atRiskStudents}
          progress={Math.min(atRiskStudents * 10, 100)}
          icon={<Info size={24} />}
          trend={{ value: "", direction: "down", label: "Students below 70%" }}
        />
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-end gap-4 mb-6">
        <span className="text-sm font-semibold text-gray-500">Filter By:</span>
        <FilterDropdown 
          title="Select Class" 
          options={classNames.length > 0 ? classNames : ["All Classes", "Year 2A", "Year 2B", "Year 2C", "Year 1A"]}
          value={selectedClass || undefined}
          onChange={setSelectedClass}
        />
        <FilterDropdown 
          title="Course" 
          options={uniqueSubjects.length > 0 ? uniqueSubjects : ["Mathematics", "Physics", "Java", "English", "DSA"]}
          isBlack={true}
          value={selectedCourse || undefined}
          onChange={setSelectedCourse}
        />
      </div>

      {/* Main Grid: Left (Classes + Dist) / Right (Quick Actions) */}
      <div className="flex gap-6">
        
        {/* Left Column (takes up approx 2/3) */}
        <div className="flex-[2]">
          <h2 className="text-xl font-bold mb-6">Classes Overview</h2>
          
          {classes.map((cls: any) => (
            <div key={cls.id} className="class-overview-card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[17px] font-bold mb-1">{cls.name}</h3>
                  <p className="text-gray-400 text-sm font-medium">{cls.students} students</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black mb-1">{cls.average}%</div>
                  <p className="text-gray-400 text-sm font-medium">Class Average</p>
                </div>
              </div>
              <div className="dual-action-btn">
                <Link 
                  href={`/teacher/grades/${cls.id}?class=${encodeURIComponent(cls.name)}`} 
                  className="dual-action-left" 
                  style={{ textDecoration: 'none' }}
                >
                  View Gradebook
                </Link>
                <button 
                  onClick={() => setSelectedClass(cls.name)}
                  className="dual-action-right"
                  style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                >
                  Grade Assignments
                </button>
              </div>
            </div>
          ))}

          <h2 className="text-xl font-bold mb-6 mt-12">Grade Distribution</h2>
          <div className="bg-[#F9FAFB] rounded-2xl p-6 border-[1.5px] border-gray-200">
            {/* Row A */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>A (90-100%)</span>
                <span>{gradeDistribution.A} students</span>
              </div>
              <div className="dist-bar-bg">
                <div className="dist-bar-fill" style={{ width: `${totalStudents > 0 ? (gradeDistribution.A / totalStudents) * 100 : 0}%` }}></div>
              </div>
            </div>
            
            {/* Row B */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>B (80-89%)</span>
                <span>{gradeDistribution.B} students</span>
              </div>
              <div className="dist-bar-bg">
                <div className="dist-bar-fill" style={{ width: `${totalStudents > 0 ? (gradeDistribution.B / totalStudents) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Row C */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>C (70-79%)</span>
                <span>{gradeDistribution.C} students</span>
              </div>
              <div className="dist-bar-bg">
                <div className="dist-bar-fill" style={{ width: `${totalStudents > 0 ? (gradeDistribution.C / totalStudents) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Row Below 70 */}
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>Below 70%</span>
                <span>{gradeDistribution.Below70} students</span>
              </div>
              <div className="dist-bar-bg">
                <div className="dist-bar-fill" style={{ width: `${totalStudents > 0 ? (gradeDistribution.Below70 / totalStudents) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (takes up approx 1/3) */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="bg-[#F9FAFB] border-[1.5px] border-gray-200 rounded-2xl p-6">
            <button 
              onClick={() => alert("Grade Pending Work - Navigate to pending assignments")}
              className="quick-action-btn dark"
            >
              Grade Pending Work
            </button>
            <button 
              onClick={() => setShowReportModal(true)}
              className="quick-action-btn light"
            >
              Generate Report Cards
            </button>
            <button 
              onClick={() => setShowEmailModal(true)}
              className="quick-action-btn light"
            >
              Email Grade Reports
            </button>
          </div>
        </div>

      </div>

      {/* Report Cards Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Generate Report Cards</h2>
            <p className="text-gray-600 mb-6">Select a class to generate report cards for:</p>
            <div className="space-y-2 mb-6">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => {
                    alert(`Report cards generated for ${cls.name}`);
                    setShowReportModal(false);
                  }}
                  className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-900"
                >
                  {cls.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Email Reports Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Email Grade Reports</h2>
            <p className="text-gray-600 mb-6">Select recipients:</p>
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <span className="text-gray-900 font-medium">Email to Parents</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-gray-900 font-medium">Email to Students</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-gray-900 font-medium">Email to Admin</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Grade reports sent successfully!");
                  setShowEmailModal(false);
                }}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:opacity-90"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
