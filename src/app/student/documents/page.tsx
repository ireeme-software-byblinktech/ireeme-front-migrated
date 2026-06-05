"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Search, Filter, Upload, Eye, Download, Trash2, FileText, AlertCircle } from "lucide-react";
import { useUploadFile } from "@/hooks/api/useFiles";
import { useStudentProfile } from "@/hooks/api/useStudentAPI";
import { formatDate } from "@/lib/utils";

// Document data interface
interface Document {
  id: string;
  name: string;
  category: string;
  fileType: string;
  uploadDate: string;
  status: "Private" | "Public" | "Shared";
  key?: string;
}

export default function StudentDocumentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([]);
  const itemsPerPage = 8;

  const { data: profile } = useStudentProfile();
  const uploadFile = useUploadFile();

  // Use uploaded documents instead of mock data
  const documentsData: Document[] = uploadedDocs;

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
        <span className="bg-black text-white px-3 py-1 rounded text-xs font-medium">
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
            className="text-gray-600 hover:text-gray-900 p-1"
          >
            <Eye size={16} />
          </button>
          <button className="text-gray-600 hover:text-gray-900 p-1">
            <Download size={16} />
          </button>
          <button 
            onClick={() => {
              setSelectedDocument(row);
              setIsDeleteModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900 p-1"
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
          <Upload size={16} />
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
          {filteredData.length === 0 ? (
            <div className="text-center py-16 px-4">
              <FileText size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-500 mb-6">Upload your first document to get started</p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 mx-auto hover:bg-gray-800"
              >
                <Upload size={16} />
                Upload Document
              </button>
              <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg max-w-2xl mx-auto text-left">
                <div className="flex gap-3">
                  <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Documents Feature</h4>
                    <p className="text-sm text-blue-700">
                      This feature allows you to securely upload and manage your academic documents. 
                      Documents are stored using the file upload API and will persist in your student account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </CardBody>
      </Card>

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <AddDocumentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onUpload={(doc) => {
            setUploadedDocs(prev => [doc, ...prev]);
          }}
        />
      )}

      {/* View Document Modal */}
      {isViewModalOpen && selectedDocument && (
        <ViewDocumentModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          document={selectedDocument}
        />
      )}

      {/* Delete Document Modal */}
      {isDeleteModalOpen && selectedDocument && (
        <DeleteDocumentModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          document={selectedDocument}
        />
      )}
    </div>
  );
}

// View Document Modal Component
function ViewDocumentModal({ 
  isOpen, 
  onClose, 
  document 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  document: Document;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999]">
        <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>
        <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
        <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col">
            <div className="bg-black text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-xl font-semibold">View Document</h2>
              <button onClick={onClose} className="text-white hover:text-gray-300">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Document title</label>
                    <div className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-900">
                      {document.name}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Document category</label>
                    <div className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-900">
                      {document.category}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <div className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-900 min-h-[80px]">
                    Academic document for {document.name} uploaded on {document.uploadDate}.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">File Type</label>
                    <div className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-900">
                      {document.fileType}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Upload Date</label>
                    <div className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-900">
                      {document.uploadDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    className="bg-black text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-white text-gray-700 border border-gray-300 px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Delete Document Modal Component
function DeleteDocumentModal({ 
  isOpen, 
  onClose, 
  document 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  document: Document;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999]">
        <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>
        <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
        <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md relative z-10 flex flex-col">
            <div className="bg-black text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-xl font-semibold">Delete Document</h2>
              <button onClick={onClose} className="text-white hover:text-gray-300">✕</button>
            </div>

            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
              <p className="text-gray-600 mb-6">
                You are about to delete <span className="font-bold text-gray-900">"{document.name}"</span>. This action cannot be undone.
              </p>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={onClose}
                  className="bg-black text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                  Delete
                </button>
                <button
                  onClick={onClose}
                  className="bg-white text-gray-700 border border-gray-300 px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Add Document Modal Component
function AddDocumentModal({ isOpen, onClose, onUpload }: { isOpen: boolean; onClose: () => void; onUpload: (doc: Document) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useUploadFile();

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.title || !formData.category) return;

    setIsUploading(true);
    try {
      const result = await uploadFile.mutateAsync(selectedFile);
      
      // Create document object
      const newDoc: Document = {
        id: result.key,
        name: formData.title,
        category: formData.category,
        fileType: selectedFile.type.split('/')[1].toUpperCase() || 'FILE',
        uploadDate: formatDate(new Date().toISOString()),
        status: "Private",
        key: result.key
      };

      onUpload(newDoc);
      onClose();
      
      // Reset form
      setFormData({ title: "", category: "", description: "" });
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Overlay that excludes sidebar */}
      <div className="fixed inset-0 z-[9999]">
        {/* Sidebar area - no blur */}
        <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>
        
        {/* Main content area - lighter blur */}
        <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
        
        {/* Modal container - centered without top space */}
        <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col">
            {/* Header with black background */}
            <div className="bg-black text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add Document</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Document Title */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Document title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                      placeholder="Your first name"
                    />
                  </div>

                  {/* Document Category */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Document category *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400 h-20 resize-none"
                    placeholder="Enter a small description"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Upload a file *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 text-gray-400 mb-3">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
                          <path d="M9 15l3 -3l3 3" />
                          <path d="M12 12l0 9" />
                        </svg>
                      </div>
                      {selectedFile ? (
                        <div className="mb-4">
                          <p className="text-gray-700 font-bold mb-1">{selectedFile.name}</p>
                          <p className="text-gray-500 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-600 font-medium mb-1">Upload a document</p>
                          <p className="text-gray-500 text-sm mb-4">Supported formats: PDF, DOCX, JPG, PNG (Max 10MB)</p>
                        </>
                      )}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          onChange={handleFileSelect}
                          accept=".pdf,.docx,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        <span className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 inline-block">
                          {selectedFile ? "Change File" : "Select File"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile || !formData.title || !formData.category}
                    className="bg-black text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Uploading..." : "Add document"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isUploading}
                    className="bg-white text-gray-700 border border-gray-300 px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
