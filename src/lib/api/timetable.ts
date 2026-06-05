import { apiClient } from "./client";

export interface TimetableSlot {
    id: string;
    classId: string;
    subjectId: string;
    teacherId: string;
    dayOfWeek: number; // 0 = Monday, 1 = Tuesday, etc.
    startTime: string; // e.g., "08:00"
    room: string | null;
    subject: {
        name: string;
        code: string;
    };
    teacher: {
        user: {
            firstName: string;
            lastName: string;
        };
    };
}

export interface CreateSlotDto {
    classId: string;
    subjectId: string;
    teacherId: string;
    dayOfWeek: number;
    startTime: string;
    room?: string;
}

export const timetableApi = {
    getByClass: (classId: string) =>
        apiClient<TimetableSlot[]>(`/timetable/class/${classId}`),

    getByTeacher: (teacherId: string) =>
        apiClient<TimetableSlot[]>(`/timetable/teacher/${teacherId}`),

    getByStudent: (studentId: string) =>
        apiClient<TimetableSlot[]>(`/timetable/student/${studentId}`),

    getMine: () =>
        apiClient<TimetableSlot[]>("/timetable/mine"),

    createSlot: (data: CreateSlotDto) =>
        apiClient<TimetableSlot>("/timetable", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    deleteSlot: (id: string) =>
        apiClient<void>(`/timetable/${id}`, {
            method: "DELETE",
        }),
};

