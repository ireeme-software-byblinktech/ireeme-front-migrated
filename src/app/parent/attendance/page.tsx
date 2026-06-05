"use client";

import { useState } from "react";
import { ChildTabs } from "@/components/parent/ChildTabs";
import { DataTable, Column } from "@/components/ui/DataTable";
import { 
  Filter, 
  ChevronDown, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp,
  Calendar as CalendarIcon,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { StatCard } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AttendanceRecord {
  id: string;
  day: string;
  date: string;
  status: "Present" | "Absent" | "Late";
  time?: string;
}

const ATTENDANCE_DATA: Record<string, AttendanceRecord[]> = {
  "Joel Queen": [
    { id: "1", day: "Monday", date: "25/5/2026", status: "Present", time: "07:30 AM" },
    { id: "2", day: "Tuesday", date: "26/5/2026", status: "Absent" },
    { id: "3", day: "Wednesday", date: "27/5/2026", status: "Present", time: "07:45 AM" },
    { id: "4", day: "Thursday", date: "28/5/2026", status: "Late", time: "08:15 AM" },
    { id: "5", day: "Friday", date: "29/5/2026", status: "Present", time: "07:25 AM" },
    { id: "6", day: "Monday", date: "01/6/2026", status: "Present", time: "07:35 AM" },
    { id: "7", day: "Tuesday", date: "02/6/2026", status: "Present", time: "07:40 AM" },
  ],
  "Jane Doe": [
    { id: "1", day: "Monday", date: "25/5/2026", status: "Present", time: "07:30 AM" },
    { id: "2", day: "Tuesday", date: "26/5/2026", status: "Present", time: "07:30 AM" },
    { id: "3", day: "Wednesday", date: "27/5/2026", status: "Present", time: "07:30 AM" },
    { id: "4", day: "Thursday", date: "28/5/2026", status: "Present", time: "07:30 AM" },
    { id: "5", day: "Friday", date: "29/5/2026", status: "Absent" },
  ],
  "Jack Peele": [
    { id: "1", day: "Monday", date: "25/5/2026", status: "Absent" },
    { id: "2", day: "Tuesday", date: "26/5/2026", status: "Present", time: "07:30 AM" },
    { id: "3", day: "Wednesday", date: "27/5/2026", status: "Present", time: "07:30 AM" },
  ]
};

const CHILDREN = ["Joel Queen", "Jane Doe", "Jack Peele"];

export default function AttendancePage() {
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026

  const columns: Column<AttendanceRecord>[] = [
    { 
      key: "day", 
      header: "Day", 
      width: "20%",
      render: (val) => <span className="font-bold text-gray-900">{String(val)}</span>
    },
    { 
      key: "date", 
      header: "Date", 
      width: "25%",
      render: (val) => <span className="font-medium text-gray-500">{String(val)}</span>
    },
    { 
      key: "time", 
      header: "Time In", 
      width: "25%",
      render: (val) => <span className="font-medium text-gray-500">{val ? String(val) : "--:--"}</span>
    },
    { 
      key: "status", 
      header: "Status", 
      width: "30%",
      render: (value) => {
        const status = String(value);
        return (
          <div className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset uppercase tracking-wider",
            status === "Present" ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20" : 
            status === "Absent" ? "bg-rose-50 text-rose-700 ring-rose-600/20" : 
            "bg-amber-50 text-amber-700 ring-amber-600/20"
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full mr-2",
              status === "Present" ? "bg-emerald-500" : 
              status === "Absent" ? "bg-rose-500" : 
              "bg-amber-500"
            )} />
            {status}
          </div>
        );
      }
    },
  ];

  // Calendar logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYearStr = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    // Adjust for Monday start: (day + 6) % 7
    const firstDay = (firstDayOfMonth(year, month) + 6) % 7; 
    
    const days = [];
    
    // Prev month padding
    const prevMonthDays = daysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, current: false });
    }
    
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, current: true });
    }
    
    // Next month padding to fill 6 rows (42 days) for consistency
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, current: false });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Helper to get status for a specific date
  const getStatusForDate = (day: number, isCurrent: boolean) => {
    if (!isCurrent) return null;
    const currentData = ATTENDANCE_DATA[selectedChild] || [];
    // We need to match date string from data (e.g., "25/5/2026")
    const dateStr = `${day}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    return currentData.find(record => record.date === dateStr)?.status;
  };

  return (
    <div className="pb-10">
      <ChildTabs 
        children={CHILDREN} 
        selectedChild={selectedChild} 
        onChildChange={setSelectedChild} 
      />

      <div className="relative mb-10">
        <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-8">Attendance Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Attendance Rate"
            value="94.2%"
            icon={<TrendingUp size={24} className="text-emerald-500" />}
            progress={94.2}
            trend={{ value: "2.1", direction: "up", label: "Vs last month" }}
          />
          <StatCard
            label="Days Present"
            value="156"
            icon={<UserCheck size={24} className="text-blue-500" />}
            progress={85}
            trend={{ value: "8", direction: "up", label: "This term" }}
          />
          <StatCard
            label="Days Absent"
            value="04"
            icon={<UserX size={24} className="text-rose-500" />}
            progress={15}
            trend={{ value: "1", direction: "down", label: "Vs last term" }}
            className="bg-rose-50/30"
          />
          <StatCard
            label="Late Arrivals"
            value="02"
            icon={<Clock size={24} className="text-amber-500" />}
            progress={5}
            trend={{ value: "0", direction: "up", label: "Steady" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detailed Logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-black flex items-center gap-2">
              <CalendarIcon size={20} className="text-gray-400" />
              Recent Logs
            </h3>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search logs..." 
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-black outline-none w-48 transition-all"
                />
              </div>
              <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <DataTable 
              columns={columns as any} 
              data={ATTENDANCE_DATA[selectedChild] as any || []} 
              className="parent-portal-table"
            />
          </div>
        </div>

        {/* Monthly View */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-black">Calendar Overview</h3>
          <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                <ChevronLeft size={20} />
              </button>
              <h4 className="font-black text-black text-sm uppercase tracking-widest">{monthYearStr}</h4>
              <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-4 mb-8">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-black text-gray-300">{d}</div>
              ))}
              
              {calendarDays.map((dayObj, i) => {
                const status = getStatusForDate(dayObj.day, dayObj.current);
                const isToday = dayObj.current && dayObj.day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();

                return (
                  <div key={i} className="flex flex-col items-center gap-1 group">
                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center text-xs font-bold rounded-2xl transition-all cursor-pointer relative",
                      !dayObj.current ? "text-gray-200" : "text-gray-900 hover:bg-gray-50",
                      isToday ? "bg-black text-white shadow-lg shadow-black/20 scale-105" : "",
                      status === "Absent" ? "text-rose-600 bg-rose-50" : "",
                      status === "Late" ? "text-amber-600 bg-amber-50" : "",
                      status === "Present" ? "text-emerald-600 bg-emerald-50" : ""
                    )}>
                      {dayObj.day}
                      {status === "Absent" && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />}
                      {status === "Late" && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />}
                      {status === "Present" && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-50">
              {(() => {
                const currentData = ATTENDANCE_DATA[selectedChild] || [];
                const monthData = currentData.filter(d => {
                  const [day, month, year] = d.date.split("/").map(Number);
                  return month === currentDate.getMonth() + 1 && year === currentDate.getFullYear();
                });
                const presentCount = monthData.filter(d => d.status === "Present").length;
                const absentCount = monthData.filter(d => d.status === "Absent").length;
                const lateCount = monthData.filter(d => d.status === "Late").length;

                return (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">Present Days</span>
                      </div>
                      <span className="text-sm font-black text-gray-900 italic">{presentCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">Absent Days</span>
                      </div>
                      <span className="text-sm font-black text-gray-900 italic">{absentCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">Late / Delayed</span>
                      </div>
                      <span className="text-sm font-black text-gray-900 italic">{lateCount}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
          
          <div className="p-2 border border-blue-100 bg-blue-50/30 rounded-[32px] overflow-hidden">
             <div className="bg-white rounded-[24px] p-6 border border-blue-50 shadow-sm">
                <h4 className="text-sm font-black text-blue-900 uppercase mb-2">Pro Tip</h4>
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  Consistent attendance is linked to better grades. Your child is currently in the top <span className="font-black">5%</span> of the class.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

