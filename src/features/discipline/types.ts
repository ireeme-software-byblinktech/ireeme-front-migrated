export interface DisciplineCase {
  id: string;
  studentId: string;
  description: string;
  severity: "low" | "medium" | "high";
  status: "open" | "resolved";
  date: string;
}

