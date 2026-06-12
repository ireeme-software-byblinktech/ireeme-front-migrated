import { apiClient } from "./client";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
  date: string;
  checkInTime?: string;
  student?: {
    studentNumber: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface TeacherAttendanceRecord {
  id: string;
  teacherId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  teacher?: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface DailySummary {
  date: string;
  classId: string | null;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
  records: AttendanceRecord[];
}

export interface TeacherDailySummary {
  date: string;
  totalTeachers: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
  records: TeacherAttendanceRecord[];
}

/**
 * Fetch attendance records for a specific class on a given date.
 * Assumes an endpoint `/attendance/class/:classId?date=YYYY-MM-DD` exists.
 */
export const getAttendanceByClass = (classId: string, date: string) =>
  apiClient<DailySummary>(`/attendance/class/${classId}?date=${date}`);

/**
 * Bulk mark attendance for a class on a specific date.
 * Payload matches the backend MarkBulkAttendanceDto.
 */
export const markBulkAttendance = (
  classId: string,
  date: string,
  records: Array<{ studentId: string; status: AttendanceRecord['status']; remarks?: string }>,
) =>
  apiClient<void>("/attendance/mark-bulk", {
    method: "POST",
    body: JSON.stringify({ classId, date, records }),
  });

// API object for use with React Query
export const attendanceApi = {
  getDailySummary: async (classId?: string, date?: string) =>
    apiClient<DailySummary>(
      `/attendance/daily${classId ? `?classId=${classId}` : ''}${date ? `&date=${date}` : ''}`
    ),
  
  getTeacherDailySummary: async (date?: string) =>
    apiClient<TeacherDailySummary>(
      `/attendance/teacher-daily${date ? `?date=${date}` : ''}`
    ),
  
  markBulk: async (data: { classId: string; date: string; records: Array<{ studentId: string; status: string; remarks?: string }> }) =>
    apiClient<void>("/attendance/mark-bulk", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  markTeacherBulk: async (data: { date: string; records: Array<{ teacherId: string; status: string; remarks?: string }> }) =>
    apiClient<void>("/attendance/mark-teacher-bulk", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getStudentAttendance: async (studentId: string, params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    const queryStr = query.toString();
    return apiClient<{ data: AttendanceRecord[]; total: number; page: number; limit: number }>(
      `/api/v1/attendance/student/${studentId}${queryStr ? `?${queryStr}` : ""}`
    );
  },
};

