// Types and Interfaces for Assignments Module

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  subject: { name: string; id: string };
  type: string;
  dueAt: string;
  maxScore: number;
  submissions: Array<{ id: string; studentId: string; status: string; submittedAt: string }>;
  allowLate?: boolean;
  weight?: number;
  subjectId?: string;
}

export interface TransformedAssignment {
  id: string;
  title: string;
  class: string;
  subject: string;
  dueDate: string;
  submitted: number;
  totalSubmissions: number;
  graded: number;
  totalGraded: number;
  status: "Active" | "Graded" | "Draft";
  type: string;
}

export interface CreateAssignmentInput {
  title: string;
  description?: string;
  subjectId: string;
  type: string;
  status?: string;
  maxScore: number;
  weight: number;
  dueAt?: string;
  allowLate?: boolean;
}

export interface FormData {
  title: string;
  description: string;
  subjectId: string;
  type: string;
  maxScore: number;
  weight: number;
  dueAt: string;
  allowLate: boolean;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  text: string;
  type: "MCQ" | "OPEN";
  options?: Array<{ id: string; value: string; isCorrect: boolean }>;
}

export interface MCQOption {
  id: string;
  value: string;
  isCorrect: boolean;
}

export interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  status: "SUBMITTED" | "GRADED" | "LATE" | "NOT_SUBMITTED";
  submittedAt?: string;
  grade?: number;
  feedback?: string;
}

export interface AssignmentStats {
  total: number;
  active: number;
  graded: number;
  drafts: number;
}

export interface FilterState {
  type?: string[];
  status?: string[];
  subject?: string[];
}

export type AssignmentVariant = "MCQ" | "Open-Ended";
export type ViewMode = "grid" | "table";
export type SortField = "title" | "dueDate" | "type" | "status";
export type SortDirection = "asc" | "desc";

// Constants
export const ASSIGNMENT_TYPES = ["HOMEWORK", "CAT", "EXAM", "PROJECT", "QUIZ"];
export const ASSIGNMENT_STATUSES = ["Active", "Graded", "Draft"];
export const SUBMISSION_STATUSES = ["ALL", "Submitted", "Graded", "Not Submitted"];
