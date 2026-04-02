"use client";

import { PageHeader } from "@/components/ui/Shared";
import { Card, CardBody, StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreCell } from "@/components/ui/DataTable";
import { ArrowLeft, Edit, Printer } from "lucide-react";
import Link from "next/link";

// Mock data - replace with real API call
const GRADE_DETAILS: Record<string, { student: string; studentId: string; subject: string; class: string; score: number; total: number; status: string; date: string; comments: string; }> = {
  "1": { student: "Alice Nguyen", studentId: "S001", subject: "Mathematics", class: "10A", score: 87, total: 100, status: "Passed", date: "2024-03-20", comments: "Excellent performance in algebra. Needs improvement in geometry." },
  "2": { student: "Brian Oke", studentId: "S002", subject: "English", class: "10B", score: 45, total: 100, status: "Failed", date: "2024-03-19", comments: "Needs significant improvement. Recommend additional tutoring sessions." },
};

export default function GradeDetailPage({ params }: { params: { id: string } }) {
  const grade = GRADE_DETAILS[params.id] ?? {
    student: "Unknown Student",
    studentId: "N/A",
    subject: "Unknown",
    class: "N/A",
    score: 0,
    total: 100,
    status: "Pending",
    date: new Date().toISOString().slice(0, 10),
    comments: "No comments available.",
  };

  return (
    <div>
      <PageHeader
        title="Grade Detail"
        breadcrumbs={[
          { label: "Grades", href: "/teacher/grades" },
          { label: grade.student },
        ]}
        actions={
          <>
            <Link href="/teacher/grades">
              <Button variant="secondary" icon={<ArrowLeft size={15} />} size="sm">Back</Button>
            </Link>
            <Button variant="outline" icon={<Printer size={15} />} size="sm">Print</Button>
            <Button icon={<Edit size={15} />} size="sm">Edit Grade</Button>
          </>
        }
      />

      <div className="grid-2">
        <Card>
          <CardBody>
            <h3 className="card-title mb-4">Student Information</h3>
            <div className="flex flex-col gap-3">
              <div><span className="text-muted text-sm">Name</span><p className="font-semibold mt-1">{grade.student}</p></div>
              <div><span className="text-muted text-sm">Student ID</span><p className="font-semibold mt-1">{grade.studentId}</p></div>
              <div><span className="text-muted text-sm">Class</span><p className="font-semibold mt-1">{grade.class}</p></div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="card-title mb-4">Grade Information</h3>
            <div className="flex flex-col gap-3">
              <div><span className="text-muted text-sm">Subject</span><p className="font-semibold mt-1">{grade.subject}</p></div>
              <div><span className="text-muted text-sm">Date</span><p className="font-semibold mt-1">{new Date(grade.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p></div>
              <div>
                <span className="text-muted text-sm">Status</span>
                <div className="mt-1"><StatusBadge status={grade.status} /></div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="stats-grid mt-4">
        <StatCard label="Score" value={String(grade.score)} icon={<span style={{ fontSize: 22 }}>📊</span>} color="blue" />
        <StatCard label="Total Marks" value={String(grade.total)} icon={<span style={{ fontSize: 22 }}>📋</span>} color="purple" />
        <StatCard label="Percentage" value={`${Math.round((grade.score / grade.total) * 100)}%`} icon={<span style={{ fontSize: 22 }}>📈</span>} color={grade.score / grade.total >= 0.5 ? "green" : "red"} />
      </div>

      <Card style={{ marginTop: 16 }}>
        <CardBody>
          <h3 className="card-title mb-3">Score Progress</h3>
          <ScoreCell score={grade.score} total={grade.total} />
        </CardBody>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <CardBody>
          <h3 className="card-title mb-2">Teacher&apos;s Comments</h3>
          <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{grade.comments}</p>
        </CardBody>
      </Card>
    </div>
  );
}
