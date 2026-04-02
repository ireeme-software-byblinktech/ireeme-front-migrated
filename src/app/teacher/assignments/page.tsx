"use client";

import { PageHeader } from "@/components/ui/Shared";
import { Card, CardBody, CardHeader, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ClipboardList, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

const ASSIGNMENTS = [
  { id: 1, title: "Algebra Problem Set", class: "10A", subject: "Mathematics", dueDate: "2024-03-25", submitted: 22, total: 28, status: "Active" },
  { id: 2, title: "Essay: Romeo & Juliet", class: "10B", subject: "English", dueDate: "2024-03-22", submitted: 18, total: 25, status: "Active" },
  { id: 3, title: "Lab Report - Pendulum", class: "11A", subject: "Physics", dueDate: "2024-03-18", submitted: 30, total: 30, status: "Closed" },
  { id: 4, title: "Cell Biology Quiz", class: "11B", subject: "Biology", dueDate: "2024-03-28", submitted: 5, total: 26, status: "Active" },
];

export default function TeacherAssignmentsPage() {
  return (
    <div>
      <PageHeader
        title="Assignments"
        subtitle="Create and manage student assignments"
        breadcrumbs={[{ label: "Assignments" }]}
        actions={
          <Button icon={<Plus size={15} />} size="sm">
            New Assignment
          </Button>
        }
      />

      <div className="stats-grid">
        <StatCard label="Active Assignments" value="3" icon={<ClipboardList size={22} />} color="blue" />
        <StatCard label="Pending Submissions" value="42" icon={<Clock size={22} />} color="orange" />
        <StatCard label="Graded" value="30" icon={<CheckCircle size={22} />} color="green" />
        <StatCard label="Overdue" value="5" icon={<AlertCircle size={22} />} color="red" />
      </div>

      <div className="flex flex-col gap-4">
        {ASSIGNMENTS.map((a) => (
          <Card key={a.id}>
            <CardBody>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold" style={{ fontSize: 15 }}>{a.title}</h3>
                    <Badge variant={a.status === "Active" ? "success" : "neutral"}>{a.status}</Badge>
                  </div>
                  <p className="text-sm text-muted">{a.subject} · {a.class} · Due: {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-bold text-lg" style={{ color: "var(--color-primary)" }}>{a.submitted}/{a.total}</p>
                    <p className="text-xs text-muted">Submitted</p>
                  </div>
                  <Link href={`/teacher/assignments/${a.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              </div>
              <div className="score-bar-track mt-3" style={{ width: "100%", height: 6 }}>
                <div className="score-bar-fill high" style={{ width: `${Math.round((a.submitted / a.total) * 100)}%` }} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
