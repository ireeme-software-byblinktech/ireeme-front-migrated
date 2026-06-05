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

// Raw shape returned by GET /students/:id/dashboard
interface RawDashboard {
    grades: Array<{ id: string; score: any; maxScore: any; gradedAt: string; subject?: { name: string } }>;
    attendance: Array<{ status: string; _count: { status: number } }>;
    assignments: Array<{ id: string; title: string; dueAt: string; type: string; subject?: { name: string } }>;
    unreadNotifications: number;
}

function transformDashboard(raw: RawDashboard): StudentDashboard {
    // Attendance stats
    const totalAttendance = raw.attendance.reduce((sum, a) => sum + a._count.status, 0);
    const presentCount = raw.attendance.find(a => a.status === 'PRESENT')?._count.status ?? 0;
    const averageAttendance = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    return {
        overview: {
            totalSubjects: [...new Set(raw.assignments.map(a => a.subject?.name).filter(Boolean))].length || raw.grades.length,
            totalAssignments: raw.assignments.length,
            completedAssignments: 0,
            averageAttendance,
            assignmentsProgress: raw.assignments.length > 0 ? Math.round((0 / raw.assignments.length) * 100) : 0,
        },
        upcomingAssignments: raw.assignments.map(a => ({
            id: a.id,
            title: a.title,
            subjectId: '',
            subjectName: a.subject?.name ?? 'Unknown',
            dueDate: a.dueAt,
            status: 'Pending',
            teacherName: '',
            progress: 0,
        })),
        recentGrades: raw.grades.map(g => ({
            id: g.id,
            subjectName: g.subject?.name ?? 'Unknown',
            score: Number(g.score),
            total: Number(g.maxScore),
            date: g.gradedAt,
        })),
        notices: [],
    };
}

export const useStudentDashboard = (studentId: string | undefined) => {
    return useQuery({
        queryKey: ['student-dashboard', studentId],
        queryFn: async () => {
            const raw = await apiClient<RawDashboard>(`/api/v1/students/${studentId}/dashboard`);
            return transformDashboard(raw);
        },
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
        enabled: !!studentId && !!termId && termId.length > 10, // Ensure valid UUID
        staleTime: 5 * 60 * 1000,
        retry: 1,
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
