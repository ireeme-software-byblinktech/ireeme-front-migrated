import { apiClient } from "./client";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  note?: string;
  date: string;
  classId?: string;
  // additional fields as needed, e.g., student info
}

export interface TeacherAttendanceRecord {
  id: string;
  teacherId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  note?: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
}

/**
 * Fetch attendance records for a specific class on a given date.
 * Assumes an endpoint `/attendance/class/:classId?date=YYYY-MM-DD` exists.
 */
export const getAttendanceByClass = (classId: string, date: string) =>
  apiClient<AttendanceRecord[]>(`/attendance/class/${classId}?date=${date}`);

/**
 * Bulk mark attendance for a class on a specific date.
 * Payload matches the backend MarkBulkAttendanceDto.
 */
export const markBulkAttendance = (
  classId: string,
  date: string,
  records: Array<{ studentId: string; status: AttendanceRecord['status']; note?: string }>,
) =>
  apiClient<void>("/attendance/mark-bulk", {
    method: "POST",
    body: JSON.stringify({ classId, date, records }),
  });

// API object for use with React Query
export const attendanceApi = {
  getDailySummary: async (classId?: string, date?: string) =>
    apiClient<AttendanceRecord[]>(
      `/attendance/daily${classId ? `?classId=${classId}` : ''}${date ? `&date=${date}` : ''}`
    ),
  
  getTeacherDailySummary: async (date?: string) =>
    apiClient<TeacherAttendanceRecord[]>(
      `/attendance/teacher-daily${date ? `?date=${date}` : ''}`
    ),
  
  markBulk: async (data: { classId: string; date: string; records: Array<{ studentId: string; status: string; note?: string }> }) =>
    apiClient<void>("/attendance/mark-bulk", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  markTeacherBulk: async (data: { date: string; records: Array<{ teacherId: string; status: string; note?: string }> }) =>
    apiClient<void>("/attendance/mark-teacher-bulk", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

