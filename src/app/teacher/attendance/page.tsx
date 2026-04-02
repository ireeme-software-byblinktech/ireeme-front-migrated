"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/Shared";
import { Card, CardBody, CardHeader, StatCard } from "@/components/ui/Card";
import { DataTable, TableUser, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchInput, Select } from "@/components/ui/FormElements";
import { UserCheck, UserX, Clock, Users, Plus } from "lucide-react";

const ATTENDANCE_DATA = [
  { id: 1, student: "Alice Nguyen", studentId: "S001", class: "10A", date: "2024-03-20", status: "Present", time: "07:58 AM" },
  { id: 2, student: "Brian Oke", studentId: "S002", class: "10A", date: "2024-03-20", status: "Absent", time: "--" },
  { id: 3, student: "Clara Mbu", studentId: "S003", class: "10A", date: "2024-03-20", status: "Present", time: "08:05 AM" },
  { id: 4, student: "David Kim", studentId: "S004", class: "10A", date: "2024-03-20", status: "Late", time: "08:32 AM" },
  { id: 5, student: "Eva Russo", studentId: "S005", class: "10A", date: "2024-03-20", status: "Present", time: "07:55 AM" },
  { id: 6, student: "Frank Balo", studentId: "S006", class: "10A", date: "2024-03-20", status: "Absent", time: "--" },
];

type AttRow = typeof ATTENDANCE_DATA[number];

export default function TeacherAttendancePage() {
  const [search, setSearch] = useState("");

  const filtered = ATTENDANCE_DATA.filter((r) =>
    r.student.toLowerCase().includes(search.toLowerCase())
  );

  const present = ATTENDANCE_DATA.filter((r) => r.status === "Present").length;
  const absent = ATTENDANCE_DATA.filter((r) => r.status === "Absent").length;
  const late = ATTENDANCE_DATA.filter((r) => r.status === "Late").length;

  const columns: Column<AttRow>[] = [
    { key: "student", header: "Student", render: (_, row) => <TableUser name={row.student} sub={`ID: ${row.studentId}`} /> },
    { key: "class", header: "Class" },
    { key: "date", header: "Date", render: (v) => new Date(String(v)).toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
    { key: "time", header: "Check-in Time" },
    { key: "status", header: "Status", render: (v) => <StatusBadge status={String(v)} /> },
    {
      key: "id", header: "Action", align: "right",
      render: (_, row) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" style={{ color: "var(--color-success)" }}>Present</Button>
          <Button variant="ghost" size="sm" style={{ color: "var(--color-danger)" }}>Absent</Button>
        </div>
      )
    },
  ];

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Track daily student attendance"
        breadcrumbs={[{ label: "Attendance" }]}
        actions={
          <Button icon={<Plus size={15} />} size="sm">Mark Attendance</Button>
        }
      />

      <div className="stats-grid">
        <StatCard label="Total Students" value={String(ATTENDANCE_DATA.length)} icon={<Users size={22} />} color="blue" />
        <StatCard label="Present" value={String(present)} icon={<UserCheck size={22} />} color="green" />
        <StatCard label="Absent" value={String(absent)} icon={<UserX size={22} />} color="red" />
        <StatCard label="Late" value={String(late)} icon={<Clock size={22} />} color="orange" />
      </div>

      <Card>
        <div className="filter-bar" style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border-light)" }}>
          <SearchInput
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            containerClassName="flex-1"
            style={{ maxWidth: 300 }}
          />
          <Select
            options={[{ value: "10A", label: "Class 10A" }, { value: "10B", label: "Class 10B" }]}
            placeholder="All Classes"
            style={{ width: 150 }}
          />
          <input type="date" className="form-input" style={{ width: 160 }} defaultValue={new Date().toISOString().slice(0, 10)} />
        </div>
        <CardBody style={{ padding: 0 }}>
          <DataTable columns={columns} data={filtered} keyField="id" />
        </CardBody>
      </Card>
    </div>
  );
}
