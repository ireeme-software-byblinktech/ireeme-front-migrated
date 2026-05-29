"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { GraduationCap, BookOpen, FileText, BarChart2 } from "lucide-react";
import { ViewSubmissionModal } from "@/components/ui/ViewSubmissionModal";
import { useStudentProfile, useStudentDashboard } from "@/hooks/api/useStudentAPI";
import { useSocket } from "@/hooks/useSocket";
import { studentsApi } from "@/lib/api/students";

// Assignment data type
interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  progress: number;
  status: "Submitted" | "Late" | "Pending" | "To do" | "Done";
  dueDate: string;
  category: "Pending" | "To do" | "Done";
}

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Pending" | "To do" | "Done">("Pending");
  const [selectedSubmission, setSelectedSubmission] = useState<Assignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: profile } = useStudentProfile();
  const { data: dashboardData, isLoading, refetch } = useStudentDashboard(profile?.id);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('grade.posted', () => refetch());
      socket.on('assignment.created', () => refetch());
    }
    return () => {
      if (socket) {
        socket.off('grade.posted');
        socket.off('assignment.created');
      }
    };
  }, [socket, refetch]);

  if (isLoading || !dashboardData) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  // Derived dynamic stats
  const statsData = dashboardData ? [
    {
      label: "Total Subjects",
      value: dashboardData.overview.totalSubjects,
      icon: <GraduationCap size={18} />,
      progress: 75,
      trend: { value: "3.6", direction: "up" as const, label: "This month" }
    },
    {
      label: "Total Assignments",
      value: dashboardData.overview.totalAssignments,
      icon: <BookOpen size={18} />,
      progress: dashboardData.overview.assignmentsProgress || 80,
      trend: { value: "2.1", direction: "up" as const, label: "This month" }
    },
    {
      label: "Completed Assignments",
      value: dashboardData.overview.completedAssignments,
      icon: <FileText size={18} />,
      progress: dashboardData.overview.assignmentsProgress || 65,
      trend: { value: "1.4", direction: "up" as const, label: "This month" }
    },
    {
      label: "Avg. Attendance",
      value: `${dashboardData.overview.averageAttendance}%`,
      icon: <BarChart2 size={18} />,
      progress: dashboardData.overview.averageAttendance || 90,
      trend: { value: "0.5", direction: "up" as const, label: "This month" }
    }
  ] : [];

  // Derived assignments data
  const assignmentsData: Assignment[] = dashboardData?.upcomingAssignments.map((a: any) => ({
    id: a.id,
    title: a.title,
    subject: a.subjectName,
    teacher: a.teacherName,
    progress: a.progress,
    status: a.status as Assignment['status'],
    dueDate: a.dueDate,
    category: a.status === 'Submitted' ? 'Done' : (a.progress > 0 ? 'Pending' : 'To do')
  })) || [];

  const handleViewSubmission = (submission: Assignment) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  // Filter assignments based on active tab
  const filteredAssignments = assignmentsData.filter(assignment => assignment.category === activeTab);

  // Get current time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = profile?.user.firstName || "Student";

  const columns: Column<Assignment>[] = [
    {
      key: "title",
      header: "",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-black rounded flex items-center justify-center flex-shrink-0">
            <FileText size={14} className="text-white" />
          </div>
          <div>
            <div className="font-medium text-sm text-gray-900">{row.title}</div>
            <div className="text-xs text-gray-500">{row.subject} • {row.teacher}</div>
          </div>
        </div>
      )
    },
    {
      key: "progress",
      header: "",
      align: "center",
      render: (_, row) => (
        <div className="text-sm font-medium text-gray-900">
          {row.progress}%
        </div>
      )
    },
    {
      key: "status",
      header: "",
      align: "center",
      render: (_, row) => (
        <div className={`text-sm font-medium ${row.status === "Submitted" ? "text-gray-600" :
          row.status === "Late" ? "text-red-600" :
            row.status === "To do" ? "text-blue-600" : "text-orange-600"
          }`}>
          {row.status}
        </div>
      )
    },
    {
      key: "action",
      header: "",
      align: "right",
      render: (_, row) => (
        <button
          onClick={() => handleViewSubmission(row)}
          className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          View submission
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-black to-gray-800 rounded-xl p-6 md:p-8 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {getGreeting()}, {firstName}! 👋
        </h1>
        <p className="text-gray-300 text-sm md:text-base">
          {(profile as any)?.class ? `${(profile as any).class.name} • ` : ""}
          {(profile as any)?.studentNumber || (profile as any)?.admissionNumber ? `Student ID: ${(profile as any).studentNumber || (profile as any).admissionNumber}` : "Welcome back to your dashboard"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value.toString()}
            icon={stat.icon}
            progress={stat.progress}
            trend={stat.trend}
            onClick={() => {
              if (stat.label === "Total Assignments") {
                router.push("/student/assignments");
              } else if (stat.label === "Total Notes") {
                router.push("/student/notes");
              } else if (stat.label === "Total Reports") {
                router.push("/student/report-card");
              } else if (stat.label === "Total Subjects") {
                router.push("/student/timetable");
              }
            }}
          />
        ))}
      </div>

      {/* Assignments Section */}
      <div id="assignments-table-section">
        <Card>
          <CardHeader
            title="Assignments"
            action={
              <Link href="/student/assignments" className="text-sm text-gray-600 hover:text-gray-900 font-medium pt-1">
                View all
              </Link>
            }
          />
          <CardBody className="p-0">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6">
              {(["Pending", "To do", "Done"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="px-6 py-4">
              <DataTable
                columns={columns as unknown as Column<Record<string, unknown>>[]}
                data={filteredAssignments as unknown as Record<string, unknown>[]}
                keyField="id"
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <ViewSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={selectedSubmission ? {
          ...selectedSubmission,
          submittedDate: "Today, 10:45 AM", // Mock date for demo
          fileName: selectedSubmission.status === "Submitted" ? `${selectedSubmission.title.replace(/\s+/g, '_')}.pdf` : undefined,
          fileSize: "1.2 MB",
          comments: selectedSubmission.status === "Submitted" ? "Excellent work on this assignment. Your methodology is clear and well-documented." : undefined
        } : null}
      />
    </div>
  );
}
