export interface HealthRecord {
  id: string;
  studentId: string;
  date: string;
  type: "checkup" | "medication" | "incident";
  notes: string;
}
