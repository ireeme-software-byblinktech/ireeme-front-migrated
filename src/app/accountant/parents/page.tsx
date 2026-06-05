"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Search, Filter, Edit, ToggleLeft } from "lucide-react";
import { EditSchoolModal } from "@/components/ui/EditSchoolModal";

// Parent data interface
interface Parent {
  id: string;
  parentName: string;
  emailAddress: string;
  gender: "Male" | "Female";
  contactInfo: string;
  paymentStatus: "Active" | "Paid" | "Pending";
}

// Sample parent data
const parentsData: Parent[] = [
  {
    id: "1",
    parentName: "John Doe",
    emailAddress: "johndoe@gmail.com",
    gender: "Male",
    contactInfo: "+250 792222222",
    paymentStatus: "Active"
  },
  {
    id: "2",
    parentName: "Mary Smith",
    emailAddress: "marysmith@gmail.com",
    gender: "Female",
    contactInfo: "+250 792222223",
    paymentStatus: "Paid"
  },
  {
    id: "3",
    parentName: "Robert Johnson",
    emailAddress: "robertj@gmail.com",
    gender: "Male",
    contactInfo: "+250 792222224",
    paymentStatus: "Pending"
  },
  {
    id: "4",
    parentName: "Sarah Wilson",
    emailAddress: "sarahw@gmail.com",
    gender: "Female",
    contactInfo: "+250 792222225",
    paymentStatus: "Active"
  },
  {
    id: "5",
    parentName: "David Brown",
    emailAddress: "davidb@gmail.com",
    gender: "Male",
    contactInfo: "+250 792222226",
    paymentStatus: "Paid"
  },
  {
    id: "6",
    parentName: "Lisa Davis",
    emailAddress: "lisad@gmail.com",
    gender: "Female",
    contactInfo: "+250 792222227",
    paymentStatus: "Active"
  },
  {
    id: "7",
    parentName: "Tom Miller",
    emailAddress: "tomm@gmail.com",
    gender: "Male",
    contactInfo: "+250 792222228",
    paymentStatus: "Pending"
  },
  {
    id: "8",
    parentName: "Emma Garcia",
    emailAddress: "emmag@gmail.com",
    gender: "Female",
    contactInfo: "+250 792222229",
    paymentStatus: "Active"
  },
  {
    id: "9",
    parentName: "Chris Martinez",
    emailAddress: "chrism@gmail.com",
    gender: "Male",
    contactInfo: "+250 792222230",
    paymentStatus: "Paid"
  },
  {
    id: "10",
    parentName: "Anna Rodriguez",
    emailAddress: "annar@gmail.com",
    gender: "Female",
    contactInfo: "+250 792222231",
    paymentStatus: "Active"
  }
];

export default function AccountantParentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const itemsPerPage = 10;

  // Filter data based on search and status
  const filteredData = parentsData.filter(parent => {
    const matchesSearch = parent.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.emailAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || parent.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<Parent>[] = [
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
      key: "parentName",
      header: "Parent Name",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.parentName}</div>
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
      key: "gender",
      header: "Gender",
      render: (_, row) => (
        <div className="text-gray-600">{row.gender}</div>
      )
    },
    {
      key: "contactInfo",
      header: "Contact - Info",
      render: (_, row) => (
        <div className="text-gray-600">{row.contactInfo}</div>
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
              setSelectedParent(row);
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
      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 w-96">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="search parents"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 min-w-[120px]">
          <Filter size={16} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="outline-none text-sm bg-transparent"
          >
            <option value="all">status</option>
            <option value="active">Active</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Parents Table */}
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

      {/* Edit School Modal */}
      <EditSchoolModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedParent(null);
        }}
        school={selectedParent ? {
          name: "Rwanda Coding Academy",
          studentName: "John Doe",
          parentName: selectedParent.parentName,
          parentEmail: selectedParent.emailAddress,
          phone: selectedParent.contactInfo
        } : undefined}
      />
    </div>
  );
}
