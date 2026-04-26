"use client";

import { useState } from "react";
import { Search, Download, Users, AlertTriangle, Award, CheckCircle, Eye, BookOpen, TrendingUp, TrendingDown, Minus, MessageSquare, Phone } from "lucide-react";
import { StatCard } from "@/components/ui";

export default function TeacherStudentsPage() {
  const [viewMode, setViewMode] = useState<"Grid" | "Table">("Grid");
  const [search, setSearch] = useState("");

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      studentId: "STU2024001",
      grade: "Grade 10-A",
      overall: 87,
      attendance: 94,
      subjects: [
        { name: "Mathematics", icon: <BookOpen size={14} />, trend: "up", score: 88, color: "text-black" },
        { name: "Algebra II", icon: <BookOpen size={14} />, trend: "flat", score: 85, color: "text-black" }
      ],
      support: null,
      avatar: "AJ"
    },
    {
      id: 2,
      name: "Bob Smith",
      studentId: "STU2024002",
      grade: "Grade 10-A",
      overall: 62,
      attendance: 78,
      subjects: [
        { name: "Mathematics", icon: <BookOpen size={14} />, trend: "down", score: 62, color: "text-black" }
      ],
      support: "Critical Support Needed",
      avatar: "BS"
    },
    {
      id: 3,
      name: "Charlie Brown",
      studentId: "STU2024003",
      grade: "Grade 10-B",
      overall: 75,
      attendance: 88,
      subjects: [
        { name: "Geometry", icon: <BookOpen size={14} />, trend: "up", score: 75, color: "text-black" }
      ],
      support: "Moderate Support Needed",
      avatar: "CB"
    },
    {
      id: 4,
      name: "Diana Prince",
      studentId: "STU2024004",
      grade: "Grade 11-A",
      overall: 93,
      attendance: 97,
      subjects: [
        { name: "Algebra II", icon: <BookOpen size={14} />, trend: "up", score: 94, color: "text-black" },
        { name: "Calculus", icon: <BookOpen size={14} />, trend: "flat", score: 91, color: "text-black" }
      ],
      support: null,
      avatar: "DP"
    },
    {
      id: 5,
      name: "Ethan Hunt",
      studentId: "STU2024005",
      grade: "Grade 12-A",
      overall: 79,
      attendance: 85,
      subjects: [
        { name: "Calculus", icon: <BookOpen size={14} />, trend: "down", score: 79, color: "text-black" }
      ],
      support: "Minimal Support Needed",
      avatar: "EH"
    }
  ]);

  const handleMessage = (name: string) => {
    alert(`Opening messages for ${name}`);
  };

  const handleCall = (name: string) => {
    alert(`Initiating call with ${name}`);
  };

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase()));

  const avgGrade = Math.round(students.reduce((acc, s) => acc + s.overall, 0) / students.length) || 0;

  return (
    <div className="pb-10 relative">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold mb-2">My Students</h1>
        <p className="text-gray-500 font-medium text-[15px]">Monitor student performance across all your classes and subjects</p>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center bg-white border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 w-[350px]">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search students..."
            className="w-full bg-transparent outline-none text-[14px] text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="bg-black text-white px-6 rounded-lg text-[14px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity h-11">
          <Download size={16} /> Export
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-[14px] text-gray-500 font-medium">Showing {filteredStudents.length} of {students.length} students</span>
        <div className="flex items-center bg-[#F3F4F6] rounded-full p-1 border border-gray-200">
          <button 
            onClick={() => setViewMode("Grid")}
            className={`px-5 py-1.5 rounded-full text-[13px] font-bold shadow-sm transition-colors ${viewMode === "Grid" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setViewMode("Table")}
            className={`px-5 py-1.5 rounded-full text-[13px] font-bold shadow-sm transition-colors ${viewMode === "Table" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-10 text-[#374151]">
        <StatCard
          label="Total Students"
          value={String(students.length)}
          progress={100}
          icon={<Users size={24} />}
          trend={{ value: "3.6%", direction: "up", label: "Across 3 classes" }}
        />
        <StatCard
          label="Need Support"
          value={String(students.filter(s => s.support).length)}
          progress={30}
          icon={<AlertTriangle size={24} />}
          trend={{ value: "2.3%", direction: "up", label: "from last term" }}
        />
        <StatCard
          label="Class Average"
          value={`${avgGrade}%`}
          progress={avgGrade}
          icon={<Award size={24} />}
          trend={{ value: "", direction: "up", label: "Assignments to grade" }}
        />
        <StatCard
          label="Avg Attendance"
          value="4"
          progress={40}
          icon={<CheckCircle size={24} />}
          trend={{ value: "", direction: "down", label: "Students below 70%" }}
        />
      </div>

      {/* View Engine */}
      {viewMode === "Grid" ? (
        <div className="grid grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <div key={student.id} className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-6 flex flex-col hover:shadow-sm transition-shadow">
              
              {/* Top Row: Avatar & Eye */}
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

              {/* Core Metrics */}
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

              {/* Advanced Subject Performance */}
              <div className="flex flex-col flex-1">
                <h4 className="font-bold text-[13px] mb-3 text-black">Subject Performance:</h4>
                <div className="flex flex-col gap-3 mb-4">
                  {student.subjects.map((sub, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#FAFAFA] rounded-md px-3 py-2 border border-gray-100">
                      <div className={`flex items-center gap-2 text-[13px] font-semibold ${sub.color}`}>
                        {sub.icon} {sub.name} 
                        {sub.trend === "up" && <TrendingUp size={14} className="text-gray-400 ml-1" />}
                        {sub.trend === "down" && <TrendingDown size={14} className="text-gray-400 ml-1" />}
                        {sub.trend === "flat" && <Minus size={14} className="text-gray-400 ml-1" />}
                      </div>
                      <span className={`font-bold text-[14px] ${sub.color}`}>{sub.score}%</span>
                    </div>
                  ))}
                </div>

                {/* Support Pill logic */}
                <div className="mt-auto mb-5 h-[28px]">
                  {student.support && (
                    <span className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-[12px] font-bold">
                      {student.support}
                    </span>
                  )}
                </div>
                
              </div>

              {/* Footer Actions */}
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
        <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-6 text-center text-gray-500 font-medium py-20">
          Table view design is not requested yet. Switch back to Grid view!
        </div>
      )}

    </div>
  );
}
