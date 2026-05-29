import { apiClient } from "./client";

export interface AttendanceRecord {
    id: string;
    studentId: string;
    subjectId: string;
    date: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    student?: { user: { firstName: string; lastName: string } };
}

export interface AttendanceSummary {
    subjectName: string;
    percentage: number;
    total: number;
    present: number;
}

export const attendancesApi = {
    markBulk: (dto: {
        classId: string;
        subjectId: string;
        date: string;
        records: { studentId: string; status: string; note?: string }[];
    }) => apiClient("/attendance/mark-bulk", {
        method: "POST",
        body: JSON.stringify(dto),
    }),

    getDailySummary: (date: string, classId: string) =>
        apiClient<any>(`/attendance/daily-summary?date=${date}&classId=${classId}`),

    getStudentHistory: (studentId: string, page = 1, limit = 25) =>
        apiClient<any>(`/attendance/student/${studentId}?page=${page}&limit=${limit}`),

    getStudentSummary: (studentId: string, from: string, to: string) =>
        apiClient<AttendanceSummary[]>(`/attendance/summary/${studentId}?from=${from}&to=${to}`),
};
