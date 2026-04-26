"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Users, Check } from "lucide-react";
import { StatCard } from "@/components/ui";
import { DataTable, Column, TableUser } from "@/components/ui/DataTable";

const FilterDropdown = ({ title, options }: { title: string, options: string[] }) => {
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
        className="bg-white border-[1.5px] border-gray-200 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#374151] flex items-center gap-6"
      >
        {selected.length > 0 ? selected[0] : title}
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
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
                <div className={`w-[24px] h-[24px] rounded-[6px] border-[2.5px] border-[#CBD5E1] flex items-center justify-center transition-colors flex-shrink-0 ${selected.includes(opt) ? "bg-black" : "bg-white"
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

const DateDropdown = ({ options }: { options: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border-[1.5px] border-gray-200 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#374151] flex items-center gap-4"
      >
        <span className="text-[15px]">{selected}</span>
        {isOpen ? (
          <ChevronUp size={18} className="text-[#374151]" />
        ) : (
          <ChevronDown size={18} className="text-[#374151]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-full min-w-[160px] bg-white border-[1.5px] border-gray-200 rounded-xl shadow-sm z-50 py-2">
          <div className="flex flex-col">
            {options.map(opt => (
              <div
                key={opt}
                className="px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => { setSelected(opt); setIsOpen(false); }}
              >
                <span className="text-[16px] text-[#374151]">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState([
    { id: 1, initials: "AJ", name: "Alice Johnson", streak: "15 day streak", status: "Present" },
    { id: 2, initials: "BS", name: "Bob Smith", streak: "12 day streak", status: "Present" },
    { id: 3, initials: "CB", name: "Charlie Brown", streak: "No streak", status: "Absent" },
    { id: 4, initials: "DP", name: "Diana Prince", streak: "20 day streak", status: "Present" },
    { id: 5, initials: "EH", name: "Ethan Hunt", streak: "8 day streak", status: "Late" },
    { id: 6, initials: "FG", name: "Fiona Green", streak: "18 day streak", status: "Present" },
    { id: 7, initials: "GW", name: "George Wilson", streak: "10 day streak", status: "Present" },
    { id: 8, initials: "HL", name: "Hannah Lee", streak: "14 day streak", status: "Excused" },
    { id: 9, initials: "JK", name: "Jack Knight", streak: "5 day streak", status: "Present" },
    { id: 10, initials: "LM", name: "Lisa Miller", streak: "22 day streak", status: "Present" },
    { id: 11, initials: "NP", name: "Nathan Page", streak: "3 day streak", status: "Absent" },
    { id: 12, initials: "QR", name: "Quinn Reed", streak: "11 day streak", status: "Present" },
  ]);

  const updateStatus = (id: number, newStatus: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(s => ({ ...s, status: "Present" })));
  };

  const clearAll = () => {
    setStudents(prev => prev.map(s => ({ ...s, status: "" })));
  };

  const presentCount = students.filter(s => s.status === "Present").length;
  const absentCount = students.filter(s => s.status === "Absent").length;
  const lateCount = students.filter(s => s.status === "Late").length;

  const columns: Column<typeof students[0]>[] = [
    {
      key: "name",
      header: "Student",
      render: (_, student) => (
        <TableUser
          name={student.name}
          sub={student.streak}
          initials={student.initials}
        />
      )
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      render: (_, student) => (
        <div className="flex items-center gap-2 justify-end">
          {["Present", "Absent", "Late", "Excused"].map(statusStr => (
            <button
              key={statusStr}
              onClick={(e) => {
                e.stopPropagation();
                updateStatus(student.id, statusStr);
              }}
              className={`px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${student.status === statusStr
                ? "bg-black text-white"
                : "bg-[#F3F4F6] text-[#374151] hover:bg-gray-200"
                }`}
            >
              {statusStr}
            </button>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold mb-2">Attendance</h1>
          <p className="text-gray-500 font-medium text-[15px]">Track and manage student attendance</p>
        </div>
        <button className="bg-black text-white px-8 py-3 rounded-md font-semibold text-[14px] hover:opacity-90 transition-opacity">
          Export Report
        </button>
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
          label="Present"
          value={String(presentCount)}
          progress={Math.round((presentCount / students.length) * 100) || 0}
          icon={<Users size={24} />}
          trend={{ value: "2.3%", direction: "up", label: "from last term" }}
        />
        <StatCard
          label="absent"
          value={String(absentCount)}
          progress={Math.round((absentCount / students.length) * 100) || 0}
          icon={<Users size={24} />}
          trend={{ value: "", direction: "up", label: "Assignments to grade" }}
        />
        <StatCard
          label="Late"
          value={String(lateCount)}
          progress={Math.round((lateCount / students.length) * 100) || 0}
          icon={<Users size={24} />}
          trend={{ value: "", direction: "down", label: "Students below 70%" }}
        />
      </div>

      {/* Actions and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={markAllPresent} className="bg-black text-white px-6 py-2.5 rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity">
            Mark All Present
          </button>
          <button onClick={clearAll} className="bg-white text-[#374151] border-[1.5px] border-gray-200 px-6 py-2.5 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition-colors">
            Clear All
          </button>
        </div>
        <div className="flex items-center gap-4">
          <FilterDropdown
            title="Select Class"
            options={["All Classes", "Year 2A", "Year 2B", "Year 2C", "Year 1A"]}
          />
          <DateDropdown
            options={["2026-03-11", "2026-03-12", "2026-03-13", "2026-03-14", "2026-03-15"]}
          />
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-[20px] border-[1.5px] border-gray-200 p-8 pb-10">
        <h2 className="text-xl font-bold mb-6">Student Attendance</h2>

        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={students as unknown as Record<string, unknown>[]}
          keyField="id"
          pageSize={10}
          paginationClassName="pagination-rounded"
          className="attendance-table-custom"
        />
      </div>

    </div>
  );
}
