"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Search, Filter, Eye, Download, Trash2, Plus } from "lucide-react";
import { AddDocumentModal, ViewDocumentModal, DeleteDocumentModal } from "@/components/ui";

// Document data interface
interface Document {
  id: string;
  name: string;
  category: string;
  fileType: string;
  uploadDate: string;
  status: "Private" | "Public" | "Shared";
}

// Sample document data
const documentsData: Document[] = [
  {
    id: "1",
    name: "Birth Certificate",
    category: "Certificate",
    fileType: "PDF",
    uploadDate: "20-07-2025",
    status: "Private"
  },
  {
    id: "2",
    name: "Birth Certificate",
    category: "Certificate",
    fileType: "PDF",
    uploadDate: "20-07-2025",
    status: "Private"
  },
  {
    id: "3",
    name: "Birth Certificate",
    category: "Certificate",
    fileType: "PDF",
    uploadDate: "20-07-2025",
    status: "Private"
  },
  {
    id: "4",
    name: "Birth Certificate",
    category: "Certificate",
    fileType: "PDF",
    uploadDate: "20-07-2025",
    status: "Private"
  },
  {
    id: "5",
    name: "Birth Certificate",
    category: "Certificate",
    fileType: "PDF",
    uploadDate: "20-07-2025",
    status: "Private"
  },
  {
    id: "6",
    name: "Birth Certificate",
    category: "Certificate",
    fileType: "PDF",
    uploadDate: "20-07-2025",
    status: "Private"
  },
  {
    id: "7",
    name: "Medical Clearance",
    category: "Medical record",
    fileType: "PDF",
    uploadDate: "20-07-2025",
    status: "Private"
  },
  {
    id: "8",
    name: "Medical Clearance",
    category: "Medical record",
    fileType: "PDF",
    uploadDate: "20-07-2025",
    status: "Private"
  }
];

export default function AccountantDocumentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const itemsPerPage = 10;

  // Filter data based on search and filters
  const filteredData = documentsData.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const columns: Column<Document>[] = [
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
      key: "name",
      header: "Name",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.name}</div>
      )
    },
    {
      key: "category",
      header: "Category",
      render: (_, row) => (
        <div className="text-gray-600">{row.category}</div>
      )
    },
    {
      key: "fileType",
      header: "File type",
      render: (_, row) => (
        <div className="text-gray-600">{row.fileType}</div>
      )
    },
    {
      key: "uploadDate",
      header: "Upload date",
      render: (_, row) => (
        <div className="text-gray-600">{row.uploadDate}</div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <span className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium inline-block min-w-[80px] text-center">
          {row.status}
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
              setSelectedDocument(row);
              setIsViewModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900 p-2"
          >
            <Eye size={16} />
          </button>
          <button className="text-gray-600 hover:text-gray-900 p-2">
            <Download size={16} />
          </button>
          <button 
            onClick={() => {
              setSelectedDocument(row);
              setIsDeleteModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900 p-2"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-gray-600">Store, organize, and access your academic and school documents.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} />
          Upload a document
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 w-96">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search document"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 min-w-[140px]">
            <Filter size={16} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="outline-none text-sm bg-transparent"
            >
              <option value="all">All documents</option>
              <option value="certificate">Certificate</option>
              <option value="medical">Medical record</option>
              <option value="academic">Academic</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 min-w-[120px]">
            <Filter size={16} className="text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="outline-none text-sm bg-transparent"
            >
              <option value="all">upload date</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Table */}
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
      {/* Document Modals (excluding Edit) */}
      <AddDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ViewDocumentModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument ? {
          name: selectedDocument.name,
          category: selectedDocument.category,
          fileType: selectedDocument.fileType,
          uploadDate: selectedDocument.uploadDate,
          status: selectedDocument.status
        } : undefined}
      />

      <DeleteDocumentModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument ? {
          name: selectedDocument.name,
          category: selectedDocument.category,
          fileType: selectedDocument.fileType,
          uploadDate: selectedDocument.uploadDate,
          status: selectedDocument.status
        } : undefined}
      />
    </div>
  );
}
