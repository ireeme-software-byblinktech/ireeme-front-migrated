"use client";

import { Download, ChevronDown, ChevronUp, CircleDollarSign, Percent, Award, Info, Check } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/ui";
import { useState } from "react";

const FilterDropdown = ({ title, options, isBlack = false }: { title: string, options: string[], isBlack?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  
  const toggle = (opt: string) => {
    if (selected.includes(opt)) setSelected(selected.filter(o => o !== opt));
    else setSelected([...selected, opt]);
  };

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
        {isBlack ? title : (selected.length > 0 ? selected[0] : title)} 
        {isOpen ? (
          <ChevronUp size={isBlack ? 15 : 18} className={isBlack ? "text-white" : "text-gray-400"} />
        ) : (
          <ChevronDown size={isBlack ? 15 : 18} className={isBlack ? "text-white" : "text-gray-400"} />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[220px] bg-white border-[1px] border-gray-200 rounded-xl shadow-md z-50 py-3">
          <div className="text-[14px] text-gray-500 mb-2 px-4 font-medium">Select status</div>
          <div className="flex flex-col gap-1">
            {options.map(opt => (
              <div 
                key={opt} 
                className="flex items-center gap-4 px-4 cursor-pointer py-2 hover:bg-gray-50 transition-colors"
                onClick={() => toggle(opt)}
              >
                <div className={`w-[24px] h-[24px] rounded-[6px] border-[2.5px] border-[#CBD5E1] flex items-center justify-center transition-colors flex-shrink-0 ${
                  selected.includes(opt) ? "bg-black" : "bg-white"
                }`}>
                  {selected.includes(opt) && <Check size={16} strokeWidth={3} className="text-white" />}
                </div>
                <span className="text-[16px] font-medium text-[#374151]">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeacherGradesPage() {
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
          value="78"
          progress={100}
          icon={<CircleDollarSign size={24} />}
          trend={{ value: "3.6%", direction: "up", label: "Across 3 classes" }}
        />
        <StatCard
          label="Average Grade"
          value="87.2"
          progress={87}
          icon={<Percent size={24} />}
          trend={{ value: "2.3%", direction: "up", label: "from last term" }}
        />
        <StatCard
          label="Pending Grades"
          value="12"
          progress={15}
          icon={<Award size={24} />}
          trend={{ value: "", direction: "up", label: "Assignments to grade" }}
        />
        <StatCard
          label="At Risk"
          value="3"
          progress={5}
          icon={<Info size={24} />}
          trend={{ value: "", direction: "down", label: "Students below 70%" }}
        />
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-end gap-4 mb-6">
        <span className="text-sm font-semibold text-gray-500">Filter By:</span>
        <FilterDropdown 
          title="Select Class" 
          options={["All Classes", "Year 2A", "Year 2B", "Year 2C", "Year 1A"]} 
        />
        <FilterDropdown 
          title="Course" 
          options={["Mathematics", "Physics", "Java", "English", "DSA"]} 
          isBlack={true}
        />
      </div>

      {/* Main Grid: Left (Classes + Dist) / Right (Quick Actions) */}
      <div className="flex gap-6">
        
        {/* Left Column (takes up approx 2/3) */}
        <div className="flex-[2]">
          <h2 className="text-xl font-bold mb-6">Classes Overview</h2>
          
          <div className="class-overview-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[17px] font-bold mb-1">Mathematics - Grade 5B</h3>
                <p className="text-gray-400 text-sm font-medium">26 students</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black mb-1">87.4%</div>
                <p className="text-gray-400 text-sm font-medium">Class Average</p>
              </div>
            </div>
            <div className="dual-action-btn">
              <Link href="/teacher/grades/1" className="dual-action-left" style={{ textDecoration: 'none' }}>
                View Gradebook
              </Link>
              <div className="dual-action-right">
                Grade Assignments
              </div>
            </div>
          </div>

          <div className="class-overview-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[17px] font-bold mb-1">Mathematics - Grade 5A</h3>
                <p className="text-gray-400 text-sm font-medium">24 students</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black mb-1">85.2%</div>
                <p className="text-gray-400 text-sm font-medium">Class Average</p>
              </div>
            </div>
            <div className="dual-action-btn">
              <Link href="/teacher/grades/1" className="dual-action-left" style={{ textDecoration: 'none' }}>
                View Gradebook
              </Link>
              <div className="dual-action-right">
                Grade Assignments
              </div>
            </div>
          </div>

          <div className="class-overview-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[17px] font-bold mb-1">Mathematics - Grade 6B</h3>
                <p className="text-gray-400 text-sm font-medium">28 students</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black mb-1">89.1%</div>
                <p className="text-gray-400 text-sm font-medium">Class Average</p>
              </div>
            </div>
            <div className="dual-action-btn">
              <Link href="/teacher/grades/1" className="dual-action-left" style={{ textDecoration: 'none' }}>
                View Gradebook
              </Link>
              <div className="dual-action-right">
                Grade Assignments
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-6 mt-12">Grade Distribution</h2>
          <div className="bg-[#F9FAFB] rounded-2xl p-6 border-[1.5px] border-gray-200">
            {/* Row A */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>A (90-100%)</span>
                <span>32 students</span>
              </div>
              <div className="dist-bar-bg">
                <div className="dist-bar-fill" style={{ width: '40%' }}></div>
              </div>
            </div>
            
            {/* Row B */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>B (80-89%)</span>
                <span>28 students</span>
              </div>
              <div className="dist-bar-bg">
                <div className="dist-bar-fill" style={{ width: '35%' }}></div>
              </div>
            </div>

            {/* Row C */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>C (70-79%)</span>
                <span>15 students</span>
              </div>
              <div className="dist-bar-bg">
                <div className="dist-bar-fill" style={{ width: '20%' }}></div>
              </div>
            </div>

            {/* Row Below 70 */}
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                <span>Below 70%</span>
                <span>3 students</span>
              </div>
              <div className="dist-bar-bg">
                <div className="dist-bar-fill" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (takes up approx 1/3) */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="bg-[#F9FAFB] border-[1.5px] border-gray-200 rounded-2xl p-6">
            <button className="quick-action-btn dark">
              Grade Pending Work
            </button>
            <button className="quick-action-btn light">
              Generate Report Cards
            </button>
            <button className="quick-action-btn light">
              Email Grade Reports
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
