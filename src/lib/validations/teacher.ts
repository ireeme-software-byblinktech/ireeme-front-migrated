import { z } from "zod";

export const createTeacherSchema = z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phoneNumber: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    employeeNum: z.string().min(1, "Employee number is required"),
    department: z.string().optional(),
    qualification: z.string().optional(),
    avatarUrl: z.string().url().optional().or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const updateTeacherSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
    lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
    phoneNumber: z.string().optional(),
    department: z.string().optional(),
    qualification: z.string().optional(),
    avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>;
