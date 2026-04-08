"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/Shared";
import { Card, CardBody } from "@/components/ui/Card";
import { DataTable, TableUser, Column, Pagination } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchInput, Select } from "@/components/ui/FormElements";
import { Plus, Download } from "lucide-react";
import Link from "next/link";

const STUDENTS = [
  { id: 1, name: "Alice Nguyen", studentId: "S001", class: "10A", gender: "Female", parent: "Mary Nguyen", phone: "+1 555 0101", status: "Active" },
  { id: 2, name: "Brian Oke", studentId: "S002", class: "10B", gender: "Male", parent: "John Oke", phone: "+1 555 0102", status: "Active" },
  { id: 3, name: "Clara Mbu", studentId: "S003", class: "11A", gender: "Female", parent: "Grace Mbu", phone: "+1 555 0103", status: "Inactive" },
  { id: 4, name: "David Kim", studentId: "S004", class: "11B", gender: "Male", parent: "Lisa Kim", phone: "+1 555 0104", status: "Active" },
  { id: 5, name: "Eva Russo", studentId: "S005", class: "10A", gender: "Female", parent: "Tom Russo", phone: "+1 555 0105", status: "Active" },
  { id: 6, name: "Frank Balo", studentId: "S006", class: "10B", gender: "Male", parent: "Anne Balo", phone: "+1 555 0106", status: "Active" },
];

type StudentRow = typeof STUDENTS[number];
export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");

  const filtered = STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  const cols: Column<StudentRow>[] = [
    { key: "name", header: "Student", render: (_, row) => <TableUser name={row.name} sub={`ID: ${row.studentId}`} /> },
    { key: "class", header: "Class" },
    { key: "gender", header: "Gender" },
    { key: "parent", header: "Parent" },
    { key: "phone", header: "Phone" },
    { key: "status", header: "Status", render: (v) => <StatusBadge status={String(v)} /> },
    {
      key: "id", header: "", align: "right",
      render: (_, row) => (
        <div className="flex gap-2 justify-end">
          <Link href={`/admin/students/${row.id}`}>
            <Button variant="ghost" size="sm">View</Button>
          </Link>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      )
    },
  ];

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Manage all student records"
        breadcrumbs={[{ label: "Students" }]}
        actions={
          <>
            <Button variant="secondary" icon={<Download size={15} />} size="sm">Export</Button>
            <Button icon={<Plus size={15} />} size="sm">Add Student</Button>
          </>
        }
      />

      <Card>
        <div className="filter-bar" style={{ padding: "16px 20px", borderBottom: "1px solid var(--color-border-light)" }}>
          <SearchInput placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} containerClassName="flex-1" style={{ maxWidth: 320 }} />
          <Select options={[{ value: "10A", label: "Class 10A" }, { value: "10B", label: "Class 10B" }, { value: "11A", label: "Class 11A" }]} placeholder="All Classes" style={{ width: 150 }} />
          <Select options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} placeholder="All Status" style={{ width: 140 }} />
        </div>
        <CardBody className="p-0">
          <DataTable
            columns={cols}
            data={filtered}
            keyField="id"
            pageSize={10}
            paginationClassName="px-6 py-4 border-t border-gray-200"
          />
        </CardBody>
      </Card>
    </div>
  );
}
