import { apiClient } from "./client";

export interface Grade {
    id: string;
    schoolId: string;
    submissionId: string;
    studentId: string;
    subjectId: string;
    teacherId: string;
    termId: string;
    score: number;
    maxScore: number;
    feedback: string | null;
    gradedAt: string;
    appealStatus: string | null;
    subject: {
        id: string;
        name: string;
        code: string;
    };
    teacher: {
        id: string;
        user: {
            firstName: string;
            lastName: string;
        };
    };
    submission: {
        id: string;
        assignment: {
            title: string;
            type: string;
            dueAt: string;
        };
    };
}

export interface GradesResponse {
    data: Grade[];
    gpa: number;
    totalCredits: number;
}

export const gradesApi = {
    getByStudentTerm: (studentId: string, termId: string, page = 1, limit = 50) =>
        apiClient<GradesResponse>(
            `/api/v1/grades/student/${studentId}/${termId}?page=${page}&limit=${limit}`
        ),
};
