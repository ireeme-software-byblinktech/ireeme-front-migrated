import { z } from "zod";

export const createStudentSchema = z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    studentNumber: z.string().min(1, "Student number is required"),
    dateOfBirth: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    classId: z.string().optional(),
    enrollmentDate: z.string().min(1, "Enrollment date is required"),
    avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const updateStudentSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
    lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    classId: z.string().optional(),
    avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

