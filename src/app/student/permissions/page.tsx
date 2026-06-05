"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Search, Filter, Upload, Edit, Trash2, Loader2 } from "lucide-react";
import { permissionsApi, CreatePermissionDto } from "@/lib/api/permissions";
import { useStudentProfile } from "@/hooks/api/useStudentAPI";
import { toast } from "@/lib/utils/toast";

// Permission data interface matching backend
interface Permission {
  id: string;
  reqId: string;
  reason: string;
  dateSubmitted: string;
  returnDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function StudentPermissionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const itemsPerPage = 8;

  const { data: profile } = useStudentProfile();
  const studentId = profile?.id;
  const queryClient = useQueryClient();

  // Fetch permissions
  const { data: permissionsData, isLoading } = useQuery({
    queryKey: ["permissions", studentId],
    queryFn: () => permissionsApi.getAll({ page: 1, limit: 100 }),
    enabled: !!studentId,
  });

  // Transform backend data to display format
  const permissionsDisplay: Permission[] = (permissionsData?.data || []).map((p) => ({
    id: p.id,
    reqId: `REQ-${p.id.substring(0, 8).toUpperCase()}`,
    reason: p.reason,
    dateSubmitted: new Date(p.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }),
    returnDate: new Date(p.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }),
    status: p.status,
  }));

  // Filter data based on search and filters
  const filteredData = permissionsDisplay.filter(permission => {
    const matchesSearch = permission.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.reqId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || permission.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded text-xs font-medium";
    
    switch (status) {
      case "PENDING":
        return `${baseClasses} bg-black text-white`;
      case "APPROVED":
        return `${baseClasses} bg-black text-white`;
      case "REJECTED":
        return `${baseClasses} bg-red-600 text-white`;
      default:
        return `${baseClasses} bg-gray-500 text-white`;
    }
  };

  const columns: Column<Permission>[] = [
    {
      key: "reqId",
      header: "Req-ID",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.reqId}</div>
      )
    },
    {
      key: "reason",
      header: "Reason",
      render: (_, row) => (
        <div className="text-gray-600">{row.reason}</div>
      )
    },
    {
      key: "dateSubmitted",
      header: "Date submitted",
      render: (_, row) => (
        <div className="text-gray-600">{row.dateSubmitted}</div>
      )
    },
    {
      key: "returnDate",
      header: "Return date",
      render: (_, row) => (
        <div className="text-gray-600">{row.returnDate}</div>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <span className={getStatusBadge(row.status)}>
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
              setSelectedPermission(row);
              setIsEditModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900 p-1"
            disabled={row.status !== "PENDING"}
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => {
              setSelectedPermission(row);
              setIsDeleteModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900 p-1"
            disabled={row.status !== "PENDING"}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Permission Requests</h1>
          <p className="text-gray-600">Submit leave requests and track the status of your permission applications.</p>
        </div>
        <button 
          onClick={() => setIsRequestModalOpen(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Upload size={16} />
          New Request
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="outline-none text-sm bg-transparent"
            >
              <option value="all">All documents</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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

      {/* Permissions Table */}
      <Card>
        <CardBody className="p-0">
          {paginatedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Upload size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium">No permission requests found</p>
              <p className="text-sm">Create your first permission request to get started.</p>
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

      {/* Request Permission Modal */}
      {isRequestModalOpen && (
        <RequestPermissionModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          studentId={studentId}
        />
      )}

      {/* Edit Permission Modal */}
      {isEditModalOpen && selectedPermission && (
        <EditPermissionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          permission={selectedPermission}
        />
      )}

      {/* Delete Permission Modal */}
      {isDeleteModalOpen && selectedPermission && (
        <DeletePermissionModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          permission={selectedPermission}
        />
      )}
    </div>
  );
}

// Edit Permission Modal Component
function EditPermissionModal({ 
  isOpen, 
  onClose, 
  permission 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  permission: Permission;
}) {
  const [formData, setFormData] = useState({
    reason: permission.reason,
    departureDate: permission.dateSubmitted,
    returnDate: permission.returnDate,
    description: "" // In a real app, this would come from the permission object
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999]">
        <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>
        <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
        <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col">
            <div className="bg-black text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit Permission Request</h2>
              <button onClick={onClose} className="text-white hover:text-gray-300">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Reason for permission *</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Departure date *</label>
                    <input
                      type="text"
                      value={formData.departureDate}
                      onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Return date *</label>
                    <input
                      type="text"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Additional details</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400 h-24 resize-none"
                    placeholder="Enter additional details about your request"
                  />
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-black text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-white text-gray-700 border border-gray-300 px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
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

// Delete Permission Modal Component
function DeletePermissionModal({ 
  isOpen, 
  onClose, 
  permission 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  permission: Permission;
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
              <h2 className="text-xl font-semibold">Delete Request</h2>
              <button onClick={onClose} className="text-white hover:text-gray-300">✕</button>
            </div>

            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the permission request <span className="font-bold text-gray-900">"{permission.reqId}"</span> for "{permission.reason}"?
              </p>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={onClose}
                  className="bg-black text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                  Delete Request
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

// Request Permission Modal Component
function RequestPermissionModal({ isOpen, onClose, studentId }: { isOpen: boolean; onClose: () => void; studentId?: string }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    reason: "",
    startDate: "",
    endDate: "",
    description: ""
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePermissionDto) => permissionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission request submitted successfully");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit permission request");
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId) {
      toast.error("Student ID not found");
      return;
    }

    if (!formData.reason || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    createMutation.mutate({
      studentId,
      type: "LEAVE",
      reason: formData.reason,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
    });
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
              <h2 className="text-xl font-semibold">Request permission</h2>
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
                {/* Reason for Permission */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Reason for permission *
                  </label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                    placeholder="e.g. Medical appointment, Family emergency"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Departure Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Departure date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                      required
                    />
                  </div>

                  {/* Return Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Return date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Additional Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Additional details
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400 h-20 resize-none"
                    placeholder="Enter additional details about your request"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-black text-white px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Request
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={createMutation.isPending}
                    className="bg-white text-gray-700 border border-gray-300 px-8 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
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
