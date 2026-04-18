"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Search, Filter, Edit, ToggleLeft, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { EditStaffModal } from "@/components/ui/EditStaffModal";

// Staff stats data
const staffStats = [
  {
    label: "Total staff",
    value: "308",
    icon: <Users size={18} />,
    progress: 75,
    trend: { value: "61%", direction: "up" as const, label: "Male (61%)" },
    subTrend: "Female (39%)"
  },
  {
    label: "Academics", 
    value: "308",
    icon: <Users size={18} />,
    progress: 60,
    trend: { value: "61%", direction: "up" as const, label: "Male (61%)" },
    subTrend: "Female (39%)"
  },
  {
    label: "Discipline",
    value: "308", 
    icon: <Users size={18} />,
    progress: 85,
    trend: { value: "61%", direction: "up" as const, label: "Male (61%)" },
    subTrend: "Female (39%)"
  },
  {
    label: "Food & Services",
    value: "308",
    icon: <Users size={18} />,
    progress: 45,
    trend: { value: "61%", direction: "up" as const, label: "Male (61%)" },
    subTrend: "Female (39%)"
  }
];

// Staff data interface
interface Staff {
  id: string;
  studentName: string;
  emailAddress: string;
  role: string;
  department: string;
  paymentStatus: "Active" | "Inactive";
}

// Sample staff data
const staffData: Staff[] = [
  {
    id: "1",
    studentName: "John Doe",
    emailAddress: "johndoe@gmail.com",
    role: "Teacher",
    department: "Academic",
    paymentStatus: "Active"
  },
  {
    id: "2",
    studentName: "Jane Smith",
    emailAddress: "janesmith@gmail.com",
    role: "Teacher",
    department: "Academic",
    paymentStatus: "Active"
  },
  {
    id: "3",
    studentName: "Mike Johnson",
    emailAddress: "mikej@gmail.com",
    role: "Teacher",
    department: "Academic",
    paymentStatus: "Active"
  },
  {
    id: "4",
    studentName: "Sarah Wilson",
    emailAddress: "sarahw@gmail.com",
    role: "Teacher",
    department: "Academic",
    paymentStatus: "Active"
  },
  {
    id: "5",
    studentName: "David Brown",
    emailAddress: "davidb@gmail.com",
    role: "Teacher",
    department: "Academic",
    paymentStatus: "Active"
  }
];

export default function AccountantStaffPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const itemsPerPage = 10;

  // Filter data based on search and filters
  const filteredData = staffData.filter(staff => {
    const matchesSearch = staff.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.emailAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || staff.department.toLowerCase() === departmentFilter.toLowerCase();
    return matchesSearch && matchesDepartment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<Staff>[] = [
    {
      key: "select",
      header: "",
      width: "50px",
      render: () => (
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300"
        />
      )
    },
    {
      key: "studentName",
      header: "Student Name",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.studentName}</div>
      )
    },
    {
      key: "emailAddress",
      header: "Email address",
      render: (_, row) => (
        <div className="text-gray-600">{row.emailAddress}</div>
      )
    },
    {
      key: "role",
      header: "Role",
      render: (_, row) => (
        <div className="text-gray-600">{row.role}</div>
      )
    },
    {
      key: "department",
      header: "Department",
      render: (_, row) => (
        <div className="text-gray-600">{row.department}</div>
      )
    },
    {
      key: "paymentStatus",
      header: "Payment Status",
      render: (_, row) => (
        <span className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium inline-block min-w-[80px] text-center">
          {row.paymentStatus}
        </span>
      )
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => {
              setSelectedStaff(row);
              setIsEditModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900 p-2"
          >
            <Edit size={16} />
          </button>
          <button className="text-gray-600 hover:text-gray-900 p-2">
            <ToggleLeft size={24} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {staffStats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card-horizontal cursor-pointer flex items-center justify-between transition-all hover:shadow-lg"
            onClick={() => router.push("/accountant/staff")}
          >
            <div className="stat-card-circle-small">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="4"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 35}
                  strokeDashoffset={2 * Math.PI * 35 - (stat.progress / 100) * 2 * Math.PI * 35}
                  transform="rotate(-90 40 40)"
                  className="stat-card-progress-small"
                />
              </svg>
              <div className="stat-card-icon-small">
                {stat.icon}
              </div>
            </div>
            <div className="stat-card-content-horizontal">
              <h3 className="stat-card-title-small font-bold">{stat.label}</h3>
              <div className="text-[10px] text-gray-600 mb-1">
                <span>● Male (61%) ● Female (39%)</span>
              </div>
              <div className="stat-card-number-row">
                <p className="stat-card-number-small">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 w-96">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="search staff"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 min-w-[120px]">
          <Filter size={16} className="text-gray-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="outline-none text-sm bg-transparent"
          >
            <option value="all">Department</option>
            <option value="academic">Academic</option>
            <option value="discipline">Discipline</option>
            <option value="food">Food & Services</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <DataTable
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={paginatedData as unknown as Record<string, unknown>[]}
              keyField="id"
              className="assignments-table"
            />
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Edit Staff Modal */}
      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff ? {
          name: selectedStaff.studentName,
          email: selectedStaff.emailAddress,
          role: selectedStaff.role,
          department: selectedStaff.department
        } : undefined}
      />
    </div>
  );
}