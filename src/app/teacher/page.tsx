"use client";

import { PageHeader } from "@/components/ui/Shared";
import { StatCard } from "@/components/ui/Card";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { DataTable, TableUser, ScoreCell, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Users, GraduationCap, ClipboardList, TrendingUp, Plus,
} from "lucide-react";

const recentGrades = [
  { id: 1, student: "Alice Nguyen", subject: "Mathematics", date: "2024-03-20", score: 87, total: 100, status: "Passed" },
  { id: 2, student: "Brian Oke", subject: "English", date: "2024-03-19", score: 45, total: 100, status: "Failed" },
  { id: 3, student: "Clara Mbu", subject: "Physics", date: "2024-03-18", score: 92, total: 100, status: "Passed" },
  { id: 4, student: "David Kim", subject: "Chemistry", date: "2024-03-17", score: 60, total: 100, status: "Passed" },
  { id: 5, student: "Eva Russo", subject: "Biology", date: "2024-03-16", score: 38, total: 100, status: "Failed" },
];

type GradeRow = typeof recentGrades[number];

const gradeColumns: Column<GradeRow>[] = [
  {
    key: "student",
    header: "Student",
    render: (_, row) => <TableUser name={row.student} sub={row.subject} />,
  },
  { key: "subject", header: "Subject" },
  { key: "date", header: "Date", render: (v) => new Date(String(v)).toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
  {
    key: "score",
    header: "Score",
    render: (_, row) => <ScoreCell score={row.score} total={row.total} />,
  },
  {
    key: "status",
    header: "Status",
    render: (v) => <StatusBadge status={String(v)} />,
  },
];

export default function TeacherDashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here is your overview for today."
        actions={
          <Link href="/teacher/grades">
            <Button icon={<Plus size={16} />} size="sm">Add Grade</Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Total Students" value="128" icon={<Users size={22} />} color="blue" trend={{ value: "+4 this week", direction: "up" }} />
        <StatCard label="Assignments" value="12" icon={<ClipboardList size={22} />} color="purple" trend={{ value: "3 pending", direction: "down" }} />
        <StatCard label="Pass Rate" value="82%" icon={<TrendingUp size={22} />} color="green" trend={{ value: "+5% this term", direction: "up" }} />
        <StatCard label="Classes Today" value="4" icon={<GraduationCap size={22} />} color="orange" />
      </div>

      {/* Recent Grades Table */}
      <Card>
        <CardHeader
          title="Recent Grades"
          subtitle="Latest student grade entries"
          action={
            <Link href="/teacher/grades">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          }
        />
        <CardBody style={{ padding: 0 }}>
          <DataTable
            columns={gradeColumns}
            data={recentGrades}
            keyField="id"
          />
        </CardBody>
      </Card>
    </div>
  );
}
