export interface Transaction {
  id: string;
  studentId: string;
  amount: number;
  type: "payment" | "refund";
  status: "pending" | "completed";
  date: string;
}

