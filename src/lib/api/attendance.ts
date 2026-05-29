import { apiClient } from "./client";

export interface AttendanceRecord {
    id: string;
    studentId: string;
    date: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    remarks?: string;
    student: {
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
    date: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    checkInTime?: string;
    checkOutTime?: string;
    remarks?: string;
    teacher: {
        employeeNum: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
    };
}

export interface DailySummaryResponse {
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

export interface TeacherDailySummaryResponse {
    date: string;
    totalTeachers: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
    records: TeacherAttendanceRecord[];
}

export interface MarkBulkAttendanceDto {
    classId: string;
    date: string;
    records: {
        studentId: string;
        status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
        remarks?: string;
    }[];
}

export interface MarkBulkTeacherAttendanceDto {
    date: string;
    records: {
        teacherId: string;
        status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
        note?: string;
        checkInTime?: string;
        checkOutTime?: string;
    }[];
}

export const attendanceApi = {
    markBulk: (data: MarkBulkAttendanceDto) =>
        apiClient("/api/v1/attendance/mark-bulk", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    markTeacherBulk: (data: MarkBulkTeacherAttendanceDto) =>
        apiClient("/api/v1/attendance/mark-teacher-bulk", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    getStudentAttendance: (studentId: string, params?: { page?: number; limit?: number }) =>
        apiClient<{ data: AttendanceRecord[]; total: number; page: number; limit: number }>(
            `/api/v1/attendance/student/${studentId}?${new URLSearchParams(params as any).toString()}`
        ),

    getDailySummary: (classId: string | undefined, date: string) => {
        const params = new URLSearchParams({ date });
        if (classId) {
            params.append('classId', classId);
        }
        return apiClient<DailySummaryResponse>(
            `/api/v1/attendance/daily-summary?${params.toString()}`
        );
    },

    getTeacherDailySummary: (date: string) =>
        apiClient<TeacherDailySummaryResponse>(
            `/api/v1/attendance/teacher-daily-summary?date=${date}`
        ),
};
