"use client";

import { Printer, Download, MapPin, Users, Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useState } from "react";

export default function TeacherSchedulePage() {
  const [viewMode, setViewMode] = useState<"Week" | "Day">("Week");

  const handleQuickAction = (actionName: string) => {
    alert(`Triggering: ${actionName}`);
  };
  return (
    <div className="pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold mb-2">My Schedule</h1>
          <p className="text-gray-500 font-medium text-[15px]">View and manage your teaching timetable</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white text-black border-[1.5px] border-gray-200 px-6 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Printer size={16} /> Print
          </button>
          <button className="bg-black text-white px-6 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border-[1.5px] border-gray-200 rounded-xl p-5 flex flex-col justify-between h-[100px]">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 rounded-md p-1.5 text-gray-500">
              <CalendarIcon size={18} />
            </div>
            <span className="text-sm font-semibold text-gray-500">Classes This Week</span>
          </div>
          <div className="text-[28px] font-bold">18</div>
        </div>

        <div className="bg-white border-[1.5px] border-gray-200 rounded-xl p-5 flex flex-col justify-between h-[100px]">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 rounded-md p-1.5 text-gray-500">
              <Clock size={18} />
            </div>
            <span className="text-sm font-semibold text-gray-500">Teaching Hours</span>
          </div>
          <div className="text-[28px] font-bold">24</div>
        </div>

        <div className="bg-white border-[1.5px] border-gray-200 rounded-xl p-5 flex flex-col justify-between h-[100px]">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 rounded-md p-1.5 text-gray-500">
              <Users size={18} />
            </div>
            <span className="text-sm font-semibold text-gray-500">Total Students</span>
          </div>
          <div className="text-[28px] font-bold">120</div>
        </div>

        <div className="bg-white border-[1.5px] border-gray-200 rounded-xl p-5 flex flex-col justify-between h-[100px]">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 rounded-md p-1.5 text-gray-500">
              <MapPin size={18} />
            </div>
            <span className="text-sm font-semibold text-gray-500">Classrooms</span>
          </div>
          <div className="text-[28px] font-bold">4</div>
        </div>
      </div>

      {/* Navigation & Controls */}
      <div className="bg-white border-[1.5px] border-gray-200 rounded-xl p-3 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 px-2">
          <button className="text-gray-400 hover:text-black transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 font-bold text-[15px] text-[#374151]">
            <CalendarIcon size={18} /> Nov 18 - Nov 22, 2024
          </div>
          <button className="text-gray-400 hover:text-black transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex items-center bg-[#F3F4F6] rounded-full p-1 border border-gray-200">
          <button 
            onClick={() => setViewMode("Week")}
            className={`px-5 py-1.5 rounded-full text-[13px] font-bold shadow-sm transition-colors ${viewMode === "Week" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
          >
            Week View
          </button>
          <button 
            onClick={() => setViewMode("Day")}
            className={`px-5 py-1.5 rounded-full text-[13px] font-bold shadow-sm transition-colors ${viewMode === "Day" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
          >
            Day View
          </button>
        </div>
      </div>

      {/* Main Grid: Schedule vs Sidebar */}
      <div className="flex gap-6 items-start">
        
        {/* Left: Weekly Timetable */}
        <div className="flex-1 bg-white border-[1.5px] border-gray-200 rounded-2xl p-6 relative overflow-hidden">
          <h2 className="text-[18px] font-bold mb-6">Weekly Timetable</h2>
          
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr>
                <th className="w-[120px] pb-4 text-left font-medium text-gray-400 text-[13px] border-b border-gray-100">Time</th>
                <th className="pb-4 font-bold text-gray-500 text-[13px] border-b border-gray-100 text-center">Monday</th>
                <th className="pb-4 font-bold text-gray-500 text-[13px] border-b border-gray-100 text-center">Tuesday</th>
                <th className="pb-4 font-bold text-gray-500 text-[13px] border-b border-gray-100 text-center">Wednesday</th>
                <th className="pb-4 font-bold text-gray-500 text-[13px] border-b border-gray-100 text-center">Thursday</th>
                <th className="pb-4 font-bold text-gray-500 text-[13px] border-b border-gray-100 text-center">Friday</th>
              </tr>
            </thead>
            <tbody>
              
              {/* 08:00 - 09:00 */}
              <tr>
                <td className="py-2 pr-4 text-xs font-semibold text-gray-500 align-top pt-4">08:00 - 09:00</td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-full bg-[#EFF6FF] border-[1.5px] border-[#93C5FD] rounded-xl p-3 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-[#1D4ED8]">Mathematics</div>
                    <div className="text-[11px] font-semibold text-[#2563EB] mb-2">Grade 5B</div>
                    <div className="text-[10.5px] text-[#3B82F6] flex items-center gap-1 mt-auto">
                      <MapPin size={11} /> Room 203
                    </div>
                    <div className="text-[10.5px] text-[#3B82F6] flex items-center gap-1 mt-0.5">
                      <Users size={11} /> 28 students
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top"><div className="h-full rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
                <td className="p-2 align-top">
                  <div className="h-full bg-[#EFF6FF] border-[1.5px] border-[#93C5FD] rounded-xl p-3 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-[#1D4ED8]">Mathematics</div>
                    <div className="text-[11px] font-semibold text-[#2563EB] mb-2">Grade 5B</div>
                    <div className="text-[10.5px] text-[#3B82F6] flex items-center gap-1 mt-auto">
                      <MapPin size={11} /> Room 203
                    </div>
                    <div className="text-[10.5px] text-[#3B82F6] flex items-center gap-1 mt-0.5">
                      <Users size={11} /> 28 students
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top"><div className="h-full rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
                <td className="p-2 align-top">
                  <div className="h-full bg-[#EFF6FF] border-[1.5px] border-[#93C5FD] rounded-xl p-3 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-[#1D4ED8]">Mathematics</div>
                    <div className="text-[11px] font-semibold text-[#2563EB] mb-2">Grade 5B</div>
                    <div className="text-[10.5px] text-[#3B82F6] flex items-center gap-1 mt-auto">
                      <MapPin size={11} /> Room 203
                    </div>
                    <div className="text-[10.5px] text-[#3B82F6] flex items-center gap-1 mt-0.5">
                      <Users size={11} /> 28 students
                    </div>
                  </div>
                </td>
              </tr>

              {/* 09:00 - 10:00 */}
              <tr>
                <td className="py-2 pr-4 text-xs font-semibold text-gray-500 align-top pt-4">09:00 - 10:00</td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-full bg-[#F0FDF4] border-[1.5px] border-[#86EFAC] rounded-xl p-3 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-[#15803D]">Mathematics</div>
                    <div className="text-[11px] font-semibold text-[#16A34A] mb-2">Grade 5A</div>
                    <div className="text-[10.5px] text-[#22C55E] flex items-center gap-1 mt-auto">
                      <MapPin size={11} /> Room 204
                    </div>
                    <div className="text-[10.5px] text-[#22C55E] flex items-center gap-1 mt-0.5">
                      <Users size={11} /> 24 students
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-full bg-[#F0FDF4] border-[1.5px] border-[#86EFAC] rounded-xl p-3 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-[#15803D]">Mathematics</div>
                    <div className="text-[11px] font-semibold text-[#16A34A] mb-2">Grade 5A</div>
                    <div className="text-[10.5px] text-[#22C55E] flex items-center gap-1 mt-auto">
                      <MapPin size={11} /> Room 204
                    </div>
                    <div className="text-[10.5px] text-[#22C55E] flex items-center gap-1 mt-0.5">
                      <Users size={11} /> 24 students
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
              </tr>

              {/* 10:00 - 11:00 */}
              <tr>
                <td className="py-2 pr-4 text-xs font-semibold text-gray-500 align-top pt-4">10:00 - 11:00</td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-full bg-[#FAF5FF] border-[1.5px] border-[#D8B4FE] rounded-xl p-3 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-[#7E22CE]">Mathematics</div>
                    <div className="text-[11px] font-semibold text-[#9333EA] mb-2">Grade 6B</div>
                    <div className="text-[10.5px] text-[#A855F7] flex items-center gap-1 mt-auto">
                      <MapPin size={11} /> Room 205
                    </div>
                    <div className="text-[10.5px] text-[#A855F7] flex items-center gap-1 mt-0.5">
                      <Users size={11} /> 28 students
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-full bg-[#FAF5FF] border-[1.5px] border-[#D8B4FE] rounded-xl p-3 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-[#7E22CE]">Mathematics</div>
                    <div className="text-[11px] font-semibold text-[#9333EA] mb-2">Grade 6B</div>
                    <div className="text-[10.5px] text-[#A855F7] flex items-center gap-1 mt-auto">
                      <MapPin size={11} /> Room 205
                    </div>
                    <div className="text-[10.5px] text-[#A855F7] flex items-center gap-1 mt-0.5">
                      <Users size={11} /> 28 students
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-full bg-[#FAF5FF] border-[1.5px] border-[#D8B4FE] rounded-xl p-3 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-[#7E22CE]">Mathematics</div>
                    <div className="text-[11px] font-semibold text-[#9333EA] mb-2">Grade 6B</div>
                    <div className="text-[10.5px] text-[#A855F7] flex items-center gap-1 mt-auto">
                      <MapPin size={11} /> Room 205
                    </div>
                    <div className="text-[10.5px] text-[#A855F7] flex items-center gap-1 mt-0.5">
                      <Users size={11} /> 28 students
                    </div>
                  </div>
                </td>
              </tr>

              {/* 11:00 - 12:00 */}
              <tr>
                <td className="py-2 pr-4 text-xs font-semibold text-gray-500 align-top pt-4">11:00 - 12:00</td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-full bg-[#FFF7ED] border-[1.5px] border-[#FDBA74] rounded-xl p-3 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-[#C2410C]">Algebra II</div>
                    <div className="text-[11px] font-semibold text-[#EA580C] mb-2">Grade 7A</div>
                    <div className="text-[10.5px] text-[#F97316] flex items-center gap-1 mt-auto">
                      <MapPin size={11} /> Room 203
                    </div>
                    <div className="text-[10.5px] text-[#F97316] flex items-center gap-1 mt-0.5">
                      <Users size={11} /> 22 students
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-full bg-[#FFF7ED] border-[1.5px] border-[#FDBA74] rounded-xl p-3 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-[#C2410C]">Algebra II</div>
                    <div className="text-[11px] font-semibold text-[#EA580C] mb-2">Grade 7A</div>
                    <div className="text-[10.5px] text-[#F97316] flex items-center gap-1 mt-auto">
                      <MapPin size={11} /> Room 203
                    </div>
                    <div className="text-[10.5px] text-[#F97316] flex items-center gap-1 mt-0.5">
                      <Users size={11} /> 22 students
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
              </tr>

              {/* 12:00 - 13:00 LUNCH */}
              <tr>
                <td className="py-2 pr-4 text-xs font-semibold text-gray-500 align-top pt-4">12:00 - 13:00</td>
                {[...Array(5)].map((_, i) => (
                  <td key={i} className="p-2 align-top h-[60px]">
                    <div className="h-full bg-gray-50 border-[1.5px] border-gray-200 rounded-xl p-3 flex flex-col justify-center items-center gap-1">
                      <div className="font-bold text-[12px] text-gray-600">Lunch Break</div>
                      <div className="text-[10px] text-gray-400 flex items-center gap-1">
                        <MapPin size={10} /> Staff Room
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* 13:00 - 14:00 */}
              <tr>
                <td className="py-2 pr-4 text-xs font-semibold text-gray-500 align-top pt-4">13:00 - 14:00</td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-full bg-[#FDF2F8] border-[1.5px] border-[#F9A8D4] rounded-xl p-3 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-[#BE185D]">Calculus</div>
                    <div className="text-[11px] font-semibold text-[#DB2777] mb-2">Grade 8B</div>
                    <div className="text-[10.5px] text-[#EC4899] flex items-center gap-1 mt-auto">
                      <MapPin size={11} /> Room 206
                    </div>
                    <div className="text-[10.5px] text-[#EC4899] flex items-center gap-1 mt-0.5">
                      <Users size={11} /> 20 students
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-full bg-[#FDF2F8] border-[1.5px] border-[#F9A8D4] rounded-xl p-3 flex flex-col justify-center">
                    <div className="font-bold text-[13px] text-[#BE185D]">Calculus</div>
                    <div className="text-[11px] font-semibold text-[#DB2777] mb-2">Grade 8B</div>
                    <div className="text-[10.5px] text-[#EC4899] flex items-center gap-1 mt-auto">
                      <MapPin size={11} /> Room 206
                    </div>
                    <div className="text-[10.5px] text-[#EC4899] flex items-center gap-1 mt-0.5">
                      <Users size={11} /> 20 students
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
              </tr>

              {/* 14:00 - 15:00 */}
              <tr>
                <td className="py-2 pr-4 text-xs font-semibold text-gray-500 align-top pt-4">14:00 - 15:00</td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-[75px] bg-[#FEFCE8] border-[1.5px] border-[#FDE047] rounded-xl p-3 flex flex-col justify-center mb-2">
                    <div className="font-bold text-[12px] text-[#A16207]">Office Hours</div>
                    <div className="text-[10px] text-[#CA8A04] flex items-center gap-1 mt-1">
                      <MapPin size={10} /> Room 203
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top"><div className="h-[110px] rounded-xl border-[1.5px] border-dashed border-gray-200"></div></td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-[75px] bg-[#FEFCE8] border-[1.5px] border-[#FDE047] rounded-xl p-3 flex flex-col justify-center mb-2">
                    <div className="font-bold text-[12px] text-[#A16207]">Office Hours</div>
                    <div className="text-[10px] text-[#CA8A04] flex items-center gap-1 mt-1">
                      <MapPin size={10} /> Room 203
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top h-[110px]">
                  <div className="h-[75px] bg-[#EEF2FF] border-[1.5px] border-[#A5B4FC] rounded-xl p-3 flex flex-col justify-center mb-2">
                    <div className="font-bold text-[12px] text-[#4338CA]">Staff Meeting</div>
                    <div className="text-[10px] text-[#6366F1] flex items-center gap-1 mt-1">
                      <MapPin size={10} /> Conference Room
                    </div>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] flex flex-col gap-6">
          
          {/* Upcoming Classes */}
          <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-6">
            <h2 className="text-[16px] font-bold mb-4">Upcoming Classes</h2>
            <div className="flex flex-col gap-4">
              
              <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl p-4">
                <div className="font-bold text-[14px]">Mathematics</div>
                <div className="text-[12px] text-gray-500 font-medium mb-3">Grade 5B</div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                    <Clock size={14} className="text-gray-400" /> Tomorrow, 08:00 AM
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                    <MapPin size={14} className="text-gray-400" /> Room 203
                  </div>
                </div>
              </div>

              <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl p-4">
                <div className="font-bold text-[14px]">Mathematics</div>
                <div className="text-[12px] text-gray-500 font-medium mb-3">Grade 5A</div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                    <Clock size={14} className="text-gray-400" /> Tomorrow, 09:00 AM
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                    <MapPin size={14} className="text-gray-400" /> Room 204
                  </div>
                </div>
              </div>

              <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl p-4">
                <div className="font-bold text-[14px]">Mathematics</div>
                <div className="text-[12px] text-gray-500 font-medium mb-3">Grade 6B</div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                    <Clock size={14} className="text-gray-400" /> Tomorrow, 10:00 AM
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                    <MapPin size={14} className="text-gray-400" /> Room 205
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Class Legend */}
          <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-6">
            <h2 className="text-[16px] font-bold mb-4">Class Legend</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded border-[1.5px] border-[#93C5FD] bg-[#EFF6FF]"></div>
                <span className="text-[14px] text-gray-600 font-medium">Grade 5B</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded border-[1.5px] border-[#86EFAC] bg-[#F0FDF4]"></div>
                <span className="text-[14px] text-gray-600 font-medium">Grade 5A</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded border-[1.5px] border-[#D8B4FE] bg-[#FAF5FF]"></div>
                <span className="text-[14px] text-gray-600 font-medium">Grade 6B</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded border-[1.5px] border-[#FDBA74] bg-[#FFF7ED]"></div>
                <span className="text-[14px] text-gray-600 font-medium">Grade 7A</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded border-[1.5px] border-[#F9A8D4] bg-[#FDF2F8]"></div>
                <span className="text-[14px] text-gray-600 font-medium">Grade 8B</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded border-[1.5px] border-gray-200 bg-gray-50"></div>
                <span className="text-[14px] text-gray-600 font-medium">Break/Other</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-6">
            <h2 className="text-[16px] font-bold mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleQuickAction("Request Schedule Change")} className="w-full bg-black text-white px-4 py-3 rounded-xl text-[13px] font-bold hover:opacity-90 transition-opacity">
                Request Schedule Change
              </button>
              <button onClick={() => handleQuickAction("View Room Availability")} className="w-full bg-white text-gray-700 border-[1.5px] border-gray-200 px-4 py-3 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-colors">
                View Room Availability
              </button>
              <button onClick={() => handleQuickAction("Sync to Calendar")} className="w-full bg-white text-gray-700 border-[1.5px] border-gray-200 px-4 py-3 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-colors">
                Sync to Calendar
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
