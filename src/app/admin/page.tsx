"use client";

import { PageHeader } from "@/components/ui/Shared";
import { StatCard } from "@/components/ui/Card";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { DataTable, TableUser, Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Users, GraduationCap, BookOpen, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

const recentStudents = [
  { id: 1, name: "Alice Nguyen", studentId: "S001", class: "10A", parent: "Mary Nguyen", status: "Active" },
  { id: 2, name: "Brian Oke", studentId: "S002", class: "10B", parent: "John Oke", status: "Active" },
  { id: 3, name: "Clara Mbu", studentId: "S003", class: "11A", parent: "Grace Mbu", status: "Inactive" },
  { id: 4, name: "David Kim", studentId: "S004", class: "11B", parent: "Lisa Kim", status: "Active" },
];

type StudentRow = typeof recentStudents[number];

const studentCols: Column<StudentRow>[] = [
  { key: "name", header: "Name", render: (_, row) => <TableUser name={row.name} sub={`ID: ${row.studentId}`} /> },
  { key: "class", header: "Class" },
  { key: "parent", header: "Parent" },
  { key: "status", header: "Status", render: (v) => <StatusBadge status={String(v)} /> },
  {
    key: "id", header: "", align: "right",
    render: (_, row) => <Link href={`/admin/students/${row.id}`}><Button variant="ghost" size="sm">View</Button></Link>
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of your school management system"
        actions={
          <Link href="/admin/students">
            <Button icon={<Plus size={15} />} size="sm">Add Student</Button>
          </Link>
        }
      />

      <div className="stats-grid">
        <StatCard label="Total Students" value="1,248" icon={<Users size={22} />} color="blue" trend={{ value: "+12 this month", direction: "up" }} />
        <StatCard label="Total Teachers" value="64" icon={<GraduationCap size={22} />} color="green" trend={{ value: "+2 this month", direction: "up" }} />
        <StatCard label="Classes" value="38" icon={<BookOpen size={22} />} color="purple" />
        <StatCard label="Pass Rate" value="78%" icon={<TrendingUp size={22} />} color="orange" trend={{ value: "+3% this term", direction: "up" }} />
      </div>

      <Card>
        <CardHeader
          title="Recent Students"
          subtitle="Latest student registrations"
          action={<Link href="/admin/students"><Button variant="outline" size="sm">View All</Button></Link>}
        />
        <CardBody style={{ padding: 0 }}>
          <DataTable columns={studentCols} data={recentStudents} keyField="id" />
        </CardBody>
      </Card>
    </div>
  );
}
