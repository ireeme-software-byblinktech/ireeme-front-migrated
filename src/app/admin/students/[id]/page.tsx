"use client";

import { PageHeader } from "@/components/ui/Shared";
import { Card, CardBody, StatCard } from "@/components/ui";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Shared";
import { ArrowLeft, Edit, Mail, Phone } from "lucide-react";
import Link from "next/link";

const STUDENTS: Record<string, {
  name: string; studentId: string; class: string; gender: string; dob: string;
  parent: string; phone: string; email: string; address: string; status: string;
  joinDate: string; avgScore: number; attendance: number;
}> = {
  "1": { name: "Alice Nguyen", studentId: "S001", class: "10A", gender: "Female", dob: "2008-04-12", parent: "Mary Nguyen", phone: "+1 555 0101", email: "alice@email.com", address: "123 Main St, Springfield", status: "Active", joinDate: "2022-09-01", avgScore: 87, attendance: 94 },
};

export default function AdminStudentDetailPage({ params }: { params: { id: string } }) {
  const student = STUDENTS[params.id] ?? {
    name: "Student " + params.id, studentId: `S00${params.id}`, class: "N/A", gender: "N/A", dob: "N/A",
    parent: "N/A", phone: "N/A", email: "N/A", address: "N/A", status: "Active", joinDate: "N/A", avgScore: 0, attendance: 0,
  };

  return (
    <div>
      <PageHeader
        title="Student Profile"
        breadcrumbs={[{ label: "Students", href: "/admin/students" }, { label: student.name }]}
        actions={
          <>
            <Link href="/admin/students"><Button variant="secondary" icon={<ArrowLeft size={15} />} size="sm">Back</Button></Link>
            <Button icon={<Edit size={15} />} size="sm">Edit</Button>
          </>
        }
      />

      {/* Profile Header */}
      <Card style={{ marginBottom: 16 }}>
        <CardBody>
          <div className="flex items-center gap-5 flex-wrap">
            <Avatar name={student.name} size="xl" />
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{student.name}</h2>
              <p className="text-muted text-sm mb-2">ID: {student.studentId} · Class {student.class}</p>
              <StatusBadge status={student.status} />
            </div>
            <div className="flex-1" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={<Mail size={14} />}>Email</Button>
              <Button variant="outline" size="sm" icon={<Phone size={14} />}>Call</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="stats-grid">
        <StatCard label="Average Score" value={`${student.avgScore}%`} icon={<span style={{ fontSize: 22 }}>📊</span>} color="blue" />
        <StatCard label="Attendance Rate" value={`${student.attendance}%`} icon={<span style={{ fontSize: 22 }}>✅</span>} color="green" />
        <StatCard label="Class Rank" value="#5" icon={<span style={{ fontSize: 22 }}>🏆</span>} color="orange" />
      </div>

      <div className="grid-2" style={{ marginTop: 16 }}>
        <Card>
          <CardBody>
            <h3 className="card-title mb-4">Personal Info</h3>
            {[
              { label: "Full Name", value: student.name },
              { label: "Gender", value: student.gender },
              { label: "Date of Birth", value: student.dob },
              { label: "Join Date", value: student.joinDate },
            ].map(({ label, value }) => (
              <div key={label} style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: 12, marginBottom: 12 }}>
                <p className="text-sm text-muted">{label}</p>
                <p className="font-medium mt-0.5">{value}</p>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="card-title mb-4">Contact Info</h3>
            {[
              { label: "Parent / Guardian", value: student.parent },
              { label: "Phone", value: student.phone },
              { label: "Email", value: student.email },
              { label: "Address", value: student.address },
            ].map(({ label, value }) => (
              <div key={label} style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: 12, marginBottom: 12 }}>
                <p className="text-sm text-muted">{label}</p>
                <p className="font-medium mt-0.5">{value}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
