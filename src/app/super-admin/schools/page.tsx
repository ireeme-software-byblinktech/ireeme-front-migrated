"use client";

import { useState } from "react";
import { AdminStatCard, Card, Pagination } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/FormElements";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Search,
  Filter,
  Edit,
  ToggleRight,
  ToggleLeft,
  School,
  Users,
  GraduationCap,
  ChevronDown,
  Download
} from "lucide-react";
import { SchoolModal } from "@/components/super-admin/SchoolModals";
import { SchoolCard } from "@/components/super-admin/SchoolCard";

interface School {
  id: string;
  name: string;
  code: string;
  dateJoined: string;
  totalStudents: number;
  totalStaff: number;
  status: "Active" | "Inactive";
}

// Mock data for schools
const initialSchools = [
  ...Array.from({ length: 25 }).map((_, i) => ({
    id: `school-${i + 1}`,
    name: "Rwanda Coding Academy",
    code: "12090857063",
    dateJoined: "12-06-2025",
    totalStudents: 800,
    totalStaff: 800,
    status: "Active" as "Active" | "Inactive"
  }))
];

export default function SuperAdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"Grid" | "Table">("Table");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleAddSchool = (data: any) => {
    const newSchool = {
      ...data,
      id: `school-${schools.length + 1}`,
      totalStudents: Number(data.totalStudents),
      totalStaff: Number(data.totalStaff)
    };
    setSchools([newSchool, ...schools]);
  };

  const handleEditSchool = (data: any) => {
    setSchools(schools.map((s: School) => s.id === selectedSchool.id ? { ...data, id: s.id } : s));
  };

  const toggleStatus = (id: string) => {
    setSchools(schools.map((s: School) => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s));
  };

  const columns: Column<any>[] = [
    {
      key: "select",
      header: "☐",
      width: "50px",
      render: () => <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />,
    },
    {
      key: "name",
      header: "School Name",
      render: (v: any) => <span className="font-semibold text-gray-900">{v}</span>
    },
    {
      key: "code",
      header: "School Code",
      render: (v: any) => <span className="text-gray-600">{v}</span>
    },
    {
      key: "dateJoined",
      header: "Date Joined",
      render: (v: any) => <span className="text-gray-600">{v}</span>
    },
    {
      key: "totalStudents",
      header: "Total students",
      render: (v: any) => <span className="font-bold text-gray-900">{v}</span>
    },
    {
      key: "totalStaff",
      header: "Total Staff",
      render: (v: any) => <span className="font-bold text-gray-900">{v}</span>
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (_, row) => (
        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={() => {
              setSelectedSchool(row);
              setModalMode("edit");
              setIsModalOpen(true);
            }}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => toggleStatus(row.id)}
            className="transition-colors"
          >
            {row.status === "Active" ? (
              <ToggleRight size={24} className="text-black" />
            ) : (
              <ToggleLeft size={24} className="text-gray-300" />
            )}
          </button>
        </div>
      )
    }
  ];

  const filteredSchools = schools.filter((s: School) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedGridData = filteredSchools.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredSchools.length / pageSize);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Schools Overview</h1>
        <div className="flex items-center bg-[#F3F4F6] rounded-full p-1 border border-gray-200">
          <button
            onClick={() => setViewMode("Grid")}
            className={`px-6 py-1.5 rounded-full text-[13px] font-bold transition-all ${viewMode === "Grid" ? "bg-black text-white shadow-md" : "text-gray-500 hover:text-black"}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("Table")}
            className={`px-6 py-1.5 rounded-full text-[13px] font-bold transition-all ${viewMode === "Table" ? "bg-black text-white shadow-md" : "text-gray-500 hover:text-black"}`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminStatCard
          label="Total Schools"
          value={String(schools.length)}
          icon={<School size={24} />}
          progress={75}
          subtext="0.5% Present today"
        />
        <AdminStatCard
          label="Total Teachers"
          value="214"
          icon={<Users size={24} />}
          progress={55}
          subtext={[
            { label: "Male (61%)" },
            { label: "Female (39%)" }
          ]}
        />
        <AdminStatCard
          label="Total Students"
          value="354"
          icon={<GraduationCap size={24} />}
          progress={85}
          subtext={[
            { label: "Male (61%)" },
            { label: "Female (39%)" }
          ]}
        />
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm">
        <div className="relative w-full lg:w-[450px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="search anything"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-1 focus:ring-black/5 transition-all focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 min-w-[150px] cursor-pointer hover:bg-gray-50 transition-colors">
            <Filter size={16} className="text-gray-400 mr-2" />
            <span className="text-sm font-semibold text-gray-700 flex-1">All Status</span>
            <ChevronDown size={14} className="text-gray-400 ml-2" />
          </div>

          <Button variant="outline" className="px-6 border-gray-200 text-gray-700 font-bold uppercase tracking-widest text-[11px] h-[46px] rounded-xl">
            Export <Download size={14} className="ml-2" />
          </Button>

          <Button
            onClick={() => {
              setSelectedSchool(null);
              setModalMode("add");
              setIsModalOpen(true);
            }}
            className="bg-black text-white hover:bg-black/90 px-8 font-bold uppercase tracking-widest text-[11px] h-[46px] rounded-xl shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5"
          >
            Add School +
          </Button>
        </div>
      </div>

      {/* View Engine */}
      {viewMode === "Table" ? (
        <Card className="rounded-[24px] overflow-hidden border border-gray-100 shadow-sm">
          <DataTable
            columns={columns}
            data={filteredSchools}
            pageSize={pageSize}
            className="school-management-table border-0"
            paginationClassName="pagination-rounded p-6"
          />
        </Card>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedGridData.map(school => (
              <SchoolCard
                key={school.id}
                school={school}
                onEdit={(s: School) => {
                  setSelectedSchool(s);
                  setModalMode("edit");
                  setIsModalOpen(true);
                }}
                onToggle={toggleStatus}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredSchools.length}
                pageSize={pageSize}
                className="pagination-rounded"
              />
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <SchoolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedSchool}
        onConfirm={modalMode === "add" ? handleAddSchool : handleEditSchool}
      />
    </div>
  );
}
