"use client";

import { useState } from "react";
import { StatCard, Card, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/FormElements";
import { GraduationCap, BookOpen, FileText, BarChart2, Filter } from "lucide-react";
import { useStudentProfile, useStudentGrades } from "@/hooks/api/useStudentAPI";
import { useQuery } from "@tanstack/react-query";
import { academicTermsApi } from "@/lib/api/academic-terms";

interface GradeRow {
  id: string;
  subject: string;
  assignmentTitle: string;
  type: string;
  score: string;
  percentage: string;
  gradedAt: string;
  term: string;
  feedback: string | null;
}

export default function MyGradesPage() {
  const { data: profile } = useStudentProfile();

  const { data: terms } = useQuery({
    queryKey: ["academic-terms"],
    queryFn: academicTermsApi.getTerms,
  });

  const activeTerm = terms?.find((t) => t.isActive) ?? terms?.[0];
  const [selectedTermId, setSelectedTermId] = useState<string>("");

  const resolvedTermId = selectedTermId || activeTerm?.id || "";

  const { data: gradesResponse, isLoading } = useStudentGrades(
    profile?.id,
    resolvedTermId
  );

  const gradesData: GradeRow[] = (gradesResponse?.data ?? []).map((g) => ({
    id: g.id,
    subject: g.subject?.name ?? "Unknown",
    assignmentTitle: g.submission?.assignment?.title ?? "Graded Work",
    type: g.submission?.assignment?.type ?? "-",
    score: `${Number(g.score).toFixed(1)} / ${Number(g.maxScore).toFixed(1)}`,
    percentage: `${Math.round((Number(g.score) / Number(g.maxScore)) * 100)}%`,
    gradedAt: new Date(g.gradedAt).toLocaleDateString(),
    term: activeTerm?.name ?? "—",
    feedback: g.feedback,
  }));

  const avgScore =
    gradesData.length > 0
      ? Math.round(
        gradesData.reduce((sum, g) => {
          const [score, max] = g.score.split(" / ").map(Number);
          return sum + (score / max) * 100;
        }, 0) / gradesData.length
      )
      : 0;

  const columns: Column<GradeRow>[] = [
    {
      key: "subject",
      header: "Subject",
      render: (_, row) => (
        <div className="font-medium text-gray-900">{row.subject}</div>
      ),
    },
    {
      key: "assignmentTitle",
      header: "Assignment",
      render: (_, row) => (
        <div className="text-gray-700">{row.assignmentTitle}</div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (_, row) => (
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
          {row.type}
        </span>
      ),
    },
    {
      key: "score",
      header: "Score",
      render: (_, row) => (
        <div className="font-bold text-gray-900">{row.score}</div>
      ),
    },
    {
      key: "percentage",
      header: "Grade %",
      align: "center",
      render: (_, row) => {
        const pct = parseInt(row.percentage);
        const color =
          pct >= 80
            ? "text-green-600"
            : pct >= 60
              ? "text-blue-600"
              : "text-red-600";
        return (
          <span className={`font-black ${color}`}>{row.percentage}</span>
        );
      },
    },
    {
      key: "gradedAt",
      header: "Date",
      render: (_, row) => (
        <div className="text-gray-500 text-sm">{row.gradedAt}</div>
      ),
    },
    {
      key: "feedback",
      header: "Feedback",
      render: (_, row) =>
        row.feedback ? (
          <div
            className="text-gray-600 text-sm max-w-[200px] truncate"
            title={row.feedback}
          >
            {row.feedback}
          </div>
        ) : (
          <span className="text-gray-300 text-sm italic">No feedback</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
          <p className="text-sm text-gray-500">
            View your academic performance
          </p>
        </div>
        {terms && terms.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Term
            </span>
            <Select
              value={selectedTermId || activeTerm?.id || ""}
              onChange={(e) => setSelectedTermId(e.target.value)}
              options={terms.map((t) => ({ value: t.id, label: t.name }))}
              className="w-48 h-10"
            />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Graded"
          value={gradesData.length.toString()}
          icon={<BookOpen size={18} />}
          progress={80}
          trend={{ value: "0", direction: "up", label: "This term" }}
        />
        <StatCard
          label="Average Score"
          value={`${avgScore}%`}
          icon={<BarChart2 size={18} />}
          progress={avgScore}
          trend={{ value: "0", direction: "up", label: "This term" }}
        />
        <StatCard
          label="Subjects"
          value={
            Array.from(new Set(gradesData.map((g) => g.subject))).length.toString()
          }
          icon={<GraduationCap size={18} />}
          progress={75}
          trend={{ value: "0", direction: "up", label: "This term" }}
        />
        <StatCard
          label="GPA"
          value={gradesResponse?.gpa?.toFixed(2) ?? "-"}
          icon={<FileText size={18} />}
          progress={90}
          trend={{ value: "0", direction: "up", label: "This term" }}
        />
      </div>

      <Card>
        <CardBody>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Grade History
          </h2>
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
            </div>
          ) : gradesData.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FileText size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">
                No grades available for this term yet.
              </p>
              <p className="text-sm mt-1">
                Check back after assignments have been graded.
              </p>
            </div>
          ) : (
            <DataTable
              columns={
                columns as unknown as Column<Record<string, unknown>>[]
              }
              data={gradesData as unknown as Record<string, unknown>[]}
              keyField="id"
              pageSize={10}
              className="grades-table"
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}

