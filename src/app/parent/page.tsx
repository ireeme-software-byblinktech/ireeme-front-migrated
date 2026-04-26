"use client";

import { useState } from "react";
import { ChildTabs } from "@/components/parent/ChildTabs";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Bell 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/ui";

const CHILDREN = ["Joel Queen", "Jane Doe", "Jack Peele"];

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Default to Feb 2026

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
    const firstDay = (firstDayOfMonth(year, month) + 6) % 7; 
    
    const days = [];
    
    // Prev month days
    const prevMonthDays = daysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, current: false });
    }
    
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, current: true });
    }
    
    // Next month days
    const remaining = 35 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, current: false });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="pb-10">
      <ChildTabs 
        children={CHILDREN} 
        selectedChild={selectedChild} 
        onChildChange={setSelectedChild} 
      />

      <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-tight">Child Summary</h2>

      {/* Reusable StatCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Attendance status"
          value="30K"
          icon={<Users size={24} />}
          progress={75}
          trend={{ value: "3.6", direction: "up", label: "This month" }}
        />
        <StatCard
          label="Messages"
          value="2"
          icon={<MessageSquare size={24} />}
          progress={45}
          trend={{ value: "1.0%", direction: "up", label: "Up from past week" }}
        />
        <StatCard
          label="Grades average"
          value="95%"
          icon={<TrendingUp size={24} />}
          progress={95}
          trend={{ value: "0%", direction: "down", label: "Down from yesterday" }}
        />
        <StatCard
          label="Fess"
          value="$200"
          icon={<Clock size={24} />}
          progress={60}
          trend={{ value: "0%", direction: "up", label: "Fee payment" }}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Chart Column */}
        <div className="flex-[2] bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-black">Child Performance Trends</h3>
            <div className="flex items-center gap-4 px-4 py-2 border border-gray-100 rounded-xl bg-gray-50/50 cursor-pointer">
              <span className="text-sm font-medium text-gray-700">By Grade</span>
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          </div>
          
          <div className="relative h-[250px] w-full mt-8">
            <svg viewBox="0 0 800 300" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>
              </defs>

              {/* Grid Lines & Labels */}
              {[
                { y: 40, label: "100%" },
                { y: 80, label: "80%" },
                { y: 120, label: "60%" },
                { y: 160, label: "40%" },
                { y: 200, label: "20%" },
                { y: 240, label: "0%" },
              ].map(({ y, label }) => (
                <g key={y}>
                  <text x="40" y={y + 4} className="text-[11px] fill-gray-400 font-bold" textAnchor="end">{label}</text>
                  <line x1="50" y1={y} x2="750" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                </g>
              ))}

              {/* Area */}
              <path 
                d="M 50 200 C 120 100, 200 100, 300 180 C 400 260, 500 100, 600 100 C 680 100, 710 260, 750 260 V 280 H 50 Z" 
                fill="url(#chartGradient)" 
              />
              
              {/* Line */}
              <path 
                d="M 50 200 C 120 100, 200 100, 300 180 C 400 260, 500 100, 600 100 C 680 100, 710 260, 750 260" 
                fill="none" 
                stroke="black" 
                strokeWidth="3" 
                strokeLinecap="round"
              />

              {["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, idx) => (
                <text key={month} x={50 + (idx * 63)} y="300" className="text-[11px] fill-gray-400 font-bold" textAnchor="middle">{month}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Calendar Column */}
        <div className="flex-1 bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-black mb-8">Monthly</h3>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                <ChevronLeft size={20} className="text-gray-400" />
              </button>
            </div>
            <h4 className="font-bold text-black text-sm uppercase tracking-wide">{monthYearStr}</h4>
            <div className="flex gap-2">
              <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-4 text-center mb-6">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => (
              <span key={day} className="text-[10px] font-black text-gray-400">{day}</span>
            ))}
            
            {calendarDays.map((dayObj, idx) => {
              const isPresent = dayObj.current && (dayObj.day % 7 !== 0 && dayObj.day % 7 !== 1);
              const isAbsent = dayObj.current && !isPresent && dayObj.day % 2 === 0;
              
              return (
                <div key={idx} className="flex items-center justify-center p-1">
                  <span className={cn(
                    "w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all cursor-default",
                    dayObj.current ? "text-gray-900" : "text-gray-200",
                    isPresent ? "bg-[#14B8A6] text-white shadow-sm" : "",
                    isAbsent ? "bg-[#F97316] text-white shadow-sm" : ""
                  )}>
                    {dayObj.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]"></div>
              <span className="text-xs font-bold text-gray-500">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></div>
              <span className="text-xs font-bold text-gray-500">Absent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Bar */}
      <div className="bg-white rounded-[32px] border border-gray-100 p-6 flex items-center justify-between shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-black">Notifications</h3>
          <p className="text-sm font-bold text-gray-400">You have 4 new notifications</p>
        </div>
        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-gray-800 transition-all">
          <Bell size={24} />
        </div>
      </div>
    </div>
  );
}
