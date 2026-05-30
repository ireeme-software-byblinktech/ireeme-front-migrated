import { apiClient } from "./client";

export interface Assignment {
    id: string;
    schoolId: string;
    subjectId: string;
    teacherId: string;
    title: string;
    description: string | null;
    type: "HOMEWORK" | "QUIZ" | "PROJECT" | "EXAM";
    maxScore: number;
    weight: number;
    dueAt: string;
    allowLate: boolean;
    fileUrls: string[];
    createdAt: string;
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
    submissions?: any[];
}

export const assignmentsApi = {
    getAll: (params?: { subjectId?: string; teacherId?: string }) => {
        const query = new URLSearchParams();
        if (params?.subjectId) query.append("subjectId", params.subjectId);
        if (params?.teacherId) query.append("teacherId", params.teacherId);

        return apiClient<Assignment[]>(`/api/v1/assignments?${query.toString()}`);
    },

    getById: (id: string) => apiClient<Assignment>(`/api/v1/assignments/${id}`),

    submit: (id: string, data: { content?: string; fileUrls?: string[] }) =>
        apiClient<any>(`/api/v1/assignments/${id}/submit`, {
            method: "POST",
            body: JSON.stringify(data),
        }),
};
