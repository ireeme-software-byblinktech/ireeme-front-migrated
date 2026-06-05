"use client";

import { useState } from "react";
import { DataTable, Column, Pagination } from "@/components/ui/DataTable";
import { SearchInput, Select } from "@/components/ui/FormElements";
import { Card, CardBody } from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { Edit, ToggleLeft, ToggleRight, Filter } from "lucide-react";

interface Admin {
  id: string;
  adminName: string;
  adminEmail: string;
  adminSchool: string;
  status: "Active" | "Inactive" | "Paid";
}

const initialMockAdmins: Admin[] = [
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `admin-${i + 1}`,
    adminName: "John Doe",
    adminEmail: "johndoes@gmail.com",
    adminSchool: "Rwanda Coding Academy",
    status: "Active" as const,
  })),
  {
    id: "admin-7",
    adminName: "John Doe",
    adminEmail: "johndoes@gmail.com",
    adminSchool: "Rwanda Coding Academy",
    status: "Paid" as const,
  },
  ...Array.from({ length: 240 }).map((_, i) => ({
    id: `admin-${i + 8}`,
    adminName: "John Doe",
    adminEmail: "johndoes@gmail.com",
    adminSchool: "Rwanda Coding Academy",
    status: "Active" as const,
  }))
];

export default function SuperAdminAdminsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminsData, setAdminsData] = useState<Admin[]>(initialMockAdmins);
  const itemsPerPage = 8;

  // Handles toggle functionality
  const handleToggle = (id: string) => {
    setAdminsData((prev) =>
      prev.map((admin) => {
        if (admin.id === id) {
          const newStatus = admin.status === "Active" ? "Inactive" : "Active";
          return { ...admin, status: newStatus as "Active" | "Inactive" | "Paid" };
        }
        return admin;
      })
    );
  };

  // Filter and search
  const filteredData = adminsData.filter((admin) => {
    const matchesSearch =
      admin.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.adminSchool.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || admin.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<Admin>[] = [
    {
      key: "select",
      header: "☐",
      width: "50px",
      render: () => <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" />,
    },
    {
      key: "adminName",
      header: "Admin Name",
      render: (_, row) => <div className="text-sm text-gray-900">{row.adminName}</div>,
    },
    {
      key: "adminEmail",
      header: "Admin Email",
      render: (_, row) => <div className="text-sm text-gray-600">{row.adminEmail}</div>,
    },
    {
      key: "adminSchool",
      header: "Admin School",
      render: (_, row) => <div className="text-sm text-gray-600">{row.adminSchool}</div>,
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <span
          className={`px-4 py-1 text-xs font-semibold rounded text-white inline-block min-w-[70px] text-center ${row.status === "Active" || row.status === "Paid" ? "bg-black" : "bg-gray-400"
            }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "left",
      width: "100px",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <button className="text-gray-600 hover:text-black">
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleToggle(row.id)}
            className="text-gray-600 hover:text-black"
          >
            {row.status !== "Inactive" ? (
              <ToggleRight size={24} className="text-black" />
            ) : (
              <ToggleLeft size={24} className="text-gray-400" />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
        <p className="text-gray-500 mt-1">
          Review and manage school administrators. You can search by name or filter by status.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-[400px]">
          <SearchInput
            placeholder="search admins"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto flex items-center">
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm h-10 min-w-[170px]">
            <div className="flex items-center justify-center w-10 h-full border-r border-gray-100 text-gray-400 shrink-0">
              <Filter size={14} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold text-gray-700 px-3 cursor-pointer appearance-none h-full"
            >
              <option value="all">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      <Card className="rounded-none border-b-0 border-x-0 sm:border sm:rounded-lg overflow-hidden">
        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={filteredData as unknown as Record<string, unknown>[]}
          keyField="id"
          className="admins-table border-0 w-full"
          pageSize={itemsPerPage}
          paginationClassName="p-4"
        />
      </Card>
    </div>
  );
}

