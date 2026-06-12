"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Search, ChevronDown, ChevronUp, Check, Download, ChevronRight } from "lucide-react";
import { StatCard } from "@/components/ui";
import { DataTable, Column, TableUser } from "@/components/ui/DataTable";
import { apiClient } from "@/lib/api/client";
import { toast } from "@/lib/utils/toast";

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  date: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentCode?: string;
  grade?: string;
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
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newAttendanceRecords, setNewAttendanceRecords] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(true);
  const queryClient = useQueryClient();

  // Get today's date for validation
  const today = new Date().toISOString().split('T')[0];
  const isDateInFuture = date > today;
  const maxDate = today; // Max selectable date is today

  // Fetch teacher's subjects
  const { data: subjectsData } = useQuery({
    queryKey: ["teachers", "subjects", "taught"],
    queryFn: async () => {
      const response = await apiClient("/teachers/subjects/taught");
      return response as any;
    },
    staleTime: 1000 * 60 * 10,
  });

  // Fetch teacher's assigned classes with subjects
  const { data: classesData } = useQuery({
    queryKey: ["teachers", "classes", "assigned"],
    queryFn: async () => {
      const response = await apiClient("/teachers/classes/assigned");
      return response as any;
    },
    staleTime: 1000 * 60 * 10,
  });

  // Fetch students to get class information
  const { data: studentsData } = useQuery({
    queryKey: ["teachers", "students"],
    queryFn: async () => {
      const response = await apiClient("/teachers/students");
      return response as any;
    },
    staleTime: 1000 * 60 * 5,
  });

  const classes = useMemo(() => {
    // Use classes from teacher's assigned classes
    if (classesData?.classes && Array.isArray(classesData.classes)) {
      const classOptions = classesData.classes.map((c: any) => ({
        id: c.id || c.name,
        name: c.name,
      }));
      // Add "All Classes" option at the beginning
      return [{ id: "all", name: "All Classes" }, ...classOptions];
    }
    return [{ id: "all", name: "All Classes" }];
  }, [classesData]);

  const subjects = useMemo(() => {
    // Use subjects taught by teacher
    if (subjectsData?.subjects && Array.isArray(subjectsData.subjects)) {
      return subjectsData.subjects.map((s: any) => ({
        id: s.id,
        name: s.name,
      }));
    }
    return [];
  }, [subjectsData]);

  // Get first class by default
  const selectedClass = classFilter || (classes.length > 0 ? classes[0]?.id : null);

  // Fetch attendance data from backend
  interface AttendanceResponse {
    date: string;
    classId: string | null;
    totalStudents: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
    records: any[];
  }

  const { data: attendanceData, isLoading, refetch: refetchAttendance } = useQuery<AttendanceResponse>({
    queryKey: ["attendance", date],
    queryFn: async (): Promise<AttendanceResponse> => {
      console.log("Fetching attendance for date:", date);
      const response = await apiClient(`/attendance/daily-summary?date=${date}`) as any;
      console.log("Attendance response full:", response);
      
      // The API returns: { date, classId, totalStudents, present, absent, late, excused, attendanceRate, records: [...] }
      // We need to extract the records array
      if (response && response.records && Array.isArray(response.records)) {
        console.log("Found records array with length:", response.records.length);
        return response; // Return the full response with records
      }
      
      // If it's just an array, wrap it
      if (Array.isArray(response)) {
        console.log("Response is array, wrapping...");
        return {
          date: new Date().toISOString(),
          classId: null,
          totalStudents: response.length,
          present: 0,
          absent: response.length,
          late: 0,
          excused: 0,
          attendanceRate: 0,
          records: response,
        };
      }
      
      // Return as-is
      return response;
    },
    staleTime: 0, // Don't cache - always fetch fresh
  });

  // Mutation for updating attendance status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ recordId, status }: { recordId: string; status: string }) => {
      return await apiClient(`/attendance/${recordId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", date], refetchType: "all" });
    },
  });

  // Mutation for marking bulk attendance (new day)
  const markBulkAttendanceMutation = useMutation({
    mutationFn: async (records: Array<{ studentId: string; status: string; note?: string }>) => {
      // Validate date is not in the future
      if (isDateInFuture) {
        throw new Error("Cannot mark attendance for future dates. Please select today or an earlier date.");
      }

      // Get the first subject if available, otherwise use undefined and let backend handle it
      const subjectId = subjectsData?.subjects?.[0]?.id;
      
      if (!subjectId) {
        throw new Error("No subject found. Please ensure you have at least one subject assigned.");
      }

      // Format date as ISO string (YYYY-MM-DD)
      const dateISO = date; // date is already in YYYY-MM-DD format

      const payload = {
        date: dateISO,
        subjectId,
        records,
      };
      
      console.log("Sending attendance payload with formatted date:", payload);
      
      const response = await apiClient("/attendance/mark-bulk", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      
      console.log("Attendance save response:", response);
      return response;
    },
    onSuccess: () => {
      console.log("Attendance saved successfully, clearing state and refetching...");
      toast.success(`Attendance for ${classStudents.length} students saved successfully!`);
      
      // Clear the temporary state immediately
      setNewAttendanceRecords({});
      
      // Force cache invalidation
      queryClient.removeQueries({ queryKey: ["attendance"] });
      
      // Refetch after a short delay to ensure DB has updated
      setTimeout(() => {
        console.log("Refetching attendance after save...");
        refetchAttendance();
      }, 500);
    },
    onError: (error: any) => {
      console.error("Attendance marking error:", error);
      toast.error(error.message || "Failed to save attendance");
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

  const allRecords = attendanceData?.records && Array.isArray(attendanceData.records) ? attendanceData.records : [];

  // Get students for selected class to show on new day
  const classStudents = useMemo(() => {
    if (!studentsData?.students || !selectedClass) return [];
    if (selectedClass === "all") return studentsData.students;
    
    // Filter by grade (class name) - the backend returns 'grade' field with class name
    return studentsData.students.filter((s: any) => s.grade === selectedClass);
  }, [studentsData, selectedClass]);

  // If no attendance records exist, convert students to attendance records for marking
  const displayRecords: AttendanceRecord[] = useMemo(() => {
    // Always show attendance records from the database if they exist
    if (allRecords && allRecords.length > 0) {
      console.log("Mapping attendance records:", allRecords.length, "records");
      return allRecords.map((record: any) => {
        // Backend returns { id, studentId, date, status, remarks, student: { studentNumber, user: { firstName, lastName, email } } }
        let studentName = "";
        
        // Try to get student name from nested student object (backend response structure)
        if (record.student?.user?.firstName && record.student?.user?.lastName) {
          studentName = `${record.student.user.firstName} ${record.student.user.lastName}`;
        }
        // Fallback to direct studentName field
        else if (record.studentName) {
          studentName = record.studentName;
        }
        // Fallback to student code
        else if (record.student?.studentNumber) {
          studentName = record.student.studentNumber;
        }
        
        console.log(`Student record ${record.studentId} name resolved to: ${studentName}`);
        
        return {
          id: record.id,
          studentId: record.studentId,
          studentName: studentName || "Unknown",
          className: record.className || "Unknown",
          status: record.status || "ABSENT",
          date: record.date,
        } as AttendanceRecord;
      });
    }
    
    // New day - convert students to attendance records for marking (only if we have students and no records yet)
    if (classStudents.length === 0) {
      console.log("No class students to display");
      return [];
    }

    console.log("Creating new attendance records for", classStudents.length, "students");
    return classStudents.map((student: any) => ({
      id: `temp-${student.id}`,
      studentId: student.id,
      studentName: student.name || `${student.firstName || ""} ${student.lastName || ""}`.trim(),
      className: student.grade || "Unknown",
      status: (newAttendanceRecords[student.id] || "PRESENT") as "PRESENT" | "ABSENT" | "LATE" | "EXCUSED",
      date: date,
    } as AttendanceRecord));
  }, [allRecords, classStudents, newAttendanceRecords, date]);

  // Filter by selected class
  const records = selectedClass === "all" 
    ? displayRecords 
    : displayRecords.filter(r => r.className === selectedClass);

  // Filter and search
  const filteredRecords = records.filter((record: AttendanceRecord) => {
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

  const handleStatusChange = (recordId: string, newStatus: string) => {
    // Check if this is a new record (from students list on new day)
    if (recordId.startsWith("temp-")) {
      const studentId = recordId.replace("temp-", "");
      setNewAttendanceRecords(prev => ({ ...prev, [studentId]: newStatus }));
    } else {
      // Existing record - update via API
      updateStatusMutation.mutate({ recordId, status: newStatus });
    }
  };

  const handleSaveNewAttendance = () => {
    const records = classStudents.map((student: any) => ({
      studentId: student.id,
      status: newAttendanceRecords[student.id] || "PRESENT",
    }));
    markBulkAttendanceMutation.mutate(records);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-gray-900">Attendance</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Track and manage student attendance</p>
        </div>
        <div className="flex gap-3 items-center flex-wrap sm:flex-nowrap">
          {allRecords.length === 0 && classStudents.length > 0 && (
            <button
              onClick={handleSaveNewAttendance}
              disabled={markBulkAttendanceMutation.isPending || isDateInFuture}
              title={isDateInFuture ? "Cannot save attendance for future dates" : "Save attendance"}
              className="flex items-center justify-center gap-2 px-4 sm:px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap text-sm sm:text-base"
            >
              <Check size={18} />
              <span className="hidden sm:inline">Save Attendance</span><span className="sm:hidden">Save</span>
            </button>
          )}
          <button
            onClick={generateReport}
            disabled={sortedRecords.length === 0}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-4 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap text-sm sm:text-base"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Generate Report</span><span className="sm:hidden">Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
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
      <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-6 mb-6">
        <div className="flex flex-col gap-4 mb-4">
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
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-black focus:outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Filters Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 mb-4 transition-colors"
        >
          <ChevronRight
            size={18}
            className={`transition-transform ${showFilters ? "rotate-90" : ""}`}
          />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Filters in Row */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  max={maxDate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    if (newDate <= today) {
                      setDate(newDate);
                      setCurrentPage(1);
                    } else {
                      toast.error("Cannot select future dates. Please select today or an earlier date.");
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none text-sm sm:text-base transition-colors ${
                    isDateInFuture
                      ? "border-red-300 bg-red-50 text-red-900"
                      : "border-gray-200 focus:border-black"
                  }`}
                />
                {isDateInFuture && (
                  <div className="text-xs text-red-600 mt-1">Cannot mark attendance for future dates</div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <FilterDropdown
                title="Select Class"
                options={classes.map((c: any) => ({ label: c.name, value: c.id }))}
                value={classFilter || undefined}
                onChange={(value) => {
                  setClassFilter(value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex-1">
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
            </div>

            {(statusFilter || classFilter) && (
              <button
                onClick={() => {
                  setStatusFilter(null);
                  setClassFilter(null);
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
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

