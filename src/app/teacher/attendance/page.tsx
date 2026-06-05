"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Search, ChevronDown, ChevronUp, Check, Download } from "lucide-react";
import { StatCard } from "@/components/ui";
import { DataTable, Column, TableUser } from "@/components/ui/DataTable";
import { apiClient } from "@/lib/api/client";

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  date: string;
}

interface AttendanceResponse {
  data: AttendanceRecord[];
}

type SortField = "studentName" | "status" | "date";
type SortOrder = "asc" | "desc" | null;

const FilterDropdown = ({ 
  title, 
  options, 
  value,
  onChange
}: { 
  title: string; 
  options: { label: string; value: string }[]; 
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border-[1.5px] border-gray-200 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 flex items-center gap-2 whitespace-nowrap"
      >
        {options.find(o => o.value === value)?.label || title}
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
          {options.map((opt) => (
            <div
              key={opt.value}
              className="flex items-center gap-3 px-4 cursor-pointer py-2 hover:bg-gray-50 transition-colors"
              onClick={() => {
                onChange?.(opt.value);
                setIsOpen(false);
              }}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  value === opt.value ? "bg-black border-black" : "border-gray-300"
                }`}
              >
                {value === opt.value && <Check size={14} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm font-medium text-gray-700">{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function TeacherAttendancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const queryClient = useQueryClient();

  // Fetch students to get class information
  const { data: studentsData } = useQuery({
    queryKey: ["teachers", "students"],
    queryFn: async () => {
      const response = await apiClient("/api/v1/teachers/students");
      return response as any;
    },
    staleTime: 1000 * 60 * 5,
  });

  const classes = useMemo(() => {
    if (!studentsData?.students || !Array.isArray(studentsData.students)) return [];
    // Extract unique classes from students
    const classMap = new Map();
    studentsData.students.forEach((student: any) => {
      const gradeKey = student.grade || "Unknown";
      if (!classMap.has(gradeKey)) {
        classMap.set(gradeKey, { id: gradeKey, name: gradeKey });
      }
    });
    // Add "All Students" option at the beginning
    const allClasses = [{ id: "all", name: "All Students" }, ...Array.from(classMap.values())];
    return allClasses;
  }, [studentsData]);

  // Get first class by default
  const selectedClass = classFilter || (classes.length > 0 ? classes[0]?.id : null);

  // Fetch attendance data from backend
  const { data: attendanceData, isLoading } = useQuery<AttendanceResponse>({
    queryKey: ["attendance", date],
    queryFn: async () => {
      const response = await apiClient(`/api/v1/attendance/teacher/daily?date=${date}`);
      return { data: response as AttendanceRecord[] };
    },
    staleTime: 1000 * 60 * 5,
  });

  // Mutation for updating attendance status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ recordId, status }: { recordId: string; status: string }) => {
      return await apiClient(`/api/v1/attendance/${recordId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", date], refetchType: "all" });
    },
  });

  const generateReport = () => {
    // Prepare CSV headers
    const headers = ['Student Name', 'Student ID', 'Class', 'Status', 'Date'];
    
    // Prepare CSV rows from filtered and sorted records
    const rows = sortedRecords.map(record => [
      record.studentName,
      record.studentId,
      record.className,
      record.status,
      new Date(record.date).toLocaleDateString(),
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance-report-${date}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allRecords = attendanceData?.data || [];

  // Filter by selected class
  const records = selectedClass === "all" 
    ? allRecords 
    : allRecords.filter(r => r.className === selectedClass);

  // Filter and search
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(search.toLowerCase()) ||
      record.studentId.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = !statusFilter || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sortedRecords = useMemo(() => {
    if (!sortField || !sortOrder) return filteredRecords;

    return [...filteredRecords].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "studentName") {
        aVal = a.studentName.toLowerCase();
        bVal = b.studentName.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecords = sortedRecords.slice(startIndex, startIndex + pageSize);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: records.length,
      present: records.filter(r => r.status === "PRESENT").length,
      absent: records.filter(r => r.status === "ABSENT").length,
      late: records.filter(r => r.status === "LATE").length,
    };
  }, [records]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === "asc") setSortOrder("desc");
      else if (sortOrder === "desc") {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleStatusChange = (recordId: string, newStatus: string) => {
    updateStatusMutation.mutate({ recordId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="pb-10">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-100 rounded-lg w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-md border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
              <div className="h-2 bg-gray-100 rounded-full w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const columns: Column<AttendanceRecord>[] = [
    {
      key: "studentName",
      header: "STUDENT",
      render: (_, record) => (
        <TableUser
          name={record.studentName}
          sub={record.className}
          avatarUrl=""
        />
      )
    },
    {
      key: "status",
      header: "STATUS",
      render: (val, record) => {
        const status = val as string;
        const statusColors: Record<string, string> = {
          "PRESENT": "bg-green-100 text-green-700",
          "ABSENT": "bg-red-100 text-red-700",
          "LATE": "bg-yellow-100 text-yellow-700",
          "EXCUSED": "bg-blue-100 text-blue-700",
        };
        return (
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-700"}`}>
              {status}
            </span>
            <div className="flex gap-1">
              {["PRESENT", "ABSENT", "LATE", "EXCUSED"].map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(record.id, s as any)}
                  className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                    status === s
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s.charAt(0)}
                </button>
              ))}
            </div>
          </div>
        );
      }
    },
    {
      key: "date",
      header: "DATE",
      render: (val) => <div className="text-sm text-gray-600">{new Date(val as string).toLocaleDateString()}</div>
    }
  ];

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Attendance</h1>
          <p className="text-gray-500 mt-1">Track and manage student attendance</p>
        </div>
        <button
          onClick={generateReport}
          disabled={sortedRecords.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={18} />
          Generate Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Students"
          value={stats.total}
          icon={<Users size={24} />}
          progress={100}
        />
        <StatCard
          label="Present"
          value={stats.present}
          icon={<Users size={24} />}
          progress={Math.round((stats.present / stats.total) * 100) || 0}
        />
        <StatCard
          label="Absent"
          value={stats.absent}
          icon={<Users size={24} />}
          progress={Math.round((stats.absent / stats.total) * 100) || 0}
        />
        <StatCard
          label="Late"
          value={stats.late}
          icon={<Users size={24} />}
          progress={Math.round((stats.late / stats.total) * 100) || 0}
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name or ID..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none"
            />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none"
          />
        </div>

        {/* Filters in Row */}
        <div className="flex items-center gap-4">
          <FilterDropdown
            title="Select Class"
            options={classes.map((c: any) => ({ label: c.name, value: c.id }))}
            value={classFilter || undefined}
            onChange={(value) => {
              setClassFilter(value);
              setCurrentPage(1);
            }}
          />

          <FilterDropdown
            title="Select Status"
            options={[
              { label: "All Statuses", value: "" },
              { label: "PRESENT", value: "PRESENT" },
              { label: "ABSENT", value: "ABSENT" },
              { label: "LATE", value: "LATE" },
              { label: "EXCUSED", value: "EXCUSED" },
            ]}
            value={statusFilter || ""}
            onChange={(value) => {
              setStatusFilter(value || null);
              setCurrentPage(1);
            }}
          />

          {(statusFilter || classFilter) && (
            <button
              onClick={() => {
                setStatusFilter(null);
                setClassFilter(null);
                setSearch("");
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Counter */}
      <div className="mb-4 text-sm text-gray-600">
        Showing <span className="font-bold text-gray-900">{paginatedRecords.length}</span> of{" "}
        <span className="font-bold text-gray-900">{sortedRecords.length}</span> records
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={paginatedRecords}
          keyField="id"
          className="attendance-table"
        />

        {/* Pagination */}
        <div className="border-t border-gray-100 bg-white p-6 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md ${
                  currentPage === page ? "bg-black text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {sortedRecords.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No attendance records found</h3>
          <p className="text-gray-500">
            {search || statusFilter ? "No records match your search or filters" : "No attendance data available for this date"}
          </p>
        </div>
      )}
    </div>
  );
}
