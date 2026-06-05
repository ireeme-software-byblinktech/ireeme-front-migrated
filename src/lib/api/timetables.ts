import { apiClient } from "./client";

export interface TimetableSlot {
    id: string;
    classId: string;
    subjectId: string;
    teacherId: string;
    dayOfWeek: number;
    startTime: string;
    room?: string;
    subject?: { name: string; code: string };
    teacher?: { user: { firstName: string; lastName: string } };
}

export const timetablesApi = {
    getMyTimetable: () => apiClient<TimetableSlot[]>("/timetable/mine"),

    getByClass: (classId: string) =>
        apiClient<TimetableSlot[]>(`/timetable/class/${classId}`),

    create: (dto: {
        classId: string;
        subjectId: string;
        teacherId: string;
        dayOfWeek: number;
        startTime: string;
        room?: string;
    }) => apiClient<TimetableSlot>("/timetable", {
        method: "POST",
        body: JSON.stringify(dto),
    }),

    delete: (id: string) => apiClient(`/timetable/${id}`, { method: "DELETE" }),
};

