"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/Shared";
import { Card, CardBody } from "@/components/ui/Card";
import { DataTable, TableUser, ScoreCell, Column, Pagination } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchInput, Select } from "@/components/ui/FormElements";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/FormElements";
import { Plus, Download } from "lucide-react";
import Link from "next/link";

const GRADES_DATA = [
  { id: 1, student: "Alice Nguyen", studentId: "S001", subject: "Mathematics", class: "10A", date: "2024-03-20", score: 87, total: 100, status: "Passed" },
  { id: 2, student: "Brian Oke", studentId: "S002", subject: "English", class: "10B", date: "2024-03-19", score: 45, total: 100, status: "Failed" },
  { id: 3, student: "Clara Mbu", studentId: "S003", subject: "Physics", class: "10A", date: "2024-03-18", score: 92, total: 100, status: "Passed" },
  { id: 4, student: "David Kim", studentId: "S004", subject: "Chemistry", class: "11A", date: "2024-03-17", score: 60, total: 100, status: "Passed" },
  { id: 5, student: "Eva Russo", studentId: "S005", subject: "Biology", class: "11B", date: "2024-03-16", score: 38, total: 100, status: "Failed" },
  { id: 6, student: "Frank Balo", studentId: "S006", subject: "Mathematics", class: "10A", date: "2024-03-15", score: 75, total: 100, status: "Passed" },
  { id: 7, student: "Grace Liu", studentId: "S007", subject: "English", class: "10B", date: "2024-03-14", score: 55, total: 100, status: "Passed" },
  { id: 8, student: "Henry Doe", studentId: "S008", subject: "Physics", class: "11A", date: "2024-03-13", score: 29, total: 100, status: "Failed" },
];

type GradeRow = typeof GRADES_DATA[number];

const PAGE_SIZE = 5;

export default function TeacherGradesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = GRADES_DATA.filter((g) => {
    const matchesSearch =
      g.student.toLowerCase().includes(search.toLowerCase()) ||
      g.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || g.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: Column<GradeRow>[] = [
    {
      key: "student",
      header: "Student",
      render: (_, row) => (
        <Link href={`/teacher/grades/${row.id}`} style={{ textDecoration: "none" }}>
          <TableUser name={row.student} sub={`ID: ${row.studentId}`} />
        </Link>
      ),
    },
    { key: "subject", header: "Subject" },
    { key: "class", header: "Class" },
    {
      key: "date",
      header: "Date",
      render: (v) => new Date(String(v)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    },
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
    {
      key: "id",
      header: "Actions",
      align: "right",
      render: (_, row) => (
        <div className="flex gap-2 justify-end">
          <Link href={`/teacher/grades/${row.id}`}>
            <Button variant="ghost" size="sm">View</Button>
          </Link>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Grades Management"
        subtitle="Manage and track student grades across all classes"
        breadcrumbs={[{ label: "Grades" }]}
        actions={
          <>
            <Button variant="secondary" icon={<Download size={15} />} size="sm">
              Export
            </Button>
            <Button icon={<Plus size={15} />} size="sm" onClick={() => setAddOpen(true)}>
              Add Grade
            </Button>
          </>
        }
      />

      <Card>
        {/* Filters */}
        <div className="filter-bar" style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border-light)" }}>
          <SearchInput
            placeholder="Search student or subject..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            containerClassName="flex-1"
            style={{ maxWidth: 320 }}
          />
          <Select
            options={[
              { value: "passed", label: "Passed" },
              { value: "failed", label: "Failed" },
            ]}
            placeholder="All Status"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ width: 150 }}
          />
        </div>

        <CardBody style={{ padding: 0 }}>
          <DataTable
            columns={columns}
            data={paginated}
            keyField="id"
            emptyMessage="No grades found"
          />
        </CardBody>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
        />
      </Card>

      {/* Add Grade Modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Grade"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => setAddOpen(false)}>Save Grade</Button>
          </>
        }
      >
        <Input label="Student Name" placeholder="Search student..." required />
        <Select label="Subject" options={[{ value: "math", label: "Mathematics" }, { value: "eng", label: "English" }, { value: "phy", label: "Physics" }]} placeholder="Select subject" required />
        <Select label="Class" options={[{ value: "10A", label: "Class 10A" }, { value: "10B", label: "Class 10B" }, { value: "11A", label: "Class 11A" }]} placeholder="Select class" required />
        <div className="grid-2">
          <Input label="Score" type="number" placeholder="0" required />
          <Input label="Total Marks" type="number" placeholder="100" required />
        </div>
        <Input label="Date" type="date" required />
      </Modal>
    </div>
  );
}
