import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface StudentProfile {
    id: string;
    userId: string;
    admissionNumber: string;
    grade: string;
    schoolId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
}

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

// Hooks
export const useStudentProfile = () => {
    return useQuery<StudentProfile, Error>({
        queryKey: ['student-profile', 'me'],
        queryFn: () => apiClient<StudentProfile>('/students/me/profile'),
    });
};

export const useStudentDashboard = (studentId: string | undefined) => {
    return useQuery<StudentDashboard, Error>({
        queryKey: ['student-dashboard', studentId],
        queryFn: () => apiClient<StudentDashboard>(`/students/${studentId}/dashboard`),
        enabled: !!studentId, // Only fetch if we have a studentId
        staleTime: 5 * 60 * 1000, // Dashboard is cached in backend for 5 min, so standard 5m stale in frontend is good
    });
};

