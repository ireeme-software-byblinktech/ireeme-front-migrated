import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { studentsApi } from '@/lib/api/students';
import { dashboardApi } from '@/lib/api/dashboard';
import { assignmentsApi } from '@/lib/api/assignments';
import { gradesApi } from '@/lib/api/grades';
import { attendanceApi } from '@/lib/api/attendance';
import { timetablesApi } from '@/lib/api/timetables';

export interface StudentDashboard {
    overview: {
        totalSubjects: number;
        totalAssignments: number;
        completedAssignments: number;
        averageAttendance: number;
        assignmentsProgress: number;
    };
    upcomingAssignments: Array<{
        id: string;
        title: string;
        subjectId: string;
        subjectName: string;
        dueDate: string;
        status: string;
        teacherName: string;
        progress: number;
    }>;
    recentGrades: Array<{
        id: string;
        subjectName: string;
        score: number;
        total: number;
        date: string;
    }>;
    notices: Array<{
        id: string;
        title: string;
        date: string;
    }>;
}

// Global hook to get current student profile
export const useStudentProfile = () => {
    return useQuery({
        queryKey: ['student-profile', 'me'],
        queryFn: studentsApi.getMyProfile,
        staleTime: 10 * 60 * 1000,
    });
};

export const useStudentDashboard = (studentId: string | undefined) => {
    return useQuery({
        queryKey: ['student-dashboard', studentId],
        queryFn: () => apiClient<StudentDashboard>(`/api/v1/students/${studentId}/dashboard`),
        enabled: !!studentId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useStudentAssignments = () => {
    return useQuery({
        queryKey: ['student-assignments', 'all'],
        queryFn: () => assignmentsApi.getAll(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useStudentGrades = (studentId: string | undefined, termId: string | undefined) => {
    return useQuery({
        queryKey: ['student-grades', studentId, termId],
        queryFn: () => gradesApi.getByStudentTerm(studentId!, termId!),
        enabled: !!studentId && !!termId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useStudentAttendance = (studentId: string | undefined, page = 1) => {
    return useQuery({
        queryKey: ['student-attendance', studentId, page],
        queryFn: () => attendanceApi.getStudentAttendance(studentId!, { page, limit: 10 }),
        enabled: !!studentId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useStudentTimetable = () => {
    return useQuery({
        queryKey: ['student-timetable', 'mine'],
        queryFn: () => timetablesApi.getMyTimetable(),
        staleTime: 30 * 60 * 1000,
    });
};
