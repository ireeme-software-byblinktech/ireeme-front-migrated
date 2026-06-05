"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { SearchInput, Select } from "@/components/ui/FormElements";
import { Card } from "@/components/ui";
import { Upload, Eye, Download, Trash2, Filter } from "lucide-react";

interface Document {
  id: string;
  name: string;
  category: string;
  fileType: string;
  uploadDate: string;
  status: "Private" | "Public";
}

const mockDocuments: Document[] = [
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `doc-${i + 1}`,
    name: "Birth Certificate",
    category: "Certificate",
    fileType: "PDF",
    uploadDate: "20-07-2025",
    status: "Private" as const,
  })),
  ...Array.from({ length: 4 }).map((_, i) => ({
    id: `doc-${i + 7}`,
    name: "Medical Clearance",
    category: "Medical record",
    fileType: "PDF",
    uploadDate: "20-07-2025",
    status: "Private" as const,
  }))
];

export default function SuperAdminDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [docsData, setDocsData] = useState<Document[]>(mockDocuments);

  const filteredData = docsData.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<Document>[] = [
    {
      key: "name",
      header: "Name",
      render: (_, row) => <div className="text-sm font-medium text-gray-900">{row.name}</div>,
    },
    {
      key: "category",
      header: "Category",
      render: (_, row) => <div className="text-sm text-gray-600">{row.category}</div>,
    },
    {
      key: "fileType",
      header: "File type",
      render: (_, row) => <div className="text-sm text-gray-600">{row.fileType}</div>,
    },
    {
      key: "uploadDate",
      header: "Upload date",
      render: (_, row) => <div className="text-sm text-gray-600">{row.uploadDate}</div>,
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <span className="bg-black text-white px-4 py-1.5 rounded-md text-xs font-medium inline-block min-w-[70px] text-center">
          {row.status}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "left",
      width: "120px",
      render: () => (
        <div className="flex items-center gap-3">
          <button className="text-gray-600 hover:text-black">
            <Eye size={16} />
          </button>
          <button className="text-gray-600 hover:text-black">
            <Download size={16} />
          </button>
          <button className="text-gray-600 hover:text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-500 mt-1">
          Store, organize, and access your academic and school documents.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between mb-6">
        <div className="flex-1">
          {/* Search Bar moved down to toolbar area below header */}
        </div>
        <button className="bg-black text-white px-5 py-2.5 rounded-md flex items-center gap-2 hover:bg-gray-800 transition-colors text-sm font-medium whitespace-nowrap">
          <Upload size={16} />
          Upload a document
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-4">
        <div className="w-full sm:w-[400px]">
          <SearchInput
            placeholder="Search document"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* All documents filter */}
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm h-10">
            <div className="flex items-center justify-center w-9 h-full border-r border-gray-100 text-gray-400 shrink-0">
              <Filter size={13} />
            </div>
            <select className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm font-medium text-gray-700 px-3 cursor-pointer appearance-none h-full min-w-[120px]">
              <option value="all">All documents</option>
              <option value="certificate">Certificates</option>
              <option value="medical">Medical records</option>
            </select>
          </div>
          {/* Upload date filter */}
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm h-10">
            <div className="flex items-center justify-center w-9 h-full border-r border-gray-100 text-gray-400 shrink-0">
              <Filter size={13} />
            </div>
            <select className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm font-medium text-gray-700 px-3 cursor-pointer appearance-none h-full min-w-[110px]">
              <option value="date">Upload date</option>
              <option value="asc">Oldest first</option>
              <option value="desc">Newest first</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-none border-b-0 border-x-0 sm:border sm:rounded-lg overflow-hidden">
        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={filteredData as unknown as Record<string, unknown>[]}
          keyField="id"
          className="documents-table border-0 w-full"
        />
      </Card>
    </div>
  );
}
